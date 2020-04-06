const express = require("express");
const router = new express.Router();
const userModel = require("./../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const uploader = require("./../config/cloudinary");


const minPasswordLength = 4;

router.post("/signup", uploader.single("avatar"), (req, res, next) => {

  var errorMsg = "";
  const { username, name, lastName, password, description, email, lat, lng } = req.body;
  // @todo : best if email validation here or check with a regex in the User model
  if (!password || !email) errorMsg += "Remplissez les champs e-mail et mdp.\n";

  if (password.length < minPasswordLength)
    errorMsg += `Votre mdp doit compter au moins ${minPasswordLength} caractères.`;

    userModel.find({ username : username})
    .then(dbRes => { if(dbRes)errorMsg += "Ce pseudo est déjà pris.\n";})

  if (errorMsg) return res.status(403).json(errorMsg); // 403	Forbidden

  const salt = bcrypt.genSaltSync(10);

  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = {
    username,
    name,
    lastName,
    email,
    description,
    password: hashPass
  };

  if (req.file) newUser.avatar = req.file.secure_url;
  newUser.address = {street: req.body.street, zipCode: req.body.zipCode, city: req.body.city}    
  newUser.author = req.user._id
  let location = {
      type: 'Point',
      coordinates: [lng, lat]
    };
    newUser.location = location;
  userModel
    .create(newUser)
    .then(newUserFromDB => {
      res.status(200).json({msg: "signup ok"});
    })
    .catch(err => {
      console.log("signup error", err);
      next(err);
    });
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, failureDetails) => {
    if (err || !user) return res.status(403).json("invalid user infos"); // 403 : Forbidden

    req.logIn(user, function(err) {
      if (err) {
        return res.json({ message: "Something went wrong logging in" });
      }
      const { _id, username, email, avatar, role } = user;
      console.log("successful login", user)
      next(
        res.status(200).json({
          currentUser: {
            _id,
            username,
            email,
            avatar,
            role,
          }
        })
      );
    });
  })(req, res, next);
});

router.post("/signout", (req, res, next) => {
  req.logout();
  res.json({ message: "Success" });
});

router.use("/is-loggedin", (req, res, next) => {
  if (req.isAuthenticated()) {
    const { _id, username, email, avatar, role } = req.user;
    return res.status(200).json({
      currentUser: {
        _id,
        username,
        email,
        avatar,
        role
      }
    });
  }
  res.status(403).json("Unauthorized");
});

module.exports = router;