const express1 = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express1();
const pg = require("pg");

const register = require("./controller/register");
const signin = require("./controller/signin");
const profile = require("./controller/profile");
const image = require("./controller/image");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1", // default
    port: 5432, // this is generally the port that has to be written
    user: "postgres", // user means the owneer. You will be able to find this if you do \d in your postgreSQL
    password: "Syedul@123",
    database: "postgres", // database name has to be kept empty becuase we don't know the name
  },
});

// console.log("Database Name:", knex.client.config.connection.database);

db.select("*")
  .from("users")
  .then((response) => console.log(response));

app.use(cors());
app.use(express1.json());

const database = {
  users1: [
    {
      id: "1",
      name: "Syedul",
      email: "syedul6000@gmail.com",
      password: "lionel",
      entries: 0,
      joining: new Date(),
    },
    {
      id: "2",
      name: "Azam",
      email: "azam6000@gmail.com",
      password: "messi",
      entries: 0,
      joining: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send("it's working");
});

// bcrypt.hash(password, null, null, function (err, hash) {
//   console.log(hash);
// });

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`"the app is running in port ${process.env.PORT}"`);
});

module.exports = db; // Exporting db object
