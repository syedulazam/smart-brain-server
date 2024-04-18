const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission"); //The reason why we are using hte return statemnet is so that the statemnts after is not implemented.
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password);

  // Start a transaction to ensure data consistency
  db.transaction((trx) => {
    // Insert the user into the 'users' table
    trx
      .insert({
        name: name,
        email: email,
        joining: new Date(),
        entries: 0,
      })
      .into("users")
      .returning("id")
      .then((userId) => {
        // Insert the hashed password and user ID into the 'login' table
        return trx("login")
          .insert({
            hash: hashedPassword,
            email: email,
          })
          .then(() => {
            // Commit the transaction if everything is successful
            trx.commit();
            // Return the user information
            res.json({
              id: userId[0],
              name: name,
              email: email,
              entries: 0,
              joining: new Date(),
            });
          })
          .catch((err) => {
            // Rollback the transaction if there's an error
            trx.rollback();
            console.log(err);
            res
              .status(400)
              .json("Unable to register - Error inserting into login table");
          });
      })
      .catch((err) => {
        // Rollback the transaction if there's an error
        trx.rollback();
        console.log(err);
        res
          .status(400)
          .json("Unable to register - Error inserting into users table");
      });
  });
};

module.exports = {
  handleRegister: handleRegister,
};
