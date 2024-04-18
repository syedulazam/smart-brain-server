const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Incorrect form submission"); //The reason why we are using hte return statemnet is so that the statemnts after is not implemented.
  }

  // Retrieve the hashed password from the 'login' table for the provided email
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data.length) {
        // Compare the provided password with the hashed password from the database
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          // If passwords match, retrieve user information from the 'users' table
          return db
            .select("*")
            .from("users")
            .where("email", "=", email)
            .then((user) => {
              res.json(user[0]); // Return user information if login is successful
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json("Unable to get user information");
            });
        } else {
          // If passwords don't match, return error
          res.status(400).json("Wrong credentials");
        }
      } else {
        // If no user with the provided email is found, return error
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("Error occurred during login");
    });
};

module.exports = {
  handleSignin: handleSignin, // Exporting the handleSignin function correctly
};
