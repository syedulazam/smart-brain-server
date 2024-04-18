const handleProfile = (req, res, db) => {
  const { id } = req.params;
  // let found = false;
  // database.users1.forEach((user) => {
  //   if (user.id === id) {
  //     found = true;
  //     res.json(user);
  //   } // In the forEach loop, we shouldn't put an else statement.
  // });
  // if (!found) {
  //   res.status(404).json("NOT FOUND");
  // }
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
};

module.exports = {
  handleProfile,
};
