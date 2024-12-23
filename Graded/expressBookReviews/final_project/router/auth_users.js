const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // This is DB for users

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.find((user) => user.username === username) === undefined;
};

// This function checks if the user is registered or not
const isUserRegistered = (username, password) => {
  return (
    users.find(
      (user) => user.username === username && user.password === password
    ) !== undefined
  );
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (isUserRegistered(username, password)) {
    const accessToken = jwt.sign({ data: password }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    req.session.authorization = {
      accessToken: accessToken,
      username: username,
    };

    return res
      .status(300)
      .json({ message: `User: ${username} Successfully Logged In.` });
  } else {
    return res
      .status(403)
      .json({ message: `User: ${username} is not registered.` });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  console.log("ISBN: ", isbn);
  console.log("Review: ", review);
  console.log("Books: ", books[isbn]);
  if (books[isbn]) {
    books[isbn].reviews[req.user] = review;
    return res.status(300).json({ message: "Review added successfully" });
  }

  //Write your code here
  return res
    .status(400)
    .json({ message: `Failed to add Review for ISBN: ${isbn}` });
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  console.log("ISBN: ", isbn);
  console.log("Review: ", review);
  console.log("Books: ", books[isbn]);
  if (books[isbn].reviews[req.user]) {
    delete books[isbn].reviews[req.user];
    return res.status(200).json({
      message: `Review for ISDN (${isbn}) made by (${req.user}) successfully Deleted!`,
    });
  }

  //Write your code here
  return res.status(400).json({
    message: `Review Deletetion, for ISDN (${isbn}) made by (${req.user}) FAILED!`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
