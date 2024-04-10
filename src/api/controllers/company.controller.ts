import { Request, Response } from 'express';
import { CompanyService } from '../../core/app/services/company.service';

/**
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @throws {Error}
 */

async function getAll(req: Request, res: Response) {
  try {
    const data = CompanyService.getAll();
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const CompanyController = { getAll };
