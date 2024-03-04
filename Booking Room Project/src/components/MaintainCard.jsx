// Card.jsx
import { Link } from 'react-router-dom';

const MaintainCard = ({ url, title, content, roomId}) => {
  return (
    <div className="card"> 
      <img src={url} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        
      </div>
    </div>
  );
}

export default MaintainCard;
