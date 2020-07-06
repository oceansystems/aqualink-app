import { isString } from 'lodash';
import { Client, Pool } from 'pg';
import * as sql from 'pg-sql2';
import log from 'loglevel';

// dotenv is a dev dependency, so conditionally import it (don't need it in Prod).
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('dotenv').config();
} catch {
  // Pass
}

export const FINAL_URL = process.env.FINAL_URL || 'INSERT_URL/';

// If we have a DATABASE_URL, use that
export const connectionInfo = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port:
        (process.env.POSTGRES_PORT &&
          parseInt(process.env.POSTGRES_PORT, 10)) ||
        5432,
      database: process.env.POSTGRES_DATABASE || 'aqualink_dev',
      ...(process.env.POSTGRES_USER && { username: process.env.POSTGRES_USER }),
      ...(process.env.POSTGRES_PASSWORD && {
        password: process.env.POSTGRES_PASSWORD,
      }),
    };

// Wrap Pg connection Pool
// See https://node-postgres.com/guides/project-structure
// Note: queries wrapped in sql.query should usually be run with `runSqlQuery` or the function
//       returned by `getQuery` rather than this raw object.
let pgPool = new Pool(connectionInfo);
export const query = async (
  text,
  params,
  callback,
  { client, logError = true } = {},
) => {
  try {
    const res = await (client || pgPool).query(text, params, callback);
    return res;
  } catch (err) {
    if (logError) {
      log.error(`Error running query: ${err.message}`);
      log.info(`Query:\n${text}`);
      log.debug(`Params:\n${params}`);
      log.debug(err);
    }
    throw err;
  }
};

export { sql };

/**
 * Helper to compile & run a SQL query.
 * @param queryObj string or sql.query object to be compiled & run.
 * @param queryVars list of variables to run query with (if string rather than sql.query object)
 * @param opts
 *   - client: Optional pg client to use for the query (enables using SQL transactions)
 *   - logError: Flag for whether to log query errors to console
 */
export const runSqlQuery = (queryObj, queryVars, opts) => {
  const { text, values } = isString(queryObj)
    ? { text: queryObj, values: queryVars }
    : sql.compile(queryObj);

  return query(text, values, undefined, opts);
};

/**
 * Helper to generate a single argument function to compile & run a SQL query based on an optional
 * client argument.
 * @param client Optional pg client to use for the query (enables using SQL transactions)
 * @return function accepting the same arguments as `runSqlQuery`
 */
export const getQuery = (client) => (queryObj, queryVars, opts) =>
  runSqlQuery(queryObj, queryVars, { client, ...opts });

export async function connectToPostgres(
  verbose = true,
  connectSingleClient = false,
  connectionOptions = {},
) {
  // disconnect if we're currently connected to anything
  if (pgPool) {
    await pgPool.end();
  }

  if (verbose) {
    log.info(
      `Connecting to Postgres DB with connection string '${connectionInfo}'.`,
    );
  }

  if (connectSingleClient) {
    // eslint-disable-next-line fp/no-mutation
    pgPool = new Client(connectionInfo);
    await pgPool.connect();
  } else {
    // eslint-disable-next-line fp/no-mutation
    pgPool = new Pool({ ...connectionInfo, ...connectionOptions });
  }
  return pgPool;
}

export function disconnectPostgres() {
  return pgPool.end();
}
