"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
exports.setConfig = setConfig;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var rootPath = _os["default"].homedir();

var configFileName = '.geetrc'; // json

var filePath = _path["default"].join(rootPath, configFileName);

function readFileContent() {
  if (_fs["default"].existsSync(filePath)) {
    var content = _fs["default"].readFileSync(filePath, 'utf8');

    var config = JSON.parse(content);
    console.log(config);
    return config;
  } else {
    return {};
  }
}

function writeFileContent(content) {
  _fs["default"].writeFileSync(filePath, JSON.stringify(content), {
    flag: 'w'
  });
}

function getConfig() {
  return readFileContent();
}

function setConfig(key, value) {
  var config = readFileContent();
  config[key] = value;
  writeFileContent(config);
}