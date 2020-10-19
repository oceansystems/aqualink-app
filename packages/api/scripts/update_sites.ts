import path from 'path';
import { createConnection } from 'typeorm';
import { startCase } from 'lodash';
import { Reef } from '../src/reefs/reefs.entity';
import { processFile } from './import-utils';

const dbConfig = require('../ormconfig');

const updatePath = path.resolve(
  __dirname,
  './application_data/reef_name_table_updated.csv',
);

/**
 * Runs survey import functions.
 */
async function runSitesUpdate() {
  const connection = await createConnection(dbConfig);
  const reefRepository = connection.getRepository(Reef);

  await processFile(updatePath, async (reefUpdate) => {
    const { id, name: reefName, suggested_name: suggestedName } = reefUpdate || {};

    if (suggestedName){
      // console.log(suggestedName, reefName, id)
      console.log(`Replacing ${reefName} with ${suggestedName}.`);
      reefRepository.update(id, { name: startCase(suggestedName) });
    }
  });
}

runSitesUpdate();
