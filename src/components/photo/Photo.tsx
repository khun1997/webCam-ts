import React from "react";
import "./style.css";

type PhotoProps = {
  photo: string | null;
};

const Photo: React.FC<PhotoProps> = ({ photo }) => {
  if (!photo) {
    return null;
  }
  return (
    <div>
      <img src={photo} style={{width:'100%',height:'100%'}}  />
    </div>
  );
};

export default Photo;
