import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Badge } from 'react-bootstrap';
import moment from 'moment-timezone';
import NavBar from './NavBar';
import { useParams } from 'react-router-dom';

const Schedule = ({ }) => {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [username, setUsername] = useState(null);
  const { roomId } = useParams();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); 
    setUsername(storedUsername); 
  }, []);

  useEffect(() => {
    moment.tz.setDefault('Asia/Bangkok');
    fetchTimeSlots(roomId, date);
  }, [roomId, date]);

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const generateTimeSlots = () => {
    const slots = [];
    let start = moment().startOf('day').add(7, 'hours'); // Start time
    const end = moment().startOf('day').add(20, 'hours'); // End time
  
    while(start.isBefore(end)) {
      const slotEndTime = start.clone().add(30, 'minutes');
      slots.push({
        startTime: start.format('HH:mm'),
        endTime: slotEndTime.format('HH:mm'),
        available: true // Initially set all slots as available
      });
      start = slotEndTime; // Move to the end time of the current slot
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
              const startTime = moment(bookedSlot.startTime).format('HH:mm');
              const endTime = moment(bookedSlot.endTime).format('HH:mm');
              allSlots.forEach(slot => {
                if (slot.startTime >= startTime && slot.endTime <= endTime) {
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
  

  return (
    <div>
      <NavBar username={username} />
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h2>Schedule of the Room {roomId}</h2>
        <div className="text-center">
          <Calendar
            onChange={onChange}
            value={date}
          />
        </div>
        <h3>Available Time Slots for {moment(date).format('YYYY-MM-DD')} (Asia/Bangkok Time)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;