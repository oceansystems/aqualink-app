# Aqualink - API

The primary purpose of the API is to serve Aqualink data to the website. In thre future, we will also thrive to make the API open and avilable for developers.

### Installation

```bash
$ yarn install
```

### Settings

The database connection must be configured before you can run the app. Configuration is sourced from environment
variables. You can either specify a Postgres connection URL using `DATABASE_URL`, or individual options:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=!ChangeMe!
POSTGRES_HOST=localhost
POSTGRES_PORT=54321
POSTGRES_DATABASE=postgres
```

In production, `APP_SECRET` should be set as well. And the database needs to have the `postgis` extension enabled. `postgis` gets installed as part of the migration. But you can also add it manually by running `CREATE IF NOT EXISTS EXTENSION postgis;`.

In development, we optionally use [dotenv](https://www.npmjs.com/package/dotenv) to automatically load environment
variables from the file `./.env` - you can create these file with the database connection options listed above.

### Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### Migrations

Migrations happen using the TypeORM CLI.

```bash
# Run a CLI command
$ yarn typeorm

# Create a new migration
$ yarn typeorm migration:generate -n NameOfMigration

# Run Migrations
$ yarn typeorm migration:run
```

### Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Daily Updates

We run daily updates using Firebase Cloud Functions.

#### Prerequisite

Before running daily updates for the first time, you will need to augment your reef table with timezone and maximum monthly mean temperature. To do so, you can simply use the convenience script `yarn augment-reefs`.

In addition, you will need to set the environment variables in Firebase:

```
export $(grep -v '^#' .env.staging | xargs) && firebase functions:config:set database.url=$DATABASE_URL sofar_api.token=$SOFAR_API_TOKEN
```

#### Deploy

```
yarn deploy:cloud-functions
```
