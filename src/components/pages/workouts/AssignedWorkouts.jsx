import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Alert, Spinner } from 'react-bootstrap'
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { Navigate, useNavigate } from 'react-router';

function AssignedWorkouts() {

    const apiConfig = {
        withCredentials: true,
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }
    const [errorMessage, setErrorMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const newWorkOut = { userId: '', date: new Date().toISOString().split('T')[0], activities: [], notes: '' };
    const navigate = useNavigate();

    const [aWorkout, setAWorkout] = useState(newWorkOut);
    const [clients, setClients] = useState([]);
    const [workouts, setWorkouts] = useState([]);

    const handleFormChange = (e) => {
        setAWorkout((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const fetchAssignedWorkouts = async () => {
        if (aWorkout.date) {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/getAssignedWorkouts?date=${aWorkout.date}`, apiConfig);
                if (res.data.success) {
                    const aw = res.data.data;
                    setAWorkout((prev) => ({ ...prev, activities: aw.activities, notes: aw.notes }));
                } else {
                    if (res.data.error) {
                        setErrorMessage(res.data.error);
                    }
                    setAWorkout((prev) => ({ ...prev, activities: newWorkOut.activities, notes: '' }));
                }
            } catch (error) {
                if (error.response.data.error) {
                    setErrorMessage(error.response.data.error);
                }
                else
                    setErrorMessage('Error fetching workouts!!');

                setAWorkout((prev) => ({ ...prev, activities: newWorkOut.activities, notes: '' }));
            } finally {
                setLoading(false);
            }
        }
    }

    const fetchDropdowns = async () => {
        try {
            // setLoading(true);
            const [clientsRes, workoutsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/clients`, apiConfig),
                axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/workouts`, apiConfig)
            ]);
            if (clientsRes.data.success) {
                setClients(clientsRes.data.clients);
            }
            if (workoutsRes.data.success) {
                setWorkouts(workoutsRes.data.workouts);
            }
            if (clientsRes.data.success === false && clientsRes.data.error) {
                if (clientsRes.data.error === 'jwt expired') {
                    navigate('/logout')
                }
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const addActivity = (e) => {
        e.preventDefault();
        aWorkout.activities.push({ workout: '', set: 3, rep: 10, kg: 1 });
        setAWorkout((prev) => ({ ...prev, activities: aWorkout.activities }));
    }

    const removeActivity = (index) => {
        const a = aWorkout.activities.filter((a, i) => i !== index);
        setAWorkout((prev) => ({ ...prev, activities: a }));
    }

    useEffect(() => {
        fetchDropdowns();
    }, []);

    useEffect(() => {
        fetchAssignedWorkouts();
    }, [aWorkout.date]);

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


    return (
        <>
            <h3>Assign Workouts</h3>
            <Row className='mt-4'>
                <Form.Group className="mb-3 col-md-6" controlId="date">
                    {/* <Form.Label>Date</Form.Label> */}
                    <Form.Control name="date" type="date" placeholder="Date" onChange={handleFormChange} value={aWorkout.date} />
                </Form.Group>
                <Col md={3}>
                    <Button variant='secondary' onClick={() => { navigate('/assign-workouts') }}>Assign Workouts</Button>
                </Col>
            </Row>
            <Row>
                <section id="alert-section">
                    {showAlert &&
                        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                            {errorMessage}
                        </Alert>
                    }
                </section>
            </Row>
            {aWorkout.activities.length > 0 ?
                <div className="card rounded-3 shadow p-3 my-3">
                    {loading ?
                        <Row className="justify-content-center mt-5">
                            <Spinner variant="secondary" animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Row>
                        :
                        <Row className="">
                            <Col sm={12}>
                                <Row className='my-2 text-center'>
                                    <span className="col-sm-6">Workout</span>
                                    <span className="col-sm-2">Set</span>
                                    <span className="col-sm-2">Rep / Time (min)</span>
                                    <span className="col-sm-2">KG</span>
                                </Row>
                            </Col>
                            <Col sm={12}>
                                {aWorkout.activities.map((activity, index) => {
                                    return (
                                        <Row key={index} className='my-2'>
                                            <Form.Group className="col-sm-6" controlId="workout">
                                                <Form.Select className='' aria-label="Workout" name='workout' value={activity.workout} readOnly disabled>
                                                    <option value="" disabled></option>
                                                    {workouts.map((workout, i) => {
                                                        return (
                                                            <option key={i} value={workout._id}>{workout.name}</option>
                                                        )
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="col-sm-2" controlId="set">
                                                <Form.Control className='' type="number" name='set' value={activity.set} readOnly />
                                            </Form.Group>
                                            <Form.Group className="col-sm-2" controlId="rep">
                                                <Form.Control className='col-sm-2' type="number" name='rep' value={activity.rep} readOnly />
                                            </Form.Group>
                                            <Form.Group className="col-sm-2" controlId="kg">
                                                <Form.Control className='col-sm-2' type="number" name='kg' value={activity.kg} readOnly />
                                            </Form.Group>
                                        </Row>
                                    )
                                })}
                            </Col>
                            <Col sm={12}>
                                <Form.Group className="mt-3" controlId="notes">
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control as="textarea" rows={3} name='notes' value={aWorkout.notes} readOnly />
                                </Form.Group>
                            </Col>
                        </Row>
                    }
                </div>
                :
                <Row>
                    <Col>
                        No Assigned workouts...
                    </Col>
                </Row>
            }
        </>
    )
}

export default AssignedWorkouts