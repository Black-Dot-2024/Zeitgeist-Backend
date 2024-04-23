import { Dummy } from '../../domain/entities/dummy.entity';
import { DummyRepository } from '../../infra/repositories/dummy.repository';

/**
 * Gets dummy data from the repository
 *
 * @returns {Promise<Dummy[]>} A promise that resolves to an array of
 *                            dummy entities
 *
 * @throws {Error} If an unexpected error occurs
 */
async function getData(): Promise<Dummy[]> {
  try {
    const dummyRecords = await DummyRepository.findAll();
    return dummyRecords;
  } catch (error: any) {
    console.error('Error: ', error);
    throw new Error('An unexpected error occurred');
  }
}

export const DummyService = { getData };
