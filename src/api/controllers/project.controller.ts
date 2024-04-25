import { Request, Response } from 'express';
import { z } from 'zod';
import { ProjectReportService } from '../../core/app/services/project-report.service';
import { ProjectService } from '../../core/app/services/project.service';

const reportSchema = z.object({
  id: z.string().min(1, { message: 'projectId cannot be empty' }),
});

async function getReportData(req: Request, res: Response) {
  try {
    const { id } = reportSchema.parse({ id: req.params.id });

    const data = await ProjectReportService.getReport(id);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @param {Request} req - The request object containing the clientID.
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @throws {Error}
 */

async function getProjectsClient(req: Request, res: Response) {
  try {
    const data = await ProjectService.findProjectsClient(req.params.clientId);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const ProjectController = { getReportData, getProjectsClient };
