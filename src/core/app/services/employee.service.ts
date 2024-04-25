import { randomUUID } from 'crypto';
import { SupportedDepartments, SupportedRoles } from '../../../utils/enums';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { DepartmentRepository } from '../../infra/repositories/department.repository';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';
import { RoleRepository } from '../../infra/repositories/role.repository';
import { SignIn, SignInUserResponse } from '../interfaces/employee.interface';

/**
 * Function to parse the full name into first name and last name
 * use the first two words as first name and the rest as last name
 * if the full name has less than 2 words, the first word is the first name and the last name is empty
 * if the full name has 2 words, the first word is the first name and the second word is the last name
 * if the full name has 3 words, the first two words are the first name and the last word is the last name
 * if the full name has more than 3 words, the first two words are the first name and the rest are the last name
 *
 * @param displayName
 * @returns [firstName, lastName]
 */
function parseName(displayName: string) {
  const nameParts = displayName.trim().split(/\s+/);
  let firstName, lastName;

  if (nameParts.length === 2) {
    [firstName, lastName] = nameParts;
  } else if (nameParts.length === 3) {
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(' ');
  } else if (nameParts.length >= 4) {
    firstName = nameParts.slice(0, 2).join(' ');
    lastName = nameParts.slice(2).join(' ');
  } else {
    firstName = displayName;
    lastName = '';
  }

  return [firstName, lastName];
}

/**
 * Function to create new Employee with Without Role and Without Department
 *
 * @param email
 * @param fullName
 * @param imageUrl
 * @returns {EmployeeEntity}
 */
async function createNewEmployee(email: string, fullName: string, imageUrl: string): Promise<EmployeeEntity> {
  const role = await RoleRepository.findByTitle(SupportedRoles.WITHOUT_ROLE);
  if (!role) {
    throw new NotFoundError(`Role '${SupportedRoles.WITHOUT_ROLE}' not found`);
  }
  const department = await DepartmentRepository.findByTitle(SupportedDepartments.WITHOUT_DEPARTMENT);
  if (!department) {
    throw new NotFoundError(`Department '${SupportedDepartments.WITHOUT_DEPARTMENT}' not found`);
  }

  const [firstName, lastName] = parseName(fullName);
  return await EmployeeRepository.create({
    id: randomUUID(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    imageUrl: imageUrl,
    idRole: role.id,
    idDepartment: department.id,
    createdAt: new Date(),
  });
}

/**
 * Function to handle sing in. If the user is not found, it will create a new one with the provided data.
 * If the user is found, it will return the user data.
 *
 * @param body
 * @returns {SignInUserResponse}
 */
async function signIn(body: SignIn): Promise<SignInUserResponse> {
  let employee = await EmployeeRepository.findByEmail(body.email);
  if (!employee) {
    employee = await createNewEmployee(body.email, body.fullName, body.imageUrl);
    const role = await RoleRepository.findById(employee.idRole);
    return { employee, role: role.title, department: SupportedDepartments.WITHOUT_DEPARTMENT };
  }

  const role = await RoleRepository.findById(employee.idRole);
  if (!role) {
    throw new NotFoundError(`Role not found for employee '${employee.id}'`);
  }

  const department = await DepartmentRepository.findById(employee.idDepartment ?? '');
  if (!department) {
    return { employee, role: role.title, department: SupportedDepartments.WITHOUT_DEPARTMENT };
  }

  if (!department) {
    throw new NotFoundError(`Department not found for employee '${employee.id}'`);
  }

  return { employee, role: role.title, department: department.title };
}

/**
 * Function to get all employees
 *
 * @returns Promise<EmployeeEntity[]>
 */
async function getAllEmployees(): Promise<EmployeeEntity[]> {
  return await EmployeeRepository.findAll();
}

/**
 * Function for finding the role of the employee by email, used in the middleware
 *
 * @param email
 * @returns {SupportedRoles} - Role of the employee
 */
async function findRoleByEmail(email: string): Promise<SupportedRoles> {
  const employee = await EmployeeRepository.findByEmail(email);
  if (!employee) {
    throw new NotFoundError(`Employee not found with email '${email}'`);
  }

  const role = await RoleRepository.findById(employee.idRole);
  if (!role) {
    throw new NotFoundError(`Role not found for employee '${employee.id}'`);
  }

  return role.title as SupportedRoles;
}

export const EmployeeService = { signIn, getAllEmployees, findRoleByEmail };
