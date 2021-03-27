/* eslint-disable */
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Generate configuration
const config = configFactory('production');

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuild);
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrlOrPath;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
      if (tscCompileOnError) {
        console.log(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
          )
        );
        printBuildError(err);
      } else {
        console.log(chalk.red('Failed to compile.\n'));
        printBuildError(err);
        process.exit(1);
      }
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  // We used to support resolving modules according to `NODE_PATH`.
  // This now has been deprecated in favor of jsconfig/tsconfig.json
  // This lets you use absolute paths in imports inside large monorepos:
  if (process.env.NODE_PATH) {
    console.log(
      chalk.yellow(
        'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
      )
    );
    console.log();
  }

  console.log('Creating an optimized production build...');

  
  // Cleans up webpack error messages.
function formatMessage(message) {
  const friendlySyntaxErrorLabel = 'Syntax error:';
  let lines = message.split('\n');

  // Strip webpack-added headers off errors/warnings
  // https://github.com/webpack/webpack/blob/master/lib/ModuleError.js
  lines = lines.filter(line => !/Module [A-z ]+\(from/.test(line));

  // Transform parsing error into syntax error
  // TODO: move this to our ESLint formatter?
  lines = lines.map(line => {
    const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(
      line
    );
    if (!parsingError) {
      return line;
    }
    const [, errorLine, errorColumn, errorMessage] = parsingError;
    return `${friendlySyntaxErrorLabel} ${errorMessage} (${errorLine}:${errorColumn})`;
  });

  message = lines.join('\n');
  // Smoosh syntax errors (commonly found in CSS)
  message = message.replace(
    /SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g,
    `${friendlySyntaxErrorLabel} $3 ($1:$2)\n`
  );
  // Clean up export errors
  message = message.replace(
    /^.*export '(.+?)' was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$2'.`
  );
  message = message.replace(
    /^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$2' does not contain a default export (imported as '$1').`
  );
  message = message.replace(
    /^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$3' (imported as '$2').`
  );
  lines = message.split('\n');

  // Remove leading newline
  if (lines.length > 2 && lines[1].trim() === '') {
    lines.splice(1, 1);
  }
  // Clean up file name
  lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, '$1');

  // Cleans up verbose "module not found" messages for files and packages.
  if (lines[1] && lines[1].indexOf('Module not found: ') === 0) {
    lines = [
      lines[0],
      lines[1]
        .replace('Error: ', '')
        .replace('Module not found: Cannot find file:', 'Cannot find file:'),
    ];
  }

  // Add helpful message for users trying to use Sass for the first time
  if (lines[1] && lines[1].match(/Cannot find module.+node-sass/)) {
    lines[1] = 'To import Sass files, you first need to install node-sass.\n';
    lines[1] +=
      'Run `npm install node-sass` or `yarn add node-sass` inside your workspace.';
  }

  message = lines.join('\n');
  // Internal stacks are generally useless so we strip them... with the
  // exception of stacks containing `webpack:` because they're normally
  // from user code generated by webpack. For more information see
  // https://github.com/facebook/create-react-app/pull/1050
  message = message.replace(
    /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
    ''
  ); // at ... ...:x:y
  message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, ''); // at <anonymous>
  lines = message.split('\n');

  // Remove duplicated newlines
  lines = lines.filter(
    (line, index, arr) =>
      index === 0 || line.trim() !== '' || line.trim() !== arr[index - 1].trim()
  );

  // Reassemble the message
  message = lines.join('\n');
  return message.trim();
}

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage +=
            '\nCompileError: Begins at CSS selector ' +
            err['postcssNode'].selector;
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        });
      } else {
        const unformattedMessages = stats.toJson({ all: false, warnings: true, errors: true });
        messages = { errors: unformattedMessages.errors.map((e) => formatMessage(e.message)), warnings: unformattedMessages.warnings.map((e) => formatMessage(e.message)) }
         
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
