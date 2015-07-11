#!/usr/bin/env node
var FRAMEWORK_PATH = __dirname.toString().slice(0, -4);
var PROJECT_PATH = process.cwd().toString();
var BRUNCH_PATH = FRAMEWORK_PATH + '/node_modules/.bin/brunch';
var CORDOVA_PATH = FRAMEWORK_PATH + '/node_modules/.bin/cordova';
var SOURCE_PATH = FRAMEWORK_PATH + '/src';

var minimist = require('minimist');
var shell = require('shelljs');
var arguments = minimist(process.argv.slice(2));
var commands = arguments['_'];

if (['n', 'new'].indexOf(commands[0]) > -1) {
    var createCommand = [BRUNCH_PATH, 'new', SOURCE_PATH];
    if (commands[1]) {
        createCommand.push(commands[1]);
    }
    shell.exec(createCommand.join(' '));
    process.exit(1);
}

try {
    var project = require(PROJECT_PATH + '/package.json');
} catch (error) {
    switch (error.code) {
        case 'MODULE_NOT_FOUND':
            console.log("Directory package.json not found.");
            break;
    }
    process.exit(0);
}

if (project.type !== 'gelato') {
    console.log("Directory is not gelato project.");
    process.exit(0);
}

if (['b', 'build'].indexOf(commands[0]) > -1) {
    var buildCommand = [BRUNCH_PATH, 'build'];
    if (arguments['e'] || arguments['env']) {
        buildCommand.push('--env ' + arguments['e'] || arguments['env']);
    }
    if (arguments['P'] || arguments['production']) {
        buildCommand.push('--production');
    }
    shell.exec(buildCommand.join(' '));
    process.exit(1);
}

if (['u', 'update'].indexOf(commands[0]) > -1) {
    shell.rm('-rf', PROJECT_PATH + '/app/gelato');
    shell.cp('-r', SOURCE_PATH + '/app/gelato', PROJECT_PATH + '/app');
    process.exit(1);
}

if (['w', 'watch'].indexOf(commands[0]) > -1) {
    var watchCommand = [BRUNCH_PATH, 'watch'];
    if (arguments['p'] || arguments['port']) {
        watchCommand.push('--port ' + arguments['p'] || arguments['port']);
    }
    if (arguments['s'] || arguments['server']) {
        watchCommand.push('--server');
    }
    shell.exec(watchCommand.join(' '));
    process.exit(1);
}

console.log("If you don't eat your meat, you can't have any pudding!");
process.exit(0);
