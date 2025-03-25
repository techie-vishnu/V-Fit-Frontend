import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';


function MembershipFormModal({ showModal, setShowModal, data, isEdit }) {
  const [mData, setMData] = useState({ _id: "", name: "", username: "", email: "", mobile: "", gender: "", roles: [], password: "", confirmPassword: "" });
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const apiConfig = {
    withCredentials: true,
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem('token')
    }
  }

  const handleModalClose = () => setShowModal(false);
  const handleFormChange = (e) => {
    setMData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (validateForm()) {
      try {
        axios.post(
          import.meta.env.VITE_BACKEND_BASEURL + '/api/auth/register',
          userData,
          apiConfig
        ).then(res => {
          let response = res.data;
          if (response.success === true) {
            // fetchData();
            setShowModal(false);
          } else if (response.error) {
            setErrorMessage(response.error);
          } else {
            setErrorMessage('User creation failed. Try again.');
          }
          setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
        }).catch((error) => {
          console.error(error.message);
          if (error.response && error.response.data && error.response.data.error)
            setErrorMessage(error.response.data.error);
          else if (error.message)
            setErrorMessage(error.message);
          else
            setErrorMessage('User creation failed. Try again.');

          setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
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
    // console.log(userData);
    // // form validation
    // if (userData.name.trim() == '') {
    //   setErrorMessage('Name is required.');
    //   return false;
    // }
    // if (userData.username.trim() == '') {
    //   setErrorMessage('Username is required.');
    //   return false;
    // }

    return true;
  }

  const handleUserUpdate = async (e) => {

    // Validate & Build Update data object
    let updateData = new Object();
    if (userData.name !== data.name) {
      updateData.name = userData.name;
    }
    if (userData.gender !== data.gender) {
      updateData.gender = userData.gender;
    }
    if (userData.email !== data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email.trim())) {
        setErrorMessage('Email is not valid.');
        return;
      }
      updateData.email = userData.email.trim();
    }
    if (userData.username !== data.username) {
      const usernameRegex = /^[a-zA-Z0-9]{4,}$/
      if (!usernameRegex.test(userData.username)) {
        setErrorMessage('Username must be alphanumeric.');
        return;
      }
      updateData.username = userData.username;
    }
    if (userData.mobile !== data.mobile) {
      const mobileRegex = /^[5-9]\d{9}$/;
      if (!mobileRegex.test(userData.mobile.trim())) {
        setErrorMessage('Enter valid 10 digit mobile number');
        return;
      }
      updateData.mobile = userData.mobile;
    }
    if (userData.password !== '' || userData.confirmPassword !== '') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (userData.password.trim() == '') {
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
      if (userData.confirmPassword.trim() == '') {
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
      axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/auth/user/${userData._id}`,
        updateData,
        apiConfig
      ).then(res => {
        let response = res.data;
        if (response.success === true) {
          // fetchData();
          setShowModal(false);
        } else if (response.error) {
          setErrorMessage(response.error);
        } else {
          setErrorMessage('User update failed. Try again.');
        }
        setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
      }).catch((error) => {
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
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    if (errorMessage !== '')
      setShowAlert(true);
    else
      setShowAlert(false);
  }, [errorMessage]);

  useEffect(() => {
    setMData(data)
  }, [showModal]);

  return (
    <>
      <Modal show={showUserModal} onHide={handleModalClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{isUserEdit ? `Edit User` : `Add User`}</Modal.Title>
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
            <div className='row'>
              <Form.Group className="mb-3 col-md-6" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={handleFormChange} name="name" type="text" placeholder="Name" value={userData.name} autoFocus />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Select aria-label="Gender" name='gender' onChange={handleFormChange} value={userData.gender}>
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control onChange={handleFormChange} name="email" type="email" placeholder="name@example.com" value={userData.email} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control onChange={handleFormChange} name="username" type="text" placeholder="Username" value={userData.username} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="mobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control onChange={handleFormChange} name="mobile" type="number" placeholder="10 digit mobile number" value={userData.mobile} />
              </Form.Group>
            </div>
            <div className='row'>
              <div key={`inline-checkbox`} className="mb-3 col-12">
                <Form.Label className='me-3'>User Roles</Form.Label>
                <Form.Check inline label="Client" value="Client" name="roles" type='checkbox' id={`inline-checkbox-1`} onChange={handleRoleCheck} checked={userData.roles.indexOf('Client') !== -1} />
                <Form.Check inline label="Trainer" value="Trainer" name="roles" type='checkbox' id={`inline-checkbox-2`} onChange={handleRoleCheck} checked={userData.roles.indexOf('Trainer') !== -1} />
                <Form.Check inline label="Receptionist" value="Receptionist" name="roles" type='checkbox' id={`inline-checkbox-3`} onChange={handleRoleCheck} checked={userData.roles.indexOf('Receptionist') !== -1} />
                <Form.Check inline label="Admin" value="Admin" name="roles" type='checkbox' id={`inline-checkbox-4`} onChange={handleRoleCheck} checked={userData.roles.indexOf('Admin') !== -1} />
              </div>
            </div>
            <div className='row'>
              <Form.Group className="mb-3 col-md-6" controlId="password">
                <Form.Label>
                  {isUserEdit ? `New Password` : `Password`}
                </Form.Label>
                <Form.Control onChange={handleFormChange} name="password" type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="confirmPassword">
                <Form.Label>
                  {isUserEdit ? `Confirm New Password` : `Confirm Password`}
                </Form.Label>
                <Form.Control onChange={handleFormChange} name="confirmPassword" type="password" placeholder="Confirm Password" />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          {isUserEdit ?
            <Button variant="primary" onClick={handleUserUpdate}>
              Update
            </Button>
            :
            <Button variant="primary" onClick={handleFormSubmit}>
              Add User
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MembershipFormModal