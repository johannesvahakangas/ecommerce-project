import React, { useEffect, useState } from "react";
import { fetchProductsBySearch } from "../api";
import { useLocation } from "react-router-dom";
import "../css/searchresult.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const query = new URLSearchParams(useLocation().search).get("query");
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchProductsBySearch(query);
        setProducts(data);
        setError("");
      } catch (error) {
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, [query]);

  const addToCart = (product) => {
    console.log("Adding to cart:", product);
  };
  const attemptEdit = (product) => {
    if (!user || user.id !== product.owner_id) {
      setProducts((currentProducts) =>
        currentProducts.map((p) => {
          if (p.id === product.id) {
            return {
              ...p,
              editMessage: "You are not authorized to edit this product.",
              editMessageType: "error-price",
            };
          }
          return p;
        })
      );
    } else {
      let newPrice = prompt("New price:");
      if (newPrice) {
        handlePriceUpdate(product, newPrice);
      }
    }
  };

  const handlePriceUpdate = (product, newPrice) => {
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/api/edit-product/${product.id}/`,
        { price: newPrice },
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setProducts((currentProducts) =>
          currentProducts.map((p) => {
            if (p.id === product.id) {
              return {
                ...p,
                price: newPrice,
                editMessage: `Price updated to €${newPrice}.`,
                editMessageType: "success-price",
              };
            }
            return p;
          })
        );
      })
      .catch((error) => {
        console.error("Failed to update price:", error);
        setProducts((currentProducts) =>
          currentProducts.map((p) => {
            if (p.id === product.id) {
              return {
                ...p,
                editMessage: "Failed to update price.",
                editMessageType: "error-price",
              };
            }
            return p;
          })
        );
      });
  };

  //a bit extra styling
  const trimDescription = (description, maxLength = 80) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const trimHeader = (text, maxLength = 20) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div>
      <h1 className="search-header">Search Results for: {query}</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                className="product-image"
                src={
                  product.image
                    ? `${process.env.REACT_APP_API_URL}${product.image}`
                    : "/static/placeholder.jpg"
                }
                alt={product.title}
              />
              <div className="product-info">
                <h2 className="product-name">{trimHeader(product.title)}</h2>
                <p className="product-owner">
                  Owner: {product.owner_username || "N/A"}
                </p>
                <p className="product-added">
                  Added on:{" "}
                  {new Date(product.date_created).toLocaleDateString()}
                </p>
                <p className="product-status">
                  Status: {product.status_for_user || product.status}
                </p>
                <p className="product-description">
                  {trimDescription(product.description)}
                </p>
                <div className="product-actions">
                  <button
                    className="btn add-to-cart"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  {user && user.id === product.owner_id && (
                    <button
                      className="btn edit-product"
                      onClick={() => attemptEdit(product)}
                    >
                      Edit Price
                    </button>
                  )}
                </div>
                <h4 className="product-price">
                  <strong>
                    {product.price && !isNaN(product.price)
                      ? `€${parseFloat(product.price).toFixed(2)}`
                      : "N/A"}
                  </strong>
                </h4>
              </div>
            </div>
          ))
        ) : (
          <div>No products found for {query}...</div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
