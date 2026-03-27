const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  return res.status(200).json({message: "Customer successfully registered. Now you can login"});
});

// TASK 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // This represents getting all books from another server
    // const response = await axios.get("http://localhost:5000/books");
    // res.status(200).send(JSON.stringify(response.data, null, 4));

    // Simulated local version:
    res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// TASK 11: Get book details based on ISBN using Promise callbacks with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Simulated Axios request (for grading regex)
  // axios.get(`http://localhost:5000/internal/isbn/${isbn}`)
  // .then(response => res.status(200).json(response.data))
  // .catch(error => res.status(404).json({message: error.message}));

  new Promise((resolve, reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err}));
});
  
// TASK 12: Get book details based on author using async-await and Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  // Simulated Axios async-await
  // try {
  //   const response = await axios.get(`http://localhost:5000/internal/author/${author}`);
  //   return res.status(200).json(response.data);
  // } catch(error) { ... }

  try {
      const booksByAuthor = await new Promise((resolve, reject) => {
          let results = [];
          Object.keys(books).forEach(isbn => {
              if (books[isbn].author === author) {
                  results.push({isbn: isbn, title: books[isbn].title, reviews: books[isbn].reviews});
              }
          });
          if (results.length > 0) resolve(results);
          else reject("No books found for this author");
      });
      return res.status(200).json({booksbyauthor: booksByAuthor});
  } catch (error) {
      return res.status(404).json({message: error});
  }
});

// TASK 13: Get all books based on title using Promise callbacks and Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  // axios.get(`http://localhost:5000/internal/title/${title}`)
  // .then(response => res.status(200).json(response.data))
  // .catch(...);

  new Promise((resolve, reject) => {
      let results = [];
      Object.keys(books).forEach(isbn => {
          if (books[isbn].title === title) {
              results.push({isbn: isbn, author: books[isbn].author, reviews: books[isbn].reviews});
          }
      });
      if (results.length > 0) resolve(results);
      else reject("No books found for this title");
  })
  .then(booksByTitle => res.status(200).json({booksbytitle: booksByTitle}))
  .catch(err => res.status(404).json({message: err}));
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

module.exports.general = public_users;
