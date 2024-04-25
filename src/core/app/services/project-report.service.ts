import { CompanyRepository } from '../../infra/repositories/company.repository';
import { EmployeeTaskRepository } from '../../infra/repositories/employee-task.repository';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';
import { ProjectRepository } from '../../infra/repositories/project.repository';
import { TaskRepository } from '../../infra/repositories/tasks.repository';
import { Project, ProjectStatistics, Report, Task } from '../interfaces/project-report.interface';

/**
 * @brief Esta función inicializa las estadísticas de un reporte
 *
 * @param total: Number
 *
 * @return ProjectStatistics
 *
 * @description Las tareas se agrupan segun su estatus y se inicializan en 0.
 *
 */
function initilizeStatistics(total: number): ProjectStatistics {
  return {
    total: total,
    done: 0,
    inprogress: 0,
    underrevision: 0,
    delayed: 0,
    postponed: 0,
    notstarted: 0,
    cancelled: 0,
  };
}

/**
 * @brief Esta función genera el reporte de un proyecto
 *
 * @param id: string
 *
 * @return Report
 *
 * @description Se hace la distinción entre un proyecto en cotización o
 * cancelado y un proyecto en cualquier otro estatus. El reporte de un proyecto en cotización
 * o cancelado retorna datos generales del proyecto y los demás incluyen tareas asociadas
 * al proyecto y sus estadísticas.
 *
 */
async function getReport(id: string): Promise<Report> {
  try {
    const rawProject = await ProjectRepository.findById(id);
    const company = await CompanyRepository.findById(rawProject.idCompany);

    const project: Project = { ...rawProject, companyName: company.name };
    const report: Report = { project: project };

    const rawTasks = await TaskRepository.findTasksByProjectId(id);
    const employeeTask = await EmployeeTaskRepository.findAll();
    const employees = await EmployeeRepository.findAll();

    const tasks: Task[] = [];
    const projectStatistics: ProjectStatistics = initilizeStatistics(rawTasks.length);

    for (let i = 0; i < rawTasks.length; i++) {
      let task: Task = rawTasks[i];

      const rawEmployeeTask = employeeTask.find(record => {
        if (record.idTask === rawTasks[i].id) return record;
      });

      if (rawEmployeeTask) {
        const employee = employees.find(record => {
          if (record.id === rawEmployeeTask.idEmployee) return record;
        });

        if (employee) {
          task = { ...task, employeeFirstName: employee.firstName, employeeLastName: employee.lastName };
        }
      }

      tasks.push(task);

      const key: string = rawTasks[i].status.replace(' ', '').toLocaleLowerCase().trim();
      if (projectStatistics.hasOwnProperty(key)) {
        projectStatistics[key as keyof ProjectStatistics] =
          Number(projectStatistics[key as keyof ProjectStatistics]) + 1;
      }
    }

    report.tasks = tasks;
    report.statistics = projectStatistics;

    return report;
  } catch (error: unknown) {
    throw new Error('An unexpected error occurred');
  }
}

export const ProjectReportService = { getReport };
