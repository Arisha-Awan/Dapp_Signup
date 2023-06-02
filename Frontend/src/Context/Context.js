import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { contractABI, contractAddress } from "./Constants";

//CREATING CONTEXT
export const InscribleContext = React.createContext();

const FetchContract = (signerProvider) =>
  new ethers.Contract(contractAddress, contractABI, signerProvider);

//FUNCTION TO CREATE CONTRACT
const CreateContract = async () => {
  try {
    //CREATING A ETHEREUM PROVIDER AND GETTING THE SIGNER
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    //SENDING THE SIGNER TO FetchContract FUNCTION TO GET THE SMART CONTRACT
    const contract = FetchContract(signer);

    return contract;
  } catch (error) {
    console.log(error);
  }
};

//CREATING CONTEXT PROVIDER
export const InscribleProvider = ({ children }) => {
  const [isMetamask, setIsMetamask] = useState(true);
  const [connectedAccount, setConnectedAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [isSignedin, setIsSignedin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserProfile, setCurrentUserProfile] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [singleUserPost, setSingleUserPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserLists] = useState([]);
  const [friendLists, setFriendLists] = useState([]);
  const [messangerName, setMessangerName] = useState("");
  const [messangerAddress, setMessangerAddress] = useState("");
  const [friendMsg, setFriendMsg] = useState([]);
  const [myProfilePosts, setmyProfilePosts] = useState([]);
  const [followerLists, setfollowerLists] = useState([]);
  const [followingLists, setfollowingLists] = useState([]);
  const [error, setError] = useState("");
  const [postUserPic, setPostUserPic] = useState("");

  //FUNCTION TO GET THE CONNECTED ACCOUNT
  const ConnectWallet = async () => {
    try {
      if (!window.ethereum) return setIsMetamask(false);

      window.ethereum.on("chainChanged", () => {
        signInState(false);
        window.location.reload(true);
      });
      window.ethereum.on("accountsChanged", () => {
        signInState(false);
        console.log("in wallet...........");
        window.location.reload(true);
      });

      //GETTING ACCOUTNS ARRAY FROM ETHEREUM/METAMASK
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      //GETTING FIRST ACCOUNT FROM ACCOUNTS ARRAY
      const firstAccount = accounts[0];
      setConnectedAccount(firstAccount);
      const _contract = await CreateContract();
      setContract(_contract);
      setCurrentUsername(firstAccount.username);
    } catch (error) {
      console.log(error);
    }
  };

  //ADD YOUR FRIENDS
  const addFriends = async ({ name, accountAddress }) => {
    try {
      // const contract = await ConnectWallet();
      const addMyFriend = await contract.addFriend(accountAddress);
      await addMyFriend.wait();
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //FRIEND VALIDATION
  const checkAlreadyFriend = async ({
    connectedAccountAddress,
    accountAddress,
  }) => {
    try {
      const checkFriend = await contract.checkAlreadyFriends(
        connectedAccountAddress,
        accountAddress
      );
      return checkFriend;
    } catch (error) {
      console.log(error);
      setError("Something went wrong while adding friends, try again");
      return false;
    }
  };

  //REMOVE FRIENDS
  const removeFriends = async ({ name, accountAddress }) => {
    try {
      // const contract = await ConnectWallet();
      const removeMyFriend = await contract.removeFriend(accountAddress);
      await removeMyFriend.wait();
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //REMOVE FOLLOWER
  const removeFollower = async ({ accountAddress }) => {
    try {
      const removeMyFriendFollower = await contract.removeFollower(
        accountAddress
      );
      await removeMyFriendFollower.wait();
    } catch (error) {
      console.log(error);
      setError("Something went wrong while adding friends, try again");
    }
  };

  //TO REGISTER USER
  const RegisterUser = async (username, img) => {
    const createdUser = await contract.createAccount(username, img);
    await createdUser.wait();
  };

  //VALIDATE USER REGISTERATION
  const CheckIfUserIsRegistered = async (account) => {
    const isUser = await contract.checkUser(account);
    if (isUser) {
      return true;
    } else {
      return false;
    }
  };

  //TO SET THE SIGN IN STATUS OF A USER
  const signInState = (state) => {
    setIsSignedin(state);

    localStorage.setItem("isSignedIn", JSON.stringify(state));
  };

  //TO GET ALL USERS REGISTERED IN APP
  const getAllAppUser = async () => {
    console.log("GetAllUser function called");

    setIsLoading(true);
    const userList = await contract.getAllAppUser();
    // console.log(userList[1].accountAddress);
    setUserLists(userList);

    setIsLoading(false);
  };

  //TO CHECK THE SIGN IN STATUS OF A USER
  const getSignInState = () => {
    return JSON.parse(localStorage.getItem("isSignedIn"));
  };

  //TO VALIDATE USERNAME
  const ValidateUsername = async (username) => {
    const _username = await contract.getUsername(connectedAccount);

    if (username === _username) {
      setCurrentUsername(_username);
      return true;
    } else {
      return false;
    }
  };

  //TO GET A USERS NAME and PROFILE
  const GetUserName = async (account) => {
    const _user = await contract.getUsername(account);
    setCurrentUsername(_user);
    const _profile = await contract.getProfilePic(account);
    setCurrentUserProfile(_profile);
  };
  const GetProfilePic = async (account) => {
    try {
      const profilePic = await contract.getProfilePic(account);
      setPostUserPic(profilePic);
    } catch (error) {
      console.log(error);
    }
  };
  //TO UPLOAD A NEW POST BY A USER
  const UploadPost = async (imageHash, caption, imageText) => {
    setIsLoading(true);
    const uploaded = await contract.addPostImage(imageHash, caption, imageText);
    await uploaded.wait();
    setIsLoading(false);
  };

  //TO GET ALL POSTS OF APP
  const GetAllPosts = async () => {
    setIsLoading(true);
    const Posts = await contract.getAllPosts();

    setAllPosts(Posts);
    setIsLoading(false);
  };

  //TO GET POSTS OF A SINGLE USER
  // const GetPostByUser = async (address) => {
  //   setIsLoading(true);
  //   const Posts = await contract.getSingleUserPost(address);
  //   setSingleUserPost(Posts);
  //   setIsLoading(false);
  // };

  //TO GET POSTS OF A SINGLE USER upgraded
  const GetPostByUser = async (address) => {
    console.log(contract);
    console.log(address);
    console.log(connectedAccount);
    setIsLoading(true);

    //const followingsCount = await contract.getMyFollowingsList(address);
    //console.log("FollowingsCount.....",followingsCount);

    let Posts = [];
    let connectedAccountPost = await contract.getOneUserPosts(connectedAccount);
    for (let j = 0; j < connectedAccountPost.length; j++) {
      Posts.push(connectedAccountPost[j]);
    }
    const followingsList = await contract.getMyFollowingsList(address);
    console.log("followings address", followingsList);

    for (let i = 0; i < followingsList.length; i++) {
      //let PostsOfOneUser = await contract.getOneUserPosts(followingsList[i]);
      let PostsOfOneUser = await contract.getOneUserPosts(
        followingsList[i].pubkey
      );
      for (let j = 0; j < PostsOfOneUser.length; j++) {
        Posts.push(PostsOfOneUser[j]);
      }
    }

    let dataCopy = [...Posts];

    // sorting posts in descending order
    dataCopy.sort((a, b) => {
      let val1 = b.likeCount.toNumber();
      let val2 = a.likeCount.toNumber();
      return val1 - val2;
    });
    setSingleUserPost(dataCopy);
    setIsLoading(false);
  };

  //READ MESSAGE/GET ALL MESSAGES
  const readMessage = async (friendAddress) => {
    try {
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (error) {
      console.log("Currently You Have no Message");
    }
  };

  //SEND MESSAGE TO YOUR FRIEND
  const SendMessage = async (msg, address) => {
    try {
      const addMessage = await contract.sendMessage(address, msg);
      setIsLoading(true);
      await addMessage.wait();
      setIsLoading(false);
      // window.location.reload();
    } catch (error) {
      setError("Please reload and try again");
    }
  };

  //RETURN POST OF A SPECIFIC USER
  const getMyProfilePost = async (address) => {
    const Posts = await contract.getOneUserPosts(address);
    setmyProfilePosts(Posts);
  };

  useEffect(() => {
    const getAccount = async () => {
      await ConnectWallet();
    };
    getAccount();
  }, [isMetamask]);

  return (
    <InscribleContext.Provider
      value={{
        ConnectWallet,
        RegisterUser,
        CheckIfUserIsRegistered,
        signInState,
        getSignInState,
        ValidateUsername,
        setIsSignedin,
        UploadPost,
        setIsLoading,
        GetAllPosts,
        GetPostByUser,
        getAllAppUser,
        setFriendLists,
        addFriends,
        removeFriends,
        setMessangerAddress,
        setMessangerName,
        readMessage,
        SendMessage,
        GetUserName,
        setmyProfilePosts,
        setfollowerLists,
        setfollowingLists,
        checkAlreadyFriend,
        removeFollower,
        getMyProfilePost,
        GetProfilePic,
        isMetamask,
        connectedAccount,
        contract,
        isSignedin,
        currentUsername,
        allPosts,
        singleUserPost,
        isLoading,
        friendLists,
        userList,
        messangerName,
        messangerAddress,
        friendMsg,
        myProfilePosts,
        followerLists,
        followingLists,
        currentUserProfile,
        setPostUserPic,
        postUserPic,
      }}
    >
      {children}
    </InscribleContext.Provider>
  );
};
