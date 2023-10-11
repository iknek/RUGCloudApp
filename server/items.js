// Imports
const { connectDB } = require("./connect");
const Item = require('./item'); // Import the item model

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

const deleteItem = async (itemId) => {
    await connectDB();
    
}

const updateItem = async (itemID, itemData) => {
    await connectDB();
    
    try{
        const updateItemInfo = Item.updateOne({ _id: itemID}, itemData, {
            returnOriginal: false,
        });
    
        if((await updateItemInfo).acknowledged){
            const itemOut = await getItem(itemID);
            if(itemOut != null){
                return itemOut;
            }else{
                throw new Error; //throw an error in case there is no item under this ID
            }
        }
    } catch (error) {
        throw new Error; //throw an error in case the itemID was an unvalid mongoID
    }  
};

module.exports = {
    getItem,
    getAllItems,
    createItem,
    updateItem,
}