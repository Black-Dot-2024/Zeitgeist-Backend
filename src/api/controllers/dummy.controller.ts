import { Request, Response } from 'express';
import { DummyService } from '../../core/app/services/dummy.services';

/**
 * Gets dummy data from the service and sends it as a response
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 *
 * @returns {Promise<void>} A promise that resolves to void
 *
 * @throws {Error} If an unexpected error occurs
 */
async function getDummyData(req: Request, res: Response) {
  try {
    const data = await DummyService.getData();
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const DummyController = { getDummyData };
