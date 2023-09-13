import React from 'react';
import './App.css';
import ItemList from './ItemList';
import Handlers from './Handlers';

function App() {
    const { items, selectedItem, handleItemClick, handleAddNewItem, handleItemEdit } = Handlers();

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
                    onItemEdit={handleItemEdit}
                />
            </div>
            <div className="right-panel">
                {selectedItem ? (
                    <div>
                        <input
                            value={selectedItem.name}
                            onChange={e => handleItemEdit(selectedItem._id, 'name', e.target.value)}
                        />
                        <textarea
                            value={selectedItem.description}
                            onChange={e => handleItemEdit(selectedItem._id, 'description', e.target.value)}
                        />
                    </div>
                ) : (
                    <p>Select an item to view its contents.</p>
                )}
            </div>
        </div>
    );
}

export default App;
