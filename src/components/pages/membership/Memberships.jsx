import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import MembershipFormModal from './MembershipFormModal';

function Memberships() {
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

  // Membership Form Modal
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const newMembership = { _id: null, userId: "", planId: "", price: '', personalTraining: false, startDate: new Date().toISOString().split('T')[0], paymentStatus: false, status: "Pending" };
  const [membershipData, setMembershipData] = useState(newMembership);
  const [isEdit, setIsEdit] = useState(true);

  const handleAdd = () => {
    setIsEdit(false);
    setMembershipData(newMembership);
    setShowMembershipModal(true);
  };

  const handleEdit = async (id) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/memberships/${id}`, apiConfig);
    if (response.data.success) {
      const data = response.data.data;
      setIsEdit(true);
      membershipData._id = data._id;
      membershipData.userId = data.userId;
      membershipData.planId = data.planId;
      membershipData.price = data.price;
      membershipData.personalTraining = data.personalTraining;
      membershipData.startDate = new Date(data.startDate).toISOString().split('T')[0];
      membershipData.paymentStatus = data.paymentStatus;
      membershipData.status = data.status;
      setMembershipData(membershipData);
      setShowMembershipModal(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, sortConfig, searchQuery, showMembershipModal]);

  const fetchData = async () => {
    try {
      let url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/memberships?page=${currentPage}&limit=${itemsPerPage}`;
      if (searchQuery !== '')
        url = `${url}&q=${searchQuery}`;
      if (sortConfig.key)
        url = `${url}&sortBy=${sortConfig.key}&sortDir=${sortConfig.direction}`;


      const response = await axios.get(url, apiConfig);
      setData(response.data.memberships);
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
            <Button variant='secondary' onClick={handleAdd}>Add Membership</Button>
          </Col>
        </Row>

        {/* Table */}
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('_id')}>
                ID {sortConfig.key === '_id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>
                User
              </th>
              <th>
                Plan
              </th>
              <th onClick={() => handleSort('price')}>
                Price {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('startDate')}>
                Start Date {sortConfig.key === 'startDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('endDate')}>
                End Date {sortConfig.key === 'endDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Payment Status</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.userId.name}</td>
                <td>{item.planId.name}</td>
                <td>{item.planId.price}</td>
                <td>{new Date(item.startDate).toISOString().split('T')[0]}</td>
                <td>{new Date(item.endDate).toISOString().split('T')[0]}</td>
                <td>{item.paymentStatus ? 'Paid' : 'Unpaid'}</td>
                <td>{item.status}</td>
                <td>
                  <Button variant="success" onClick={() => { handleEdit(item._id) }}>Edit</Button>
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

      <MembershipFormModal
        data={membershipData}
        isEdit={isEdit}
        setShowModal={setShowMembershipModal}
        showModal={showMembershipModal}
      />
    </>
  )
}

export default Memberships