import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/userproductview.css";
import { useAuth } from "../context/AuthContext";

const UserProductView = () => {
  const { user } = useAuth();
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [boughtProducts, setBoughtProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [error, setError] = useState("");
  const [setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;

      try {
        // Fetch owned products
        let response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user-inventory/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setOwnedProducts(response.data);

        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user-bought-products/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setBoughtProducts(response.data);

        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user-sold-products/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setSoldProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, [user]);

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
        //update the product's price in the list and show message
        const updateProductsList = (productsList) =>
          productsList.map((p) => {
            if (p.id === product.id) {
              return {
                ...p,
                price: newPrice,
                editMessage: `Price updated to ${newPrice}€.`,
                editMessageType: "success-price",
              };
            }
            return p;
          });
        setOwnedProducts((currentProducts) =>
          updateProductsList(currentProducts)
        );
      })
      .catch((error) => {
        console.error("Failed to update price:", error);
        //update only the message
        const updateMessage = (productsList) =>
          productsList.map((p) => {
            if (p.id === product.id) {
              return {
                ...p,
                editMessage: "Failed to update price.",
                editMessageType: "error-price",
              };
            }
            return p;
          });
        setOwnedProducts((currentProducts) => updateMessage(currentProducts));
      });
  };

  const renderProductList = (products, title) => (
    <>
      <h3>{title}</h3>
      <div className="products-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <img
                src={
                  product.image
                    ? `${process.env.REACT_APP_API_URL}${product.image}`
                    : "/static/placeholder.jpg"
                }
                alt={product.title}
                className="product-image"
              />
              <div className="product-details">
                <h4>{product.title}</h4>
                <p className="product-owner">
                  Owner: {product.owner_username || "N/A"}
                </p>
                <p>Price: {product.price}€</p>
                <p>Status: {product.status_for_user || product.status}</p>
                {ownedProducts.includes(product) && (
                  <button onClick={() => attemptEdit(product)}>
                    Edit Price
                  </button>
                )}
                {product.editMessage && (
                  <div className={product.editMessageType}>
                    {product.editMessage}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No products found...</p>
        )}
      </div>
    </>
  );

  return (
    <div className="user-products">
      <h2>My Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {renderProductList(ownedProducts, "Owned Products")}
      {renderProductList(boughtProducts, "Bought Items")}
      {renderProductList(soldProducts, "Sold Items")}
    </div>
  );
};

export default UserProductView;
