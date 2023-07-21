import React from "react";

type PhotoProps = {
  photo: string | null ;
};

const Photo: React.FC<PhotoProps> = ({ photo }) => {
  if (!photo) {
    return null;
  }
  return (
    <div>
      <img src={photo} />
    </div>
  );
};

export default Photo;
