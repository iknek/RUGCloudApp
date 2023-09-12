import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetch("/items")
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((error) => console.error("Error fetching items:", error));
    }, []);

    const handleItemClick = (item) => {
        // For now, just set the selected item, later this can be expanded to fetch more details or navigate.
        setSelectedItem(item);
    };

    return (
        <div className="container">
            <div className="left-panel">
                <div className="list-header">My Lists</div>
                <ul>
                    {items.map(item => (
                        <li 
                            key={item._id} 
                            onClick={() => handleItemClick(item)}
                            className={selectedItem && selectedItem._id === item._id ? 'selected' : ''}
                        >
                            {item.name}
                            <div className="item-description">{item.description}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="right-panel">
                {selectedItem ? (
                    <div>
                        {/* Placeholder for now, can expand later. */}
                        <h3>{selectedItem.name}</h3>
                        <p>{selectedItem.description}</p>
                    </div>
                ) : (
                    <p>Select an item to view details...</p>
                )}
            </div>
        </div>
    );
}

export default App;
