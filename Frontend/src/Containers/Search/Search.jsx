import React, { useContext, useEffect, useState } from "react";
import { InscribleContext } from "../../Context/Context";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import { Navbar, Loader, SearchCard } from "../../Components/Index";
import "./Search.css";

const Search = () => {
  const navigate = useNavigate();
  const {
    GetPostByUser,
    isLoading,
    singleUserPost,
    connectedAccount,
    getSignInState,
    ConnectWallet,
    contract,
    userList,
    getAllAppUser,
    currentUserProfile,
  } = useContext(InscribleContext);

  const notify = (msg) => toast.error(msg);
  const [isSigned, setIsSigned] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    console.log("From Search");
    const state = getSignInState();
    setIsSigned(state);

    const fetchdata = async () => {
      await ConnectWallet();
      await getAllAppUser();
    };

    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      await getAllAppUser();
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
          <div className="search-main-container">
            <div className="search-input-container">
              <span>Search</span>
              <div className="search-bar-container">
                <span className="material-symbols-outlined">search</span>
                <input
                  className="search-bar"
                  placeholder="Search..."
                  onChange={(e) => setQuery(e.target.value.toLowerCase())}
                />
              </div>
            </div>
            <hr className="search-border" />
            {isLoading ? (
              <Loader />
            ) : userList.length > 0 ? (
              <>
                {userList
                  .filter((user) =>
                    user.username.toLowerCase().includes(query.toLowerCase())
                  )
                  .filter(
                    (user) =>
                      user.accountAddress.toLowerCase() !==
                      connectedAccount.toLowerCase()
                  )
                  .map((item) => (
                    <SearchCard
                      username={item.username}
                      address={item.accountAddress}
                      key={item.id}
                      filteruser={item.username}
                      filterUserAdress={item.address}
                      profilePic={item.profilePic}
                      {...console.log(item.profilePic)}
                    />
                  ))}
              </>
            ) : (
              noPostMsg()
            )}
          </div>
        </>
      ) : (
        backToSignIn()
      )}
    </>
  );
};

export default Search;
