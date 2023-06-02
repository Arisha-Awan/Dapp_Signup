import React, { useContext, useEffect, useState } from "react";
import { PostCard, Navbar, Loader } from "../../Components/Index";
import { InscribleContext } from "../../Context/Context";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Explore = () => {
  const navigate = useNavigate();
  const {
    GetPostByUser,
    isLoading,
    singleUserPost,
    connectedAccount,
    getSignInState,
    ConnectWallet,
    contract,
    GetUserName,
    GetAllPosts,
    allPosts,
  } = useContext(InscribleContext);

  const notify = (msg) => toast.error(msg);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    const state = getSignInState();
    setIsSigned(state);

    const fetchdata = async () => {
      await ConnectWallet();
      await GetAllPosts();
      await GetUserName(connectedAccount);
    };

    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      await GetAllPosts();
      await GetUserName(connectedAccount);
    };

    fetchdata();
  }, [connectedAccount, contract]);

  const backToSignIn = () => {
    if (!isSigned) {
      navigate("/");
    }
  };

  const noPostMsg = () => {
    notify("No Posts Created Yet !");
  };

  return (
    <>
      {isSigned ? (
        <>
          <Navbar />
          {isLoading ? (
            <Loader />
          ) : allPosts.length > 0 ? (
            allPosts.map((item, i) => {
              {
                console.log(allPosts);
              }
              return (
                <PostCard
                  username={item.createrName}
                  address={item.userAddress}
                  file={item.imageHash}
                  caption={item.caption}
                  imageText={item.imageText}
                  likeCount={item.likeCount}
                  postId={item.id.toNumber()}
                  key={i}
                  tipAmount={item.tipAmount}
                  {...console.log(
                    "tttttttttt" + typeof item.likeCount.toNumber()
                  )}
                />
              );
            })
          ) : (
            noPostMsg()
          )}
        </>
      ) : (
        backToSignIn()
      )}
    </>
  );
};

export default Explore;
