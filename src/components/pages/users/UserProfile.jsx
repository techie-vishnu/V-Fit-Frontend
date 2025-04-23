import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert, Spinner } from 'react-bootstrap';

function UserProfile() {

    const apiConfig = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }
    const [errorMessage, setErrorMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const newUserData = { name: "", username: "", email: "", mobile: "", gender: "", password: "", confirmPassword: "" };
    const [userData, setUserData] = useState(newUserData);
    const [existingUserData, setExistingUserData] = useState(newUserData);


    const handleUserFormChange = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleUserUpdate = async (e) => {

        // Validate & Build Update data object
        let updateData = new Object();
        if (userData.name !== existingUserData.name) {
            updateData.name = userData.name;
        }
        if (userData.gender !== existingUserData.gender) {
            updateData.gender = userData.gender;
        }
        if (userData.email !== existingUserData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email.trim())) {
                setErrorMessage('Email is not valid.');
                return;
            }
            updateData.email = userData.email.trim();
        }
        if (userData.username !== existingUserData.username) {
            const usernameRegex = /^[a-zA-Z0-9]{4,}$/
            if (!usernameRegex.test(userData.username)) {
                setErrorMessage('Username must be alphanumeric.');
                return;
            }
            updateData.username = userData.username;
        }
        if (userData.mobile !== existingUserData.mobile) {
            const mobileRegex = /^[5-9]\d{9}$/;
            if (!mobileRegex.test(userData.mobile.trim())) {
                setErrorMessage('Enter valid 10 digit mobile number');
                return;
            }
            updateData.mobile = userData.mobile;
        }
        if (userData.password !== '' || userData.confirmPassword !== '') {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (userData.password.trim() === '') {
                setErrorMessage('Password is required.');
                return;
            }
            else if (userData.password.length < 8) {
                setErrorMessage('Password must be atleast 8 characters.');
                return;
            }
            else if (!passwordRegex.test(userData.password)) {
                setErrorMessage('Password must include atleast one uppercase letter, one lowercase letter, one number, and one special character');
                return;
            }
            if (userData.confirmPassword.trim() === '') {
                setErrorMessage('Confirm password is required.');
                return;
            }
            else if (userData.confirmPassword.length < 8) {
                setErrorMessage('Confirm Password must be atleast 8 characters.');
                return;
            }
            else if (!passwordRegex.test(userData.confirmPassword)) {
                setErrorMessage('Confirm Password must include atleast one uppercase letter, one lowercase letter, one number, and one special character');
                return;
            }
            if (userData.confirmPassword.trim() !== userData.password.trim()) {
                setErrorMessage("Passwords dosn't match.");
                return;
            }
            updateData.password = userData.password.trim();
            updateData.confirmPassword = userData.confirmPassword.trim();
        }

        try {
            setLoading(true);
            axios.patch(
                `${import.meta.env.VITE_BACKEND_BASEURL}/api/user/updateProfile`,
                updateData,
                apiConfig
            ).then(res => {
                let response = res.data;
                setLoading(false);
                if (response.success === true) {
                    fetchData();
                } else if (response.error) {
                    setErrorMessage(response.error);
                } else {
                    setErrorMessage('User update failed. Try again.');
                }
                setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
            }).catch((error) => {
                setLoading(false);
                console.error(error.message);
                if (error.response && error.response.data && error.response.data.error)
                    setErrorMessage(error.response.data.error);
                else if (error.message)
                    setErrorMessage(error.message);
                else
                    setErrorMessage('User update failed. Try again.');

                setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
            });
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.message);
        }
    }

    const fetchData = async () => {
        try {
            let url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/user/profile`;

            setLoading(true);
            setUserData(newUserData);
            setExistingUserData(newUserData);
            const response = await axios.get(url, apiConfig);
            if (response.data.success) {
                const uData = response.data.data;
                userData.name = uData.name;
                userData.username = uData.username;
                userData.email = uData.email;
                userData.mobile = uData.mobile;
                userData.gender = uData.gender;

                setUserData(userData);
                setExistingUserData(userData);
                setLoading(false);
            }
            else {
                setErrorMessage('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Load User Data on Page Load
    useEffect(() => {
        fetchData()
    }, []);

    // Show Alert Message when Error Message is Set
    useEffect(() => {
        if (errorMessage !== '')
            setShowAlert(true);
        else
            setShowAlert(false);
    }, [errorMessage]);

    // Automatically close Alert Message
    useEffect(() => {
        setTimeout(() => {
            setErrorMessage('')
        }, 3000);
    }, [showAlert]);

    if (loading) {
        return (
            <Row className="justify-content-center mt-5">
                <Spinner variant="secondary" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Row>
        )
    } else {
        return (
            <>
                <Form>
                    <h3>My Profile</h3>
                    <Row className='mt-4'>
                        <section id="alert-section">
                            {showAlert &&
                                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                    {errorMessage}
                                </Alert>
                            }
                        </section>
                    </Row>
                    <div className="card rounded-3 shadow p-3 my-3">
                        <Row>
                            <Form.Group className="mb-3 col-md-6" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control onChange={handleUserFormChange} name="name" type="text" placeholder="Name" value={userData.name} autoFocus />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="gender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select aria-label="Gender" name='gender' onChange={handleUserFormChange} value={userData.gender}>
                                    <option value=""></option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control onChange={handleUserFormChange} name="email" type="email" placeholder="name@example.com" value={userData.email} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control onChange={handleUserFormChange} name="username" type="text" placeholder="Username" value={userData.username} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="mobile">
                                <Form.Label>Mobile</Form.Label>
                                <Form.Control onChange={handleUserFormChange} name="mobile" type="number" placeholder="10 digit mobile number" value={userData.mobile} />
                            </Form.Group>
                        </Row>
                    </div>
                    <div className="card rounded-3 shadow p-3 my-3">
                        <Row>
                            <Form.Group className="mb-3 col-md-6" controlId="password">
                                <Form.Label>
                                    New Password
                                </Form.Label>
                                <Form.Control onChange={handleUserFormChange} name="password" type="password" placeholder="Password" />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="confirmPassword">
                                <Form.Label>
                                    Confirm New Password
                                </Form.Label>
                                <Form.Control onChange={handleUserFormChange} name="confirmPassword" type="password" placeholder="Confirm Password" />
                            </Form.Group>
                        </Row>
                    </div>
                    {/* <div className="card rounded-3 shadow p-3 my-3">
                        <Row>
                            <Form.Group className="mb-3 col-md-6" controlId="weight">
                                <Form.Label>Height (Cms)</Form.Label>
                                <Form.Control onChange={handleUserFormChange} name="weight" type="number" placeholder="10 digit mobile number" value={userData.mobile} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="weight">
                                <Form.Label>Weight (Kg)</Form.Label>
                                <Form.Control onChange={handleUserFormChange} name="weight" type="number" placeholder="10 digit mobile number" value={userData.mobile} />
                            </Form.Group>
                        </Row>
                    </div> */}
                    <Row className='mt-5'>
                        <Button variant="secondary" onClick={handleUserUpdate}>
                            Save
                        </Button>
                    </Row>
                </Form>
            </>
        )
    }
}

export default UserProfile