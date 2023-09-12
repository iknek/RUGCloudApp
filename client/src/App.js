import React, { useState, useEffect } from 'react';
import './App.css';
import ItemList from './ItemList';

function App() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // Placeholder for selected item for the right panel

    useEffect(() => {
        fetch("/items")
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((error) => console.error("Error fetching items:", error));
    }, []);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    }

    const handleAddNewItem = () => {
        // Placeholder function for now, to be replaced with API call later
        const newItem = {
            _id: new Date().getTime().toString(), // Temporary ID for demonstration
            name: "New List",
            description: "Description for new list"
        };

        setItems(prevItems => [...prevItems, newItem]);
    }

    return (
        <div className="container">
            <div className="left-panel">
                <ItemList 
                    items={items} 
                    onItemSelected={(item) => handleItemClick(item)}
                    onAddNewItem={() => handleAddNewItem()}
                />
            </div>
            <div className="right-panel">
                {/* Placeholder for the right panel content based on the selected item */}
                {selectedItem ? (
                    <div>
                        <h2>{selectedItem.name}</h2>
                        <p>{selectedItem.description}</p>
                    </div>
                ) : (
                    <p>Select an item to view its contents.</p>
                )}
            </div>
        </div>
    );
}

export default App;
