import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/account.css";

const AccountDetails = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData({ name: user.name, email: user.email });
    }
  }, []);

  const token = localStorage.getItem("token");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/change-password/`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setSuccessMessage("Password changed!");
    } catch (error) {
      console.error("Failed to change password.", error);
      setErrorMessage("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="account-container">
      <div className="profile-info">
        <img
          src="/static/profile.jpg"
          alt="Profile"
          className="profile-image"
        />
        <div className="user-details">
          <h3>{userData.name}</h3>
          <p>Email: {userData.email}</p>
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleChangePassword} className="password-form">
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old Password"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default AccountDetails;
