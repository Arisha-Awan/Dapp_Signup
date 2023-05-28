import React, { useState, useContext } from "react";
import "./ProfilePosts.css";
import { PostCard } from "../Index";
import { InscribleContext } from "../../Context/Context";

const ProfilePosts = () => {
  const { myProfilePosts, currentUserProfile } = useContext(InscribleContext);

  const [isUserPosts, setIsUserPosts] = useState(true);
  const [isSavedPosts, setIsSavedPosts] = useState(false);

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
      {isUserPosts &&
        myProfilePosts.map((item) => {
          return (
            <PostCard
              username={item.createrName}
              address={item.userAddress}
              file={item.imageHash}
              caption={item.caption}
              imageText={item.imageText}
              likeCount={item.likeCount._hex}
              key={item.id}
              currentUserProfile={currentUserProfile}
            />
          );
        })}

      
    </>
  );
};

export default ProfilePosts;
