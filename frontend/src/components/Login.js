import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:7200/login', formData);
            const { accessToken, refreshToken } = response.data;

            // Save access token to localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // Decode the access token to get user role
            const decodedToken = jwtDecode(accessToken);
            const role = decodedToken.role;

            // Redirect based on user role
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/main');
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0, 0, 255, 0.1)' }}>
            <Container className="p-5" style={{ width: '34rem', backgroundColor: 'rgba(0, 0, 255, 0.1)', borderRadius: '10px' }}>
                <h2 style={{ textAlign: 'center' }}>Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername" as={Row} className="m-3">
                        <Form.Label column sm={3} style={{ width: '6.3rem', textAlign: 'right', fontWeight: 'bold' }}>Username</Form.Label>
                        <Col sm={9}>
                            <Form.Control className={formData.username ? 'shifted' : ''} style={{ width: '100%' }} type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" required />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="formPassword" as={Row} className="m-3">
                        <Form.Label column sm={3} style={{ width: '6.3rem', textAlign: 'right', fontWeight: 'bold' }}>Password</Form.Label>
                        <Col sm={9}>
                            <Form.Control className={formData.password ? 'shifted' : ''} style={{ width: '100%' }} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
                        </Col>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </Container>
        </div>
    );
};