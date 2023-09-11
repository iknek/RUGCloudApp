// Imports
const { connectDB } = require("./connect");
const Book = require('../models/book'); // Import the book model


const getBook = async (bookID) => {
    await connectDB();
    return Book.findOne({ _id: bookID});
};

const getAllBooks = async () => {
    await connectDB();

    return Book.find();
};

const createBook = async (bookData) => {
    await connectDB();

    const createdBook = new Book(bookData);
    await createdBook.save();
    return createdBook;
};

module.exports = {
    getBook,
    getAllBooks,
    createBook,
}