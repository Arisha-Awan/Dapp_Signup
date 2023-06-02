import React from "react";
import "./App.css";
import {
  Profile,
  Home,
  SignUp,
  Create,
  SignIn,
  Search,
  Message,
  MyProfile,
  Explore,
} from "./Containers/Index";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProfilePic } from "./Components/Index";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/inscrible" element={<Home />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/create" element={<Create />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/profile" element={<MyProfile />}></Route>
        <Route path="/Explore" element={<Explore />}></Route>

        <Route
          path="/profile/:address/:username/:profilePic"
          element={<Profile />}
        ></Route>
        <Route path="/message" element={<Message />}></Route>
        <Route path="/edit" element={<ProfilePic />}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
