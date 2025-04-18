const { runScheduledBackups } = require('../lib/backup');


async function main() {
  try {
    console.log('Running scheduled backups...');
    await runScheduledBackups();
    console.log('Scheduled backups completed successfully');
  } catch (error) {
    console.error('Error running scheduled backups:', error);
  }
}

main();