import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Dropdown, Form, InputGroup, Button, Row, Col, Modal, Alert } from 'react-bootstrap';


function WorkoutFormModal({ showModal, setShowModal, data, isEdit }) {
    const [loading, setLoading] = useState(true);
    const [mData, setMData] = useState({ _id: null, name: '', type: '', muscle: '', equipment: '', difficulty: '', instructions: '' });
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
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (validateForm()) {
            try {
                axios.put(
                    import.meta.env.VITE_BACKEND_BASEURL + '/api/workouts',
                    mData,
                    apiConfig
                ).then(res => {
                    let response = res.data;
                    if (response.success === true) {
                        setShowModal(false);
                    } else if (response.error) {
                        setErrorMessage(response.error);
                    } else {
                        setErrorMessage('Workout creation failed. Try again.');
                    }
                    setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
                }).catch((error) => {
                    console.error(error.message);
                    if (error.response && error.response.data && error.response.data.error)
                        setErrorMessage(error.response.data.error);
                    else if (error.message)
                        setErrorMessage(error.message);
                    else
                        setErrorMessage('Workout creation failed. Try again.');

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
        if (mData.type !== data.type) {
            updateData.type = mData.type;
        }
        if (mData.muscle !== data.muscle) {
            updateData.muscle = mData.muscle;
        }
        if (mData.equipment !== data.equipment) {
            updateData.equipment = mData.equipment;
        }
        if (mData.difficulty !== data.difficulty) {
            updateData.difficulty = mData.difficulty;
        }
        if (mData.instructions !== data.instructions) {
            updateData.instructions = mData.instructions;
        }

        try {
            axios.patch(
                `${import.meta.env.VITE_BACKEND_BASEURL}/api/workouts/${mData._id}`,
                updateData,
                apiConfig
            ).then(res => {
                let response = res.data;
                if (response.success === true) {
                    setShowModal(false);
                } else if (response.error) {
                    setErrorMessage(response.error);
                } else {
                    setErrorMessage('Workout update failed. Try again.');
                }
                setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
            }).catch((error) => {
                console.error(error.message);
                if (error.response && error.response.data && error.response.data.error)
                    setErrorMessage(error.response.data.error);
                else if (error.message)
                    setErrorMessage(error.message);
                else
                    setErrorMessage('Workout update failed. Try again.');

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
        if (showModal) {
            setMData(data);
        }
    }, [showModal]);

    const types = ['cardio', 'olympic_weightlifting', 'plyometrics', 'powerlifting', 'strength', 'stretching', 'strongman'];
    const muscles = ['full_body', 'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 'chest', 'forearms', 'glutes', 'hamstrings', 'lats', 'lower_back', 'middle_back', 'neck', 'quadriceps', 'traps', 'triceps'];
    const difficulty = ['beginner', 'intermediate', 'expert'];

    return (
        <>
            <Modal show={showModal} onHide={handleModalClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? `Edit Workout` : `Add Workout`}</Modal.Title>
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
                            <Form.Group className="mb-3 col-12" controlId="name">
                                <Form.Label>Workout Name</Form.Label>
                                <Form.Control onChange={handleFormChange} name="name" type="text" placeholder="Workout Name" value={mData.name} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="type">
                                <Form.Label>Type</Form.Label>
                                <Form.Select aria-label="Type" name='type' onChange={handleFormChange} value={mData.type}>
                                    <option value="" disabled></option>
                                    {types.map((type, i) => {
                                        return (
                                            <option key={i} value={type}>{type.toUpperCase()}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="muscle">
                                <Form.Label>Muscle Group</Form.Label>
                                <Form.Select aria-label="Muscle" name='muscle' onChange={handleFormChange} value={mData.muscle}>
                                    <option value="" disabled></option>
                                    {muscles.map((muscle, i) => {
                                        return (
                                            <option key={i} value={muscle}>{muscle.toUpperCase()}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="difficulty">
                                <Form.Label>Difficulty</Form.Label>
                                <Form.Select aria-label="Difficulty" name='difficulty' onChange={handleFormChange} value={mData.difficulty}>
                                    <option value="" disabled></option>
                                    {difficulty.map((d, i) => {
                                        return (
                                            <option key={i} value={d}>{d.toUpperCase()}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-6" controlId="equipment">
                                <Form.Label>Equipment (If any)</Form.Label>
                                <Form.Control onChange={handleFormChange} name="equipment" type="text" placeholder="Equipment" value={mData.equipment} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-12" controlId="instructions">
                                <Form.Label>Instructions</Form.Label>
                                <Form.Control as="textarea" rows={3} name='instructions' onChange={handleFormChange} value={mData.instructions} />
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
                            Add
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default WorkoutFormModal