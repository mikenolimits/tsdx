const util = require('util');
const ramdisk = require('node-ramdisk');
const shell = require('shelljs');
const path = require('path');

const rootDir = process.cwd();
const disk = ramdisk('tsdx-tests');
const vol = (async () => {
  await util.promisify(disk.delete)('/tmp/tsdx-tests');
  return await util.promisify(disk.create)(10);
})();
console.log(vol);

shell.config.silent = true;

module.exports = {
  setupStageWithFixture: (stageName, fixtureName) => {
    const stagePath = path.join(vol, stageName);
    shell.mkdir(stagePath);
    shell.exec(`cp -a ${rootDir}/test/fixtures/${fixtureName}/. ${stagePath}/`);
    shell.ln(
      '-s',
      path.join(rootDir, 'node_modules'),
      path.join(stagePath, 'node_modules')
    );
    shell.cd(stagePath);
  },

  teardownStage: stageName => {
    shell.cd(rootDir);
    shell.rm('-rf', path.join(vol, stageName));
  },

  rootDir,
};
