import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js library
// Function to generate a random color




const RoomsPieChart = ({ bookings }) => {
    const [chart, setChart] = useState(null);
    const roomColors = {
        '303': '#e34f52',
        '306': '#484CB0', 
        '703': '#00876c',
        '704': '#5BAAEC',
        '709': '#43aa8b',
        '710': '#90be6d',
        '711': '#f9845b',
        '713': '#f9bc60',
        '751': '#fdee6c',
        '803': '#a0d468',
        '809': '#8cc152',
    
        // ... add colors for other rooms
    };

    useEffect(() => {
        let newChart = null; // Initialize to null

        if (chart) {
            // Chart instance exists, destroy it before creating a new one
            chart.destroy(); 
        }

        newChart = renderChart();
        setChart(newChart);

        return () => {
            if (newChart) { 
                newChart.destroy(); // Cleanup on component unmount or re-renders
            }
        };
    }, [bookings]); // Re-render and run the effect when bookings change
    function getRoomColor(roomNumber) {
        return roomColors[roomNumber] || '#ccc'; // Default to gray if not found
    }

    const renderChart = () => {
        const roomData = bookings.reduce((acc, booking) => {
            const { room_number } = booking;
            acc[room_number] = (acc[room_number] || 0) + 1;
            return acc;
        }, {});

        const totalBookings = Object.values(roomData).reduce((total, count) => total + count, 0);

        const formattedRoomData = Object.entries(roomData).map(([roomNumber, count]) => ({
            room_number: roomNumber,
            bookedPercentage: Math.round((count / totalBookings) * 100),
            color: getRoomColor(roomNumber), // This line needs to be modified
        }));
        

        const labels = formattedRoomData.map(room => `Room ${room.room_number}`);
        const data = formattedRoomData.map(room => room.bookedPercentage);
        const backgroundColors = formattedRoomData.map(room => room.color);

        const chartData = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors,
            }],
        };

        return new Chart(document.getElementById("myPieChart"), {
            type: "pie",
            data: chartData,
            options: {
                plugins: {
                    legend: {
                        labels: {
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const meta = chart.getDatasetMeta(0);
                                        const ds = data.datasets[0];
                                        const arc = meta.data[i];
                                        const custom = arc && arc.custom || {};
                                        const room = formattedRoomData[i];
                                        const value = ds.data[i];
                                        const percentage = Math.round((value / ds.data.reduce((acc, val) => acc + val, 0)) * 100);
                                        return {
                                            text: `${label}: ${percentage}%`,
                                            fillStyle: room.color, // Fallback to a random color 
                                            hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    }
                }
            }
        });
    };

    return <canvas id="myPieChart" />;
};

export default RoomsPieChart;