import React, { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Organiser from '../../interfaces/Organiser';
import User from '../../interfaces/User';
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from 'react-router-dom';

const UserListView = () => {
    let params = useParams();
    const navigate = useNavigate();
  const [data, setData] = useState<User[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [approve, setApprove] = useState<number>();
  const [admin, setAdmin] = useState<number>();
  const organiserId = params.orgId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/users', {params: {token: sessionStorage.getItem("TOKEN")}});
        console.log('Response data:', response.data);
        setData(response.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

 
  
    const handleModalHide = () => {
        setShowModal(false);
        setSelectedUser(null);
        setToDelete(false);
    };

    const chooseUserDelete = (organiser: User) => {
        setSelectedUser(organiser);
        setShowModal(true);
        setToDelete(true);
    };

    const chooseUserEdit = (organiser: User) => {
        setSelectedUser(organiser);
        setAdmin(selectedUser?.type)
        setApprove(selectedUser?.approved ? 1 : 0)
        setShowModal(true);
    };

    const deleteUser = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (selectedUser) {
            const URL = `/api/users/` + selectedUser.id.toString();
            const response = await axios.delete(URL, {params: {token: sessionStorage.getItem("TOKEN")}});
            console.log(response);
            if (response.status == 204) {
                const updatedList = data.filter(
                    (data) => data.id !== selectedUser.id
                );
                setData(updatedList);
                handleModalHide();
            }
            return response.data.organiser;
        };
    };

    const editUser = async(e: SyntheticEvent) => {
        e.preventDefault();
        if (selectedUser) {
            const URL = `/api/users/` + selectedUser.id.toString();
            const response = await axios.put(URL, ({role: admin, approved: approve}), {params: {token: sessionStorage.getItem("TOKEN")}});
            console.log(response);
            if (response.status == 200) {
            selectedUser.type = admin == 1 ? 1 : 0;
            selectedUser.approved = approve == 1;
            const updatedList = data.map((data) => {
                if (data.id === selectedUser.id) {
                return selectedUser;
                } else {
                return data;
                }
            });
            setData(updatedList);
            setShowModal(false);
            setSelectedUser(null);
            }
            return response.data.events;
        }
    };

    
  return (
    <div>
        <h2>User list</h2>
        {Array.isArray(data) && data.length > 0 ? (
          <Table striped bordered hover>
          <thead>
          <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Org</th>
              <th>Approved</th>
              <th>Role</th>
          </tr>
          </thead>
          <tbody>
          {data.map((data) => (
              <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.organisation.name}</td>
              <td>{data.approved ? 1 : 0}</td>
              <td>{data.type}</td>
              <td>
                    <Button
                        variant='primary'
                        onClick={() => chooseUserEdit(data)}
                    >
                        Edit
                    </Button>
                    </td>
                <td>
                    <Button
                        variant='danger'
                        onClick={() => chooseUserDelete(data)}
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
                {toDelete && selectedUser ? (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    Are you sure you want to delete "{selectedUser.name}" event?
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalHide}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteUser}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </>
                ) : selectedUser ? (
                <>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit user {(selectedUser.name)}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form onSubmit={editUser}>
                        
                        <Form.Label htmlFor="description">Approve?</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Check
                            type="checkbox"
                            defaultChecked = {selectedUser.approved ? true : false}
                            onChange={(e) => {
                                setApprove(e.target.checked ? 1 : 0)
                            }}
                            label="Yes"
                            id={`approve`}
                        />
                        </InputGroup>
                        <Form.Label htmlFor="date">Admin?</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Check
                            type="checkbox"
                            defaultChecked = {selectedUser.type == 1 ? true : false}
                            onChange={(e) => {
                                setAdmin(e.target.checked ? 1 : 0)
                            }}
                            label="Yes"
                            id={`admin`}
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
                                setSelectedUser({
                                    ...selectedUser,
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
                    <Button variant="primary" onClick={editUser}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </>
                ) : (
                <>
                    
                </>
                )}
            </Modal>
    </div>
  );
};

export default UserListView;
