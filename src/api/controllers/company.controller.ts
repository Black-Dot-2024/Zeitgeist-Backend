import { Request, Response } from 'express';
import { z } from 'zod';
import { CompanyService } from '../../core/app/services/company.service';
import { CompanyEntity } from '../../core/domain/entities/company.entity';
import { companySchema, updateCompanySchema } from '../validators/company.validator';

const reportSchema = z.object({
  id: z.string().uuid().min(1, { message: 'clientId cannot be empty' }),
});

/**
 * Finds all companies
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */

/**
 * Finds all companies
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */

async function getUnique(req: Request, res: Response) {
  try {
    const { id } = reportSchema.parse({ id: req.params.id });

    const data = await CompanyService.findById(id);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Receives a request to update a client and validates de data before sending it to the service
 * @param req
 * @param res
 */
async function updateClient(req: Request, res: Response) {
  try {
    const validSchema = updateCompanySchema.parse(req.body);
    const updatedCompany = await CompanyService.update(validSchema);

    res.status(200).json({ data: updatedCompany });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Receives a request to update a client and validates de data before sending it to the service
 * @param req
 * @param res
 */

async function getAll(req: Request, res: Response) {
  try {
    const data = await CompanyService.findAll();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Finds all companies
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */

async function create(req: Request, res: Response) {
  try {
    const company: CompanyEntity = req.body.company;
    if (!company) throw new Error('Missing company data in body');

    companySchema.parse(company);

    const data = await CompanyService.create(company);
    res.status(200).json(data);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: error.errors[0].message });
    } else res.status(500).json({ error: error.message });
  }
}

/**
 * Receives a request to get all Archived Clients
 * @param req
 * @param res
 */

async function getArchived(req: Request, res: Response) {
  try {
    const data = await CompanyService.findArchived();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
export const CompanyController = { getUnique, getAll, create, updateClient, getArchived };
