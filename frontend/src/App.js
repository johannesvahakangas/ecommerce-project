import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import CartProvider from './context/CartContext';
import Login from './components/Login';
import Signup from './components/Signup';
import AccountPage from './components/Account';
import { AuthProvider } from './context/AuthContext'
import AddProductForm from './components/AddProduct';
import UserProductView from './components/UserProductView';
import SearchResults from './components/SearchResult'

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <div className="container">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path='/addproduct' element={<AddProductForm/>}/>
            <Route path='/myitems' element={<UserProductView/>}/>
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </Router>
      </div>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;