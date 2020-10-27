import os from 'os';
import util from 'util';
import utility from 'utility';
import Logger from 'mini-logger';
import formater from 'error-formater';


export default (config)=>{

  // const config = ctx.$config;
  const logger =  Logger({
    categories: ['sync_info', 'sync_error'],
    dir: config.dataDir,
    duration: '1d',
    format: config.format,//,
    stdout: true ,
    errorFormater: (err) =>{
      const msg = formater.both(err);
      return msg.text;
    },
    seperator: os.EOL,
  });

  // console.log(config.logdir)
  logger.syncInfo = function () {
    const args = [].slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = util.format('[%s][%s] ', utility.logDate(), process.pid) + args[0];
    }

    
    logger.sync_info.apply(logger, args);
  };

  logger.syncError = function () {
    const args = [].slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = util.format('[%s][%s] ', utility.logDate(), process.pid) + args[0];
    }

    
    logger.sync_error.apply(logger, args);
  };

  return async (ctx, next)=>{

    ctx.info = logger.syncInfo;
    ctx.error = logger.syncError;
    
    return next();
  }
};