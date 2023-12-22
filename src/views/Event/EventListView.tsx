import React, { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Organiser from '../../interfaces/Organiser';
import Event from '../../interfaces/Event';
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from 'react-router-dom';

const EventListView = () => {
    let params = useParams();
    const navigate = useNavigate();
  const [data, setData] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [organisers, setOrganisers] = useState<Organiser[]>([]);
  const ROLE = sessionStorage.getItem("ROLE");
    const ORG = sessionStorage.getItem("ORG");
    const APP = sessionStorage.getItem("APPROVED");
  const emptyOrganiser: Organiser = {
    id: 0,
    name: "",
    phoneNumber: "",
    email: "",
    events: [],
  }
  const emptyEvent: Event = {
    id: 0,
    name: "",
    description: "",
    date: new Date(),
    address: "",
    items: [],
    organiser: emptyOrganiser,
    organiserId: 0,
  }
  const [newEvent, setNewEvent] = useState<Event>(emptyEvent);
  const organiserId = params.orgId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/organisers/'+ organiserId +'/events', {params: {token: sessionStorage.getItem("TOKEN")}});
        console.log('Response data:', response.data);
        setData(response.data.events);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOrganisers = async () => {
      try {
        const response = await axios.get(`/api/organisers`, {params: {token: sessionStorage.getItem("TOKEN")}});
        setOrganisers(response.data.organisers);
      } catch (error) {
        console.error('Error fetching organisers:', error);
      }
    };
  
    fetchOrganisers();
  }, []);
  
  
    const handleModalHide = () => {
        setShowModal(false);
        setSelectedEvent(null);
        setToDelete(false);
    };

    const chooseEventDelete = (organiser: Event) => {
        setSelectedEvent(organiser);
        setShowModal(true);
        setToDelete(true);
    };

    const chooseEventEdit = (organiser: Event) => {
        setSelectedEvent(organiser);
        setShowModal(true);
    };

    const deleteEvent = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (selectedEvent) {
            const URL = `/api/organisers/${organiserId}/events/` + selectedEvent.id.toString();
            const response = await axios.delete(URL, {params: {token: sessionStorage.getItem("TOKEN")}});
            console.log(response);
            if (response.status == 204) {
                const updatedList = data.filter(
                    (data) => data.id !== selectedEvent.id
                );
                setData(updatedList);
                handleModalHide();
            }
            return response.data.organiser;
        };
    };

    const editEvent = async(e: SyntheticEvent) => {
        e.preventDefault();
        if (selectedEvent) {
            const URL = `/api/organisers/${organiserId}/events/` + selectedEvent.id.toString();
            const response = await axios.put(URL, ({name: selectedEvent.name, description: selectedEvent.description, date: selectedEvent.date, address: selectedEvent.address, organiserId: selectedEvent.organiserId}), {params: {token: sessionStorage.getItem("TOKEN")}});
            console.log(response);
            selectedEvent.organiser = response.data.event.organiser;
            if (response.status == 200) {
            const updatedList = data.map((data) => {
                if (data.id === selectedEvent.id) {
                return selectedEvent;
                } else {
                return data;
                }
            });
            setData(updatedList);
            setShowModal(false);
            setSelectedEvent(null);
            }
            return response.data.events;
        }
    };

    const createEvent = async(e: SyntheticEvent) => {
        e.preventDefault();
        const response = await axios.post(`/api/organisers/${organiserId}/events/`, ({name: newEvent.name, description: newEvent.description, date: newEvent.date, address: newEvent.address, organiserId: newEvent.organiserId}), {params: {token: sessionStorage.getItem("TOKEN")}})
        console.log(response);
        newEvent.organiser = response.data.event.organiser;
        if (response.status == 201) {
            newEvent.id = response.data.event.id;
            setData([...data, newEvent]);
            setShowModal(false);
            setNewEvent(emptyEvent);
        }
        return response.data.events;
    };

  return (
    <div>
        <h2>Event list</h2>
        {ROLE == "1" || (ROLE == "0" && APP == "true" && ORG == organiserId) ? (<Button variant="success" onClick={() => setShowModal(true)}>
                Add Event
            </Button>) : (<></>)}
        {Array.isArray(data) && data.length > 0 ? (
          <Table striped bordered hover>
          <thead>
          <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Address</th>
              <th>Organiser</th>
          </tr>
          </thead>
          <tbody>
          {data.map((data) => (
              <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.description}</td>
              <td>{new Date(data.date).toLocaleDateString('lt-LT')}</td>
              <td>{data.address}</td>
              <td>{data.organiser.name}</td>
                {ROLE == "1" || (ROLE == "0" && APP == "true" && ORG == organiserId) ? (<td>
                    <Button
                        variant='primary'
                        onClick={() => chooseEventEdit(data)}
                    >
                        Edit
                    </Button>
                    </td>) : (<></>)}
                {ROLE == "1" || (ROLE == "0" && APP == "true" && ORG == organiserId) ? (<td>
                    <Button
                        variant='danger'
                        onClick={() => chooseEventDelete(data)}
                    >
                        Delete
                    </Button>
                </td>) : (<></>)}
                {ROLE == "1" || ORG == organiserId ? (<td>
                    <Button
                        variant='secondary'
                        onClick={() => navigate(`/organisers/${organiserId}/events/${data.id}/items`)}
                    >
                        Show Items
                    </Button>
              </td>) : (<></>)}
              </tr>
          ))}
          </tbody>
          </Table>  
        ) : (
          <p>No data available</p>
        )}
        <Modal show={showModal} onHide={handleModalHide}>
                {toDelete && selectedEvent ? (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete Event</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    Are you sure you want to delete "{selectedEvent.name}" event?
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteEvent}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </>
                ) : selectedEvent ? (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit event</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form onSubmit={editEvent}>
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="name"
                            aria-describedby="basic-addon3"
                            value={selectedEvent.name}
                            onChange={(e) =>
                            setSelectedEvent({
                                ...selectedEvent,
                                name: e.target.value,
                            })
                            }
                        />
                        </InputGroup>
                        <Form.Label htmlFor="description">Description</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="description"
                            aria-describedby="basic-addon3"
                            value={selectedEvent.description}
                            onChange={(e) =>
                            setSelectedEvent({
                                ...selectedEvent,
                                description: e.target.value,
                            })
                            }
                        />
                        </InputGroup>
                        <Form.Label htmlFor="date">Date</Form.Label>
                        <InputGroup className="mb-3">
                            <DatePicker
                                id="date"
                                selected={new Date(selectedEvent.date.toLocaleString('lt-LT'))}
                                onChange={(date) =>
                                    setSelectedEvent({
                                        ...selectedEvent,
                                        date: date || new Date(),
                                    })
                                }
                                dateFormat="yyyy-MM-dd"
                            />
                        </InputGroup>
                        <Form.Label htmlFor="address">Address</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="address"
                            aria-describedby="basic-addon3"
                            value={selectedEvent.address}
                            onChange={(e) =>
                            setSelectedEvent({
                                ...selectedEvent,
                                address: e.target.value,
                            })
                            }
                        />
                        </InputGroup>
                        {/* <Form.Label htmlFor="organiser">Select Organiser</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            as="select"
                            id="organiser"
                            onChange={(e) => {
                            const selectedOrganiserId = parseInt(e.target.value, 10);
                            const selectedOrganiser = organisers.find(
                                (organiser) => organiser.id == selectedOrganiserId
                            );
                            console.log(selectedOrganiser);
                            if(selectedOrganiser){
                                setSelectedEvent({
                                    ...selectedEvent,
                                    organiserId: selectedOrganiserId,
                                })
                            }
                            }}
                        >
                            <option value="">Select an organiser</option>
                            {organisers.map((organiser) => (
                            <option key={organiser.id} value={organiser.id}>
                                {organiser.name}
                            </option>
                            ))}
                        </Form.Control>
                        </InputGroup> */}
                    </Form>
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={editEvent}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </>
                ) : (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Event</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form onSubmit={createEvent}>
                        <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newEvent.name}
                            onChange={(e) => {
                            setNewEvent({ ...newEvent, name: e.target.value });
                            }}
                        />
                        </Form.Group>
                        <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={newEvent.description}
                            onChange={(e) => {
                            setNewEvent({ ...newEvent, description: e.target.value });
                            }}
                        />
                        </Form.Group>
                        <Form.Label htmlFor="date">Date</Form.Label>
                        <InputGroup className="mb-3">
                            <DatePicker
                                id="date"
                                selected={newEvent.date}
                                onChange={(date: any) =>
                                    setNewEvent({
                                        ...newEvent,
                                        date: date,
                                    })
                                }
                                dateFormat="yyyy-MM-dd"
                            />
                        </InputGroup>
                        <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            value={newEvent.address}
                            onChange={(e) => {
                            setNewEvent({ ...newEvent, address: e.target.value });
                            }}
                        />
                        </Form.Group>
                        
                    </Form>
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={createEvent}>
                        Add new event
                    </Button>
                    </Modal.Footer>
                </>
                )}
            </Modal>
    </div>
  );
};

export default EventListView;
