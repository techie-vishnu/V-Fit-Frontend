import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import WorkoutFormModal from './WorkoutFormModal';

function Workouts() {
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

  // Workout Form Modal
  const [showAddEditFormModal, setShowAddEditFormModal] = useState(false);
  const newFormData = { _id: null, name: '', type: '', muscle: '', equipment: '', difficulty: '', instructions: '' };
  const [formData, setFormData] = useState(newFormData);
  const [isEdit, setIsEdit] = useState(true);

  const handleAdd = () => {
    setIsEdit(false);
    setFormData(newFormData);
    setShowAddEditFormModal(true);
  };

  const handleEdit = async (id) => {
    setFormData(newFormData);
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/workouts/${id}`, apiConfig);
    if (response.data.success) {
      const data = response.data.data;
      setIsEdit(true);
      formData._id = data._id;
      formData.name = data.name;
      formData.type = data.type;
      formData.muscle = data.muscle;
      formData.equipment = data.equipment;
      formData.difficulty = data.difficulty;
      formData.instructions = data.instructions;
      setFormData(formData);
      setShowAddEditFormModal(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, sortConfig, searchQuery, showAddEditFormModal]);

  const fetchData = async () => {
    try {
      let url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/workouts?page=${currentPage}&limit=${itemsPerPage}`;
      if (searchQuery !== '')
        url = `${url}&q=${searchQuery}`;
      if (sortConfig.key)
        url = `${url}&sortBy=${sortConfig.key}&sortDir=${sortConfig.direction}`;


      const response = await axios.get(url, apiConfig);
      setData(response.data.workouts);
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
                placeholder="Search workout..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
                Clear
              </Button>
            </InputGroup>
          </Col>
          <Col>
            <Button variant='secondary' onClick={handleAdd}>Add Workout</Button>
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
              <th onClick={() => handleSort('type')}>
                Type {sortConfig.key === 'type' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('muscle')}>
                Muscle Group {sortConfig.key === 'muscle' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('difficulty')}>
                Difficulty {sortConfig.key === 'difficulty' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('equipment')}>
                Equipment {sortConfig.key === 'equipment' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.muscle}</td>
                <td>{item.difficulty}</td>
                <td>{item.equipment}</td>
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

      <WorkoutFormModal
        data={formData}
        isEdit={isEdit}
        setShowModal={setShowAddEditFormModal}
        showModal={showAddEditFormModal}
      />
    </>
  )
}

export default Workouts