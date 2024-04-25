import { Decimal } from '@prisma/client/runtime/library';

export interface Project {
  id: string;
  name: string;
  matter?: string | null;
  description?: string | null;
  status: string;
  category?: string | null;
  startDate: Date;
  endDate?: Date | null;
  totalHours?: Decimal | null;
  periodicity?: string | null;
  isChargeable?: boolean | null;
  area?: string;
  createdAt: Date;
  updatedAt?: Date | null;
  idCompany: string;
  companyName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  waitingFor?: string;
  startDate: Date;
  endDate?: Date;
  workedHours?: number;
  createdAt: Date;
  updatedAt?: Date;
  idProject: string;
  employeeFirstName?: string;
  employeeLastName?: string;
}

export interface ProjectStatistics {
  total: number;
  done: number;
  inprogress: number;
  underrevision: number;
  delayed: number;
  postponed: number;
  notstarted: number;
  cancelled: number;
}

export interface Report {
  project: Project;
  tasks?: Task[] | null;
  statistics?: ProjectStatistics | null;
}
