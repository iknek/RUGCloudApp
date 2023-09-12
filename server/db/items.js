// Imports
const { connectDB } = require("./connect");
const Item = require('../models/item'); // Import the item model

const getItem = async (itemID) => {
    await connectDB();
    return Item.findOne({ _id: itemID});
};

const getAllItems = async () => {
    await connectDB();

    return Item.find();
};

const createItem = async (itemData) => {
    await connectDB();

    const createdItem = new Item(itemData);
    await createdItem.save();
    return createdItem;
};

module.exports = {
    getItem,
    getAllItems,
    createItem,
}