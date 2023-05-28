import React, { useContext } from "react";
import "./UserCard.css";
import { InscribleContext } from "../../Context/Context";

const UserCard = ({ username, address, profilePic }) => {
  const { setMessangerName, setMessangerAddress, readMessage } =
    useContext(InscribleContext);

  return (
    <div className="user-card">
      <div className="user-card-header">
        <img
          src={`https://gateway.pinata.cloud/ipfs/${profilePic.substring(6)}`}
          alt=""
        />
        <div
          className="user-card-info"
          onClick={async () => {
            setMessangerAddress(address);
            setMessangerName(username);
            await readMessage(address);
          }}
        >
          <h5>{username}</h5>
          <small>{address}</small>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
