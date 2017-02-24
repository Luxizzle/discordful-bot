module.exports = function(cmder) {
  cmder.command('reload', {
    desc: 'Reload all the command modules'
  }, function(msg) {
    cmder.reload();
    this.reply('Reloaded modules');
  });
};
