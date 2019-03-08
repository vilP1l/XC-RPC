import rpc from 'discord-rich-presence';
import { execString } from 'applescript';

const client = rpc('553717331273187338');
const startTime = Date.now();
const updateRPC = () => {
  execString('tell application "Xcode" to get the name of the front window', (err, res) => {
    if (err) {
      console.log(err);
      process.exit();
    }
    client.updatePresence({
      state: `Editing ${res}`,
      startTimestamp: startTime,
      largeImageKey: 'xcode',
      largeImageText: 'Editing in XCode',
      smallImageKey: res.includes('.swift') ? 'swift': 'unknown',
      smallImageText: res.includes('.swift') ? 'Editing a .swift file': undefined,
      instance: true,
    });
  });
}
updateRPC();

setInterval(() => {
  updateRPC();
}, 5000)
