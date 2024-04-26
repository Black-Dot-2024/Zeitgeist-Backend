import { Request, Response } from 'express';
import * as z from 'zod';
import { NotificationService } from '../../core/app/services/notification.service';

/**
 * @brief Schema for the user device token
 *
 * @param email: string - Email of the employee
 * @param deviceToken: string - Token of the device
 *
 * @return {z.ZodObject} - The schema for the user device token
 */

const userToken = z.object({
  email: z.string().email(),
  deviceToken: z.string(),
});

/**
 * @brief Function that calls the service to save the token of the employee
 *
 * @param req: Request
 * @param res: Response
 *
 * @return status 200 if the token was saved successfully, 500 if an error occurred
 */

async function saveToken(req: Request, res: Response) {
  try {
    const data = {
      email: req.body.auth.email,
      deviceToken: req.body.deviceToken,
    };
    const parsed = userToken.parse(data);
    const deviceToken = await NotificationService.saveToken(parsed);

    res.status(200).json({ message: 'Device Token registered successfully.', deviceToken });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error occurred.', error });
  }
}

/**
 * Creates a new notification and sends it as a response
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 *
 * @returns {Promise<void>} A promise that resolves to void
 *
 * @throws {Error} If an unexpected error occurs
 */

async function createNotification(req: Request, res: Response) {
  try {
    const data = await NotificationService.createNotification(req.body);
    res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Gets the notificacion data from the service and sends it as a response
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 *
 * @returns {Promise<void>} A promise that resolves to void
 *
 * @throws {Error} If an unexpected error occurs
 */

async function getAllNotifications(req: Request, res: Response) {
  try {
    const data = await NotificationService.getAllNotifications();
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const NotificationController = { saveToken, createNotification, getAllNotifications };
