import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import './index.css';

const appSettings = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListinDB = ref(database, 'shoppingList');

function App() {
  const [inputValue, setInputValue] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(shoppingListinDB, (snapshot) => {
      if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
        setShoppingList(itemsArray);
      } else {
        setShoppingList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = () => {
    if (inputValue.trim()) {
      push(shoppingListinDB, inputValue);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemID) => {
    const exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  };

  return (
    <div className="container">
      <img id="logo" src="src/assets/cat.png" alt="cat" />
      <input
        type="text"
        id="input-field"
        placeholder="Bread"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className="add__cart__btn" id="add-button" onClick={handleAddToCart}>
        Add to cart
      </button>
      <ul id="shopping-list">
        {shoppingList.length > 0 ? (
          shoppingList.map(([itemID, itemValue]) => (
            <li key={itemID} onDoubleClick={() => handleRemoveItem(itemID)}>
              {itemValue}
            </li>
          ))
        ) : (
          <p>No items here...yet</p>
        )}
      </ul>
    </div>
  );
}

export default App;
