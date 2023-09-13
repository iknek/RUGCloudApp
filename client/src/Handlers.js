import { useState, useEffect } from 'react';

const Handlers = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetch("/items")
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((error) => console.error("Error fetching items:", error));
    }, []);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    }

    const handleAddNewItem = async (newItemData) => {
        try {
            const response = await fetch("/item", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItemData)
            });

            const data = await response.json();

            if (data && data._id) {
                setItems(prevItems => [...prevItems, data]);
            } else {
                console.error("Error adding new item: Data format unexpected", data);
            }
        } catch (error) {
            console.error("Error adding new item:", error);
        }
    }

    const handleItemEdit = (itemId, field, value) => {
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
    }

    return {
        items,
        selectedItem,
        handleItemClick,
        handleAddNewItem,
        handleItemEdit
    };
}

export default Handlers;
