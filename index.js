const Helpers = require('@lawlzer/helpers');

const chalk = require('chalk');

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');


let config;
// Will be done sync to ensure that the config is working before we start trying to log
// This is OK, because it will be done only on the initial require, so it will never slow down a request 
// If we did this async initially, if we instantly tried to log, we would have an error
const initConfig = () => {
    if (!global.configLocation) throw new Error('@lawlzer/logging: There must be a global.configLocation set.');
    const configFileLocation = path.join(global.configLocation, 'logging.json');

    Helpers.ensureExists(global.configLocation);

    const configFileExists = fs.existsSync(configFileLocation);
    if (!configFileExists) fs.copyFileSync(path.join(__dirname, './default_log.json'), configFileLocation);

    const configFileData = JSON.parse(fs.readFileSync(configFileLocation));

    if (!configFileData.logFolderPath) throw new Error('@lawlzer/logging: There must be a logFolderPath set in the config.');
    logFolderPath = configFileData.logFolderPath;

    if (!configFileData.logFolderPath) throw new Error('@lawlzer/logging: There must be a logFolderPath set in the config.');
    if (!configFileData.logTypes) throw new Error('@lawlzer/logging: There a logTypes in the config');

    config = configFileData;
};

const log = async (logType, text) => {
    if (typeof text === 'object') text = JSON.stringify(text, null, 2);

    const logTypeInfo = config.logTypes[logType];
    if (!logTypeInfo) throw new Error(`@lawlzer/logging: In the logging config, there is no colour for the log type ${logType}.`);

    const colour = logTypeInfo.colour;
    const folderName = logTypeInfo.folderName;
    const bold = logTypeInfo.bold;
    const underline = logTypeInfo.underline;

    let outputText = chalk.hex(colour)(text);
    if (bold) outputText = chalk.bold(outputText);
    if (underline) outputText = chalk.underline(outputText);

    if (!folderName) return; // No folder name, so it's not necessary to be logged
    await Helpers.ensureExists(path.join(logFolderPath, folderName));
    const newFileName = `${Date.now()}_${Helpers.returnRandomCharacters(50, { symbols: false })}.txt`;
    const filePath = path.join(logFolderPath, folderName, newFileName);
    await fsPromises.writeFile(filePath, JSON.stringify(text, null, 2));
};
initConfig();

// log('debug', { text: 'data goes here' });



module.exports.log = log;
if (config.global) global.lawlzerLog = log; // If the config has global set, we will make the log function available globally