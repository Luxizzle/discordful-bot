module.exports = function(cmder) {
  cmder
    .command('help', {
      desc: 'Gives help about the bot'
    })
    .callback(function(msg, cmdname) {
      if (!cmdname) {
        var cmds = '';
        this.self.commands.sort().forEach((c) => {
          cmds += c.trigger + ' - ' + (c.cmd.options.desc || 'No description') + '\n';
        });

        msg.send('', {
          title: 'Help',
          description: `I'm **Koly**! 
I'm written in nodejs using [discordie](https://github.com/qeled/discordie) and [discordful](https://github.com/Luxizzle/discordful)

**Commands:**
${cmds}`,
          /*
          fields: this.self.commands.map(function(cmd) {
            return { inline: true, name: cmd.trigger, value: cmd.cmd.options.desc};
          }) //[ {inline: true, name: '', value: ''} ]
          */
        });
      } else {

      }
    });
}
;
