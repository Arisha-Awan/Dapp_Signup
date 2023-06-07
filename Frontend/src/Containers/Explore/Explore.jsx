import React, { useContext, useEffect, useState } from "react";
import { PostCard, Navbar, Loader } from "../../Components/Index";
import { InscribleContext } from "../../Context/Context";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import './Explore.css';

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
  const [data, setData] = useState(null);

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
            <div className="grid">
              {allPosts.map((item, i) => {
                return (
                  <div className="cell" onClick={() => setData(item)} key={i}>
                    <img src={`https://gateway.pinata.cloud/ipfs/${item.imageHash.substring(
                      6
                    )}`} alt="" />
                  </div>
                );
              })}
            </div>
          ) : (
            noPostMsg()
          )}
        </>
      ) : (
        backToSignIn()
      )
      }

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
            />
          </div>
        )
      }
    </>
  );
};

export default Explore;
