import { useNavigate } from "react-router";
import "./PostCard.css";
import { InscribleContext } from "../../Context/Context";
import React, { useState, useEffect, useContext } from "react";

const PostCard = ({
  username,
  address,
  file,
  caption,
  imageText,
  likeCount,
  currentUserProfile,
}) => {
  const { GetProfilePic, contract } = useContext(InscribleContext);
  const navigate = useNavigate();
  const [postUserPic, setPostUserPic] = useState("");

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const profilePic = await contract.getProfilePic(address);
        setPostUserPic(profilePic);
      } catch (error) {
        console.log(error);
      }
    };
    console.log("Useeffffffftttt");
    fetchProfilePic();
  }, []);



  const handleClick = () => {
    navigate(
      `/profile/${address}/${username}/${encodeURIComponent(postUserPic)}`
    );
  };

  const handleLike = (e) => {
    const state = document.getElementById("heart").getAttribute("fill");
    if (state === "white") {
      document.getElementById("heart").setAttribute("fill", "red");
      document.getElementById("heart").setAttribute("stroke", "red");
    } else {
      document.getElementById("heart").setAttribute("fill", "white");
      document.getElementById("heart").setAttribute("stroke", "black");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-image">
          {postUserPic && (
            <img
              src={`https://gateway.pinata.cloud/ipfs/${postUserPic.substring(
                7
              )}`}
              alt="Profile"
            />
          )}
        </div>
        <h5 onClick={handleClick} className="cursor">
          {username}
        </h5>
        <div className="card-header-address">
          <small>{address}</small>
        </div>
      </div>

      <div className="card-image">
        <img
          src={`https://gateway.pinata.cloud/ipfs/${file.substring(6)}`}
          alt="image"
        />
        <div className="card-image-text">
          <p>{imageText}</p>
        </div>
      </div>

      <div className="card-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          className="heart"
          viewBox="0 0 20 20"
          onClick={handleLike}
        >
          <path
            d="m 10 5 a 1 1 0 0 0 -8 5 l 8 9 l 8 -9 a -1 -1 0 0 0 -8 -5"
            fill="white"
            stroke="black"
            id="heart"
          ></path>
        </svg>
        <button className="card-content-tip">Tip 0.1eth</button>
        <p>{likeCount}</p>
        <h5 onClick={handleClick} className="cursor">
          {username}
        </h5>
        <p>{caption}</p>
      </div>

      <div className="card-comment">
        <span className="material-symbols-outlined">sentiment_satisfied</span>
        <input type="text" placeholder="Add a comment" />
        <button className="comment">Post</button>
      </div>
    </div>
  );
};

export default PostCard;
