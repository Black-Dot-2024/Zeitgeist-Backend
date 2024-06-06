import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { EnvConfigKeys } from '../../../utils/constants';

const bucketName = process.env[EnvConfigKeys.AWS_BACKUP_BUCKET] as string;

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: `${process.env[EnvConfigKeys.AWS_ACCESS_KEY_ID]}`,
    secretAccessKey: `${process.env[EnvConfigKeys.AWS_SECRET_ACCESS_KEY]}`,
  },
});

export async function uploadToS3(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Key: path.basename(filePath),
    Body: fileStream,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('Upload successful', data);
  } catch (err) {
    console.error('Error', err);
  }
}

export async function deleteFromS3(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(deleteParams));
    console.log('Successfully deleted old backup', data);
  } catch (err) {
    console.error('Error deleting old backup', err);
  }
}
