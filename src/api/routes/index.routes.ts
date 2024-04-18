import { Router } from 'express';
import { CompanyRouter } from './company.routes';
import { DummyRouter } from './dummy.routes';
import { ProjectRouter } from './project.routes';

const baseRouter = Router();

const V1_PATH = '/api/v1';

baseRouter.use('/dummy', DummyRouter);
baseRouter.use(`${V1_PATH}/project`, ProjectRouter);
baseRouter.use(`${V1_PATH}/clients`, CompanyRouter);

export { baseRouter };
