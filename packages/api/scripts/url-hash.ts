import { hashId, idFromHash, isValidId } from '../src/utils/urls';

function usage() {
  return '\nUsage: url-hash [toHash/toId] <HASH_OR_ID>';
}

function parseArgs() {
  const task = process.argv[2];
  const value = process.argv[3];

  if (
    task === '-h' ||
    task === '--help' ||
    value === 'h' ||
    value === '--help'
  ) {
    console.log(usage());
    process.exit(0);
  }

  if (!task) {
    console.error('No task was specified.');
    console.log(usage());
    process.exit(1);
  }

  if (!['toHash', 'toId'].includes(task)) {
    console.error(`Unknown task '${task}' specified\n${usage()}`);
    process.exit(1);
  }

  if (!value) {
    console.error(`No hash/id value specified!\n${usage()}`);
    process.exit(1);
  }

  return { task, value };
}

function main() {
  const { task, value } = parseArgs();
  if (task === 'toHash') {
    if (!isValidId(value)) {
      console.error(
        `Id must be a valid integer to hash!\n'${value}' does not appear to be an integer.\n${usage()}`,
      );
      process.exit(1);
    }
    console.log(hashId(parseInt(value, 10)));
  } else {
    const id = idFromHash(value);
    if (typeof id === 'undefined') {
      console.error(`${value} does not appear to be a valid hash!`);
      process.exit(1);
    }
    console.log(id);
  }
  process.exit(0);
}

main();
