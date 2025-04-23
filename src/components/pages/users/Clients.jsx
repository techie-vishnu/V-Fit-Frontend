import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import ClientFormModal from './ClientFormModal';


function Clients() {
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
    const newUser = { _id: null, name: "", username: "", email: "", mobile: "", gender: "", roles: ['Client'], password: "", confirmPassword: "" };
    const [userData, setUserData] = useState(newUser);
    const [isUserEdit, setIsUserEdit] = useState(true);

    const handleAddUser = () => {
        setIsUserEdit(false);
        setUserData(newUser);
        setShowUserModal(true);
    };

    const handleUserEdit = async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/user/${id}`, apiConfig);
        if (response.data.success) {
            const user = response.data.user;
            setIsUserEdit(true);
            userData._id = user._id;
            userData.name = user.name;
            userData.username = user.username;
            userData.email = user.email;
            userData.mobile = user.mobile;
            userData.gender = user.gender;
            userData.roles = user.roles;
            userData.password = userData.confirmPassword = '';
            setShowUserModal(true);
        }
    }

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, sortConfig, searchQuery, showUserModal]);

    const fetchData = async () => {
        try {
            let url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/users/clients?page=${currentPage}&limit=${itemsPerPage}`;
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
                <h3>Clients</h3>
                <Row className='mt-4'>
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
                        <Button variant='secondary' onClick={handleAddUser}>Add Client</Button>
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
                        {data.map((item, index) => (
                            <tr key={item._id}>
                                <td>{item._id}</td>
                                <td>{item.name}</td>
                                <td>{item.username}</td>
                                <td>{item.email}</td>
                                <td>{item.mobile}</td>
                                <td>{item.gender}</td>
                                <td>
                                    <Button variant="success" onClick={() => { handleUserEdit(item._id) }}>Edit</Button>
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
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(5)}>5</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>50</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <ClientFormModal
                showUserModal={showUserModal}
                setShowUserModal={setShowUserModal}
                data={userData}
                isUserEdit={isUserEdit}
            />
        </>
    );
}

export default Clients