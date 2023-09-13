const express = require("express");
const { connectDB } = require("./db/connect.js");
const { getItem, getAllItems, createItem, updateItem } = require("./db/items.js");
const { getBook, getAllBooks, createBook, updateBook } = require("./db/books.js");
const bodyParser = require("body-parser"); // Require the body-parser middleware

const PORT = 3001;
const cors = require('cors');
app.use(cors({
  origin: ["http://frontend:3000", "http://localhost:3000"], // Allow these domains
  methods: ["GET", "POST"], // Allow these HTTP methods
  credentials: true // Enable cookies and headers
}));

// Add body-parser middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());
app.get("/api", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({message: "Hello from server!"});
});
app.get("/items", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const items = await getAllItems();
  res.json(items);
});
app.get("/item/:itemID", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { itemID } = req.params;  
  const item = await getItem(itemID);
  res.json(item);
});
app.post("/item", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const item = await createItem(req.body);
  res.json(item);
});
app.put("/item/:itemID", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { itemID } = req.params;  
  try{
    const item = await updateItem(itemID, req.body);
    const message = "Item updated!";
    res.json({ message, item });
  } catch (error){
    const message = "Item not found or could not be updated!";
    res.json({ message });
  }
});

app.get("/books", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const books = await getAllBooks();
  res.json(books);
});
app.get("/book/:bookID", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { bookID } = req.params;  
  const book = await getBook(bookID);
  res.json(book);
});
app.post("/book", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const book = await createBook(req.body);
  res.json(book);
});
app.put("/book/:bookID", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { bookID } = req.params; 
  try{
    const book = await updateBook(bookID, req.body);
    const message = "Book updated!";
    res.json({ message, book });
  } catch (error){
    const message = "Book not found or could not be updated!";
    res.json({ message });
  }
  
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`);
});

