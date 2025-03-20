import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';


function Users() {
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Sorting state
    const [searchQuery, setSearchQuery] = useState(''); // Search state

    // User Form Modal
    const [showUserModal, setShowUserModal] = useState(false);
    const handleUserModalClose = () => setShowUserModal(false);
    const handleAddUser = () => {
        setShowUserModal(true)
    };
    const [userData, setUserData] = useState({ name: "", username: "", email: "", mobile: "", gender: "", roles: [], password: "", confirmPassword: "" });
    const handleUserFormChange = (e) => {
        console.log(e.target.value);
        setTimeout(() => {
            setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        }, 10);
        setTimeout(() => { 
            console.log(userData)
        }, 1000);
    }
    const handleRoleCheck = (e) => {
        let roles = userData.roles;
        let index = roles.indexOf(e.target.value);
        if (e.target.checked) {
            if (index === -1) {
                roles.push(e.target.value)
            }
        } else {
            if (index !== -1) {
                roles.splice(index, 1);
            }
        }
        userData.roles = roles;
        setUserData(userData);
    }
    const [errorMessage, setErrorMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        if (errorMessage !== '')
            setShowAlert(true);
        else
            setShowAlert(false);
    }, [errorMessage]);
    const handleUserFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (validateForm()) {
            try {
                axios.post(
                    import.meta.env.VITE_BACKEND_BASEURL + '/api/auth/register',
                    userData,
                    { withCredentials: true }
                ).then(res => {
                    let response = res.data;
                    if (response.success === true) {
                        fetchData();
                        setShowUserModal(false);
                    } else if (response.error) {
                        setErrorMessage(response.error);
                    } else {
                        setErrorMessage('User creation failed. Try again.');
                    }
                }).catch((error) => {
                    console.error(error.message);
                    if (error.response && error.response.data && error.response.data.error)
                        setErrorMessage(error.response.data.error);
                    else if (error.message)
                        setErrorMessage(error.message);
                    else
                        setErrorMessage('User creation failed. Try again.');
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
        console.log(userData);
        // form validation
        if (userData.name.trim() == '') {
            setErrorMessage('Name is required.');
            return false;
        }
        if (userData.username.trim() == '') {
            setErrorMessage('Username is required.');
            return false;
        }
        else if (userData.username.length < 4) {
            setErrorMessage('Username must be atleast 4 characters.');
            return false;
        }
        const usernameRegex = /^[a-zA-Z0-9]{4,}$/
        if (!usernameRegex.test(userData.username)) {
            setErrorMessage('Username must be alphanumeric.');
            return false;
        }
        if (userData.email.trim() == '') {
            setErrorMessage('Email is required.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email.trim())) {
            setErrorMessage('Email is not valid.');
            return false;
        }
        if (userData.mobile.trim() == '') {
            setErrorMessage('Mobile number is required.');
            return false;
        }
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(userData.mobile.trim())) {
            setErrorMessage('Enter valid 10 digit mobile number');
            return false;
        }
        if (userData.password.trim() == '') {
            setErrorMessage('Password is required.');
            return false;
        }
        else if (userData.password.length < 8) {
            setErrorMessage('Password must be atleast 8 characters.');
            return false;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(userData.password)) {
            setErrorMessage('Password must include atleast one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }
        if (userData.confirmPassword.trim() == '') {
            setErrorMessage('Confirm password is required.');
            return false;
        }
        else if (userData.confirmPassword.length < 8) {
            setErrorMessage('Confirm Password must be atleast 8 characters.');
            return false;
        }
        else if (!passwordRegex.test(userData.confirmPassword)) {
            setErrorMessage('Confirm Password must include atleast one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }
        if (userData.confirmPassword.trim() !== userData.password.trim()) {
            setErrorMessage("Passwords dosn't match.");
            return false;
        }

        return true;
    }

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, sortConfig, searchQuery]);

    const fetchData = async () => {
        try {
            let url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/auth/users?page=${currentPage}&limit=${itemsPerPage}`;
            if (searchQuery !== '')
                url = `${url}&q=${searchQuery}`;
            if (sortConfig.key)
                url = `${url}&sortBy=${sortConfig.key}&sortDir=${sortConfig.direction}`;


            const response = await axios.get(url, apiConfig);
            setData(response.data.users);
            setTotalItems(response.data.total);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sort data based on sortConfig
    const sortedData = [...data].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (limit) => {
        setItemsPerPage(limit);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
        <>
            <div>
                <Row>
                    <Col>
                        {/* Search Input */}
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Search by name, email, username..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
                                Clear
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Button variant='secondary' onClick={handleAddUser}>Add User</Button>
                    </Col>
                </Row>

                {/* Table */}
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('_id')}>
                                ID {sortConfig.key === '_id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => handleSort('name')}>
                                Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => handleSort('username')}>
                                Username {sortConfig.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => handleSort('email')}>
                                Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th>Mobile</th>
                            <th onClick={() => handleSort('gender')}>
                                Gender {sortConfig.key === 'gender' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item._id}>
                                <td>{item._id}</td>
                                <td>{item.name}</td>
                                <td>{item.username}</td>
                                <td>{item.email}</td>
                                <td>{item.mobile}</td>
                                <td>{item.gender}</td>
                                <td>
                                    <Button variant="success">Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-between align-items-center">
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>

                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                            {itemsPerPage} per page
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>50</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <Modal show={showUserModal} onHide={handleUserModalClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <section id="alert-section">
                        {showAlert &&
                            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                {errorMessage}
                            </Alert>
                        }
                    </section>
                    <Form>
                        <div key={`inline-checkbox`} className="mb-3">
                            <Form.Label className='me-3'>User Roles</Form.Label>
                            <Form.Check
                                inline
                                label="Client"
                                value="Client"
                                name="roles"
                                type='checkbox'
                                id={`inline-checkbox-1`}
                                onChange={handleRoleCheck}
                            />
                            <Form.Check
                                inline
                                label="Trainer"
                                value="Trainer"
                                name="roles"
                                type='checkbox'
                                id={`inline-checkbox-2`}
                                onChange={handleRoleCheck}
                            />
                            <Form.Check
                                inline
                                label="Receptionist"
                                value="Receptionist"
                                name="roles"
                                type='checkbox'
                                id={`inline-checkbox-3`}
                                onChange={handleRoleCheck}
                            />
                            <Form.Check
                                inline
                                label="Admin"
                                value="Admin"
                                name="roles"
                                type='checkbox'
                                id={`inline-checkbox-4`}
                                onChange={handleRoleCheck}
                            />
                        </div>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                onChange={handleUserFormChange}
                                name="name"
                                type="text"
                                placeholder="name"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select aria-label="Gender" name='gender' onChange={handleUserFormChange}>
                                <option value=""></option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                onChange={handleUserFormChange}
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                onChange={handleUserFormChange}
                                name="username"
                                type="text"
                                placeholder="username"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="mobile">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control
                                onChange={handleUserFormChange}
                                name="mobile"
                                type="number"
                                placeholder="mobile"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={handleUserFormChange}
                                name="password"
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                onChange={handleUserFormChange}
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUserModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUserFormSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Users