import React from 'react';
import './App.css';
import ItemList from './ItemList';
import Handlers from './Handlers';

function App() {
    const { items, selectedItem, handleItemClick, handleAddNewItem } = Handlers();

    return (
        <div className="container">
            <div className="left-panel">
                <ItemList 
                    items={items} 
                    onItemSelected={handleItemClick}
                    onAddNewItem={() => handleAddNewItem({
                        name: "Custom Name",
                        description: "Custom Description"
                    })}
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
