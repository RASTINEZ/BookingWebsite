import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomsPieChart from './RoomsPieChart';
 

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [buildingFilter, setBuildingFilter] = useState('All');
    const [problematicBookings, setProblematicBookings] = useState([]);
    const [bookingUsers, setBookingUsers] = useState({});
    const [selectedRoomUsers, setSelectedRoomUsers] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookings, setBookings] = useState([]);
    

    useEffect(() => {
        fetchRooms();
        fetchProblematicBookings();
        fetchBookings();
    }, [buildingFilter]);

    const fetchRooms = () => {
        fetch(`http://localhost:8081/allrooms?building=${buildingFilter}`)
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching rooms:', error));
    };

    const fetchProblematicBookings = () => {
        axios.get('http://localhost:8081/getProblematicBookings')
            .then(response => {
                setProblematicBookings(response.data);
                setBookingUsers({}); // Reset bookingUsers state
            })
            .catch(error => {
                console.error('Error fetching problematic bookings:', error);
            });
    };

    const handleShowUsers = (roomNumber) => {
        setSelectedRoom(roomNumber);
        axios.get(`http://localhost:8081/getBookingUsers?roomNumber=${roomNumber}`)
            .then(response => {
                setSelectedRoomUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching booking users:', error);
            });
    };

    const handleSendEmails = () => {
        const emails = selectedRoomUsers.map(user => user.email);

        axios.post('http://localhost:8081/sendEmailsToUsers', {
            emails: emails,
            subject: 'Your Booked room has a problem',
            message: 'ห้องที่คุณจองไว้มีรายงานเข้ามาว่ามีปัญหา คุณอาจจะต้องจองห้องอื่น',
        })
        .then(response => {
            console.log(response.data.message); // Log success message
            alert("Emails sent !")
            // Handle success if needed
        })
        .catch(error => {
            console.error('Error sending emails:', error); // Log error message
            // Handle error if needed
        });
    };

    const fetchBookings = () => {
        axios.get(`http://localhost:8081/bookingsForChart?building=${buildingFilter}`)
            .then(response => {
                setBookings(response.data);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
            });
    };

    // Calculate the count of bookings for each room
    const roomData = bookings.reduce((acc, booking) => {
        const { room_number } = booking;
        if (!acc[room_number]) {
            acc[room_number] = 0;
        }
        acc[room_number]++;
        return acc;
    }, {});

    // Calculate the total count of bookings
    const totalBookings = Object.values(roomData).reduce((total, count) => total + count, 0);

    // Calculate the percentage of booked rooms for each room
    const formattedRoomData = Object.entries(roomData).map(([roomNumber, count]) => ({
        room_number: roomNumber,
        bookedPercentage: Math.round((count / totalBookings) * 100),
    }));

   

    return (
        <div>
            <br/>
            <label htmlFor="buildingFilter">Filter by Building:</label>
            
            <select id="buildingFilter" value={buildingFilter} onChange={e => setBuildingFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="SC45">SC45</option>
                <option value="SCL">SCL</option>
                {/* Add other building options as needed */}
            </select>

            <div style={{ display: 'flex' }}>
                <h2 style={{ textAlign: 'left' }}>Rooms</h2>
                <table className="room-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Room Number</th>
                            <th>Type</th>
                            <th>Building</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={room.room_number}>
                                <td>{index + 1}</td>
                                <td>{room.room_number}</td>
                                <td>{room.room_type}</td>
                                <td>{room.building}</td>
                                <td>{room.available_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
      <h2>Rooms Booking Status</h2>
      <RoomsPieChart bookings={bookings} />


    </div>
            </div>

            <div>
                <h1>Problematic Bookings</h1>
                <p>There are {problematicBookings.length} problematic bookings.</p>
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Detail</th>
                            <th>Room Number</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problematicBookings.map(booking => (
                            <tr key={booking.booking_id}>
                                <td>{booking.booking_id}</td>
                                <td>{booking.detail}</td>
                                <td>{booking.room_number}</td>
                                <td>
                                    <button onClick={() => handleShowUsers(booking.room_number)}>Show Users</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
            <div style={{ marginBottom: "20px" }}></div>
                <h1>Room Users</h1>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedRoomUsers.map(user => (
                            <tr key={user.username}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedRoom && (
                <div>
                    <h2>Users for Room {selectedRoom}</h2>
                    <ul>
                        {bookingUsers[selectedRoom]?.map(user => (
                            <li key={user.username}>{user.username}</li>
                        ))}
                    </ul>
                </div>
            )}

            {problematicBookings.length > 0 && (
                <div>
                    
                    <button onClick={handleSendEmails}>Send Emails</button>
                    <div style={{ marginBottom: "40px" }}></div>
                </div>
            )}
        </div>
        
    );
};

export default RoomsPage;
