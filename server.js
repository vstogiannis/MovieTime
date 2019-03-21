require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "My secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/registrationsDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const reservationSchema = {
  firstName: String,
  lastName: String,
  email: String,
  day: Number,
  number: Number
};

const nextMovieSchema = {
  title: String,
  description: String,
  date1: String,
  date2: String,
  image1: String,
  image2: String,
  image3: String
};

const postSchema = {
  title: String,
  content: String,
  image: String
};


const Post = mongoose.model("Post", postSchema);
const Reservation = mongoose.model("Reservation", reservationSchema);
const Movie = mongoose.model("Movie", nextMovieSchema);

app.route("/")
  .get(function(req, res){
    Movie.find({}).sort({_id: -1}).limit(1).exec(function(err, movies){
      res.render("index", {title: "MovieTime", movies: movies});
    });

  });

app.route("/reservation")
  .get(function(req, res){
    res.render("reservation", {title: "Reservation"});
  })
  .post(function(req, res){
    let givenName = req.body.fname;
    let givenLastName = req.body.lname;
    let givenEmail = req.body.email;
    let givenDay = req.body.day;
    let givenNumber = req.body.number;


    const addReservation = new Reservation ({
      firstName: givenName,
      lastName: givenLastName,
      email: givenEmail,
      day: givenDay,
      number: givenNumber
    });

    addReservation.save();

    async function main(){


      let account = await nodemailer.createTestAccount();

      let transporter = nodemailer.createTransport({
        host: "smtp.live.com",
        port: 587,
        secure: false,
        auth: {
          user: ,
          pass:
        },
        tls:{
          rejectUnauthorized: false
        }
      });


      let mailOptions = {
        from: '"Cinema" email@email.com',
        to: givenEmail,
        subject: "Confirmation",
        text: "Your reservation has been confirmed",
        html: ""
      };

      let info = await transporter.sendMail(mailOptions)

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    main().catch(console.error);
    res.redirect("/reservation");
  });

app.route("/blog")
    .get(function(req, res){
      Post.find({}).sort({_id: -1}).limit(3).exec(function(err, posts){
        res.render("blog", {title: "Blog", posts: posts});
      });
    });

app.route("/about")
  .get(function(req, res){
    res.render("about", {title: "About"});
  });

app.route("/administrator")
  .get(function(req, res){
    if (req.isAuthenticated()){
      Reservation.find(function(err, reservations){
        var leftSeats = [200,200,200,200,200,200,200];
        for (var i = 0; i < reservations.length; i++){
            for (var j = 0; j < leftSeats.length; j++){
              if (reservations[i].day === j + 1){
                if (leftSeats[j] > 0) {
                  leftSeats[j] -= reservations[i].number;
                }
              }
            }
          }
        res.render("admin", {reservations: reservations, leftSeats: leftSeats});
      });
    } else {
      res.redirect("/login");
    }
  })
  .post(function(req, res){
    let givenTitle = req.body.btitle;
    let givenContent = req.body.bcontent;
    let givenImage = req.body.bimage;

    const addPost = new Post ({
      title: givenTitle,
      content: givenContent,
      image: givenImage
    });

    addPost.save();

    let movieTitle = req.body.mtitle;
    let movieDescription = req.body.mdescription;
    let startDate = req.body.date1;
    let finishDate = req.body.date2;
    let movieImage1 = req.body.mimage1;
    let movieImage2 = req.body.mimage2;
    let movieImage3 = req.body.mimage3;

    const addMovie = new Movie ({
      title: movieTitle,
      description: movieDescription,
      date1: startDate,
      date2: finishDate,
      image1: movieImage1,
      image2: movieImage2,
      image3: movieImage3
    });

    addMovie.save();

    res.redirect("/administrator");
  });

app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(function(req, res){

    User.findOne({ username: process.env.USER }, function(err, user) {
      if (err) {
        console.log(err);
      }  if (!user) {
        User.register({username: process.env.USER}, process.env.PASSWORD, function(err, user){
          if (err){
            console.log(err);
          } else {
            passport.authenticate("local")(req, res, function(){
              res.redirect("/login");
            });
          }
        });
      } else {
        const user = new User({
          username: req.body.username,
          password: req.body.password
        });

        req.login(user, function(err){
          if (err) {
            console.log(err);
          } else {
            passport.authenticate("local")(req, res, function(){
              res.redirect("/administrator");
            });
          }
        });
      }
    });
  });

app.route("/logout")
 .get(function(req, res){
   req.logout();
   res.redirect("/login");
 });

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});
