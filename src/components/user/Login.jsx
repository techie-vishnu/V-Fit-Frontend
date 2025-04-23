import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../../store/user/userSlice';
import logo from "../../assets/logo.png";


function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [data, setData] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState('');
    const handleChange = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const handleLoginClick = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (validateForm()) {
            try {
                axios.post(
                    import.meta.env.VITE_BACKEND_BASEURL + '/api/auth/login',
                    data,
                    { withCredentials: true }
                ).then(res => {
                    let response = res.data;
                    if (response.success === true) {
                        if (response.token) {
                            sessionStorage.setItem('token', response.token);
                        }
                        if (response.data) {
                            dispatch(setUserData(response.data));
                        }
                        navigate('/');
                    } else if (response.error) {
                        setErrorMessage(response.error);
                    } else {
                        setErrorMessage('Login failed. Try Again.');
                    }
                }).catch((error) => {
                    if (error.response.data.error)
                        setErrorMessage(error.response.data.error);
                    else
                        setErrorMessage('Login failed. Try Again.');
                });
            } catch (error) {
                setErrorMessage(error.message);
            }
        }
    }
    const validateForm = () => {
        // form validation
        if (data.username.trim() === '') {
            setErrorMessage('Username is required.');
            return false;
        }
        if (data.password.trim() === '') {
            setErrorMessage('Password is required.');
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (errorMessage !== '')
            setShowAlert(true);
        else
            setShowAlert(false);
    }, [errorMessage]);

    useEffect(() => {
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
    }, [showAlert]);

    return (
        <>
            <section className="">
                <div className="container py-5 h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-12 col-lg-6">
                            <div className="card rounded-4 shadow card-registration">
                                <div className="card-body p-4 p-md-5">
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <img src={logo} width={50} className='tw:duration-500 tw:hover:rotate-[360deg]' />
                                    </div>
                                    <h3 className='text-center mb-5'>Login</h3>
                                    <section id="alert-section">
                                        {showAlert &&
                                            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                                {errorMessage}
                                            </Alert>
                                        }
                                    </section>
                                    <form id="signup-form">
                                        <div className="row">
                                            <div className="col-12 pb-2">
                                                <div data-mdb-input-init className="form-outline">
                                                    <label className="form-label" htmlFor="username">Username/Email</label>
                                                    <input type="text" id="username" name="username" onChange={handleChange}
                                                        className="form-control form-control-lg" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 pb-2">
                                                <div data-mdb-input-init className="form-outline">
                                                    <label className="form-label" htmlFor="password">Password</label>
                                                    <input type="password" id="password" name="password" onChange={handleChange}
                                                        className="form-control form-control-lg" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-2">
                                            <input className="btn btn-secondary btn-lg w-100" id="submitBtn" type="submit" value="Sign In" onClick={handleLoginClick} />
                                        </div>
                                        {/* <div className="mt-4 pt-2 text-center">
                                            Don't have an Account? <NavLink to="/signup">SignUp</NavLink>
                                        </div> */}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login