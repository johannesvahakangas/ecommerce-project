import React, { useState } from "react";
import axios from "axios";
import "../css/addproduct.css";

const AddProductForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/add-product/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product added:", response.data);
      // Sucess
      setSuccessMessage("Your Product has been added!");

      // Clear
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      console.log("successmessage:", successMessage);
    } catch (error) {
      console.error("Failed to add product:", error.response || error);
      setSuccessMessage("");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="add-product-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" class="add-button">
          Add Product
        </button>
      </form>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default AddProductForm;
