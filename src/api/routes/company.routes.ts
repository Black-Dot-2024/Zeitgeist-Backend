import { Router } from 'express';
import { SupportedRoles } from '../../utils/enums';
import { CompanyController } from '../controllers/company.controller';
import { checkAuthToken } from '../middlewares/auth.middleware';
import { checkAuthRole } from '../middlewares/rbac.middleware';

const router = Router();

router.get(
  '/',
  checkAuthRole([SupportedRoles.ACCOUNTING, SupportedRoles.LEGAL, SupportedRoles.ADMIN]),
  CompanyController.getAll
);

router.get(
  '/archived',
  checkAuthRole([SupportedRoles.ACCOUNTING, SupportedRoles.LEGAL, SupportedRoles.ADMIN]),
  CompanyController.getArchived
);

router.get(
  '/:id',
  checkAuthRole([SupportedRoles.ACCOUNTING, SupportedRoles.LEGAL, SupportedRoles.ADMIN]),
  CompanyController.getUnique
);

router.put(
  '/:id',
  checkAuthToken,
  checkAuthRole([SupportedRoles.ACCOUNTING, SupportedRoles.LEGAL, SupportedRoles.ADMIN]),
  CompanyController.updateClient
);

router.post(
  '/new',
  checkAuthRole([SupportedRoles.ACCOUNTING, SupportedRoles.LEGAL, SupportedRoles.ADMIN]),
  CompanyController.create
);

export { router as CompanyRouter };
