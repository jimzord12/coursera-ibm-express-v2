const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 5000;

// Message to Reviewer: I was not able to fully understand the reason for this node.js script.
// I believe you simply wish for us to consume the API endpoints from the express server we created.

const axiosInstance = axios.create({
  baseURL: BASE_URL + ":" + PORT,
});

// Using async/await - Get all books
async function getAllBooks() {
  try {
    const response = await axiosInstance.get("/");
    console.log("All Books:", response.data);
  } catch (error) {
    console.error("Error fetching all books:", error.message);
  }
}

// Using Promises - Get book by ISBN
function getBookByISBN(isbn) {
  axiosInstance
    .get(`/books/${isbn}`)
    .then((response) => {
      console.log("Book by ISBN:", response.data);
    })
    .catch((error) => {
      console.error("Error fetching book by ISBN:", error.message);
    });
}

// Search by Author
async function getAuthor(author) {
  try {
    const response = await axiosInstance.get(`/author/${author}`);
  } catch (error) {
    console.error("Error searching by ISBN:", error.message);
  }
}

// Search by Title
async function getTitle(title) {
  try {
    const response = await axiosInstance.get(`/title/${title}`);
  } catch (error) {
    console.error("Error searching by Title:", error.message);
  }
}
