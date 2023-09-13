const express = require("express");
const { connectDB } = require("./db/connect.js");
const { getItem, getAllItems, createItem } = require("./db/items.js");
const { getBook, getAllBooks, createBook } = require("./db/books.js");
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

app.get("/books", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const items = await getAllBooks();
  res.json(items);
});
app.get("/book/:bookID", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { itemID } = req.params;  
  const item = await getBook(bookID);
  res.json(item);
});
app.post("/book", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const item = await createBook(req.body);
  res.json(item);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`);
});

