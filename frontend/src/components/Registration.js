import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Registration = () => {
    const [formData, setFormData] = useState({
        username: '',
        userEmail: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send registration data to the backend
            const response = await axios.post('http://localhost:7200/register', formData);
            console.log(response.data);
            // Store username, userEmail, and password in sessionStorage
            sessionStorage.setItem('registrationData', JSON.stringify({
                username: formData.username,
                userEmail: formData.userEmail,
                password: formData.password
            }));
            // Redirect to OTP verification page after successful registration
            navigate('/otp-verification');
        } catch (error) {
            console.error('Error:', error.response ? error.response.data.message : error.message);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0, 0, 255, 0.1)' }}>
            <Container className="p-5" style={{ width: '30rem', backgroundColor: 'rgba(0, 0, 255, 0.1)', borderRadius: '10px' }}>
                <h2 style={{ textAlign: 'center' }}>Registration</h2>
                {error && <Alert variant="danger" style={{ width: '331px', margin: "auto" }}>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    
                    <Form.Group as={Row} className="m-3" controlId="formUsername">
                        <Col sm={12} className="form-floating">
                            <Form.Control id="floatingInput" style={{ width: '100%' }} type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" />
                            <label htmlFor="floatingInput" className='ms-3'>Username</label>
                        </Col>
                    </Form.Group>
                    
                    <Form.Group as={Row} className="m-3" controlId="formEmail">
                        <Col sm={12} className="form-floating">
                            <Form.Control id="floatingInput" style={{ width: '100%' }} type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} placeholder="Enter your email" />
                            <label htmlFor="floatingInput" className='ms-3'>Email</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="m-3" controlId="formPassword">
                        <Col sm={12} className="form-floating">
                            <Form.Control id="floatingInput" style={{ width: '100%' }} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
                            <label htmlFor="floatingInput" className='ms-3'>Password</label>
                        </Col>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
            </Container>
        </div>
    );
};
