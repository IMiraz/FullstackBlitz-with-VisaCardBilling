const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
//const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');


const Survey = mongoose.model('surveys');

module.exports = app => {

  app.get('/api/surveyslist', requireLogin, async (req, res) => {
 const surveyslist = await Survey.find({ _user: req.user.id});

 res.send(surveyslist)
  })





    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
          title,
          subject,
          body,
          recipients: recipients.split(',').map(email => ({ email: email.trim() })),
          _user: req.user.id,
          dateSent: Date.now()
        });
//best place to send an email
//const mailer = new Mailer(survey, surveyTemplate(survey));


  // mailer.send();
   survey.save();
  req.user.credits -= 1;
  const user =  req.user.save();

  res.send(user);

});



};