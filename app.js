const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const auth = require("./auth");
// body parser configuration
dbConnect();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});
app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User created successfully!",
            result,
          });
        })
        .catch((err) => {
          response.status(500).send({ message: "Error creating user!", err });
        });
    })
    .catch((e) =>
      response
        .status(500)
        .send({ meessage: "Password was not hashed successfully!", e })
    );
});
app.post("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordChecck) => {
          if (!passwordChecck) {
            return response
              .status(400)
              .send({ message: "Password doesn't match!" }, error);
          }
          //check password
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
          // creating JWT TOken
          response.status(200).send({
            message: "Login successfull",
            email: user.email,
            token,
          });
        })
        .catch((err) => {
          response.status(400).send({ message: "Incorrect Password", err });
        });
    })
    .catch((err) => {
      response.status(404).send({ message: "Email not found!", err });
    });
});
module.exports = app;

// async function isPasswordMatching(request, user, response) {
//   return
// }
