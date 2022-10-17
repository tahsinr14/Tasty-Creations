import React from "react";

const ItemComponent = (props) => {
    const {title, image, Description} = props
  return (
    <div>
      
        <div className="card">
          <div className="Name_Image">
            <li>Name: {title}</li>
            <img src={image} alt="Yummy food" />
            Rating:...
          </div>
          <div className="Description">
            Description:
            <br />
            <li>{Description}</li>
          </div>
        </div>
      
      <hr />
    </div>
  );
};

export default ItemComponent;
