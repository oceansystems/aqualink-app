import { Logger } from '@nestjs/common';
import { Worker } from 'worker_threads';

const logger = new Logger('Backfill Worker');

export const backfillReefData = (reefId: number) => {
  const worker = new Worker(`./scripts/async-backfill.js`, {
    argv: ['--days', '90', '--reefs', `${reefId}`],
  });

  worker.on('error', (err) => {
    logger.error(err);
    logger.error(`Backfill worker encountered an error: `, err.stack);
  });

  worker.on('exit', (code) => {
    logger.log(`Backfill worker exited with code ${code}`);
  });
};
