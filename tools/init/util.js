const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

/**
 * Create all directories needed.
 *
 * @param pathToCreate
 */
function createDirDeep(pathToCreate) {
    pathToCreate.split(path.sep).reduce((currentPath, folder) => {
        currentPath += folder + path.sep;
        if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
        return currentPath;
    }, '');
}

/**
 * Write a file, but ask if it already exists.
 *
 * @param file Path to the file
 * @param data Content of the file
 * @return {Promise<boolean>} If the file overwrite another
 */
async function overwriteOrNot(file, data) {
    if (fs.existsSync(file)) {
        const answers = inquirer.prompt([{
            type: 'confirm',
            name: 'overwrite',
            message: `The file '${file}' already exists, overwrite ?`,
            default: false
        }]);

        if (!answers.overwrite) return true;

    } else {
        createDirDeep(file);
    }

    await writeFile(file, data, 'utf8');
    return false;
}

module.exports = {
    overwriteOrNot,
    createDirDeep
};
