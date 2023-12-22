import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { SessionStorageKey } from "../../constants/sessionStorage";
// import { getAuthData } from "../../utils/getAuthData";
// import { UserType } from "../../interfaces/User";
// import { sha256 } from "js-sha256";

type LoginFormData = {
  nickname: string;
  password: string;
};

const LoginForm = () => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    setError("");


    const Login = async () => {
        if (email && password) {
            try{
                const response = await axios.post('/api/login', ({email: email, password: password}))
                if (response.status == 200) {
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
            setError("Username and password required")
        }
        ;
    };
    Login()
  };

  return (
    <>
        <h2>Login page</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <p>
                    {error}
                    <br />
                </p>
            )}
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
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>
                    Login
            </Button>
        </Form></>
  );
};

export default LoginForm;
