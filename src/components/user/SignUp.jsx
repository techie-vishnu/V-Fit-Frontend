import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';


function SignUp() {
    let navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [data, setData] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "", mobile: "", termsAgreement: "" });
    const [errorMessage, setErrorMessage] = useState('');
    const handleChange = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (validateForm()) {
            try {
                axios.post(
                    import.meta.env.VITE_BACKEND_BASEURL + '/api/auth/register',
                    data,
                    { withCredentials: true }
                ).then(res => {
                    let response = res.data;
                    if (response.success == true) {
                        navigate('/login');
                    } else if (response.error) {
                        setErrorMessage(response.error);
                    } else {
                        setErrorMessage('Login failed. Try Again.');
                    }
                }).catch((error) => {
                    console.error(error.message);
                    if (error.response && error.response.data && error.response.data.error)
                        setErrorMessage(error.response.data.error);
                    else if (error.message)
                        setErrorMessage(error.message);
                    else
                        setErrorMessage('Login failed. Try Again.');
                });
            } catch (error) {
                setErrorMessage(error.message);
            }   
        }
        setTimeout(() => {
            setErrorMessage('');
        }, 5000);
    }
    const validateForm = () => {
        console.log(data);
        // form validation
        if (data.name.trim() == '') {
            setErrorMessage('Name is required.');
            return false;
        }
        if (data.username.trim() == '') {
            setErrorMessage('Username is required.');
            return false;
        }
        else if (data.username.length < 4) {
            setErrorMessage('Username must be atleast 4 characters.');
            return false;
        }
        const usernameRegex = /^[a-zA-Z0-9]{4,}$/
        if (!usernameRegex.test(data.username)) {
            setErrorMessage('Username must be alphanumeric.');
            return false;
        }
        if (data.email.trim() == '') {
            setErrorMessage('Email is required.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email.trim())) {
            setErrorMessage('Email is not valid.');
            return false;
        }
        if (data.mobile.trim() == '') {
            setErrorMessage('Mobile number is required.');
            return false;
        }
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(data.mobile.trim())) {
            setErrorMessage('Enter valid 10 digit mobile number');
            return false;
        }
        if (data.password.trim() == '') {
            setErrorMessage('Password is required.');
            return false;
        }
        else if (data.password.length < 8) {
            setErrorMessage('Password must be atleast 8 characters.');
            return false;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(data.password)) {
            setErrorMessage('Password must include atleast one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }
        if (data.confirmPassword.trim() == '') {
            setErrorMessage('Confirm password is required.');
            return false;
        }
        else if (data.confirmPassword.length < 8) {
            setErrorMessage('Confirm Password must be atleast 8 characters.');
            return false;
        }
        else if (!passwordRegex.test(data.confirmPassword)) {
            setErrorMessage('Confirm Password must include atleast one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }
        if (data.confirmPassword.trim() !== data.password.trim()) {
            setErrorMessage("Passwords dosn't match.");
            return false;
        }
        if (!document.getElementById('termsAgreement').checked) {
            setErrorMessage('You must agee to the terms.');
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

    return (
        <>
            <section className="">
                <div className="container py-5 h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-12 col-lg-9 col-xl-7">
                            <div className="card rounded-4 shadow card-registration">
                                <div className="card-body p-4 p-md-5">
                                    <h3 className='text-center mb-5'>Signup</h3>
                                    <section id="alert-section">
                                        {showAlert &&
                                            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                                {errorMessage}
                                            </Alert>
                                        }
                                    </section>
                                    <form id="signup-form">
                                        <div className="row">
                                            <div className="col-md-6 mb-4 pb-2">
                                                <div data-mdb-input-init className="form-outline">
                                                    <label className="form-label" htmlFor="name">Name</label>
                                                    <input type="text" id="name" name="name"
                                                        className="form-control form-control-lg" onChange={handleChange} />
                                                    <div id="nameInValid" className="invalid-feedback"></div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4 pb-2">
                                                <div data-mdb-input-init className="form-outline">
                                                    <label className="form-label" htmlFor="username">Username</label>
                                                    <input type="text" id="username" name="username"
                                                        className="form-control form-control-lg" onChange={handleChange} />
                                                    <div id="usernameInValid" className="invalid-feedback">Username Invalid!</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-4 pb-2">
                                                <div data-mdb-input-init className="form-outline">
                                                    <label className="form-label" htmlFor="email">Email</label>
                                                    <input type="email" id="email" name="email" onChange={handleChange}
                                                        className="form-control form-control-lg" />
                                                    <div id="emailInValid" className="invalid-feedback">Email Invalid!</div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4 pb-2">
                                                <div data-mdb-input-init className="form-outline">
                                                    <label className="form-label" htmlFor="mobile">Mobile</label>
                                                    <input type="text" id="mobile" name="mobile" onChange={handleChange}
                                                        className="form-control form-control-lg" />
                                                    <div id="mobileInValid" className="invalid-feedback"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <div data-mdb-input-init className="form-outline">
                                                    <label className="form-label" htmlFor="password">Password</label>
                                                    <input type="password" id="password" name="password" onChange={handleChange}
                                                        className="form-control form-control-lg" />
                                                    <div id="passwordInValid" className="invalid-feedback">Password Invalid!</div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div data-mdb-input-init className="form-outline">
                                                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                                    <input type="password" id="confirmPassword" name="confirmPassword" onChange={handleChange}
                                                        className="form-control form-control-lg" />
                                                    <div id="confirmPasswordInValid" className="invalid-feedback"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" name="termsAgreement"
                                                        value="agree" id="termsAgreement" onChange={handleChange}/>
                                                    <label className="form-check-label" htmlFor="termsAgreement">
                                                        I agree to the Terms and Conditions.
                                                    </label>
                                                    <div id="termsAgreementInvalid" className="invalid-feedback">
                                                        You must agree before submitting.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-2">
                                            <input className="btn btn-secondary btn-lg w-100" id="submitBtn" type="submit" value="Sign Up"
                                                onClick={handleSubmit} />
                                        </div>
                                        <div className="mt-4 pt-2 text-center">
                                            Already have an account? <NavLink to="/login">Login</NavLink>
                                        </div>
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

export default SignUp
