import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import MembershipPlanFormModal from './MembershipPlanFormModal';

function MembershipPlans() {
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

  // Membership Plan Form Modal
  const [showPlanModal, setShowPlanModal] = useState(false);
  const newPlan = { _id: null, name: "", price: null, personalTraining: false, duration: null, durationUnit: "" };
  const [planData, setPlanData] = useState(newPlan);
  const [isEdit, setIsEdit] = useState(true);

  const handleAdd = () => {
    setIsEdit(false);
    setPlanData(newPlan);
    setShowPlanModal(true);
  };

  const handleEdit = async (id) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/membership-plans/${id}`, apiConfig);
    if (response.data.success) {
      const plan = response.data.plan;
      setIsEdit(true);
      planData._id = plan._id;
      planData.name = plan.name;
      planData.price = plan.price;
      planData.personalTraining = plan.personalTraining;
      planData.duration = plan.duration;
      planData.durationUnit = plan.durationUnit;
      setShowPlanModal(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, sortConfig, searchQuery, showPlanModal]);

  const fetchData = async () => {
    try {
      let url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/membership-plans?page=${currentPage}&limit=${itemsPerPage}`;
      if (searchQuery !== '')
        url = `${url}&q=${searchQuery}`;
      if (sortConfig.key)
        url = `${url}&sortBy=${sortConfig.key}&sortDir=${sortConfig.direction}`;

      const response = await axios.get(url, apiConfig);
      setData(response.data.plans);
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
        <h3>Membership Plans</h3>
        <Row className='mt-4'>
          <Col>
            {/* Search Input */}
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search plans..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
                Clear
              </Button>
            </InputGroup>
          </Col>
          <Col>
            <Button variant='secondary' onClick={handleAdd}>Add Plan</Button>
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
              <th onClick={() => handleSort('price')}>
                Price {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>
                Duration
              </th>
              {/* <th onClick={() => handleSort('personalTraining')}>
                PT {sortConfig.key === 'personalTraining' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th> */}
              <th onClick={() => handleSort('createdAt')}>
                Created At {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('updatedAt')}>
                Updated At {sortConfig.key === 'updatedAt' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.duration + ' ' + item.durationUnit}</td>
                {/* <td>{item.personalTraining ? 'Yes' : 'No'}</td> */}
                <td>{item.createdAt}</td>
                <td>{item.updatedAt}</td>
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
              <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10</Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemsPerPageChange(50)}>50</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <MembershipPlanFormModal
        showModal={showPlanModal}
        setShowModal={setShowPlanModal}
        data={planData}
        isEdit={isEdit}
      />
    </>
  )
}

export default MembershipPlans