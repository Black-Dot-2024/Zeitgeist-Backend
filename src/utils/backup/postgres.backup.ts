import { exec } from 'child_process';
import fs from 'fs';
import cron from 'node-cron';
import { deleteFromS3, uploadToS3 } from '../../core/infra/providers/s3.provider';
import { EnvConfigKeys, ExecutionEnv } from '../constants';

const PG_USER = process.env[EnvConfigKeys.PG_USER];
const PG_PASSWORD = process.env[EnvConfigKeys.PG_PASSWORD];
const PG_DATABASE = process.env[EnvConfigKeys.PG_DATABASE];

const formatDate = (date: Date) => {
  const d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

function performBackup() {
  const todayFormatted = formatDate(new Date());
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  const fifteenDaysAgoFormatted = formatDate(fifteenDaysAgo);

  const backupFileName = `backup-${todayFormatted}.sql`;
  const oldBackupFileName = `backup-${fifteenDaysAgoFormatted}.sql`;

  process.env.PGPASSWORD = PG_PASSWORD;

  const consoleCommand = `pg_dump -U ${PG_USER} -h localhost -d ${PG_DATABASE} > backup-${backupFileName}.sql`;

  exec(consoleCommand, (error, stdout, stderr) => {
    if (process.env[ExecutionEnv.PRODUCTION] !== ExecutionEnv.PRODUCTION) {
      console.log('Backup skipped: not in production environment');
      return;
    }

    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    try {
      const result = uploadToS3(backupFileName);
      console.log('Backup uploaded successfully:', result);

      const deleteResult = deleteFromS3(oldBackupFileName);
      console.log('Old backup deleted successfully:', deleteResult);

      fs.unlinkSync(backupFileName);
    } catch (error) {
      console.error(error);
    }
  });

  delete process.env.PGPASSWORD;
}

cron.schedule('0 0 */15 * *', performBackup);
