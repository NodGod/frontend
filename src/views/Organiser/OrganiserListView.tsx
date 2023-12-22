import React, { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Organiser from '../../interfaces/Organiser';
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const OrganiserListView = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<Organiser[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [toDelete, setToDelete] = useState<boolean>(false);
    const [selectedOrganiser, setSelectedOrganiser] = useState<Organiser | null>(null);
    const emptyOrganiser: Organiser = {
        id: 0,
        name: "",
        phoneNumber: "",
        email: "",
        events: [],
    }
    const [newOrganiser, setNewOrganiser] = useState<Organiser>(emptyOrganiser);
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('/api/organisers');
            console.log('Response data:', response.data.organisers);
            setData(response.data.organisers);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
    
        fetchData();
    }, []);
    
    const handleModalHide = () => {
        setShowModal(false);
        setSelectedOrganiser(null);
        setToDelete(false);
    };

    const chooseOrganiserDelete = (organiser: Organiser) => {
        setSelectedOrganiser(organiser);
        setShowModal(true);
        setToDelete(true);
    };

    const chooseOrganiserEdit = (organiser: Organiser) => {
        setSelectedOrganiser(organiser);
        setShowModal(true);
    };

    const deleteOrganiser = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (selectedOrganiser) {
            const URL = '/api/organisers/' + selectedOrganiser.id.toString();
            const response = await axios.delete(URL);
            console.log(response);
            if (response.status == 204) {
                const updatedList = data.filter(
                    (data) => data.id !== selectedOrganiser.id
                );
                setData(updatedList);
                handleModalHide();
            }
            return response.data.organiser;
        };
    };

    const editOrganiser = async(e: SyntheticEvent) => {
        e.preventDefault();
        if (selectedOrganiser) {
            const URL = '/api/organisers/' + selectedOrganiser.id.toString();
            const response = await axios.put(URL, ({name: selectedOrganiser.name, phoneNumber: selectedOrganiser.phoneNumber, email: selectedOrganiser.email}));
            console.log(response);
            if (response.status == 200) {
            const updatedList = data.map((data) => {
                if (data.id === selectedOrganiser.id) {
                return selectedOrganiser;
                } else {
                return data;
                }
            });
            setData(updatedList);
            setShowModal(false);
            setSelectedOrganiser(null);
            }
            return response.data.organiser;
        }
    };

    const createOrganiser = async(e: SyntheticEvent) => {
        e.preventDefault();
        const response = await axios.post('/api/organisers', ({name: newOrganiser.name, phoneNumber: newOrganiser.phoneNumber, email: newOrganiser.email}))
        console.log(response);
        if (response.status == 201) {
            newOrganiser.id = response.data.organiser.id;
            setData([...data, newOrganiser]);
            setShowModal(false);
            setNewOrganiser(emptyOrganiser);
        }
        return response.data.organiser;
    };

    return (
        <div>
            <h2>Organisation list</h2>
            <Button variant="success" onClick={() => setShowModal(true)}>
                Add organisation
            </Button>
            {Array.isArray(data) && data.length > 0 ? (
            <Table striped bordered hover>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody>
            {data.map((data) => (
                <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.phoneNumber}</td>
                <td>{data.email}</td>
                <td>
                    <Button
                        variant='primary'
                        onClick={() => chooseOrganiserEdit(data)}
                    >
                        Edit
                    </Button>
                </td>
                <td>
                    <Button
                        variant='danger'
                        onClick={() => chooseOrganiserDelete(data)}
                    >
                        Delete
                    </Button>
                </td>
                <td>
                    <Button
                        variant='secondary'
                        onClick={() => navigate(`/organisers/${data.id}/events`)}
                    >
                        Show Events
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
            </Table>  
            ) : (
            <p>No data available</p>
            )}
            <Modal show={showModal} onHide={handleModalHide}>
                {toDelete && selectedOrganiser ? (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete organiser</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    Are you sure you want to delete "{selectedOrganiser.name}" organiser?
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteOrganiser}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </>
                ) : selectedOrganiser ? (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit organiser</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form onSubmit={editOrganiser}>
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="name"
                            aria-describedby="basic-addon3"
                            value={selectedOrganiser.name}
                            onChange={(e) =>
                            setSelectedOrganiser({
                                ...selectedOrganiser,
                                name: e.target.value,
                            })
                            }
                        />
                        </InputGroup>
                        <Form.Label htmlFor="phoneNumber">Phone number</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="phoneNumber"
                            aria-describedby="basic-addon3"
                            value={selectedOrganiser.phoneNumber}
                            onChange={(e) =>
                            setSelectedOrganiser({
                                ...selectedOrganiser,
                                phoneNumber: e.target.value,
                            })
                            }
                        />
                        </InputGroup>
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="email"
                            aria-describedby="basic-addon3"
                            value={selectedOrganiser.email}
                            onChange={(e) =>
                            setSelectedOrganiser({
                                ...selectedOrganiser,
                                email: e.target.value,
                            })
                            }
                        />
                        </InputGroup>
                    </Form>
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={editOrganiser}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </>
                ) : (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Add organiser</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form onSubmit={createOrganiser}>
                        <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newOrganiser.name}
                            onChange={(e) => {
                            setNewOrganiser({ ...newOrganiser, name: e.target.value });
                            }}
                        />
                        </Form.Group>
                        <Form.Group controlId="phoneNumber">
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control
                            type="text"
                            value={newOrganiser.phoneNumber}
                            onChange={(e) => {
                            setNewOrganiser({ ...newOrganiser, phoneNumber: e.target.value });
                            }}
                        />
                        </Form.Group>
                        <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={newOrganiser.email}
                            onChange={(e) => {
                            setNewOrganiser({ ...newOrganiser, email: e.target.value });
                            }}
                        />
                        </Form.Group>
                    </Form>
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={createOrganiser}>
                        Add new organisation
                    </Button>
                    </Modal.Footer>
                </>
                )}
            </Modal>
        </div>
    );
};

export default OrganiserListView;
