const glob = require('glob');
const path = require('path');

/**
 * Looks for all *.entity.{js,ts} files and generates import statements for them. After all the import statements,
 * adds an inline const definition for all the imported names which can then be used by the script.
 * @returns {string}
 */
function getEntityImports() {
  const imports = glob
    .sync(path.join(__dirname, '../src/**/*.entity.{js,ts}'))
    .reduce(
      (acc, entityPath) => {
        const { names, importsString } = acc;
        const [entityNameRaw] = entityPath.match(
          /[^/]+(?=\.entity\.(?:js|ts)$)/,
        );
        const nameParts = entityNameRaw.split('-');
        const entityName = nameParts
          .map((name) => name[0].toUpperCase() + name.slice(1))
          .join('');
        return {
          names: [...names, entityName],
          importsString: `${importsString}import * as ${entityName} from '${entityPath}';\n`,
        };
      },
      { names: [], importsString: '' },
    );
  return `${imports.importsString}\nconst dbEntities = [${imports.names.join(
    ', ',
  )}];`;
}

module.exports = function addEntityImports(source) {
  return source.replace('// import-all-entities', getEntityImports());
};
