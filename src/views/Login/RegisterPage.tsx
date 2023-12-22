import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Organiser from "../../interfaces/Organiser";

type RegisterFormData = {
  nickname: string;
  password: string;
};

const RegisterForm = () => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [name, setName] = useState<string>();
    const [surname, setSurname] = useState<string>();
    const [organisationId, setOrganisation] = useState<number>();
    const [organisers, setOrganisers] = useState<Organiser[]>([]);
    const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  
  useEffect(() => {
    const fetchOrganisers = async () => {
      try {
        const response = await axios.get('/api/organisers');
        setOrganisers(response.data.organisers);
      } catch (error) {
        console.error('Error fetching organisers:', error);
      }
    };
  
    fetchOrganisers();
  }, []);
  const onSubmit = (data: RegisterFormData) => {
    setError("");


    const Register = async () => {
        if (email && password) {
            try{
                const response = await axios.post('/api/register', ({name: name, surname: surname, email: email, password: password, organisationId: organisationId}))
                if (response.status == 201) {
                    sessionStorage.setItem(
                        "TOKEN",
                        response.data.user.token
                    );
                    sessionStorage.setItem(
                        "ROLE",
                        response.data.user.type
                    );
                    sessionStorage.setItem(
                        "NAME",
                        response.data.user.name
                    );
                    navigate("/")
                }
            }
            catch{
                setError("Wrong username or password")
            }
        }else{
            setError("All fields required")
        }
        ;
    };
    Register()
  };

  return (
    <>
        <h2>Register page</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <p>
                    {error}
                    <br />
                </p>
            )}
            <Form.Label htmlFor="name">Name</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    id="name"
                    aria-describedby="basic-addon3"
                    onChange={(e) =>
                        setName(e.target.value)}
                        />
            </InputGroup>
            <Form.Label htmlFor="surname">Surname</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    id="surname"
                    aria-describedby="basic-addon3"
                    onChange={(e) =>
                        setSurname(e.target.value)}
                        />
            </InputGroup>
            <Form.Label htmlFor="email">Email</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    id="email"
                    aria-describedby="basic-addon3"
                    onChange={(e) =>
                        setEmail(e.target.value)}
                        />
            </InputGroup>
            <Form.Label htmlFor="password">Password</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    id="password"
                    type="password"
                    aria-describedby="basic-addon3"
                    onChange={(e) =>
                    setPassword(e.target.value)
                    
                }
                    />
            </InputGroup>
            <Form.Label htmlFor="organisation">Organisation</Form.Label>
            <Form.Control
                            as="select"
                            id="organisation"
                            onChange={(e) => {
                            const selectedOrganiserId = parseInt(e.target.value, 10);
                            const selectedOrganiser = organisers.find(
                                (organiser) => organiser.id == selectedOrganiserId
                            );
                            console.log(selectedOrganiser);
                            if(selectedOrganiser){
                                setOrganisation(selectedOrganiserId)
                            }
                            }}
                        >
                            <option value="">Select an organisation</option>
                            {organisers.map((organiser) => (
                            <option key={organiser.id} value={organiser.id}>
                                {organiser.name}
                            </option>
                            ))}
            </Form.Control>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>
                    Register
            </Button>
        </Form></>
  );
};

export default RegisterForm;
