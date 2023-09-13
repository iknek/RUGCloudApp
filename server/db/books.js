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

const updateBook = async (bookID, bookData) => {
    await connectDB();
    
    try{
        const updateBookInfo = Book.updateOne({ _id: bookID}, bookData, {
            returnOriginal: false,
        });
    
        if((await updateBookInfo).acknowledged){
            const bookOut = await getBook(bookID);
            if(bookOut != null){
                return bookOut;
            }else{
                throw new Error; //throw an error in case there is no book under this ID
            }
        }
    } catch (error) {
        throw new Error; //throw an error in case the bookID was an unvalid mongoID
    }  
};

module.exports = {
    getBook,
    getAllBooks,
    createBook,
    updateBook,
}