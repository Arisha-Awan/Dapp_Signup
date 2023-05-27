//SPDX-License-Identifier: Unlicense
pragma solidity >=0.5.0 <0.9.0;

contract Inscrible {
    
    //USER STRUCT
    struct User{
        string username;        
        friend[] followersList;
        friend[] followingsList;
        Post [] myPosts;
        // string profilePic; do add later
    }

    struct AllUserStruck{
        string username;
        address accountAddress;
    }
    
   struct friend{
        address pubkey;
        string name;
    }
    //POST COUNT
    uint postCount = 0;

    //CONTAINING ALL THE POSTS UPLOADED BY USERS
    struct Post{
        string createrName;
        address payable userAddress;
        string imageHash;
        string caption;
        string imageText;
        uint256  tipAmount;
        uint256 id;
        uint likeCount;
        string [] likedByUser;
    }

    struct Message{
        address sender;
        uint256 timestamp;
        string msg;
    } 


    mapping(address=>User) userList;
    mapping(address=>Post[]) singleUserPostList;
    mapping(bytes32=>Message[]) allMessages;
    Post [] allposts;
    AllUserStruck[] AllUsers;


    //FUNCTIONS----------------------------

    //CHECK IS A USER HAS AN ACCOUNT
    function checkUser(address key) public view returns(bool){
        if(AllUsers.length > 0)
        return bytes(userList[key].username).length > 0;
        else{
            return false;
        }
    }

    //GET USER NAME
    function getUsername(address key) public view returns(string memory){
        return userList[key].username;
    }

    //CREATE ACCOUNT
    function createAccount(string calldata _username) external {
        require(checkUser(msg.sender) == false, "User alredy has an account!");
        require(bytes(_username).length > 0, "User name should not be empty!");

        userList[msg.sender].username = _username;
        AllUsers.push(AllUserStruck(_username, msg.sender));
    }

    //TO ADD A FRIEND TO USER
    function addFriend(address friend_key) external{
        require(checkUser(msg.sender), "Create an account first");
        require(checkUser(friend_key), "User is not registered!");
        require(msg.sender != friend_key, "Users cannot add themeselves as friends");
        require(checkAlreadyFriends(msg.sender, friend_key)== false, "These users are already friends");
        _addFriend(friend_key, msg.sender, userList[msg.sender].username);
    }

    //TO CHECK IF A USER IS ALREADY FRIEND WITH GIVEN ACCOUNT
    function checkAlreadyFriends(address me,address following_key) public view returns (bool){

        for(uint256 i = 0; i < userList[following_key].followersList.length; i++){
            
            if(userList[following_key].followersList[i].pubkey == me) return true;
        }
        return false;
    }

    //_AddFriend
    function _addFriend(address following_key, address me, string memory name) internal{
        friend memory newFollower = friend(me, name);
        userList[following_key].followersList.push(newFollower);

        friend memory newFollowing = friend(following_key, userList[following_key].username);
        userList[me].followingsList.push(newFollowing);
    }

    // //GETMY FRIEND
    // function getMyFriendList() external view returns(friend[] memory){
    //     return userList[msg.sender].friendList;
    // }

    //FUNCTION TO REMOVE A FRIEND
    function removeFriend(address followingAddress) public {

        //Removing follower(msg.sender) from the followerList of our following(followingAddress)
        uint256 followerIndex;
        bool found = false;

        // Find the index of the friend in the array
        for (uint256 i = 0; i < userList[followingAddress].followersList.length; i++) {
            if (userList[followingAddress].followersList[i].pubkey == msg.sender) {
                followerIndex = i;
                found = true;
                break;
            }
        }
        // If the friend is found, remove it
        if (found) {
            // Replace the element at friendIndex with the last element
            userList[followingAddress].followersList[followerIndex] = userList[followingAddress].followersList[userList[followingAddress].followersList.length - 1];
            // Reduce the size of the array by one
            userList[followingAddress].followersList.pop();
       }

        //------------------------------------------------------------------------------
        //Removing followingAddress from our followingList
        //-------------------------------------------------------------------------------

        uint256 followingIndex;
        bool foundFollowing = false;

        // Find the index of the friend in the array
        for (uint256 i = 0; i < userList[msg.sender].followingsList.length; i++) {
            if (userList[msg.sender].followingsList[i].pubkey == followingAddress) {
                followingIndex = i;
                foundFollowing = true;
                break;
            }
        }
        // If the friend is found, remove it
        if (foundFollowing) {
            // Replace the element at friendIndex with the last element
            uint256 lengthOfFollowingList  = userList[msg.sender].followingsList.length;
            userList[msg.sender].followingsList[followingIndex] = userList[msg.sender].followingsList[lengthOfFollowingList - 1];
            // Reduce the size of the array by one
            userList[msg.sender].followingsList.pop();
       }

    }

    //FUNCTION TO REMOVE A FOLLOWER
    function removeFollower(address followerAddress) public {        
        uint256 followerIndex;
        bool found = false;

        // Find the index of the friend in the array
        for (uint256 i = 0; i < userList[msg.sender].followersList.length; i++) {
            if (userList[msg.sender].followersList[i].pubkey ==followerAddress) {
                followerIndex = i;
                found = true;
                break;
            }
        }
        // If the friend is found, remove it
        if (found) {
      
            userList[msg.sender].followersList[followerIndex] = userList[msg.sender].followersList[userList[msg.sender].followersList.length - 1];
            // Reduce the size of the array by one
            userList[msg.sender].followersList.pop();
       }

        uint256 followingIndex;
        bool foundFollowing = false;

        // Find the index of the friend in the array
        for (uint256 i = 0; i < userList[followerAddress].followingsList.length; i++) {
            if (userList[followerAddress].followingsList[i].pubkey == msg.sender) {
                followingIndex = i;
                foundFollowing = true;
                break;
            }
        }
        // If the friend is found, remove it
        if (foundFollowing) {
            // Replace the element at friendIndex with the last element
            uint256 lengthOfFollowingList  = userList[followerAddress].followingsList.length;
            userList[followerAddress].followingsList[followingIndex] = userList[followerAddress].followingsList[lengthOfFollowingList - 1];
            // Reduce the size of the array by one
            userList[followerAddress].followingsList.pop();
       }

    }

    //GET FOLLOWERS
    function getMyFollowersList(address _user) external view returns(friend[] memory){
        return userList[_user].followersList;
    }

    //GET FOLLOWING
    function getMyFollowingsList(address _user) external view returns(friend[] memory){
        return userList[_user].followingsList;
    }

    //TO POST IMAGES TO BLOCKCHAIN
    function addPostImage(string memory _imgHash, string memory desc, string memory imgText) public 
    {   
        require(checkUser(msg.sender), "User not registered!");
        require(bytes(_imgHash).length > 0);
        postCount++;
        Post memory newPost = Post({
            createrName: userList[msg.sender].username,
            userAddress: payable(msg.sender),
            imageHash: _imgHash,
            caption: desc,
            imageText: imgText,
            tipAmount:0,
            id:postCount,
            likeCount:0,
            likedByUser : new string[](0)         
        });
            
        for(uint256 i = 0; i < userList[msg.sender].followersList.length; i++){
              singleUserPostList[userList[msg.sender].followersList[i].pubkey].push(newPost);
         } 
        userList[msg.sender].myPosts.push(newPost);
        singleUserPostList[msg.sender].push(newPost);
        allposts.push(newPost);   
    }

    function getAllPosts() public view returns(Post [] memory){
        return allposts;
    }
    
    function getAllAppUser() public view returns(AllUserStruck[] memory){
        return AllUsers;
    }

    function getSingleUserPost(address key) public view returns(Post [] memory) {
        if (singleUserPostList[key].length > 0) {
            return singleUserPostList[key];
        } else {
            return new Post[](0);
        }
    }

    function getSingleUserLatestPost(address key) public view returns(Post memory){
        
            return  singleUserPostList[key][singleUserPostList[key].length-1]; 
        
    }

    //TO GET THE CHAT CODE--> WILL DIFFERENTIATE CHAT BETWEEN DIFFERENT USERS
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else 
        return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    //TO DISPLAY MESSAGES
    function readMessage(address friend_key) external view returns(Message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    //SEND MESSAGES
    function sendMessage(address friend_key, string calldata _msg) external{
        require(checkUser(msg.sender), "Create an account first");
        require(checkUser(friend_key), "User is not registered");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        Message memory newMsg = Message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    //TO GET A USERS POST FOR PROFILE
    function getMyProfilePost (address _user) public view returns(Post [] memory)
    {   
        return userList[_user].myPosts;
    }
    
    receive() external payable {}
}