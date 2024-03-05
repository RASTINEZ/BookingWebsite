// App.jsx

import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import MaintainCard from './components/MaintainCard';
import NavBar from './components/NavBar';
import './App.css'; // Import CSS file for styling

export const App = () => {
  const [data, setData] = useState([])
  const [username, setUsername] = useState(null);
  const [brokenRoom, setBrokenRoom] = useState(null); // State variable for broken room announcement
  const [maintainRooms, setMaintainRooms] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8081/rooms')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));

    const storedUsername = localStorage.getItem('username'); 
    
    setUsername(storedUsername); 

     // Fetch rooms in 'maintain' status
     fetch('http://localhost:8081/maintain')
     .then(res => res.json())
     .then(data => setMaintainRooms(data))
     .catch(err => console.log(err));
    



  },[])

   

  




  return (
    <div>
      <NavBar username={username} />
      
      <div className="container">
        {data.map((room, index) => (
          <Card
            key={index}
            title={`Room ${room.room_number}`}
            content={`Size: ${room.room_type}  <br> Status:🟢${room.available_status} `}
            roomId={room.room_number} // Pass room_number as a prop to Card
            username={username}
            url={"https://previews.123rf.com/images/rilueda/rilueda1410/rilueda141000244/32842748-modern-lecture-room.jpg"}
             
          />
        ))}
      </div>


      {maintainRooms.length > 0 && (
      <div className="maintain-rooms-container">
      <h3>Rooms Under Maintenance ⚠️</h3>
      </div>
      )}
      

      <div className="maintain-rooms-container2">
      <ul className="maintain-rooms-list">
        {maintainRooms.map((room, index) => (

          
          <li key={index}>
            
            <span className="room">Room:</span>{room.room_number}


            <span className="details"> Details:</span> {room.details}
           
           
           </li>
        ))}
        </ul>
      </div>
    
    <br/><br/><br/><br/><br/><br/><br/><br/>

    </div>
  );
}

export default App;