import rpc from 'discord-rich-presence';
import { execString, execFile } from 'applescript';

const client = rpc('553717331273187338');
const startTime = Date.now();
const updateRPC = () => {
  execString('tell application "Xcode" to get the name of the front window', (err, res) => {
    execFile('src/getWorkspace.applescript', (err, project) => {
      const workspace = project.replace('.xcodeproj', '');
      client.updatePresence({
        state: `Editing ${res}`,
        details: `Working on ${workspace}`,
        startTimestamp: startTime,
        largeImageKey: 'xcode',
        largeImageText: 'Editing in XCode',
        smallImageKey: res.includes('.swift') ? 'swift': 'unknown',
        smallImageText: res.includes('.swift') ? 'Editing a .swift file': undefined,
        instance: true,
      });
    });
  });
}
updateRPC();

setInterval(() => {
  updateRPC();
}, 5000)
