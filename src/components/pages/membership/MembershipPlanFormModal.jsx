import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';


function MembershipPlanFormModal({ showModal, setShowModal, data, isEdit }) {
  const [mData, setMData] = useState({ _id: null, name: "", price: null, personalTraining: false, duration: "", durationUnit: "" });
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
        axios.put(
          import.meta.env.VITE_BACKEND_BASEURL + '/api/membership-plans',
          mData,
          apiConfig
        ).then(res => {
          let response = res.data;
          if (response.success === true) {
            // fetchData();
            setShowModal(false);
          } else if (response.error) {
            setErrorMessage(response.error);
          } else {
            setErrorMessage('Plan creation failed. Try again.');
          }
          setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
        }).catch((error) => {
          console.error(error.message);
          if (error.response && error.response.data && error.response.data.error)
            setErrorMessage(error.response.data.error);
          else if (error.message)
            setErrorMessage(error.message);
          else
            setErrorMessage('Plan creation failed. Try again.');

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

  const handleUpdate = async (e) => {

    // Validate & Build Update data object
    let updateData = new Object();
    if (mData.name !== data.name) {
      updateData.name = mData.name;
    }
    if (mData.price !== data.price) {
      updateData.price = parseFloat(mData.price);
    }
    if (mData.duration !== data.duration) {
      updateData.duration = parseFloat(mData.duration);
    }
    if (mData.durationUnit !== data.durationUnit) {
      updateData.durationUnit = mData.durationUnit;
    }


    try {
      axios.patch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/membership-plans/${mData._id}`,
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
      <Modal show={showModal} onHide={handleModalClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? `Edit Plan` : `Add Plan`}</Modal.Title>
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
                <Form.Control onChange={handleFormChange} name="name" type="text" placeholder="Name" value={mData.name} autoFocus />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control onChange={handleFormChange} name="price" type="number" placeholder="Price" value={mData.price} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="duration">
                <Form.Label>Duration</Form.Label>
                <Form.Control onChange={handleFormChange} name="duration" type="number" placeholder="Duration" value={mData.duration} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6" controlId="durationUnit">
                <Form.Label>Duration Unit</Form.Label>
                <Form.Select aria-label="durationUnit" name='durationUnit' onChange={handleFormChange} value={mData.durationUnit}>
                  <option value=""></option>
                  <option value="Day">Day</option>
                  <option value="Days">Days</option>
                  <option value="Month">Month</option>
                  <option value="Months">Months</option>
                  <option value="Year">Year</option>
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
            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
            :
            <Button variant="primary" onClick={handleFormSubmit}>
              Add Plan
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MembershipPlanFormModal