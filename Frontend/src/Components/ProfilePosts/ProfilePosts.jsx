import React, { useState, useContext } from "react";
import "./ProfilePosts.css";
import { PostCard } from "../Index";
import { InscribleContext } from "../../Context/Context";

const ProfilePosts = () => {
  const { myProfilePosts, currentUserProfile } = useContext(InscribleContext);

  const [isUserPosts, setIsUserPosts] = useState(true);
  const [isSavedPosts, setIsSavedPosts] = useState(false);
  const [data, setData] = useState(null);

  return (
    <>
      <div className="post-type-selection">
        <div
          className={
            isUserPosts ? "post-type-selector active" : "post-type-selector"
          }
          onClick={() => {
            setIsSavedPosts(false);
            setIsUserPosts(true);
          }}
        >
          <span class="material-symbols-outlined">grid_on</span>
          <span className="selector-text">Posts</span>
        </div>
        <div
          className={
            isSavedPosts ? "post-type-selector active" : "post-type-selector"
          }
          onClick={() => {
            setIsSavedPosts(true);
            setIsUserPosts(false);
          }}
        >
          <span class="material-symbols-outlined">grid_on</span>
          <span className="selector-text">Saved</span>
        </div>
      </div>
      <div className="profile-grid">
        {isUserPosts &&
          myProfilePosts.map((item, i) => {
            return (
              <div className="cell" onClick={() => setData(item)} key={i}>
                <img src={`https://gateway.pinata.cloud/ipfs/${item.imageHash.substring(
                  6
                )}`} alt="" />
              </div>
            );
          })}
      </div>

      {
        data && (
          <div className="post-con">
            <span
              className="material-symbols-outlined close"
              onClick={() => {
                setData(null)
              }}
            >
              close
            </span>
            <PostCard
              username={data.createrName}
              address={data.userAddress}
              file={data.imageHash}
              caption={data.caption}
              imageText={data.imageText}
              likeCount={data.likeCount}
              postId={data.id.toNumber()}
              tipAmount={data.tipAmount}
              currentUserProfile={currentUserProfile}
            />
          </div>
        )
      }
    </>
  );
};

export default ProfilePosts;
