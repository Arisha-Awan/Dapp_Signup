import { useNavigate } from "react-router";
import "./PostCard.css";
import { ethers } from "ethers";
import { InscribleContext } from "../../Context/Context";
import React, { useState, useEffect, useContext } from "react";

const PostCard = ({
  username,
  address,
  file,
  caption,
  imageText,
  likeCount,
  postId,
  tipAmount,
}) => {
  const { connectedAccount, contract } = useContext(InscribleContext);
  const navigate = useNavigate();
  const [postUserPic, setPostUserPic] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const [tipAmountState, setTipAmountState] = useState(0);
  const [likeCountState, setLikeCountState] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profilePic = await contract.getProfilePic(address);
        setPostUserPic(profilePic);

        const isLikeByUser = await contract.LikedByExists(postId);
        setIsLiked(isLikeByUser);

        if (connectedAccount.toLowerCase() === address.toLowerCase()) {
          setButtonDisabled(true);
        } else {
          setButtonDisabled(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    setTipAmountState(parseInt(tipAmount._hex, 16) / 10 ** 18);
    setLikeCountState(likeCount.toNumber());
    console.log("callledddddddd", username, address, file, caption, imageText, likeCount, postId, tipAmount);
  }, [connectedAccount, contract]);

  const handleClick = () => {
    navigate(
      `/profile/${address}/${username}/${encodeURIComponent(postUserPic)}`
    );
  };

  const tip = async (post_id) => {
    // tip post owner

    await (
      await contract.tipPostOwner(post_id, {
        value: ethers.utils.parseEther("0.00001"),
      })
    ).wait();

    const tipAmount = await contract.getTipAmountByPostId(post_id);
    // console.log("Data:", parseInt(tipAmount._hex, 16) / 10 ** 18);
    setTipAmountState(parseInt(tipAmount._hex, 16) / 10 ** 18);
  };

  const Handlelike = async (postId) => {
    try {
      if (isLiked) {
        await contract.LikePostDecrement(postId);
        setLikeCountState((prevState) => prevState - 1);
        setIsLiked(false);
      } else {
        await contract.LikePostIncrement(postId);
        setLikeCountState((prevState) => prevState + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-image">
          {postUserPic && (
            <img
              src={`https://gateway.pinata.cloud/ipfs/${postUserPic.substring(
                6
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
          onClick={() => Handlelike(postId)}
        >
          <path
            d="m 10 5 a 1 1 0 0 0 -8 5 l 8 9 l 8 -9 a -1 -1 0 0 0 -8 -5"
            fill={isLiked ? "red" : "white"}
            stroke={isLiked ? "red" : "black"}
            id="heart"
          ></path>
        </svg>

        <button
          className="card-content-tip"
          onClick={() => {
            tip(postId);
          }}
          disabled={isButtonDisabled}
        >
          Tip 0.1eth
        </button>
        <small className="tip">{tipAmountState}</small>
        <p>{likeCountState}</p>
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
