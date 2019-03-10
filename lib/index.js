"use strict";

var _discordRichPresence = _interopRequireDefault(require("discord-rich-presence"));

var _applescript = require("applescript");

require("colors");

var _os = require("os");

var _config = _interopRequireDefault(require("./config.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var client = (0, _discordRichPresence["default"])('553717331273187338');
var startTime = Date.now();

if ((0, _os.platform)() !== 'darwin') {
  console.log("".concat('err'.red, " Only macos is supported."));
  process.exit();
}

console.log("".concat('info'.green, " Started RPC"));

var updateRPC = function updateRPC() {
  (0, _applescript.execString)('tell application "System Events" to (name of processes) contains "Xcode"', function (err, res) {
    if (res === 'false') {
      console.log("".concat('err'.red, " XCode is not open."));
      process.exit();
    }

    (0, _applescript.execString)('tell application "Xcode" to get the name of the front window', function (err, res) {
      (0, _applescript.execString)('tell application "Xcode" to get the name of the active workspace document', function (err, project) {
        var workspace;
        if (project) workspace = project.replace('.xcodeproj', '');
        var fileExtension;
        if (res) fileExtension = res.match(/\.(.+)/g) ? res.match(/\.(.+)/g)[0] : 'unknown';

        var state = _config["default"].state.replace(/{file}/g, res);

        var details = _config["default"].details.replace(/{project}/g, workspace);

        client.updatePresence({
          state: _config["default"].showState ? !res ? 'No file open' : state : undefined,
          details: _config["default"].showDetails ? !workspace ? 'No project open' : details : undefined,
          startTimestamp: startTime,
          largeImageKey: 'xcode',
          largeImageText: 'Editing in XCode',
          smallImageKey: fileExtension ? fileExtension === '.swift' ? 'swift' : fileExtension === '.plist' ? 'plist' : 'unknown' : undefined,
          smallImageText: fileExtension ? "Editing a ".concat(fileExtension, " file") : undefined,
          instance: true
        });
      });
    });
  });
};

updateRPC();
setInterval(function () {
  updateRPC();
}, 5000);