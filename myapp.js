require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
let PORT = 3500;
const cors = require("cors");
const { Schema } = mongoose;
const public_users = require("./routes/general").general;
const regd_users = require("./routes/authenticated").authenticated;
const userSchema = require("./model/users").userSchema;
const User = require("./model/users").User;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Address = require("./model/address").Address;
const addr = require("./routes/addressRoute").addr;
const myPlan = require("./routes/myPlanRoute").myPlan;
const Razorpay = require("razorpay");
const paymentRoute = require("./routes/paymentRoute").paymentRoute;

app.use(cors());

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

const res = mongoose.connect(
  "mongodb+srv://eatfresh251:tW20fbGGtNbl87yS@cluster0.vhw9ubl.mongodb.net/EatFreshDB",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3500/auth/google/plans",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

app.use("/", public_users);
app.use("/customer", regd_users);
app.use("/customer/address", addr);
app.use("/customer/myPlan", myPlan);
app.use("/api", paymentRoute);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
});

module.exports.instance = instance;

// npx express-generator --views=ejs eat_fresh
