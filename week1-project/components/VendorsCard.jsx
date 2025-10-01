const VendorCard = ({ name, img, src, culture }) => {
  const image = img || src;
  return (
    <div className="VendorCard">
      {image && <img src={image} alt={name} />}
      <h5>{name}</h5>
      {culture && <p className="VendorCulture">{culture}</p>}
    </div>
  );
};

export default VendorCard;
