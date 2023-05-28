import React, { useContext, useEffect, useState } from "react";
import "./Message.css";
import { InscribleContext } from "../../Context/Context";
import { useNavigate } from "react-router";
import { Navbar, UserCard, Loader } from "../../Components/Index";
import { toast } from "react-toastify";

const Message = () => {
  const {
    isLoading,
    userList,
    getAllAppUser,
    getSignInState,
    ConnectWallet,
    contract,
    connectedAccount,
    currentUsername,
    messangerName,
    messangerAddress,
    SendMessage,
    readMessage,
    friendMsg,
    GetUserName,
    currentUserProfile,
  } = useContext(InscribleContext);

  const [postUserPic, setPostUserPic] = useState("");

  const navigate = useNavigate();

  const [messageInput, setMessageInput] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const state = getSignInState();
    if (!state) {
      navigate("/");
    } else {
      const fetchdata = async () => {
        await getAllAppUser();
        await GetUserName(connectedAccount);
      };
      fetchdata();
    }
  }, [contract]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        await ConnectWallet();
        await getAllAppUser();
        await GetUserName(connectedAccount);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const profilePic = await contract.getProfilePic(messangerAddress);
        setPostUserPic(profilePic);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfilePic();
  }, []);

  const handleMessage = (e) => {
    const value = e.target.value;
    setMessageInput(value);
  };

  return (
    <>
      <Navbar />
      <div className="msg-user-div">
        <div className="msg-user-search">
          <span>Message</span>
          <div className="msg-search-input">
            <span className="material-symbols-outlined">search</span>
            <input
              className="msg-search-bar"
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value.toLowerCase())}
            />
          </div>
        </div>

        <hr />

        {userList
          .filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
          )
          .filter(
            (user) =>
              user.accountAddress.toLowerCase() !==
              connectedAccount.toLowerCase()
          )
          .map((item, i) => {
            return (
              <UserCard
                username={item.username}
                address={item.accountAddress}
                key={i}
                profilePic={item.profilePic}
              />
            );
          })}
      </div>

      {messangerName !== "" && messangerAddress !== "" && (
        <div className="msg-chat-div">
          <div className="msg-chat-header">
            <div className="user-card-header">
              <img
                src={`https://gateway.pinata.cloud/ipfs/${postUserPic.substring(
                  6
                )}`}
                alt=""
              />
              <div className="user-card-info">
                <h5>{messangerName}</h5>
                <small>{messangerAddress}</small>
              </div>
            </div>
          </div>
          <hr />
          <div className="msg-chat-container">
            <div className="chat">
              {friendMsg.map((msg) => {
                return (
                  <div
                    className={
                      msg.sender === messangerAddress
                        ? "friend-message"
                        : "user-message"
                    }
                  >
                    <div
                      className={
                        msg.sender === messangerAddress
                          ? "user-data"
                          : "user-data r-img"
                      }
                    >
                      {msg.sender === messangerAddress ? (
                        <>
                          <img
                            src={`https://gateway.pinata.cloud/ipfs/${postUserPic.substring(
                              6
                            )}`}
                            alt=""
                            className="chat-img"
                          />
                          <div className="info">
                            <span>{messangerName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={`https://gateway.pinata.cloud/ipfs/${currentUserProfile.substring(
                              6
                            )}`}
                            alt=""
                            className="chat-img"
                          />
                          {console.log(
                            "messssageeeeeeeeeeeeee" + currentUserProfile
                          )}
                          <div className="info">
                            <span>{currentUsername}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="message-data">{msg.msg}</p>
                  </div>
                );
              })}
            </div>

            <div className="chat-input-div">
              <input
                type="text"
                placeholder="Type your message..."
                className="chat-input"
                onChange={handleMessage}
                value={messageInput}
              />
              {isLoading ? (
                <Loader />
              ) : (
                <span
                  class="material-symbols-outlined"
                  onClick={async () => {
                    await SendMessage(messageInput, messangerAddress);
                    await readMessage(messangerAddress);
                    setMessageInput("");
                  }}
                >
                  send
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
