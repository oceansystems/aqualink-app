import * as functions from 'firebase-functions';
import { createConnection } from 'typeorm';
import { runDailyUpdate } from '../src/workers/dailyData';

// We have to manually import all required entities here, unfortunately - the globbing that is used in ormconfig.ts
// doesn't work with Webpack. This declaration gets processed by a custom loader (`add-entities.js`) to add import
// statements for all the entity classes.
// import-all-entities

/**
 * Crude check to try to get the entity itself from the full module import. Checks if the export name begins with an
 * uppercase letter and the export itself is a function. There might be a more accurate way to do this?
 * @param fullImport
 */
function extractEntityDefinition(fullImport: Record<string, any>) {
  const exportKey =
    Object.keys(fullImport).find(
      (key) =>
        key[0].toUpperCase() === key[0] &&
        typeof fullImport[key] === 'function',
    ) || Object.keys(fullImport)[0];
  return fullImport[exportKey];
}

// Remove all the connection info from the dbConfig object - we want to replace it with the dbUrl input from this
// function argument.
const {
  url,
  host,
  port,
  database,
  username,
  password,
  entities: defaultEntities,
  ...dbConfig
} = require('../ormconfig');

// Start a daily update for each reefs.
exports.dailyUpdate = functions
  .runWith({ timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    const dbUrl = functions.config().database.url;
    // eslint-disable-next-line fp/no-mutation
    process.env.SOFAR_API_TOKEN = functions.config().sofar_api.token;
    // eslint-disable-next-line no-undef
    const entities = dbEntities.map(extractEntityDefinition);
    const conn = await createConnection({
      ...dbConfig,
      url: dbUrl,
      entities,
    });
    try {
      await runDailyUpdate(conn);
      res.json({ result: `Daily update on ${new Date()}` });
    } finally {
      conn.close();
    }
  });

exports.scheduledDailyUpdate = functions
  .runWith({ timeoutSeconds: 120 })
  .pubsub.schedule('every 24 hours')
  .onRun(async () => {
    const dbUrl = functions.config().database.url;
    // eslint-disable-next-line fp/no-mutation
    process.env.SOFAR_API_TOKEN = functions.config().sofar_api.token;
    // eslint-disable-next-line no-undef
    const entities = dbEntities.map(extractEntityDefinition);
    const conn = await createConnection({
      ...dbConfig,
      url: dbUrl,
      entities,
    });
    try {
      await runDailyUpdate(conn);
      // eslint-disable-next-line no-console
      console.log(`Daily update on ${new Date()}`);
    } finally {
      conn.close();
    }
  });
