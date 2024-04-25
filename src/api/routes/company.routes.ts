import { Router } from 'express';
import { SupportedRoles } from '../../utils/enums';
import { CompanyController } from '../controllers/company.controller';
import { checkAuthToken } from '../middlewares/auth.middleware';
import { checkAuthRole } from '../middlewares/rbac.middleware';

const router = Router();

/**
 * @opeanapi
 * /company/:
 *  get:
 *    summary: Obtiene todas las compañías
 *    tags:
 *      - Company
 *    description: Retorna una lista de todas la compañías
 *    responses:
 *      200:
 *        description: Una lista de todas la compañías
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: El ID de la compañía
 *                    example: "f4105be8-3b4a-44bb-8707-d1e3eec927ba"
 */
router.get(
  '/',
  checkAuthToken,
  checkAuthRole([SupportedRoles.CONTABLE, SupportedRoles.LEGAL, SupportedRoles.ADMIN]),
  CompanyController.getAll
);

export { router as CompanyRouter };
