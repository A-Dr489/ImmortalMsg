import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;
const API_AUTH = import.meta.env.VITE_API_AUTH;
axios.defaults.withCredentials = true;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refreshAccessToken();
    }, []);

    async function refreshAccessToken() {
        try{
            const response = await axios.post(`${API_AUTH}/auth/refresh`);
            setAccessToken(response.data.accessToken);

            const profile = await axios.get(`${API_URL}/protect/profile`, {
                headers: { Authorization: `Bearer ${response.data.accessToken}` }
            });
            setUser(profile.data.user);
        } catch(e) {
            console.log("refreshAccessToken Error: " + e);
        } finally {
            setLoading(false);
        }
    }

    async function register(username, email, password, cpassword) {
        try{
            const response = await axios.post(`${API_AUTH}/auth/register`, {
                username: username,
                Remail: email,
                Rpassword: password,
                Cpassword: cpassword
            });
            return {result: true}
        } catch(e) {
            console.log("register error: " + e);
            return {result: false, message: e.response.data.errors, server: e.response?.status === 500 ? "Internal Server Error" : null};
        }
    }

    async function login(email, password) {
        try{
            const response = await axios.post(`${API_AUTH}/auth/login`, {
                Lemail: email,
                Lpassword: password
            });
            setAccessToken(response.data.accessToken);
            setUser(response.data.user);
            return {result: true};
        } catch(e) {
            console.log("Login Error: " + e);
            return {result: false, message: e.response.data.message};
        }
    }

    async function logout() {
        try {
            await axios.post(`${API_AUTH}/auth/logout`);
        } catch (err) {
            console.log('Logout error: ' + err);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    }

    async function apiCall(method, url, data = null) {  //(post, /auth/login, {email, password})
        try{
            const configs = {
                method: method,
                url: `${API_URL}${url}`,
                headers: { Authorization: `Bearer ${accessToken}` },
                data: data
            }

            return await axios(configs);
        } catch(e) {
            if(e.response?.status === 403) {
                await refreshAccessToken();
                const configs = {
                    method: method,
                    url: `${API_URL}${url}`,
                    headers: { Authorization: `Bearer ${accessToken}` },
                    data: data
                }

                return await axios(configs);
            }
            throw e;
        }
    }

    async function setAccessTokenFromOAuth(token) {
        try {
            setAccessToken(token);
            const profile = await axios.get(`${API_URL}/protect/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(profile.data.user);
        } catch(e) {
            console.log("OAuthAccessTokenError: " + e);
        } finally {
            setLoading(false);
        }
    }

    const values = {
        user,
        accessToken,
        loading,
        refreshAccessToken,
        register,
        login,
        apiCall,
        logout,
        setAccessTokenFromOAuth
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}