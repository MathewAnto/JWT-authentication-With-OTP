import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Admin = () => {

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:7200/protected', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log('UserData:', response.data); // Debugging
                setUserData(response.data);
            } catch (error) {
                console.error('Error:', error.response ? error.response.data.message : error.message);
            }
        };

        if (accessToken) {
            fetchData();
        }
    }, []);

    console.log('UserData:', userData); // Debugging

  return (
    
        <div>
            <h2>Admin Page</h2>
            {userData ? (
                <div>
                    <p>Admin Name: {userData.data.username}</p>
                    <p>Admin Email: {userData.data.userEmail}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
   
  )
}
