/**
 * @brief Esta clase es para establecer la estructura de la entidad Dummy
 *
 * @param id: number
 * @param name: string
 *
 * @return void
 *
 * @description La estructura basicamente es lo que esta en el MER,
 * se tiene la idea usar tipos de datos personalizados, como UUID.
 */

export interface Dummy {
  /**
   * @param id: string - Identificador único del Dummy
   */
  id: string;

  /**
   * @param name: string - Nombre del Dummy
   */
  name: string;
}
