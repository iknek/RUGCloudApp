import React, { useEffect, useState } from "react";
import "./App.css";
import Controller from "./controller";

const controller = new Controller();

function App() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        controller.getItems().then(data => setItems(data));
    }, []);

    return (
        <div className="container">
            <div className="left-panel">
              <div className="list-header">My Lists</div> {/* This is the label */}
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>{item.title}</li>
                    ))}
                </ul>
            </div>
            <div className="right-panel">
                {/* Blank for now, will fetch sub-list from item*/}
            </div>
        </div>
    );
}

export default App;
