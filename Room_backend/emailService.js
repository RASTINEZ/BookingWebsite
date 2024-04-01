const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Outlook SMTP server
    port: 587, // Port number for Outlook SMTP (587 for TLS)
    secure: false, // Use TLS (true for 465 port, false for other ports)
    auth: {
        user: 'kuroomservice@hotmail.com', // Your Outlook email address
        pass: 'poggerswebsite1234', // Your Outlook password
    },
});
const formatDateAndTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate} ${formattedTime}`;
};

const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `${formattedDate} ` ;
};

const formatTime = (timeString) => {
  // Assuming the time string is in HH:mm format
  const [hours, minutes] = timeString.split(':');
  const formattedTime = `${parseInt(hours)}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
  return formattedTime;
};



// Function to send booking confirmation email
const sendEmail = (email, username, room_Id, start_Time, end_Time, status, bookingId, detail) => {
  // Example email options
  let emailText = `Hello ${username},\n`;
  
  // Include booking details if status is "rejected"
  // Include booking details if status is "rejected"
  if (status === "rejected") {
    emailText += `Your booking status is: ${status}\n`;
    emailText += `Reason: ${detail}\n`;
    emailText += `for Room ${room_Id} from ${formatDateAndTime(start_Time)} to ${formatDateAndTime(end_Time)}\n`;
    emailText += `(Booking ID: ${bookingId})`;
  } else {
    emailText += `Your booking status is: ${status}\n`;
    emailText += `for Room ${room_Id} from ${formatDateAndTime(start_Time)} to ${formatDateAndTime(end_Time)}\n`;
    emailText += `(Booking ID: ${bookingId})`;
  }
  // Example email options
  const mailOptions = {
    from: '"COM-SCI Room Service @KU" <kuroomservice@hotmail.com>',
    to: email,
    subject: 'Booking Confirmation',
    text: emailText,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // Handle error
    } else {
      console.log('Email sent:', info.response);
      // Email sent successfully
    }
  });
};

const sendEmail2 = (email, username, room_Id, date, start_Time, end_Time, status, bookingId, reason) => {
   // Log start_Time and end_Time
   console.log('start_Time:', start_Time);
   console.log('end_Time:', end_Time);

   let emailText = `Hello ${username},\n`;
   emailText += `Your booking status is: ${status}\n`;
   emailText += `for Room ${room_Id} from ${formatDate(date)}${formatTime(start_Time)} to ${formatDate(date)}${formatTime(end_Time)}\n`;
   emailText += `(Booking ID: ${bookingId}, `;
   emailText += `Booking Reason: ${reason})`;

  // Example email options
  const mailOptions = {
    from: '"COM-SCI Room Service @KU" <kuroomservice@hotmail.com>',
    to: email,
    subject: 'Booking Confirmation',
    text: emailText,
    
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // Handle error
    } else {
      console.log('Email sent:', info.response);
      // Email sent successfully
    }
  });
};


// Function to send an email to the admin
const sendEmailToAdmin = (bookingId, roomId, detail) => {

  let adminEmail = 'tinrunner4869@gmail.com';
  

  const mailOptions = {
      from: '"COM-SCI Room Service @KU" <kuroomservice@hotmail.com>',
      to: adminEmail,
      subject: `Problem reported for booking ID: ${bookingId}, Room : ${roomId}`,
      text: `A problem has been reported for booking ID ${bookingId}, Room ${roomId} with the following details:\n\n${detail}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
};


module.exports = { sendEmail,
   sendEmail2, sendEmailToAdmin };
