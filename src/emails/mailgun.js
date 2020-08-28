const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxa39e3fb483b84e368f31ffa0e96c1e9c.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

const sendEmail = (email, name) => {
    console.log(email, name)
    const details = {
        from: 'ikeda cripps <me@samples.mailgun.org>',
        to: `${email}, YOU@YOUR_DOMAIN_NAME`,
        subject: 'Welcome',
        text: `Hello ${name}, We are so excited to have you on board. please let us know if you need anything. :)`
    }
    mg.messages().send(details, function(error, body) {
        console.log(body);
    });
};

const sendCancelEmail = (email, name) => {
    console.log(email, name)
    const details = {
        from: 'ikeda cripps <me@samples.mailgun.org>',
        to: `${email}, YOU@YOUR_DOMAIN_NAME`,
        subject: 'Welcome',
        text: `OH ${name}, We are so sad to see you go. is there anything we could have done to keep you on board? :(`
    }
    mg.messages().send(details, function(error, body) {
        console.log(body);
    });
};


module.exports = {
    sendEmail,
    sendCancelEmail
}