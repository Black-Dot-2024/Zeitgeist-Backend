import { Request, Response } from 'express';
import { CompanyService } from '../../core/app/services/company.services';
import { CompanyEntity } from '../../core/domain/entities/company.entity';
import { companySchema } from '../validation/companyValidation'

/**
 * Finds all companies
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */

async function getAll(req: Request, res: Response) {
  try {
    const data = await CompanyService.findAll();
    res.status(200).json({ data });
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
    const company: CompanyEntity = req.body.company

    if(!company) throw new Error("Missing company data in body")

    companySchema.parse(company)

    const data = await CompanyService.create(company);
    res.status(200).json({ data });
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
}

export const CompanyController = { getAll, create };