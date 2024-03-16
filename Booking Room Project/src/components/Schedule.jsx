import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Badge } from 'react-bootstrap';
import moment from 'moment-timezone';
import NavBar from './NavBar';
import { useNavigate, useParams } from 'react-router-dom';

const Schedule = ({}) => {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [username, setUsername] = useState(null);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {


    const storedUsername = localStorage.getItem('username');

    
    setUsername(storedUsername);
    moment.tz.setDefault('Asia/Bangkok');
    fetchTimeSlots(roomId, date);
  


  }, [navigate, roomId, date]);

  

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleBooking = (slot) => {
    const isSlotSelected = selectedSlots.some(
      (selectedSlot) =>
        selectedSlot.startTime === slot.startTime &&
        selectedSlot.endTime === slot.endTime
    );

    if (!isSlotSelected) {
      setSelectedSlots([...selectedSlots, slot]);
    } else {
      handleRemoveBooking(slot);
    }
  };

  const handleRemoveBooking = (slot) => {
    const updatedSelectedSlots = selectedSlots.filter(
      (selectedSlot) =>
        selectedSlot.startTime !== slot.startTime ||
        selectedSlot.endTime !== slot.endTime
    );
    setSelectedSlots(updatedSelectedSlots);
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = moment().startOf('day').add(7, 'hours'); // Start time
    const end = moment().startOf('day').add(20, 'hours'); // End time

    while (start.isBefore(end)) {
      slots.push({
        startTime: start.format('HH:mm'),
        endTime: start.add(30, 'minutes').format('HH:mm'), // Change this to the length of your time slots
        available: true, // Initially set all slots as available
      });
    }

    return slots;
  };

  const fetchTimeSlots = (roomId, selectedDate) => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    fetch(`http://localhost:8081/schedule/${roomId}?date=${formattedDate}`)
        .then(response => response.json())
        .then(bookedSlots => {
            const allSlots = generateTimeSlots();
            bookedSlots.forEach(bookedSlot => {
                const bookedStartTime = moment(bookedSlot.startTime).format('HH:mm');
                const bookedEndTime = moment(bookedSlot.endTime).format('HH:mm');
                allSlots.forEach(slot => {
                    const slotStartTime = slot.startTime;
                    const slotEndTime = slot.endTime;
                    if (slotStartTime >= bookedStartTime && slotEndTime <= bookedEndTime) {
                        slot.available = false;
                    }
                });
            });
            setTimeSlots(allSlots);
        })
        .catch(error => {
            console.error('Error fetching schedule:', error);
            // Handle error
        });
};

const addBookings = () => {
  fetch('http://localhost:8081/bookings2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomId: roomId,
      date: moment(date).format('YYYY-MM-DD'),
      selectedSlots: selectedSlots,
      username: username,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add bookings');
      }
      console.log('Bookings added successfully');
      setBookingSuccess(true); // Set booking success state to true
      alert('Booking successful \n Please check your email for details');
      setTimeout(() => {
        // Redirect to home page after 1.5 seconds
        navigate('/');
      }, 1000); // Adjust the time as needed
    })
    .catch(error => {
      console.error('Error adding bookings:', error);
      // Handle error, show error message, etc.
    });
};




  return (
    <div>
      <NavBar username={username} />
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h2>Schedule of the Room {roomId}</h2>
        <div className="text-center">
          <Calendar onChange={onChange} value={date} />
        </div>
        <div>
          <h4>Selected Time Slots:</h4>
          <ul>
            {selectedSlots.map((slot, index) => (
              <li key={index}>
                {moment(date).format('YYYY-MM-DD')} {slot.startTime} - {slot.endTime}
              </li>
            ))}

            {/* Button to add selected time slots (conditionally rendered) */}
            {selectedSlots.length > 0 && (
            <button className='blue-button' onClick={addBookings}>Confirm Bookings</button>
            )}
              
          </ul>
        </div>
        <h3>Available Time Slots for {moment(date).format('YYYY-MM-DD')} (Asia/Bangkok Time)</h3>
        <table >
          <thead>
            <tr>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, index) => (
              <tr key={index}>
                <td>{slot.startTime} - {slot.endTime}</td>
                <td>
                  <Badge bg={slot.available ? 'success' : 'danger'}>
                    {slot.available ? 'Available' : 'Not Available'}
                  </Badge>
                </td>
                <td>
                  {slot.available ? (
                    selectedSlots.some(
                      (selectedSlot) =>
                        selectedSlot.startTime === slot.startTime &&
                        selectedSlot.endTime === slot.endTime
                    ) ? (
                      <button className='yellow-button' onClick={() => handleRemoveBooking(slot)}>Cancel</button>
                    ) : (
                      <button className='custom-button' onClick={() => handleBooking(slot)}>Book</button>
                    )
                  ) : (
                    <button disabled>Unavailable</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;