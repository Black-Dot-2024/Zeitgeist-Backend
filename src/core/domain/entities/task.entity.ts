import { TaskStatus } from '../../../utils/enums/index';

/**
 * @brief Esta clase establece la estructura de la entidad Task
 *
 * @param id: string
 * @param title: string
 * @param description: string
 * @param status: TaskStatus
 * @param waitingFor: string
 * @param startDate: Date
 * @param endDate: Date
 * @param workedHours: Number
 * @param createdAt: Date
 * @param updatedAt: Date
 * @param idProject: string
 *
 * @return void
 *
 * @description La estructura contiene los datos del esquema de Task,
 * pero se identifican como atributos opcionales aquellos que no
 * son requeridos por una tarea.
 *
 */

export interface Task {
  /**
   * @param id: string - Identificador único de la tarea
   */
  id: string;

  /**
   * @param title: string - Titulo de la tarea
   */
  title: string;

  /**
   * @param description: string - Descripcion de la tarea
   */
  description: string;

  /**
   * @param status: TaskStatus - Estatus de la tarea
   */
  status: TaskStatus;

  /**
   * @param waitingFor: string - Empleado necesario para poder continuar con la tarea
   */
  waitingFor?: string;

  /**
   * @param startDate: Date - Fecha de inicio de la tarea
   */
  startDate: Date;

  /**
   * @param endDate: Date - Fecha de fin de la tarea
   */
  endDate?: Date;

  /**
   * @param workedHours: number - Horas trabajadas en la tarea
   */
  workedHours?: number;

  /**
   * @param createdAt: Date - Fecha de registro de la tarea
   */
  createdAt: Date;

  /**
   * @param updatedAt: Date - Última fecha de modificación
   */

  updatedAt?: Date;

  /**
   * @param idProject: string - Identificador único del proyecto asociado
   */
  idProject: string;
}

export interface BareboneTask {
  title: string;
  description: string;
  status: TaskStatus;
  waitingFor: string;
  startDate: Date;
  dueDate: Date | null;
  workedHours: number | null;
  idProject: string;
}
