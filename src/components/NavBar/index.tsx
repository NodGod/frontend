import React from "react";
import { NavbarText } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";

const NavBarView = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("ROLE");
    sessionStorage.removeItem("NAME");
    sessionStorage.removeItem("TOKEN");
    navigate("/");
  };
  const ROLE = sessionStorage.getItem("ROLE")
  const navLinks = [
    //{ title: "Organisers", path: "/organisers" },
    //{ title: "Events", path: "/events" },
    //{ title: "Items", path: "/items" },
  ];
  if(ROLE == "0" || ROLE == "1"){
    navLinks.push({ title: "Organisers", path: "/organisers" });
  }
  return (
    <Navbar fixed="top" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          Event inventory
        </Navbar.Brand>
        <Nav className="me-auto">
          {navLinks.map((link) => (
            <Nav.Link as={Link} to={link.path} key={link.title}>
              {link.title}
            </Nav.Link>
          ))}
        </Nav>
        <Nav>
          {sessionStorage.getItem("ROLE") =="0" || sessionStorage.getItem("ROLE") =="1" ? (
            <Nav>
            <NavbarText>
              {sessionStorage.getItem("NAME")}
            </NavbarText>
            <Nav.Link className="text-danger" onClick={logout}>
              Sign out
            </Nav.Link>
            </Nav>
          ):(
            <Nav>
            <Nav.Link className="text-primary" onClick={() => navigate("/login")}>
              Log in
            </Nav.Link>
            <Nav.Link className="text-primary" onClick={() => navigate("/register")}>
              Register
            </Nav.Link>
            </Nav>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBarView;
