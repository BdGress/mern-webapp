const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const passport = require("passport");



// DB Config
const db = require("./config/keys").mongoURI;

const app = express();

const usersRouter = require('./routes/users');
const herokuRouter = require('./routes/heroku');


const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);


app.use('/users', usersRouter);
app.use('/heroku', herokuRouter);

// ... other imports 
const path = require("path")

// ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});





