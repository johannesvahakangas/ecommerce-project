import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../css/signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/signup/`, { username, password, email });
        alert(`New user created! Welcome ${username}! Please log in.`);
        navigate('/login'); 

      } catch (error) {
        console.error(error);
        alert('Signup failed. Please try again.');
      }
    };

    return (
      <div className="signup-container">
        <h2>Signup Page</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
};

export default Signup;

