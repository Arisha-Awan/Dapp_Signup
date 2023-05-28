import React from "react";
import { useNavigate } from "react-router-dom";
import "./SearchCard.css";

const SearchCard = ({
  username,
  address,
  file,
  caption,
  imageText,
  likeCount,
  query,
  filteruser,
  filterUserAdress,
  profilePic,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/profile/${address}/${username}/${encodeURIComponent(profilePic)}`
    );
  };

  return (
    <div className="search-card">
      <div className="search-card-header" onClick={handleClick}>
        {profilePic && (
          <img
            src={`https://gateway.pinata.cloud/ipfs/${profilePic.substring(6)}`}
            alt="Profile"
          />
        )}
        {console.log(profilePic)}

        <div className="search-card-info">
          <h5>{username}</h5>
          <small>{address}</small>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
