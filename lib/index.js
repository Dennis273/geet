#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _simpleGit = _interopRequireDefault(require("simple-git"));

var _config = require("./config");

var _git = require("./git");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var git = (0, _simpleGit["default"])();

_commander["default"].version('0.1.0');

_commander["default"].command('clone <url>').option('-f, --force').action(function (url, options) {
  var repoRoot = (0, _config.getConfig)()['repoRoot'];

  if (repoRoot) {
    var result = (0, _git.clone)(url, repoRoot, options.force);
    var log = '';

    switch (result) {
      case _git.result.EXT_NAME_NOT_GIT:
        log = 'External name of given url is not \'.git\'.';
        break;

      case _git.result.TARGET_DIR_EXIST:
        log = 'Target directory already exists, use --force to overwirte.';

      case _git.result.SUCCESS:
        log = 'Clone success!';
    }
  } else {
    console.error('Repo root not set');
  }
});

_commander["default"].command('set <key> <value>').action(function (key, value) {
  (0, _config.setConfig)(key, value);
});

_commander["default"].command('get <key>').action(function (key) {
  (0, _config.getConfig)()[key];
});

_commander["default"].parse(process.argv);