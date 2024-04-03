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
  const [imagePath, setImagePath] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [role, setRole] = useState('');
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [reason, setReason] = useState('');
  const [detail, setDetail] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [bookedSlots, setBookedSlots] = useState([]);
  const reasonOptions = [
    "เกี่ยวกับการเรียน",
    "Meeting",
    "Presentation",
    "Workshop",
    "Training",
    "Other"
  ];
  

  useEffect(() => {


    const storedUsername = localStorage.getItem('username');

    
    setUsername(storedUsername);
    getName(storedUsername)
        .then(data => {

          setRole(data.role);
        })
        .catch(error => {
          console.error('Failed to retrieve name:', error);
        });
    moment.tz.setDefault('Asia/Bangkok');
    fetchTimeSlots(roomId, date);
    fetchRoomImage(roomId)
    setCurrentDate(new Date());
    
  


  }, [navigate, roomId, date]);

  const getName = async (storedUsername) => {
    try {
      const response = await fetch(`http://localhost:8081/getname/${storedUsername}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve name');
      }
      const data = await response.json();
      return data; // This will contain first_name and last_name
    } catch (error) {
      console.error('Error retrieving name:', error);
      // Handle error
    }
  };

  

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
        .then(bookedSlotsData => {
            const allSlots = generateTimeSlots();
            const currentTime = moment();
            const formattedBookedSlots = bookedSlotsData.map(slot => ({
                startTime: moment(slot.startTime).format('HH:mm'),
                endTime: moment(slot.endTime).format('HH:mm')
            }));
            setBookedSlots(formattedBookedSlots);
            allSlots.forEach(slot => {
                formattedBookedSlots.forEach(bookedSlot => {
                    const slotStartTime = slot.startTime;
                    const slotEndTime = slot.endTime;

                    if (role === 'user') {
                    if (slotStartTime >= bookedSlot.startTime && slotEndTime <= bookedSlot.endTime) {
                        slot.available = false;
                    }
                    // Check if the slot's start time is before the current time
                    if (moment(`${formattedDate} ${slot.startTime}`).isBefore(currentTime)) {
                              // Mark the slot as unavailable
                            slot.available = false;
                    }
                    // Check if the selected date is the current date
                    if (moment(formattedDate).isSame(currentTime, 'day')) {
                         // Mark all slots as unavailable if it's the current day
                        slot.available = false;
                    }

                   // Check if the current time is between 8 PM and 7 AM
                    if (currentTime.format('HH:mm') >= '20:00' || currentTime.format('HH:mm') < '07:00') {
                                 // Check if the slot starts before 12 AM of the next day
                              if (moment(`${formattedDate} ${slot.startTime}`).isBefore(moment(formattedDate).add(1, 'day').startOf('day'))) {
                                  // Mark the slot as unavailable
                                  slot.available = false;
                                    }
                        }
                    }  else {
                      if (slotStartTime >= bookedSlot.startTime && slotEndTime <= bookedSlot.endTime) {
                        slot.available = false;
                    }
                      
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





// Function to check if a slot is available for booking based on current time


// const isSlotAvailable = (slot) => {
//   const currentDate = moment(); // Get the current date and time
//   const selectedDate = moment(date).startOf('day'); // Get the selected date
  
//   // Get tomorrow's date
//   const tomorrowDate = moment().add(1, 'day').startOf('day');

//   // Check if the selected date is tomorrow
//   if (selectedDate.isSame(tomorrowDate, 'day')) {
//     // Parse slot start time
//     const slotStartTime = moment(slot.startTime, 'HH:mm');

//     // Check if the slot start time is after 12:00 PM
//     if (slotStartTime.isAfter(moment().startOf('day').add(12, 'hours'))) {
//       return true; // Slot is available if it's after 12:00 PM for tomorrow
//     }
//     // Slot is not available if it's before 12:00 PM for tomorrow
//     return false;
//   }

//   // Check if the selected date is today and the slot time is in the past
//   if (selectedDate.isSame(currentDate, 'day')) {
//     // Parse slot start time
//     const slotStartTime = moment(slot.startTime, 'HH:mm');

//     // Check if the slot start time is before the current time
//     if (slotStartTime.isBefore(currentDate)) {
//       return false; // Slot is not available if it's in the past for today
//     }
//     return false;
//   }

//   // Allow booking for any date after tomorrow
//   return true;
// };
const handleReasonButton = () => {
  // Check if any selected slot overlaps with booked slots or is marked as unavailable
  const isAnySlotUnavailable = selectedSlots.some(slot => {
    // Check if the slot is marked as unavailable
    if (!slot.available) {
      return true; // Slot is unavailable, return true
    }

    // Check if the slot overlaps with any booked slot
    return bookedSlots.some(bookedSlot => {
      return (
        (bookedSlot.startTime <= slot.startTime && bookedSlot.endTime > slot.startTime) || // Check if start time overlaps
        (bookedSlot.startTime < slot.endTime && bookedSlot.endTime >= slot.endTime) // Check if end time overlaps
      );
    });
  });

  if (isAnySlotUnavailable) {
    console.error('One or more selected slots are unavailable.');
    alert('One or more selected time slots are already booked or unavailable. Please choose another time slot.');
    return;
  }

  setShowReasonPopup(true);
};







const handleReasonSubmit = () => {
  

  // If all selected slots are available, proceed with booking
  console.log('Reason:', reason);
  setShowReasonPopup(false);
  addBookings();
};




const handleAddBooking = () => {
  const slot = { startTime: start, endTime: end, available: true };

  // Check if the slot is already booked
  const isSlotBooked = bookedSlots.some(
    (bookedSlot) =>
      bookedSlot.startTime === slot.startTime &&
      bookedSlot.endTime === slot.endTime
  );

  if (isSlotBooked) {
    console.error('The selected slot is already booked !.');
    alert('One or more selected time slots are already booked or unavailable. Please choose another time slot.');
    // Handle error, e.g., show an error message to the user
    return;
  }

  // If the slot is not booked, add it to the selectedSlots array
  handleBooking(slot);
};



const handleCancel = () => {
  const slot = { startTime: start, endTime: end };
  handleRemoveBooking(slot);
  setSelectedSlot(null);
  setSelectedSlots([]);
  
  
};





const fetchRoomImage = (roomId) => {

  fetch(`http://localhost:8081/room-image/${roomId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch room image');
          }
          return response.json();
      })
      .then(data => {
        setImagePath(data.imagePath);


        // Return the image path

      })
      .catch(error => {
          console.error('Error fetching room image:', error);
          // Handle error
          return null; // Return null or handle the error as needed
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
      reason: reason + detail,
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

const generateTimeOptions = () => {
  const options = [];
  const startTime = moment().startOf('day').add(7, 'hours'); // Start time at 07:00 AM
  const endTime = moment().startOf('day').add(20, 'hours'); // End time at 08:00 PM

  while (startTime.isSameOrBefore(endTime)) {
    options.push(
      <option key={startTime.format('HH:mm')} value={startTime.format('HH:mm')}>
        {startTime.format('HH:mm')} {/* Use 24-hour format */}
      </option>
    );
    startTime.add(30, 'minutes');
  }

  return options;
};







  return (
    <div>
      <NavBar username={username} />
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h2 style={{ color: 'black' }}>Schedule of the Room {roomId}</h2>
        <div className="d-flex justify-content-center align-items-center">
    <div className="text-center mr-4"style={{ marginRight: '50px' }}>
      <Calendar onChange={onChange} value={date} /> 
    </div>
    <div  >
      {imagePath ? (
        <img src={imagePath} alt={`Room ${roomId}`} style={{ width: 'auto%', height: 'auto', maxWidth: '400px', maxHeight: '400px' }} />
      ) : (
        <p>Loading...</p>
      )}
      </div>
    </div>
    <div>
    <div style={{ marginBottom: "20px" }}></div>
        
    
    <div className="form-group d-flex" style={{marginRight: "20px"}}>
  <div className="mr-3">
    <label htmlFor="startTime" style={{ color: 'black', paddingRight: "30px" }}>Start Time:</label>
    <select id="startTime" value={start} onChange={(e) => setStart(e.target.value)}>
      <option value="">Select Start Time</option>
      {generateTimeOptions()}
    </select>
  </div>
  <div>
    <label htmlFor="endTime" style={{ color: 'black' }}>End Time:</label>
    <select id="endTime" value={end} onChange={(e) => setEnd(e.target.value)}>
      <option value="">Select End Time</option>
      {generateTimeOptions()}
    </select>
  </div>
</div>

          
          <div className="form-group">
          <button style={{marginLeft: "55px"}} className='custom-button ' onClick={() => handleAddBooking()}>Add</button>
          <button style={{marginLeft: "10px"}}className='yellow-button ' onClick={() => handleCancel()}>Clear</button>
          </div>
          

          
        </div>
       
        {selectedSlots.length > 0 && (
  <div>
    <h4 style={{ color: 'black' }}>Selected Time Slots:</h4>
    <ul>
      {selectedSlots.map((slot, index) => (
        <li key={index}>
          {moment(date).format('YYYY-MM-DD')} {slot.startTime} - {slot.endTime}
        </li>
      ))}
    </ul>
    <button style={{marginLeft: "20px"}} className='blue-button' onClick={() => handleReasonButton()}>Confirm Bookings</button>
  </div>
)}

        {/* Reason popup */}
      {showReasonPopup && (
        <div className="popup-container">
        <div className="popup">
          <h3>Enter Reason for Booking</h3>
          <label htmlFor="reasonSelect">Select Reason:</label>
          <select id="reasonSelect" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select Reason</option>
            {reasonOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div style={{ marginBottom: '10px' }}></div>
          <label htmlFor="detailTextarea">Details:</label>
          <textarea
            id="detailTextarea"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="โปรดใส่รหัสวิชา..."
          />
          <div className="submit-buttons" style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleReasonSubmit}>Submit</button>
            <button onClick={() => setShowReasonPopup(false)}>Cancel</button>
          </div>
          </div>
        </div>
      )}
      <h3 style={{ color: 'black' }} >Available Time Slots for {moment(date).format('YYYY-MM-DD')} (Asia/Bangkok Time)</h3>
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
              <tr key={index} className="user-column">
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