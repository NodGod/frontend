import React, { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import Item from '../../interfaces/Item';
import Event from '../../interfaces/Event';
import Organiser from '../../interfaces/Organiser';
import { parse } from 'path';
import { useParams } from 'react-router-dom';

const ItemListView = () => {
    let params = useParams();
  const [data, setData] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
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
    organiserId: 0
    }
  const emptyItem: Item = {
    id: 0,
    name: "",
    quantity: 0,
    price: 0,
    event: emptyEvent,
    eventId: 0,
    }
const organiserId = params.orgId;
const eventId = params.eventId;
const [newItem, setNewItem] = useState<Item>(emptyItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/organisers/${organiserId}/events/${eventId}/items`);
        console.log('Response data:', response.data.items);
        setData(response.data.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
}, []);

    useEffect(() => {
        const fetchEvents = async () => {
        try {
            const response = await axios.get(`/api/organisers/${organiserId}/events`);
            setEvents(response.data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
        };
        fetchEvents();
    }, []);

  const handleModalHide = () => {
    setShowModal(false);
    setSelectedItem(null);
    setToDelete(false);
};

const chooseItemDelete = (organiser: Item) => {
    setSelectedItem(organiser);
    setShowModal(true);
    setToDelete(true);
};

const chooseItemEdit = (organiser: Item) => {
    setSelectedItem(organiser);
    setShowModal(true);
};

const deleteItem = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (selectedItem) {
        const URL = `/api/organisers/${organiserId}/events/${eventId}/items/` + selectedItem.id.toString();
        const response = await axios.delete(URL);
        console.log(response);
        if (response.status == 204) {
            const updatedList = data.filter(
                (data) => data.id !== selectedItem.id
            );
            setData(updatedList);
            handleModalHide();
        }
        return response.data.organiser;
    };
};

const editItem = async(e: SyntheticEvent) => {
    e.preventDefault();
    if (selectedItem) {
        const URL = `/api/organisers/${organiserId}/events/${eventId}/items/` + selectedItem.id.toString();
        const response = await axios.put(URL, ({name: selectedItem.name, quantity: selectedItem.quantity, price: selectedItem.price}));
        console.log(response);
        if (response.status == 200) {
        const updatedList = data.map((data) => {
            if (data.id === selectedItem.id) {
            return selectedItem;
            } else {
            return data;
            }
        });
        setData(updatedList);
        setShowModal(false);
        setSelectedItem(null);
        }
        return response.data.events;
    }
};

const createItem = async(e: SyntheticEvent) => {
    e.preventDefault();
    console.log(({name: newItem.name, quantity: newItem.quantity, price: newItem.price, eventId: newItem.eventId}));
    const response = await axios.post(`/api/organisers/${organiserId}/events/${eventId}/items`, ({name: newItem.name, quantity: newItem.quantity, price: newItem.price, eventId: eventId}))
    console.log(response);
    if (response.status == 201) {
        newItem.id = response.data.item.id;
        setData([...data, newItem]);
        setShowModal(false);
        setNewItem(emptyItem);
    }
    return response.data.item;
};

  return (
    <div>
        <h2>Item list</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
            Add item
        </Button>
        {Array.isArray(data) && data.length > 0 ? (
          <Table striped bordered hover>
          <thead>
          <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
          </tr>
          </thead>
          <tbody>
          {data.map((data) => (
              <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.quantity}</td>
              <td>{data.price}</td>
              <td>
              <Button
                        variant='primary'
                        onClick={() => chooseItemEdit(data)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant='danger'
                        onClick={() => chooseItemDelete(data)}
                    >
                        Delete
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
                {toDelete && selectedItem ? (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete Item</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    Are you sure you want to delete "{selectedItem.name}" item?
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteItem}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </>
                ) : selectedItem ? (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit item</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form onSubmit={editItem}>
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="name"
                            aria-describedby="basic-addon3"
                            value={selectedItem.name}
                            onChange={(e) =>
                            setSelectedItem({
                                ...selectedItem,
                                name: e.target.value,
                            })
                            }
                        />
                        </InputGroup>
                        <Form.Label htmlFor="quantity">Quantity</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="quantity"
                            aria-describedby="basic-addon3"
                            value={selectedItem.quantity}
                            onChange={(e) =>
                            setSelectedItem({
                                ...selectedItem,
                                quantity: parseInt(e.target.value),
                            })
                            }
                        />
                        </InputGroup>
                        <Form.Label htmlFor="price">Price</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control
                            id="price"
                            aria-describedby="basic-addon3"
                            value={selectedItem.price}
                            onChange={(e) =>
                            setSelectedItem({
                                ...selectedItem,
                                price: parseFloat(e.target.value),
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
                    <Button variant="primary" onClick={editItem}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </>
                ) : (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Add item</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form onSubmit={createItem}>
                        <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newItem.name}
                            onChange={(e) => {
                            setNewItem({ ...newItem, name: e.target.value });
                            }}
                        />
                        </Form.Group>
                        <Form.Group controlId="phoneNumber">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="text"
                            value={newItem.quantity}
                            onChange={(e) => {
                            setNewItem({ ...newItem, quantity: parseInt(e.target.value) });
                            }}
                        />
                        </Form.Group>
                        <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            value={newItem.price}
                            onChange={(e) => {
                            setNewItem({ ...newItem, price: parseFloat(e.target.value) });
                            }}
                        />
                        </Form.Group>
                        
                    </Form>
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={createItem}>
                        Add new item
                    </Button>
                    </Modal.Footer>
                </>
                )}
            </Modal>
    </div>
  );
};

export default ItemListView;
