import classes from "./home.module.scss";
import { useState } from "react";
import React, { useEffect } from "react";
import addFriendAPI from "../../api/addFriendAPI";
import { format } from "timeago.js";
import { Fragment } from "react";
import tung from "../../assets/tung.jpg";
import { FileIcon, defaultStyles } from "react-file-icon";
import FormViewImage from "./form-video/FormViewImage";
import moment from "moment";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import messageAPI from "../../api/messageAPI";
import FormFordWardMessage from "./form-fordwardMessage/FormFordWardMessage";



const Chat = (props) => {
  const [user, setUser] = useState(null);
  const [isOpenFormViewImage, setIsOpenFormViewImage] = useState(false);
  const [message, setMessage] = useState([]);
  const [dataTextForWard, setdatatTextFordWard] = useState(""); //lấy nội dung tin nhắn
  const [dataTypeForWard, setdatatTypeFordWard] = useState(""); //lấy type tin nhắn
  const [dataNameFileForWard, setdatatNameFileFordWard] = useState(""); //lấy type tin nhắn
  const loggedInUser = useSelector((state) => state.user.current);
  const avatar = loggedInUser.avatar;

  // var date = new Date(props.data.createdAt);
  // var hour = date.getHours();
  // var minute = date.getMinutes();
  // var timeFormated = hour + ":" + minute


  const time = moment(props.data.createdAt);

  useEffect(() => {
    setMessage(props.data);
  }, [props.data]);

  useEffect(() => {
    const fetchGetUser = async () => {
      try {
        const requestGetUser = await addFriendAPI.getUser({
          userID: message?.sender,
        });
        setUser(requestGetUser.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUser();
  }, [message?.sender]);

  // console.log(props.data);
  // console.log(message?.text);

  // const uploadFile = message.text?.split(".");
  // const filesTypes = uploadFile[uploadFile?.length - 1];

  const uploadFile = props.data.text.split(".");
  const filesTypes = uploadFile[uploadFile.length - 1];

  const viewImageHandler = () => {
    setIsOpenFormViewImage(true);
  };
  const falseFromViewImage = () => {
    setIsOpenFormViewImage(false);
  };

  // console.log(props.data);
  // console.log(props.messages);

  const cancelMessageHandler = (event) => {
    // console.log(event.currentTarget.attributes["data-index"].value);

    const cancelMessage = async () => {
      try {
        const cancelMess = await messageAPI.cancelMessage({
          messageId: event.currentTarget.attributes["data-id"].value,
        });
        if (cancelMess.status === 200) {
          setMessage(cancelMess.data);
          //console.log(cancelMess.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    cancelMessage();
  };

  useEffect(() => {
    props.onSendSocketToChat.current.on("CancelMessage", async (data) => {
      if (data._id === props.data._id) {
        setMessage("Tin nhắn đã được thu hồi");
      }
    });
  }, [props.onSendSocketToChat]);

  const [activeDelete, setActiveDelete] = useState(false);
  const deleteActive = () => {
    setActiveDelete(!activeDelete);
  };
  const [isFormFordWardMess, setIsFormFordWardMess] = useState(false);
  const openFormFordWardHandler = (event) => {
    setdatatTextFordWard(event.currentTarget.attributes["data-text"].value);
    setdatatTypeFordWard(event.currentTarget.attributes["data-type"].value);
    setdatatNameFileFordWard(event.currentTarget.attributes["data-nameFile"]?.value)
    setIsFormFordWardMess(true);
  };
  const FalseFromFormAddGroup = (False) => {
    setIsFormFordWardMess(False);
  };

  console.log(message);
  return (
    <Fragment>
      <div
        className={`${classes.container} ${
          props.own ? classes.message_own : ""
        }`}
      >
        {/* {props.own && props.onSendBoxChatToChat && (
          <Fragment>
            <div className={`${classes.container_mess} `}>
              <div className={classes.message}>
                <p>{message?.text}</p>
                <div className={classes.messageBottom}>
                  <Moment format="HH:mm">{time}</Moment>
                </div>
              </div>
            </div>
          </Fragment>
        )} */}

        {/* tin nhắn của bản thân */}
        {props.own && (
          <Fragment>
            <div className={`${classes.container_mess} `}>
              <div className={classes.message}>
                <div className={classes.messageTop}>
                  {message?.type === "img" && message?.active ? (
                    <img
                      className={classes.messageImage}
                      alt=""
                      src={message?.text}
                      onClick={viewImageHandler}
                    />
                  ) : message?.type === "text" && message?.active ? (
                    <p className={classes.messageText}>{message?.text}</p>
                  ) : message?.type === "video" && message?.active ? (
                    <video
                      controls
                      className={classes.messageVideo}
                      alt=""
                      src={message?.text}
                    >
                      <source src={message?.text} />
                    </video>
                  ) : message?.type === "file" && message?.active ? (
                    <div className={classes.file}>
                      <div className={classes.imageFile}>
                        <a
                          className={classes.messageFile}
                          href={message?.text}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={classes.fileicon}>
                            <FileIcon
                              type="document"
                              extension={filesTypes}
                              {...defaultStyles[filesTypes]}
                              size="5"
                            />
                          </div>
                        </a>
                      </div>
                      <div className={classes.nameFile}>
                        <a
                          href={message?.text}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {message?.nameFile}
                        </a>
                      </div>
                    </div>
                  ) : message?.type === "gif" && message?.active ? (
                    <img
                      className={classes.messageImage}
                      alt=""
                      src={props.data.text}
                      onClick={viewImageHandler}
                    />
                  ) : (
                    <div className={classes.active_cancel_messageText}>
                      Tin nhắn đã được thu hồi
                    </div>
                  )}
                </div>
                <div className={classes.messageBottom}>
                  <Moment format="HH:mm">{time}</Moment>
                </div>
              </div>
              <div
                className={`${message?.active ? classes.dropdown_message : ""}`}
              >
                <div
                  className={classes.thuhoi}
                  data-index={props.index}

                  //onClick={cancelMessageHandler}
                >
                  {/* {message?.active ? "..." : ""} */}
                  {message?.active ? (
                    <nav>
                      <ul>
                        <li
                          className={`${classes.ItemDelete} ${
                            activeDelete ? classes.active : ""
                          }`}
                          onClick={deleteActive}
                        >
                          <i className="fas fa-ellipsis-h"></i>
                          <ul className={`${classes.dropdown}`}>
                            <li
                              onClick={cancelMessageHandler}
                              data-id={message?._id}
                            >
                              <a>Thu hồi tin nhắn</a>
                            </li>
                            <li
                              className={classes.last}
                              onClick={openFormFordWardHandler}
                              data-text={message?.text}
                              data-type={message?.type}
                              data-nameFile={message?.nameFile}
                            >
                              <a>Chuyển tiếp tin nhắn</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className={classes.avatar}>
              <img src={avatar} alt="avatar" />
            </div>
          </Fragment>
        )}
        {!props.own && (
          <Fragment>
            <div className={classes.avatar}>
              <img src={user?.avatar} alt="avatar" />
            </div>
            <div className={`${classes.container_mess} `}>
              <div className={classes.message}>
                <div className={classes.messageTop}>
                  <p className={classes.nameSender}>{user?.name}</p>
                  {message?.type === "img" && message?.active ? (
                    <img
                      className={classes.messageImage}
                      alt=""
                      src={message?.text}
                      onClick={viewImageHandler}
                    />
                  ) : message?.type === "text" && message?.active ? (
                    <p className={classes.messageText}>{message?.text}</p>
                  ) : message?.type === "video" && message?.active ? (
                    <video
                      controls
                      className={classes.messageVideo}
                      alt=""
                      src={message?.text}
                    >
                      <source src={message?.text} />
                    </video>
                  ) : message?.type === "file" && message?.active ? (
                    <div className={classes.file}>
                      <div className={classes.imageFile}>
                        <a
                          className={classes.messageFile}
                          href={message?.text}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={classes.fileicon}>
                            <FileIcon
                              type="document"
                              extension={filesTypes}
                              {...defaultStyles[filesTypes]}
                              size="5"
                            />
                          </div>
                        </a>
                      </div>
                      <div className={classes.nameFile}>
                        <a
                          href={message?.text}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {message?.nameFile}
                        </a>
                      </div>
                    </div>
                  ) : message?.type === "gif" && message?.active ? (
                    <img
                      className={classes.messageImage}
                      alt=""
                      src={props.data.text}
                      onClick={viewImageHandler}
                    />
                  ) : !message?.active ? (
                    <div className={classes.active_cancel_messageText}>
                      Tin nhắn đã được thu hồi
                    </div>
                  ) : null}
                </div>
                <div className={classes.messageBottom}>
                  <Moment format="HH:mm">{time}</Moment>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>

      <FormViewImage
        isOpenFormViewImage={isOpenFormViewImage}
        data={props.data}
        onFormFalse={falseFromViewImage}
        messages={props.messages}
        nameRoom={props.onSendNameRoomToChat}
      />

      {
        <FormFordWardMessage
          onSendIsFormFordWardMess={isFormFordWardMess}
          onFormFalse={FalseFromFormAddGroup}
          onSendTextFromChat={dataTextForWard}
          onSendTypeFromChat={dataTypeForWard}
          onSendNameFileFromChat={dataNameFileForWard}
        />
      }
    </Fragment>
  );
};

export default Chat;
