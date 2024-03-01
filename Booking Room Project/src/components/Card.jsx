
// Card.jsx



const Card = ({ url, title, content }) => {
  return (
    <div className="card"> 
      <img src={url} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <a href="#" className="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  );
}

export default Card;

