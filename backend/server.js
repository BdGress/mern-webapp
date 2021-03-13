const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const passport = require("passport");



// DB Config
const db = require("./config/keys").mongoURI;

const app = express();

const usersRouter = require('./routes/users');


const port = process.env.PORT || 5000;

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

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});