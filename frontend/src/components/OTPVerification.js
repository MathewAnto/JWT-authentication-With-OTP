import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const OTPVerification = () => {
    const [otp, setOTP] = useState('');
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve registration data from sessionStorage
        const storedData = sessionStorage.getItem('registrationData');
        if (storedData) {
            const { username, userEmail, password } = JSON.parse(storedData);
            setUsername(username);
            setUserEmail(userEmail); // assuming you have a state variable for userEmail
            setPassword(password); // assuming you have a state variable for password
        } else {
            // Handle case where sessionStorage is empty or data is missing
            setError('Registration data not found');
        }
    }, []);

    const handleChange = (e) => {
        setOTP(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Retrieve user email and password from sessionStorage
            const { userEmail, password } = JSON.parse(sessionStorage.getItem('registrationData'));
            // Send OTP, user email, username, and password to server for verification and saving user data
            const response = await axios.post('http://localhost:7200/verifyOTP', {
                username,
                userEmail,
                password,
                otp
            });
            console.log(response.data);
            // Redirect to login page after successful OTP verification
            navigate('/login');
        } catch (error) {
            console.error('Error:', error.response ? error.response.data.message : error.message);
            setError(error.response ? error.response.data.message : error.message);
            // alert("Invalid OTP")
        }
    };

    return (
        <Container>
            <h2>OTP Verification</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formOTP">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control type="text" value={otp} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Verify OTP
                </Button>
            </Form>
        </Container>
    );
};
