import { startFollowUpCron } from './followUp.cron';

export const initJobs = () => {
  startFollowUpCron();
  console.log('✅ Background jobs initialized');
};




