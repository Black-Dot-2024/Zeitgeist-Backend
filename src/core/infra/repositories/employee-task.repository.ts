import { Prisma } from '../../..';
import { EmployeeTask } from '../../domain/entities/employee-task.entity';
import { mapEmployeeTaskEntityFromDbModel } from '../mappers/employee-task-entity-from-db-model-mapper'
import { NotFoundError } from '../../errors/not-found.error';

const RESOURCE_NAME = 'EmployeeTask';

async function findAll(): Promise<EmployeeTask[]> {
    try {
        let data = await Prisma.employee_task.findMany();

        if(!data) {
            throw new NotFoundError(RESOURCE_NAME);
        }
        
        return data.map(mapEmployeeTaskEntityFromDbModel);

    } catch (error: unknown) {
        throw new Error(`${RESOURCE_NAME} repository error`);
    }

}

export const EmployeeTaskRepository = { findAll };