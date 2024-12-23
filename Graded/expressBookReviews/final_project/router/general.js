const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  console.log("Username: ", username);
  console.log("Password: ", password);
  if (username === "" || password === "")
    return res
      .status(400)
      .json({ message: "Username or password cannot be empty" });

  console.log("isValid: ", isValid(username));
  if (isValid(username)) {
    users.push({ username, password }); // Create user in DB
    return res.status(200).json({
      message: `User (${username}) successfully registered. Now you can login`,
    });
  }

  return res.status(300).json({
    message: `User (${username}) failed to registered. Probably already exists`,
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const _books = Object.values(books);
  return res.status(300).json(_books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  const _books = Object.values(books).filter((book) => book.author === author);
  if (_books.length > 0) {
    return res.status(200).json(_books);
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
  //Write your code here
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  const _book = Object.values(books).find((book) => book.title === title);
  if (_book) {
    return res.status(200).json(_book);
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const reviews = Object.values(books[isbn].reviews);

  if (reviews.length > 0) {
    return res.status(200).json(reviews);
  }

  return res.status(404).json({ message: "Reviews not found" });
});

module.exports.general = public_users;
