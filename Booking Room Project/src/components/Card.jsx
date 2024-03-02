// Card.jsx
import { Link } from 'react-router-dom';

const Card = ({ url, title, content, roomId }) => {
  return (
    <div className="card"> 
      <img src={url} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <Link to={`/schedule/${roomId}`} className="btn btn-primary">Go to Schedule</Link>
      </div>
    </div>
  );
}

export default Card;
