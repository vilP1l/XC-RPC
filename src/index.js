import rpc from 'discord-rich-presence';
import { execString } from 'applescript';
import 'colors';
import { platform } from 'os';
import config from './config.json'

const client = rpc('553717331273187338');
const startTime = Date.now();
if (platform() !== 'darwin') {
  console.log(`${'err'.red} Only macos is supported.`);
  process.exit();
}
console.log(`${'info'.green} Started RPC`);
const updateRPC = () => {
  execString('tell application "System Events" to (name of processes) contains "Xcode"', (err, res) => {
    if (res === 'false') {
      console.log(`${'err'.red} XCode is not open.`);
      process.exit();
    }
    execString('tell application "Xcode" to get the name of the front window', (err, res) => {
      execString('tell application "Xcode" to get the name of the active workspace document', (err, project) => {
        let workspace;
        if (project) workspace = project.replace('.xcodeproj', '');
        let fileExtension
        if (res) fileExtension = res.match(/\.(.+)/g) ? res.match(/\.(.+)/g)[0] : 'unknown';
        const state = config.state.replace(/{file}/g, res);
        const details = config.details.replace(/{project}/g, workspace);
        client.updatePresence({
          state: config.showState ? !res ? 'No file open' : state : undefined,
          details: config.showDetails ? !workspace ? 'No project open' : details : undefined,
          startTimestamp: startTime,
          largeImageKey: 'xcode',
          largeImageText: 'Editing in XCode',
          smallImageKey: fileExtension ? fileExtension === '.swift' ? 'swift' : fileExtension === '.plist' ? 'plist' : 'unknown' : undefined,
          smallImageText: fileExtension ? `Editing a ${fileExtension} file` : undefined,
          instance: true,
        });
      });
    });
  });
}
updateRPC();

setInterval(() => {
  updateRPC();
}, 5000)
