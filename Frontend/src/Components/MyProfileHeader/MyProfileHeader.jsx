import React, { useState, useEffect, useContext } from "react";
import "./MyProfileHeader.css";
import { ProfilePosts, MyProfileUserCard } from "../Index";
import { InscribleContext } from "../../Context/Context";
import { useNavigate } from "react-router";

const MyProfileHeader = ({}) => {
  const [isPost, setIsPost] = useState(true);
  const [isFollower, setIsFollower] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerListing, setfollowerListing] = useState([]);
  const [followingList, setfollowingList] = useState([]);
  const {
    connectedAccount,
    contract,
    getMyProfilePost,
    myProfilePosts,
    currentUsername,
    GetUserName,
    currentUserProfile,
    signInState
  } = useContext(InscribleContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!contract) {
      return; // Return early if contract is not set
    }
    GetUserName(connectedAccount);
    getFollowersList();
    getMyFollowingsList();
    getMyProfilePost(connectedAccount);
  }, [contract]);

  // const { username, address } = useParams();
  const getFollowersList = async () => {
    const followerListing = await contract.getMyFollowersList(connectedAccount);
    setfollowerListing(followerListing);
  };

  const getMyFollowingsList = async () => {
    const followingList = await contract.getMyFollowingsList(connectedAccount);
    setfollowingList(followingList);
  };

  return (
    <>
      <div className="profile-header">
        <div className="profile-header_image">
          <img
            src={`https://gateway.pinata.cloud/ipfs/${currentUserProfile.substring(
              6
            )}`}
            alt="Pofile"
          />
        </div>
        <div className="profile-header_content">
          <div className="profile-header_content-name-edit">
            <p id="profile-name" className="bold-5 size-l">
              {currentUsername}
            </p>
            <button className="logout" onClick={()=>{
              signInState(false);
              navigate('/');
            }}>Log Out</button>
          </div>
          <div className="profile-header_content-info">
            <div>
              <span className="bold-5">{myProfilePosts.length}</span>
              <span
                className={isPost ? "bold-7" : ""}
                onClick={() => {
                  setIsFollower(false);
                  setIsFollowing(false);
                  setIsPost(true);
                }}
              >
                {" "}
                Posts
              </span>
            </div>
            <div>
              <span className="bold-5">{followerListing.length}</span>
              <span
                className={isFollower ? "bold-7" : ""}
                onClick={() => {
                  setIsFollower(true);
                  setIsFollowing(false);
                  setIsPost(false);
                  getFollowersList();
                }}
              >
                {" "}
                Followers
              </span>
            </div>
            <div>
              <span className="bold-5">{followingList.length}</span>
              <span
                className={isFollowing ? "bold-7" : ""}
                onClick={() => {
                  setIsFollower(false);
                  setIsFollowing(true);
                  setIsPost(false);
                  getMyFollowingsList();
                }}
              >
                {" "}
                Following
              </span>
            </div>
          </div>
        </div>
      </div>

      {isPost && <ProfilePosts />}

      {isFollower && (
        <div className="profile-usercard-container">
          <div className="profile-usercard-header">
            <h3>Followers</h3>
          </div>
          <div className="profile-usercard-body">
            {followerListing.map((item, i) => {
              return (
                <MyProfileUserCard
                  userName={item.name}
                  profilePic={item.pic}
                  address={item.pubkey}
                  key={i}
                  followingBtn={isFollowing}
                  getFollowersList={getFollowersList}
                  getMyFollowingsList={getMyFollowingsList}
                />
              );
            })}
          </div>
        </div>
      )}

      {isFollowing && (
        <div className="profile-usercard-container">
          <div className="profile-usercard-header">
            <h3>Following</h3>
          </div>
          <div className="profile-usercard-body">
            {followingList.map((item, i) => {
              return (
                <MyProfileUserCard
                  userName={item.name}
                  profilePic={item.pic}
                  address={item.pubkey}
                  key={i}
                  followingBtn={isFollowing}
                  getFollowersList={getFollowersList}
                  getMyFollowingsList={getMyFollowingsList}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfileHeader;
