import { createConnection } from 'typeorm';
import { runDailyUpdate } from '../src/workers/dailyData';

const dbConfig = require('../ormconfig');

async function main() {
  const conn = await createConnection(dbConfig);
  try {
    await runDailyUpdate(conn);
  } catch (err) {
    console.error(`Daily data update failed:\n${err}`);
    process.exit(1);
  } finally {
    conn.close();
  }
  process.exit(0);
}

main();
