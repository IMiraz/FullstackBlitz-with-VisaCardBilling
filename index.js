const express = require('express');
const mongoose = require('mongoose');
const cookieSession= require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const Keys = require('./config/keys');
require('./models/User');
require('./models/Surveys');
const authRouter = require('./routes/authRoutes.js');
const BillingRouter = require('./routes/billingRoute.js');
const surveyRoute = require('./routes/surveyRoute');

require('./services/passport.js');

mongoose.connect(Keys.mongoURL);


const app = express();
app.use(bodyParser.json())

app.use(
    cookieSession({
maxAge:30 * 24 * 60 * 60 * 1000,
keys:[Keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());




authRouter(app);
BillingRouter(app);
surveyRoute(app);

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }



app.listen(process.env.PORT || 8080,() => {
 console.log("server running on the port : 8080")
})