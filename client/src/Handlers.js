import { useState, useEffect } from 'react';
import socket from './socket';  // Assuming you created this socket connection file as instructed

const Handlers = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    console.log("Handlers.js called");
    useEffect(() => {
        // Request items from the server using socket
        socket.emit('requestItems');
        console.log("UseEffect");
        // Listen for the 'itemsFetched' event from the server
        socket.on('itemsFetched', (fetchedItems) => {
            setItems(fetchedItems);
        });

        // Listen for the 'itemAdded' event from the server
        socket.on('itemAdded', (newItem) => {
            console.log("added");
            setItems(prevItems => [...prevItems, newItem]);
        });
        
        // Listen for the 'itemUpdated' event from the server
        socket.on('itemUpdated', (updatedItem) => {
            console.log("work 16")
            // Update your state with the updated item
            setItems(prevItems => {
                console.log("work 19")
                return prevItems.map(item => {
                    if (item._id === updatedItem._id) {
                        return updatedItem;
                    }
                    return item;
                });
            });
        });

        // Clean up the listener when the component is unmounted
        return () => {
            socket.off('itemUpdated');
            socket.off('itemsFetched');
            socket.off('itemAdded');
            socket.off('itemUpdated');
        };
    }, []);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        console.log("work 37")
    };

    const handleAddNewItem = (newItemData) => {
        // Send the new item data to the server using socket
        socket.emit('addItem', newItemData);
    };

    const handleItemEdit = (itemId, field, value) => {
        // Emit the 'editItem' event to the server with the necessary data
        socket.emit('editItem', { itemId, field, value });

        // Update the local state
        setItems(prevItems => {
            return prevItems.map(item => {
                if (item._id === itemId) {
                    return {
                        ...item,
                        [field]: value
                    };
                }
                return item;
            });
        });

        if (selectedItem && selectedItem._id === itemId) {
            setSelectedItem(prevItem => ({
                ...prevItem,
                [field]: value
            }));
        }
    };

    return {
        items,
        selectedItem,
        handleItemClick,
        handleAddNewItem,
        handleItemEdit
    };
};

export default Handlers;
