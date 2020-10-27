import nodemailer from 'nodemailer';
import utility from 'utility';

export default (config)=>(ctx, next)=>{


  var smtpConfig = {
    // enable: config.enable,
    // backward compat
    host: config.host,
    port: config.port,
    // secure: config.secure || config.ssl,//// true for 465, false for other ports
    // debug: config.debug,
    auth: {//发件人
      user: config.user,
      pass: config.pass
    }
  };

  const transport = nodemailer.createTransport(smtpConfig);


  /**
   * Send email.
   * @param {String|Array} to, email or email list.
   * @param {String} subject
   * @param {String} html
   * @param {Function(err, result)} callback
   */
  function sendMail(to, subject, html, callback = utility.noop) {

    if (config.enable === false) {
      console.log('[send mail debug] [%s] to: %s, subject: %s\n%s', Date(), to, subject, html);
      return callback();
    }



    const message = {
      from: config.from,
      to: to,
      subject: subject,
      html: html,
    };

    transport.sendMail(message, function (err, result) {
      callback(err, result);
    });
  };



  ctx.sendMail = sendMail;
  

  return next();
}

