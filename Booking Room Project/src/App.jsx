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

  const [filterOption, setFilterOption] = useState('All'); // Default filter option
  const [roomFilter, setRoomFilter] = useState(''); // Default room filter value
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [buildingFilter, setBuildingFilter] = useState('All'); // State variable for building filter
  const [floorFilter, setFloorFilter] = useState("");








  useEffect(() => {
    fetchRooms();
    

    const storedUsername = localStorage.getItem('username'); 
    
    setUsername(storedUsername); 

     // Fetch rooms in 'maintain' status
     fetch('http://localhost:8081/maintain')
     .then(res => res.json())
     .then(data => setMaintainRooms(data))
     .catch(err => console.log(err));
    



  },[])

  useEffect(() => {
    filterHistory();
  }, [data, filterOption, roomFilter, floorFilter]);


  useEffect(() => {
    fetchRooms();
  }, [buildingFilter]);

  const fetchRooms = () => {
    fetch(`http://localhost:8081/rooms?building=${buildingFilter}`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  };

  const handleBuildingChange = (e) => {
    setBuildingFilter(e.target.value);
  };
  const handleFloorChange = (e) => {
    setFloorFilter(e.target.value);
  };


  const filterHistory = () => {
    let filtered = data;
  
    
  
    if (roomFilter !== '') {
      // Convert room_id to string and then apply toLowerCase()
      const roomFilterLower = roomFilter.toLowerCase();
      filtered = filtered.filter(room => `${room.room_number}`.toLowerCase().includes(roomFilterLower));
    }
    if (buildingFilter === "SC45" && floorFilter !== "") {
      // Filter rooms based on floorFilter value (7 or 8) only when buildingFilter is SC45
      filtered = filtered.filter((room) =>
        room.room_number.startsWith(floorFilter)
      );
    }
  
    setFilteredHistory(filtered);
  };

   

  




  return (
    <div>
      <NavBar username={username} />
      {/* Building filter dropdown */}
      <div
        style={{
          margin: "30px auto",
          width: "80%",
          display: "flex",
          textAlign: "right",
          justifyContent: "flex-end",
          marginRight: "200px",
          paddingBottom: "1px",
          paddingRight: "100px",
        }}
      >
        <label htmlFor="filterBuilding" style={{ color: "black" }}>
          Filter by Building:
        </label>
        <select
          id="filterBuilding"
          value={buildingFilter}
          onChange={handleBuildingChange}
        >
          <option value="All">All</option>
          <option value="SC45">SC45</option>
          <option value="SCL">SCL</option>
        </select>
      </div>

      {/* Filter search bar */}
      <div
        style={{
          margin: "30px auto",
          width: "80%",
          display: "flex",
          textAlign: "right",
          justifyContent: "flex-end",
          marginRight: "100px",
        }}
      >
        {/* Filter by Floor */}
        {buildingFilter === "SC45" && (
          <div style={{
            margin: "30px auto",
            width: "80%",
            display: "flex",
            textAlign: "right",
            justifyContent: "flex-end",
            marginLeft: "700px",
          }}>
            <label htmlFor="filterFloor" style={{ color: "black" }}>
              Filter by Floor: &nbsp;
            </label>
            <select
              id="filterFloor"
              value={floorFilter}
              onChange={handleFloorChange}
            >
              <option value="">All</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
        )}

        {/* Filter by Room */}
        <div style={{
          margin: "30px auto",
          width: "80%",
          display: "flex",
          textAlign: "right",
          justifyContent: "flex-end",
          marginLeft: "10px",
          marginRight: "190px",
        }}>
          <label htmlFor="filterRoom" style={{ color: "black" }}>
            Filter by Room:&nbsp;&nbsp;
          </label>
          <input
            type="text"
            id="filterRoom"
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="container">
        {filteredHistory.map((room, index) => (
          <Card
            key={index}
            title={`Room ${room.room_number}`}
            content={`Building: ${room.building} <br> Type: ${room.room_type}  <br> Status:🟢${room.available_status} `}
            roomId={room.room_number} // Pass room_number as a prop to Card
            username={username}
            url={
              room.room_type === "Meeting Room"
                ? "https://cdn.shopify.com/s/files/1/0605/0136/0804/files/Modern_meeting_room_with_advanced_technology.jpg?v=1703751846" // Replace with actual auditorium image URL
                : room.room_type === "Big(100 seats)"
                ? "https://media.licdn.com/dms/image/C4E12AQF5Rrnjk24OzQ/article-cover_image-shrink_720_1280/0/1579964780563?e=2147483647&v=beta&t=iEt5jbkYuJvxyC0yp8NJmDqTqgI8wXZB4eG4ZZ5xYxc" // Replace with actual big room image URL
                : "https://previews.123rf.com/images/rilueda/rilueda1410/rilueda141000244/32842748-modern-lecture-room.jpg" // Default image URL
            }
          />
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}></div>

      {maintainRooms.length > 0 && (
        <div className="maintain-rooms-container">
          <h3>Rooms Under Maintenance ⚠️</h3>
        </div>
      )}

      <div className="maintain-rooms-container2">
        <ul className="maintain-rooms-list">
          {maintainRooms.map((room, index) => (
            <li key={index}>
              <span className="room">Room:</span>
              {room.room_number}({room.building})
              <span className="details"> Details:</span> {room.details}
            </li>
          ))}
        </ul>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default App;