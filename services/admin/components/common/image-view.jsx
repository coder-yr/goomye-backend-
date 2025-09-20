import React from "react";

const AvatarList = (props) => {
  const { record } = props;
  const imageUrl = record.params.image;

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="image"
      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
    />
  ) : (
    <span>No Avatar</span>
  );
};

export default AvatarList;
