import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { fetchProductsBySearch } from "../api";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [populateMessage, setPopulateMessage] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.length >= 1) {
        try {
          const data = await fetchProductsBySearch(searchTerm);
          setResults(data);
          console.log("Search Results:", data);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setResults([]);
        }
      } else {
        setResults([]);
      }
    };

    const timerId = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const populateDatabase = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/populate_database/`,
        {}
      );
      setPopulateMessage(
        "Database has been populated with sample data!"
      );
    } catch (error) {
      console.error("Error populating database:", error);
      setPopulateMessage("Failed to populate the database...");
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <img
            src="/static/jvlogo.png"
            width="50"
            height="50"
            className="navbar-logo"
            alt="Logo"
          />
        </Link>
        <Link className="action-button-my-products" to="/myitems">
          My Items
        </Link>
        <button onClick={populateDatabase} id="populateDbButton">
          Populate DB with data (for grading)
        </button>
        {populateMessage && <div id="messageBox">{populateMessage}</div>}
        <div className="navbar-search">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="user-greeting">Hello, {user.name}</span>
              <Link to="/account" className="action-button-account">
                Account
              </Link>
              <Link to="/addproduct" className="action-button-account">
                Add Product
              </Link>
              <button onClick={logout} className="action-button logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="action-button login">
                Login
              </Link>
              <Link to="/signup" className="action-button signup">
                Signup
              </Link>
            </>
          )}
          <Link to="/cart" className="cart-icon">
            <img src="/static/cart.png" alt="Cart" />
            <span id="cart-total">{totalQuantity}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
