import React, { useState, useContext, useEffect } from "react";
import "./MyProfileUserCard.css";
import { UnFollowModal } from "../Index";
import { RemoveFollowerModal } from "../Index";
import { useNavigate } from "react-router-dom";
import { InscribleContext } from "../../Context/Context";
const MyProfileUserCard = ({
  userName,
  address,
  followingBtn,
  getFollowersList,
  getMyFollowingsList,
}) => {
  const { removeFriends, removeFollower, contract } =
    useContext(InscribleContext);
  const [profilePic, setProfilePic] = useState("");

  const navigate = useNavigate();
  const [isUnFollowModalOpen, setIsUnFollowModalOpen] = useState(false);
  const [isFollowerRemoveModalOpen, setIsFollowerRemoveModalOpen] =
    useState(false);

  const handleClick = () => {
    navigate(
      `/profile/${address}/${userName}/${encodeURIComponent(profilePic)}`
    );
  };
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const profilePic = await contract.getProfilePic(address);
        setProfilePic(profilePic);
        console.log("UserCard", profilePic);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfilePic();
  }, [address]);

  const btnHandler = () => {
    if (followingBtn) {
      setIsUnFollowModalOpen(true);
    } else {
      setIsFollowerRemoveModalOpen(true);
    }
  };
  const handleUnfollow = async () => {
    // Perform unfollow action here
    console.log("Unfollowedddddddddddddddddddddddd");
    console.log(address);
    await removeFriends({ accountAddress: address });

    // Close the modal
    setIsUnFollowModalOpen(false);
    //update useStates of following listing
    getMyFollowingsList();
  };

  ///reomve Follwer
  const handleFollowerRemove = async () => {
    // Perform unfollow action here
    console.log("Unfollowedddddddddddddddddddddddd");
    // console.log(address);
    await removeFollower({ accountAddress: address });
    // Close the modal
    setIsFollowerRemoveModalOpen(false);
    // /update useStates of follower listing
    await getFollowersList();
  };

  return (
    <>
      <div className="profile-usercard">
        <div className="profiel-usercard-main-info">
          <img
            src={`https://gateway.pinata.cloud/ipfs/${profilePic.substring(6)}`}
            alt="Profile"
            className="profile-usercard-pic"
          />
          <span className="profile-usercard-name" onClick={handleClick}>
            {userName}
          </span>
          <button className="profile-remove-follower" onClick={btnHandler}>
            {followingBtn ? "Following" : "Remove"}
          </button>
        </div>
        <small className="profile-usercard-address">{address}</small>
      </div>
      <UnFollowModal
        isOpen={isUnFollowModalOpen}
        onClose={() => setIsUnFollowModalOpen(false)}
        followingName={userName}
        onUnfollow={handleUnfollow}
      />

      <RemoveFollowerModal
        isOpen={isFollowerRemoveModalOpen}
        onClose={() => setIsFollowerRemoveModalOpen(false)}
        onRemove={handleFollowerRemove}
        Followername={userName}
      />
    </>
  );
};

export default MyProfileUserCard;
