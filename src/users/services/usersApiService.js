import axios from "axios";

const API_URL = "http://127.0.0.1:8181/users";

export const login = async (userLogin) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userLogin);
        const data = response.data
        return data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data);
        }
        else throw new Error(error.message);
    }
}

export const signup = async (normalizedUser) => {
    try {
        const response = await axios.post(API_URL, normalizedUser);
        const data = response.data
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}
