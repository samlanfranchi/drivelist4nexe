/*
 * Copyright 2016 Resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const childProcess = require('child_process');
const path = require('path');
const debug = require('debug')(require('../package.json').name);

const ORIGINAL_SCRIPTS_PATH = path.join(__dirname, '..', 'scripts');
const SCRIPTS_PATH = path.join(process.cwd(), 'scripts');

exports.originalPaths = {

  win32: path.join(SCRIPTS_PATH, 'win32.bat'),
  darwin: path.join(SCRIPTS_PATH, 'darwin.sh'),
  linux: path.join(SCRIPTS_PATH, 'linux.sh')

};

exports.paths = {

  win32: path.join(SCRIPTS_PATH, 'win32.bat'),
  darwin: path.join(SCRIPTS_PATH, 'darwin.sh'),
  linux: path.join(SCRIPTS_PATH, 'linux.sh')

};

/**
 * @summary Run a platform script
 * @function
 * @public
 *
 * @param {String} script - path to script
 * @param {Function} callback - callback (error, output)
 *
 * @example
 * scripts.run(scripts.paths.win32, (error, output) => {
 *   if (error) {
 *     throw error;
 *   }
 *
 *   console.log(output);
 * });
 */
exports.run = (script, callback) => {
  childProcess.execFile(script, (error, stdout, stderr) => {
    if (error) {
      return callback(error);
    }

    // Don't throw an error if we get `stderr` output from
    // the drive detection scripts at this point, given that
    // if the script already exitted with code zero, then
    // we consider them warnings that we can safely ignore.
    if (stderr.trim().length) {
      debug('stderr: %s', stderr);
    }

    return callback(null, stdout);
  });
};
