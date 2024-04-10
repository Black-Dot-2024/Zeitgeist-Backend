import { Router } from 'express';
import { DummyRouter } from './dummy.routes';
import { RoleRouter } from './role.routes';

const baseRouter = Router();

baseRouter.use('/dummy', DummyRouter);
baseRouter.use('/roles', RoleRouter);

export { baseRouter };
