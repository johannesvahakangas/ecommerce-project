import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchProductsBySearch = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/store/search/?search=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
    }
};