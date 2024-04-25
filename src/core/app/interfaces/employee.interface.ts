import { EmployeeEntity } from '../../domain/entities/employee.entity';

export interface SignInUserResponse {
  employee: EmployeeEntity;
  role: string;
  department: string;
}

export interface SignIn {
  email: string;
  fullName: string;
  imageUrl: string;
}
