import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';


function MembershipFormModal({ showModal, setShowModal, data, isEdit }) {
  const [loading, setLoading] = useState(true);
  const [mData, setMData] = useState({ _id: null, userId: "", planId: "", price: '', personalTraining: false, startDate: new Date().toISOString().split('T')[0], paymentStatus: false, status: "" });
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const apiConfig = {
    withCredentials: true,
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem('token')
    }
  }

  const handleModalClose = () => {
    setErrorMessage('');
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    setMData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name == 'planId') {
      const plan = plans.filter(plan => plan._id == e.target.value);
      if (plan[0].price) {
        setMData((prev) => ({ ...prev, price: plan[0].price }));
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (validateForm()) {
      try {
        axios.put(
          import.meta.env.VITE_BACKEND_BASEURL + '/api/memberships',
          mData,
          apiConfig
        ).then(res => {
          let response = res.data;
          if (response.success === true) {
            setShowModal(false);
          } else if (response.error) {
            setErrorMessage(response.error);
          } else {
            setErrorMessage('Membership creation failed. Try again.');
          }
          setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
        }).catch((error) => {
          console.error(error.message);
          if (error.response && error.response.data && error.response.data.error)
            setErrorMessage(error.response.data.error);
          else if (error.message)
            setErrorMessage(error.message);
          else
            setErrorMessage('Membership creation failed. Try again.');

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
    return true;
  }

  const handleUserUpdate = async (e) => {

    // Validate & Build Update data object
    let updateData = new Object();
    if (mData.userId !== data.userId) {
      updateData.userId = mData.userId;
    }
    if (mData.planId !== data.planId) {
      updateData.planId = mData.planId;
    }
    if (mData.price !== data.price) {
      updateData.price = mData.price;
    }
    if (mData.startDate !== data.startDate) {
      updateData.startDate = mData.startDate;
    }
    if (mData.paymentStatus !== data.paymentStatus) {
      updateData.paymentStatus = mData.paymentStatus;
    }
    if (mData.status !== data.status) {
      updateData.status = mData.status;
    }

    try {
      axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/memberships/${mData._id}`,
        updateData,
        apiConfig
      ).then(res => {
        let response = res.data;
        if (response.success === true) {
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

  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const fetchDropdowns = async () => {
    try {
      setLoading(true);
      const [clientsRes, plansRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/clients`, apiConfig),
        axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/membership-plans`, apiConfig)
      ]);
      if (clientsRes.data.success) {
        setClients(clientsRes.data.clients);
      }
      if (plansRes.data.success) {
        setPlans(plansRes.data.plans);
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (errorMessage !== '')
      setShowAlert(true);
    else
      setShowAlert(false);
  }, [errorMessage]);

  useEffect(() => {
    if (showModal) {
      setMData(data);
      fetchDropdowns();
    }
  }, [showModal]);

  return (
    <>
      <Modal show={showModal} onHide={handleModalClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? `Edit Membership` : `Add Membership`}</Modal.Title>
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
              <Form.Group className="mb-3 col-md-6" controlId="client">
                <Form.Label>Client</Form.Label>
                <Form.Select aria-label="Client" name='userId' onChange={handleFormChange} value={mData.userId}>
                  <option value="" disabled></option>
                  {clients.map((client, i) => {
                    return (
                      <option key={i} value={client._id}>{client.name}</option>
                    )
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="plan">
                <Form.Label>Plan</Form.Label>
                <Form.Select aria-label="Plan" name='planId' onChange={handleFormChange} value={mData.planId}>
                  <option value="" disabled></option>
                  {plans.map((plan, i) => {
                    return (
                      <option key={i} value={plan._id} data-plan={plan}>{plan.name}</option>
                    )
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control onChange={handleFormChange} name="price" type="number" placeholder="Price" value={mData.price} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control onChange={handleFormChange} name="startDate" type="date" placeholder="Start Date" value={mData.startDate} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="paymentStatus">
                <Form.Label>Payment Status</Form.Label>
                <Form.Select aria-label="Plan" name='paymentStatus' onChange={handleFormChange} value={mData.paymentStatus}>
                  <option value="" disabled></option>
                  <option value={false}>Unpaid</option>
                  <option value={true}>Paid</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Select aria-label="Status" name='status' onChange={handleFormChange} value={mData.status}>
                  <option value="" disabled></option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  {isEdit && <option value="Expired">Expired</option>}
                  {isEdit && <option value="Canceled">Canceled</option>}
                </Form.Select>
              </Form.Group>
            </div>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          {isEdit ?
            <Button variant="primary" onClick={handleUserUpdate}>
              Update
            </Button>
            :
            <Button variant="primary" onClick={handleFormSubmit}>
              Add
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MembershipFormModal