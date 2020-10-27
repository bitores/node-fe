

export default config=>{
  const schedule = require("node-schedule");
  const uuid = require('uuid');

  function startTimer(rule, callback){
    return new Promise((resolve, reject)=>{
      try {
        const name = uuid.v1();
        schedule.scheduleJob(name, rule, function(){
          callback&&callback();
        });
        resolve(name);
      } catch (error) {
        reject(error)
      }
    })
  }
  // rule 的值  | 
  return async (ctx,  next)=>{

    // 1. cron字符串
    ctx.cronJob = async (rule, callback)=>{
      // 每分钟的第30秒触发： '30 * * * * *'
      // 每小时的1分30秒触发 ：'30 1 * * * *'
      // 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
      // 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
      // 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'
      // 每周1的1点1分30秒触发 ：'30 1 1 * * 1'

      return startTimer(rule, callback);
    }

    // 1. Date 实例
    ctx.dateJob = async (rule, callback)=>{

      return startTimer(new Date(rule), callback);
    }

    // 1. RangeDate
    ctx.rangeJob = async (rule={}, callback)=>{
      const _rule = {
        rule: rule.rule
      };
      if(rule.start){
        _rule.start = new Date(rule.start);
      }

      if(rule.end){
        _rule.end = new Date(rule.end);
      }

      return startTimer(_rule, callback);
    }

    // 1. RecurrenceRule实例
    ctx.ruleJob = async (rule={}, callback)=>{
    // second (0-59)
    // minute (0-59)
    // hour (0-23)
    // date (1-31)
    // month (0-11)
    // year
    // dayOfWeek (0-6) Starting with Sunday
      
      var _rule    = new schedule.RecurrenceRule();//递归循环规则调度
      if(rule.year){
        _rule.year = rule.year;
      }

      if(rule.month){
        _rule.month = rule.month;
      }

      if(rule.date){
        _rule.date = rule.date;
      }

      if(rule.dayOfWeek){
        _rule.dayOfWeek = rule.dayOfWeek;
      }

      if(rule.hour){
        _rule.hour = rule.hour;
      }

      if(rule.minute){
        _rule.minute = rule.minute;
      }

      if(rule.second){
        _rule.second = rule.second;
      }

      return startTimer(_rule, callback);
    }


    ctx.cancelJob = async name=>{

      // schedule.cancelJob(name)
      return new Promise((resolve, reject)=>{
        const job = schedule.scheduledJobs(name);
        if(job) {
          try {
            job.cancel();
          } catch (error) {
            reject();
          }
        }

        resolve(true);
      })
      
    }

    await next()
  }
}