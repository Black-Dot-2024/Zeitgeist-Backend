import { Decimal } from "@prisma/client/runtime/library";

/**
 * @brief Esta clase es para establecer la estructura de la entidad proyecto
 *
 * @param id: string
 * @param name: string
 * @param matter: string
 * @param description: string
 * @param status: ProjectStatus
 * @param category: string
 * @param startDate: Date
 * @param endDate: Date
 * @param totalHours: Deciaml
 * @param perodicity: string
 * @param isChargeable: boolean
 * @param area: string
 * @param createdAt: Date
 * @param updatedAt: Date
 * @param idCompany: string
 *
 * @return void
 *
 * @description La estructura basicamente es lo que esta en el MER,
 * se tiene la idea usar tipos de datos personalizados, como UUID.
 */


export interface ProjectEntity {
  /**
   * @param id: string - Project id
   */
  id: string;
  /**
   * @param name: string - Project name
   */
  name: string;
  /**
   * @param matter: string - Project matter
   */
  matter?: string | null;
  /**
   * @param description: string - Project description
   */
  description?: string | null;
  /**
   * @param status: string - Project status
   */
  status: string;
  /**
   * @param category: string - Project category
   */
  category: string;
  /**
   * @param startDate: Date - Project start date
   */
  startDate: Date;
  /**
   * @param endDate: Date - Project end date
   */
  endDate?: Date | null;
  /**
   * @param totalHours: Decimal - Project total hours
   */
  totalHours?: Decimal | null;
  /**
   * @param periodicity: string - Project periodicity
   */
  periodicity?: string | null;
  /**
   * @param isChargeable: boolean - Determines whether the project is chargeable or not
   */
  isChargeable?: boolean | null;
  /**
   * @param area: string - Project area
   */
  area?: string;
  /**
   * @param createdAt: Date - Project creation date
   */
  createdAt: Date;
  /**
   * @param updatedAt: Date - Project update date
   */
  updatedAt?: Date | null;
  /**
   * @param idCompany: string - Id for project company
   */
  idCompany: string;
}
