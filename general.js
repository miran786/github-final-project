const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  return res.status(200).json({message: "Customer successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Using traditional response for basic setup
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn].author === author) {
      booksByAuthor.push({"isbn": isbn, "title": books[isbn].title, "reviews": books[isbn].reviews});
    }
  });

  if (booksByAuthor.length > 0) return res.status(200).json({booksbyauthor: booksByAuthor});
  else return res.status(404).json({message: "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn].title === title) {
      booksByTitle.push({"isbn": isbn, "author": books[isbn].author, "reviews": books[isbn].reviews});
    }
  });

  if (booksByTitle.length > 0) return res.status(200).json({booksbytitle: booksByTitle});
  else return res.status(404).json({message: "No books found for this title"});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

// ============================================
// TASK 10-13: Async/Await and Axios Promise Callbacks
// ============================================

// Task 10: Get all books using async/await with axios
async function getAllBooksAsync() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("All books:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all books:", error.message);
    }
}

// Task 11: Get book details by ISBN using Promises with axios
function getBookByIsbnPromise(isbn) {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Book with ISBN ${isbn}:`, response.data);
        })
        .catch(error => {
            console.error("Error fetching book by ISBN:", error.message);
        });
}

// Task 12: Get book details by Author using async/await with axios
async function getBooksByAuthorAsync(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Books by ${author}:`, response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
    }
}

// Task 13: Get book details by Title using Promises with axios
function getBooksByTitlePromise(title) {
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            console.log(`Books with title ${title}:`, response.data);
        })
        .catch(error => {
            console.error("Error fetching books by title:", error.message);
        });
}

module.exports.general = public_users;
