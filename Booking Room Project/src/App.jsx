// App.jsx

import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import NavBar from './components/NavBar';
import './App.css'; // Import CSS file for styling

export const App = () => {
  const [data, setData] = useState([])
  const [username, setUsername] = useState(null);
  useEffect(() => {
    fetch('http://localhost:8081/rooms')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));

    const storedUsername = localStorage.getItem('username'); 
    setUsername(storedUsername); 



  },[])
  




  return (
    <div>
      <NavBar username={username} />
      <div className="container">
        {data.map((room, index) => (
          <Card
            key={index}
            title={`Room ${room.room_number}`}
            content={`Details :  Size: ${room.room_type}  <br> Status: ${room.available_status}`}
            roomId={room.room_number} // Pass room_number as a prop to Card
          />
        ))}
      </div>
    </div>
  );
}

export default App;