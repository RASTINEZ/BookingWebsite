// Card.jsx
import { Link } from 'react-router-dom';

const Card = ({ url, title, content, roomId, username  }) => {
  return (
    <div className="card"> 
      <img src={url} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {username ? (
          <Link to={`/schedule/${roomId}`} className="btn btn-primary">Go to Schedule</Link> //<Link to={`/schedule/${roomId}`} className="btn btn-primary">Go to Schedule</Link>
        ) : (
          <Link to="/login" className="btn btn-primary">Login to view schedule</Link>
        )}
      </div>
    </div>
  );
}

export default Card;
