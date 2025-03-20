import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import { jwtDecode } from "jwt-decode";

export const UserRoute = ({ children, isAdmin = false }) => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const userData = useSelector(state => state.user.userData);

    const checkUserLoggedIn = () => {
        try {
            // const res = await axios.get(import.meta.env.VITE_BACKEND_BASEURL + '/api/user/profile', { withCredentials: true });
            const currentTime = new Date().getTime() / 1000;
            const token = sessionStorage.getItem('token');
            if (userData !== null || !token) {
                if (currentTime > jwtDecode(token).exp) {
                    navigate('/logout');
                }
                if (isAdmin) {
                    if (Array.isArray(userData.roles) && userData.roles.includes('Admin')) {
                        setData(userData);
                    } else {
                        navigate('/logout');
                    }
                } else {
                    setData(userData);
                }
            } else {
                navigate('/logout');
            }
        } catch (error) {
            console.log(error);
            navigate('/logout');
        }
    };

    useEffect(() => {
        checkUserLoggedIn()
    }, [navigate, setData])

    return data ? children : null;
}