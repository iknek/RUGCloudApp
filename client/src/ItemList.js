import React from 'react';

function ItemList({ items, onItemSelected, onAddNewItem }) {
    return (
        <div>
            <div className="list-header">
                My Lists
            </div>
            <button onClick={onAddNewItem} className="add-list-btn">Make New List</button>
            <ul>
                {items.map(item => (
                    <li 
                        key={item._id} 
                        onClick={() => onItemSelected(item)}
                    >
                        {item.name}
                        <div className="item-description">{item.description}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ItemList;
