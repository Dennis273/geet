"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.result = void 0;

var _url = require("url");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _simpleGit = _interopRequireDefault(require("simple-git"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var result;
exports.result = result;

(function (result) {
  result[result["EXT_NAME_NOT_GIT"] = 0] = "EXT_NAME_NOT_GIT";
  result[result["TARGET_DIR_EXIST"] = 1] = "TARGET_DIR_EXIST";
  result[result["UNKNOWN"] = 2] = "UNKNOWN";
  result[result["SUCCESS"] = 3] = "SUCCESS";
})(result || (exports.result = result = {}));

var git = (0, _simpleGit["default"])();

function clone(repoPath, localRoot, force) {
  var gitUrl = new _url.URL(repoPath);
  var protocol = gitUrl.protocol;

  var _path$parse = _path["default"].parse(_path["default"].join(gitUrl.hostname, gitUrl.pathname)),
      dir = _path$parse.dir,
      ext = _path$parse.ext,
      name = _path$parse.name;

  if (ext !== '.git') {
    return result.EXT_NAME_NOT_GIT;
  }

  var localPath = _path["default"].join(localRoot, dir, name);

  if (_fs["default"].existsSync(localPath)) {
    if (!force) {
      return result.TARGET_DIR_EXIST;
    }
  } else {
    _fs["default"].mkdirSync(localPath, {
      recursive: true
    });
  }

  git.clone(repoPath, localPath);
  return result.SUCCESS;
}