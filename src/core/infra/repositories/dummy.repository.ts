import { randomUUID } from 'crypto';
import { Dummy } from '../../domain/entities/dummy.entity';

// const RESOURCE_NAME = 'DummyInfo';

/**
 * Finds all dummy entities in the database
 * @version 1.0.0
 *
 * @returns {Promise<Dummy[]>} A promise that resolves to an array of
 *                             dummy entities
 *
 * @throws {NotFoundError} If no dummy entities are found
 * @throws {Error} If an unexpected error occurs
 */
async function findAll(): Promise<Dummy[]> {
  try {
    // const data = await Prisma.dummy.findMany();

    // if (!data) {
    //   throw new NotFoundError(RESOURCE_NAME);
    // }

    // return data;

    return Promise.resolve([
      {
        id: randomUUID(),
        name: 'Joe Doe',
      },
    ]);
  } catch (error: any) {
    console.error(error);
    throw new Error('An unexpected error occurred');
  }
}

export const DummyRepository = { findAll };
