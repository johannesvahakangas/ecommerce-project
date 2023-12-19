import React from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import "../css/cart.css";

const Cart = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const handlePayment = async (item) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/update-status/${item.id}/`,
        {},
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );
      removeFromCart(item.id);
      alert(
        `Payment successful for ${item.title}. Item has been marked accordingly.`
      );
    } catch (error) {
      console.error(`Failed to update status for item: ${item.id}`, error);
    }
  };

  // pay for all
  const handlePaymentForAll = async () => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    if (totalPrice <= 0) {
      alert(
        "The transaction didn't work. The total price is 0 or under. Please modify your cart and try again."
      );
      return;
    }

    let failedUpdates = 0;

    for (let item of cartItems) {
      try {
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/update-status/${item.id}/`,
          {},
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        removeFromCart(item.id);
      } catch (error) {
        console.error(`Failed to update status for item: ${item.id}`, error);
        failedUpdates++;
      }
    }

    if (failedUpdates === 0) {
      alert(
        `Payment successful for all items. Items have been marked accordingly.`
      );
    } else {
      alert(
        `Payment partially successful. ${failedUpdates} item(s) failed to update.`
      );
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-column">
        <div className="cart-box">
          <a className="btn-continue-shopping" href="/">
            &#x2190; Continue Shopping
          </a>
          <br />
          <br />
          <div className="cart-info">
            <h5>
              Items in cart: <strong>{totalItems}</strong>
            </h5>
            <h5>
              Total: <strong>{totalPrice}€</strong>
            </h5>
            <button className="btn-checkout" onClick={handlePaymentForAll}>
              Pay for every product
            </button>
          </div>
        </div>
        <br />
        <div className="cart-box">
          {cartItems.map((item) => (
            <div className="cart-row" key={item.id}>
              <div style={{ flex: 2 }}>
                <img
                  className="item-image"
                  src={
                    item.image
                      ? `${process.env.REACT_APP_API_URL}${item.image}`
                      : "/static/placeholder.jpg"
                  }
                  alt={item.title}
                />
              </div>
              <div style={{ flex: 2 }}>
                <p>{item.title}</p>
              </div>
              <div style={{ flex: 1 }}>
                <p>{item.price.toFixed(2)}€</p>
              </div>
              <div style={{ flex: 1 }}>
                <img
                  src="/static/arrow-up.png"
                  alt="Increase"
                  height="10"
                  onClick={() => increaseQuantity(item.id)}
                />
                <span className="quantity">{item.quantity}</span>
                <img
                  src="/static/arrow-down.png"
                  alt="Decrease"
                  height="10"
                  onClick={() => decreaseQuantity(item.id)}
                />
              </div>
              <div>
                <p>{(item.price * item.quantity).toFixed(2)}€</p>
              </div>
              <div className="pay-button-container">
                <button className="btn-pay" onClick={() => handlePayment(item)}>
                  Pay
                </button>
              </div>
              <img
                src="/static/delete.png"
                alt="Delete"
                height="30"
                onClick={() => removeFromCart(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
