import React, { useContext, useEffect, useState } from "react";
import "./Create.css";
import { Navbar, Discard, Loader } from "../../Components/Index";
import { useNavigate } from "react-router";
import { InscribleContext } from "../../Context/Context";
import { toast } from "react-toastify";
import axios from "axios";

const Create = () => {
  const {
    currentUsername,
    UploadPost,
    isLoading,
    setIsLoading,
    getSignInState,
    currentUserProfile,
  } = useContext(InscribleContext);
  const notify = (msg) => toast.error(msg);

  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [isCrossed, setIsCrossed] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [next, setNext] = useState(false);
  const [input, setInput] = useState({
    caption: "",
    imgTxt: "",
  });

  useEffect(() => {
    const state = getSignInState();
    if (!state) {
      navigate("/");
    }
  }, []);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const manageSelectedFile = (e) => {
    const selectedFile = e.target.files[0];

    let reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = function () {
      setFile(selectedFile);
    };
    filePreview(selectedFile);
  };

  const filePreview = (selectedFile) => {
    let reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = function (e) {
      setPreviewSrc(e.target.result);
    };
  };

  const createNewPost = async () => {
    if (file) {
      setIsLoading(true);
      //UPLOADING TO PINATA
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `d197e147935b17d3208e`,
          pinata_secret_api_key: `8dd2463b95e8afc7d062b1d41efe12e57d15ee54116d9d0e320445ce92e94882`,
          "Content-Type": "multipart/form-data",
        },
      });
      const ImgHash = `ipfs://${resFile.data.IpfsHash}`;

      await UploadPost(ImgHash, input.caption, input.imgTxt);

      if (!isLoading) {
        navigate("/inscrible");
      }
    } else {
      notify("No Image Selected !");
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-main-container">
        <span
          className="material-symbols-outlined create-container-close"
          onClick={() => {
            if (!file) {
              navigate("/inscrible");
            } else {
              setIsCrossed(true);
            }
          }}
        >
          close
        </span>
        {isCrossed && file && (
          <Discard
            crossState={isCrossed}
            setCrossState={setIsCrossed}
            file={setFile}
            back={setGoBack}
            setnext={setNext}
          />
        )}

        {goBack && (
          <Discard
            crossState={isCrossed}
            setCrossState={setIsCrossed}
            file={setFile}
            back={setGoBack}
            setnext={setNext}
          />
        )}

        {isLoading ? (
          // <Loader />
          notify("Please wait. Uploading Image !")
        ) : (
          <div className="create-select-post">
            <div className="create-select-post_header">
              <span
                className={
                  !file ? "d-none" : "material-symbols-outlined back-arrow"
                }
                onClick={() => {
                  setGoBack(true);
                }}
              >
                chevron_left
              </span>
              <h5>Create New Post</h5>
              <span
                className={file && !next ? "next" : "d-none"}
                onClick={() => {
                  setNext(true);
                }}
              >
                Next
              </span>

              <span
                className={next ? "next" : "d-none"}
                onClick={createNewPost}
              >
                Share
              </span>
            </div>

            {/* BODY OF CREATE POST CONTAINER */}
            {!file ? (
              <div className="create-select-post_body">
                <span className="material-symbols-outlined create-select-post_body-icon">
                  imagesmode
                </span>
                <label htmlFor="selectedFile" className="select-post-button">
                  Select From Computer
                </label>
                <input
                  type="file"
                  name="selectedFile"
                  id="selectedFile"
                  className="d-none"
                  onChange={manageSelectedFile}
                />
              </div>
            ) : !next ? (
              <div className="selected-file-preview">
                <img src={previewSrc} alt="No Preview" id="imgPreview" />
              </div>
            ) : (
              <>
                <div className="creater-info">
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${currentUserProfile.substring(
                      7
                    )}`}
                    alt="pic"
                  />
                  <h4>{currentUsername}</h4>
                </div>
                <div className="caption-div">
                  <textarea
                    name="caption"
                    id="caption"
                    placeholder="Write a caption..."
                    onChange={handleInput}
                    value={input.caption}
                  ></textarea>
                  <span className="material-symbols-outlined emoji-selector">
                    mood
                  </span>
                </div>
                <div className="img-txt-div">
                  <textarea
                    name="imgTxt"
                    id="imgTxt"
                    placeholder="Add text on image..."
                    onChange={handleInput}
                    value={input.imgTxt}
                  ></textarea>
                  <span className="material-symbols-outlined emoji-selector">
                    mood
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Create;
