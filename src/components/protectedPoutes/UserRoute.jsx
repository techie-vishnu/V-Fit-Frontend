import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import { jwtDecode } from "jwt-decode";
import NotFound from '../notFound/NotFound';

export const UserRoute = ({ children, isAdmin = false, allowedRoles = [] }) => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const userData = useSelector(state => state.user.userData);

    const checkUserLoggedIn = () => {
        try {
            // const res = await axios.get(import.meta.env.VITE_BACKEND_BASEURL + '/api/user/profile', { withCredentials: true });
            const currentTime = new Date().getTime() / 1000;
            const token = sessionStorage.getItem('token');
            if (token == null || currentTime > jwtDecode(token).exp) {
                navigate('/logout');
            }
            if (userData !== null) {
                if (allowedRoles.length > 0) {
                    let allowed = false;
                    allowedRoles.forEach((role) => {
                        if (userData.roles.includes(role)) {
                            allowed = true;
                        }
                    })
                    if (!allowed) {
                        navigate('/logout');
                    }
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