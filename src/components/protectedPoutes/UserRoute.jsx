import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';


export const UserRoute = ({ children, isAdmin = false }) => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const userData = useSelector(state => state.user.userData);

    const checkUserLoggedIn = () => {
        try {
            // const res = await axios.get(import.meta.env.VITE_BACKEND_BASEURL + '/api/user/profile', { withCredentials: true });
            if (userData !== null) {
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