import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Alert, Spinner } from 'react-bootstrap'
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { useNavigate } from 'react-router';

function AssignWorkout() {

    const apiConfig = {
        withCredentials: true,
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }
    const [errorMessage, setErrorMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const newWorkOut = { userId: '', date: new Date().toISOString().split('T')[0], activities: [{ workout: '', set: 3, rep: 10, kg: 1 }], notes: '' };
    const navigate = useNavigate();

    const [aWorkout, setAWorkout] = useState(newWorkOut);
    const [clients, setClients] = useState([]);
    const [workouts, setWorkouts] = useState([]);

    const handleFormChange = (e) => {
        setAWorkout((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const handleActivityChange = (e, i) => {
        if (typeof aWorkout.activities[i] !== 'undefined') {
            let activity = aWorkout.activities[i];
            activity = { ...activity, [e.target.name]: e.target.name !== 'workout' ? parseFloat(e.target.value) : e.target.value };
            aWorkout.activities[i] = activity;
            setAWorkout((prev) => ({ ...prev, activities: aWorkout.activities }));
        }
    }

    const handleWorkoutSave = () => {
        try {
            setLoading(true);
            axios.patch(
                `${import.meta.env.VITE_BACKEND_BASEURL}/api/assignWorkouts`,
                aWorkout,
                apiConfig
            ).then(res => {
                let response = res.data;
                setLoading(false);
                if (response.success === true) {
                    // fetchData();
                } else if (response.error) {
                    setErrorMessage(response.error);
                } else {
                    setErrorMessage('User update failed. Try again.');
                }
                setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 1000);
            }).catch((error) => {
                setLoading(false);
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
            setLoading(false);
            setErrorMessage(error.message);
        }

    }

    const fetchAssignedWorkouts = async () => {
        if (aWorkout.userId && aWorkout.userId !== '' && aWorkout.date) {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/api/getAssignedWorkouts?userId=${aWorkout.userId}&date=${aWorkout.date}`, apiConfig);
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
                let clients = clientsRes.data.clients;
                if (clients.length === 1) {
                    setAWorkout((prev) => ({ ...prev, userId: clients[0]._id }));
                }
                setClients(clients);
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
    }, [aWorkout.userId, aWorkout.date]);

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
                <section id="alert-section">
                    {showAlert &&
                        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                            {errorMessage}
                        </Alert>
                    }
                </section>
            </Row>
            <Row>
                <Form.Group className="mb-3 col-md-6" controlId="userId">
                    <Form.Label>Client</Form.Label>
                    <Form.Select aria-label="Client" name='userId' onChange={handleFormChange} value={aWorkout.userId}>
                        <option value="" disabled></option>
                        {clients.map((client, i) => {
                            return (
                                <option key={i} value={client._id}>{client.name}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3 col-md-6" controlId="date">
                    <Form.Label>Date</Form.Label>
                    <Form.Control name="date" type="date" placeholder="Date" onChange={handleFormChange} value={aWorkout.date} />
                </Form.Group>
            </Row>
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
                                <span className="col-sm-5">Workout</span>
                                <span className="col-sm-2">Set</span>
                                <span className="col-sm-2">Rep / Time (min)</span>
                                <span className="col-sm-2">KG</span>
                                <span className="col-sm-1">
                                    {/* <Button variant='secondary' size='sm' onClick={addActivity}><IoMdAdd /></Button> */}
                                </span>
                            </Row>
                        </Col>
                        <Col sm={12}>
                            {aWorkout.activities.map((activity, index) => {
                                return (
                                    <Row key={index} className='my-2'>
                                        <Form.Group className="col-sm-5" controlId="workout">
                                            <Form.Select className='' aria-label="Workout" name='workout' onChange={(e) => handleActivityChange(e, index)} value={activity.workout}>
                                                <option value="" disabled></option>
                                                {workouts.map((workout, i) => {
                                                    return (
                                                        <option key={i} value={workout._id}>{workout.name}</option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="col-sm-2" controlId="set">
                                            <Form.Control className='' type="number" name='set' onChange={(e) => handleActivityChange(e, index)} value={activity.set} />
                                        </Form.Group>
                                        <Form.Group className="col-sm-2" controlId="rep">
                                            <Form.Control className='col-sm-2' type="number" name='rep' onChange={(e) => handleActivityChange(e, index)} value={activity.rep} />
                                        </Form.Group>
                                        <Form.Group className="col-sm-2" controlId="kg">
                                            <Form.Control className='col-sm-2' type="number" name='kg' onChange={(e) => handleActivityChange(e, index)} value={activity.kg} />
                                        </Form.Group>
                                        <span className="col-sm-1 text-center">
                                            {index > 0 && <Button variant='danger' size='sm' onClick={() => removeActivity(index)}><IoMdRemove /></Button>}
                                            {(index === aWorkout.activities.length - 1) && <Button variant='secondary' size='sm' onClick={addActivity}><IoMdAdd /></Button>}
                                        </span>
                                    </Row>
                                )
                            })}
                        </Col>
                        <Col sm={12}>
                            <Form.Group className="mt-3" controlId="notes">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control as="textarea" rows={3} name='notes' onChange={handleFormChange} value={aWorkout.notes}/>
                            </Form.Group>
                        </Col>
                        <Col sm={12}>
                            <Button className='mt-4 tw:float-right' variant="secondary" onClick={handleWorkoutSave}>
                                Save
                            </Button>
                        </Col>
                    </Row>
                }
            </div>
        </>
    )
}

export default AssignWorkout