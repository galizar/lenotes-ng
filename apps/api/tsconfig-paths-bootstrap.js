// this script configures tsconfig-paths to resolve the TS path aliases to their
// correct relative path. this script is used by the start target of this project
const tsConfigPaths = require('tsconfig-paths');

const configLoadResult = tsConfigPaths.loadConfig('apps/api/tsconfig.app.json');

const apiOutputRoot = 'dist/out-tsc';

// each new path added to the root tsconfig (that this project depends on) 
// must be added to this paths object too
let paths = {
	'@lenotes-ng/model': [`${apiOutputRoot}/libs/model/src/index.js`],
	'@lenotes-ng/data-storage': [`${apiOutputRoot}/libs/data-storage/src/index.js`],
	'@lenotes-ng/api-interfaces': [`${apiOutputRoot}/libs/api-interfaces/src/index.js`]
};

tsConfigPaths.register({
	baseUrl: configLoadResult.absoluteBaseUrl,
	paths 
});