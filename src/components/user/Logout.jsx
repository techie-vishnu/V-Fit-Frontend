import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserData } from '../../store/user/userSlice';

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    sessionStorage.clear();
    dispatch(clearUserData());
    axios.get(import.meta.env.VITE_BACKEND_BASEURL + '/api/auth/logout').then((res) => {
        navigate('/login');
    });
    return (
        <></>
    )
}

export default Logout