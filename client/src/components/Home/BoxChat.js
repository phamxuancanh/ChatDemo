import React, { Fragment, useEffect } from "react";
import classes from "./home.module.scss";
import { useState } from "react";
import messageAPI from "../../api/messageAPI";
import Chat from "./Chat";
import { useSelector } from "react-redux";
import { useRef } from "react";
import FormUserInfomation from "./form-information/FormUserInfomation";
import FormAddMember from "./form-addGroup/FormAddMember";
import FormCallVideo from "./form-video/FormCallVideo";
import FormOutGroup from "./form-outGroupChat/formOutGroup";
import FormRemoveMember from "./form-outGroupChat/formRemoveMember";
import FormDeleteGroup from "./form-outGroupChat/formDeleteGroupChat";
import FormDeleteFriend from "./form-deleteFriend/FormDeleteFriend";
import Member from "./Member";
import Picker from "emoji-picker-react";
import axios from "axios";
import { FileIcon, defaultStyles } from "react-file-icon";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Carousel } from "@giphy/react-components";
import FormViewImage from "./form-video/FormViewImage";
import Image from "./Image";
import { Scrollbars } from "react-custom-scrollbars";
// import groupAPI from "../../api/groupAPI";

const BoxChat = (props) => {
  const [nameRoom, setNameRoom] = useState("");
  const [avatarRoom, setAvatarRoom] = useState("");
  const [enteredChat, setEnteredChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isFormInfomation, setIsFormInfomation] = useState(false);
  const [isOpenFormAddGroup, setIsOpenFormAddGroup] = useState(false);
  const [
    isOpenFormBoxChatInfoHandler,
    setIsOpenFormBoxChatInfoHandler,
  ] = useState(false);
  const [isOpenFormCallVideo, setIsOpenFormCallVideo] = useState(false);
  const [isOpenFormOutGroup, setIsOpenFormOutGroup] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isOpenFormDeleteGroup, setIsOpenFormDeleteGroup] = useState(false);
  const [isOpenFormRemoveMember, setIsOpenFormRemoveMember] = useState(false);
  const [userFromMember, setUserFromMember] = useState(null);
  const [isOpenFormDeleteFriend, setIsOpenFormDeleteFriend] = useState(false);

  //dùng để render khi chuyển nhóm trưởng
  const [renderRoomMaster, setRenderRoomMaster] = useState(false);

  //dùng để render lại member khi 1 người khác rời nhóm
  const [renderMemberOutGroup, setRenderMemberOutGroup] = useState(false);
  const [arrayMember, setArrayMember] = useState({
    new: props.onSendRoomToBoxChat.users,
  });
  const [room, setRoom] = useState(null);

  //dùng để render lại member khi thành viên mới được thêm vào
  const [renderAddMember, setRenderAddMember] = useState(false);

  //dùng để render lại member khi có 1 thành viên bị mời ra khỏi nhóm
  const [renderRemoveMember, setRenderRemoveMember] = useState(false);

  const [roomMaster, setRoomMaster] = useState("");
  const [roomSended, setRoomSended] = useState("");

  const [userFromFUI, setUserFromFUI] = useState(null);

  const [isOpenGif, setIsOpenGif] = useState(false);
  const [keyword, setKeyword] = useState("");

  const loggedInUser = useSelector((state) => state.user.current);
  const idLogin = loggedInUser._id;
  const _isMounted = useRef(true);

  //Set biến true để mở form FormUserInformation cho thằng FormUserInformation
  const openFormUserInfomation = () => {
    setIsFormInfomation(true);
  };

  //Nhận biến false từ FormUserInformation để đóng form
  const closeFormInformation = (falseFromFUI) => {
    setIsFormInfomation(falseFromFUI);
  };

  const chatHandler = (event) => {
    setEnteredChat(event.target.value);

    //enter gửi tin nhắn
    if (event.charCode === 13) {
      const newMessage = {
        sender: idLogin,
        type: "text",
        text: event.target.value,
        active: true,
        RoomId: props.onSendRoomToBoxChat?._id,
      };
      const fetchAddMessage = async () => {
        try {
          const res = await messageAPI.AddMessage({
            message: newMessage,
          });
          setMessages([...messages, res.data]);
          //console.log(res.data);
          setEnteredChat("");
          setShowEmoji(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchAddMessage();
    }
  };

  // console.log(props.onSendSocketToBoxChat);

  // console.log(props.onSendRoomToBoxChat._id); //lấy object room từ bên home gửi qua
  //console.log(props.onSendUserToBoxChat);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await messageAPI.GetMessage({
          idRoom: props.onSendRoomToBoxChat?._id,
        });
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, [props.onSendRoomToBoxChat]);

  const SendMessageHandler = async (e) => {
    e.preventDefault();
    const newMessage = {
      sender: idLogin,
      type: "text",
      text: enteredChat,
      active: true,
      RoomId: props.onSendRoomToBoxChat?._id,
    };
    const fetchAddMessage = async () => {
      try {
        const res = await messageAPI.AddMessage({
          message: newMessage,
        });
        setMessages([...messages, res.data]);
        //console.log(res.data);
        setEnteredChat("");
        setShowEmoji(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddMessage();
  };

  useEffect(() => {
    props.onSendSocketToBoxChat.current.on("send-message", (data) => {
      if (props.onSendRoomToBoxChat?._id === data.RoomId) {
        // if (_isMounted.current) {
        setRoomSended(data.RoomId);
        setArrivalMessage({
          sender: data.sender,
          type: data.type,
          text: data.text,
          active: data.active,
          createdAt: Date.now(),
        });
      }
    });
    // return () => {
    //   _isMounted.current = false;
    // };
  }, [props.onSendRoomToBoxChat]);

  //socket tự bản thân xóa nhóm chat
  useEffect(() => {
    props.onSendSocketToBoxChat.current.on("delete-group-by-me", (data) => {
      // alert("t xóa nhóm rồi" + data.name)
    });
  }, []);

  useEffect(() => {
    if (props.onSendRoomToBoxChat?._id === roomSended) {
      arrivalMessage &&
        props.onSendRoomToBoxChat?.users.includes(arrivalMessage.sender) &&
        // _isMounted.current &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }
    // return () => {
    //   _isMounted.current = false;
    // };
  }, [arrivalMessage || props.onSendRoomToBoxChat || roomSended]);

  const scrollRef = useRef();
  useEffect(() => {
    // if (_isMounted.current) {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // }
    // return () => {
    //   _isMounted.current = false;
    // };
  }, [messages]);

  const formfalseHandler = (falseFromForm) => {
    setIsOpenFormAddGroup(falseFromForm);
  };

  const addMemberHandler = () => {
    setIsOpenFormAddGroup(true);
  };

  const openFormBoxChatInfoHandler = () => {
    setIsOpenFormBoxChatInfoHandler(!isOpenFormBoxChatInfoHandler);
  };

  const openFormCallVideoHandler = () => {
    setIsOpenFormCallVideo(true);
  };

  const closeFormCallVideo = (falseFromCallVideo) => {
    setIsOpenFormCallVideo(falseFromCallVideo);
  };

  //hiện form out group chat
  const outGroupHandler = () => {
    setIsOpenFormOutGroup(true);
  };
  //đóng form out group chat
  const closeFormOutGroup = (falseFormOutGroup) => {
    setIsOpenFormOutGroup(falseFormOutGroup);
  };
  // console.log(props.onSendUserToBoxChat);
  // console.log(props.onSendRoomToBoxChat.group);

  const onEmojiClick = (event, emojiObject) => {
    // console.log(emojiObject);
    setEnteredChat(enteredChat + emojiObject.emoji);
  };

  const showEmojiHandler = () => {
    setShowEmoji(!showEmoji);
  };

  const fileUploadHandler = async (e) => {
    e.preventDefault();
    const fileSelected = e.target.files[0];
    const fd = new FormData();
    //for(let i = 0; i < selectedFile.length; i++) {
    fd.append("uploadFile", fileSelected);
    //     }
    axios
      .post("//localhost:5000/messages/addFile", fd)
      .then((res) => {
        console.log(res.data);
        // if();
        const uploadFile = res.data.split(".");
        const filesTypes = uploadFile[uploadFile.length - 1];
        let newMessage;
        if (filesTypes === "mp4" || filesTypes === "mkv") {
          newMessage = {
            sender: idLogin,
            text: res.data,
            RoomId: props.onSendRoomToBoxChat?._id,
            type: "video",
          };
        } else if (
          filesTypes === "png" ||
          filesTypes === "jpg" ||
          filesTypes === "gif" ||
          filesTypes === "jpeg"
        ) {
          newMessage = {
            sender: idLogin,
            text: res.data,
            RoomId: props.onSendRoomToBoxChat?._id,
            type: "img",
          };
        } else {
          newMessage = {
            sender: idLogin,
            text: res.data,
            RoomId: props.onSendRoomToBoxChat?._id,
            type: "file",
            nameFile: fileSelected.name,
          };
        }
        const fetchAddMessage = async () => {
          try {
            const res = await messageAPI.AddMessage({
              message: newMessage,
            });
            setMessages([...messages, res.data]);
            //console.log(res.data);
            //setEnteredChat("");
          } catch (error) {
            console.log(error);
          }
        };
        fetchAddMessage();
      })
      .catch((aa) => {
        console.log("Khong Gui dc", aa);
      });
  };

  // console.log(props.onSendRoomToBoxChat._id);

  const deleteGroupHandler = () => {
    setIsOpenFormDeleteGroup(true);
  };
  const cancelFormDeleteGroup = (falseFromDeleteForm) => {
    setIsOpenFormDeleteGroup(falseFromDeleteForm);
  };
  //nhận lệnh mở form removeMember và truyền cho FormRemoveMember
  const openRemoveMemberHandler = (trueFromRemoverMember) => {
    setIsOpenFormRemoveMember(trueFromRemoverMember);
  };
  //nhận lệnh đóng form từ removeMember và truyền qua cho Member
  const closeFormRemoveMember = (falseFromRemoveMember) => {
    setIsOpenFormRemoveMember(falseFromRemoveMember);
  };
  const ReceiveUserFromMember = (user) => {
    setUserFromMember(user);
  };
  document.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList?.contains("secondRight")) {
      console.log("haha");
    }
  });

  const [clickedOutside, setClickedOutside] = useState(false);
  const myRef = useRef();

  const handleClickOutside = (e) => {
    if (window.innerWidth < 992) {
      if (!myRef.current?.contains(e.target)) {
        setIsOpenFormBoxChatInfoHandler(false);
        setClickedOutside(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  });

  //calvideo
  //NHận biến answer từ form call video
  const receiveFromCallVideoHandler = ({
    receivingCall,
    callAccepted,
    name,
    activeCalling,
  }) => {
    props.onReceiveCallingFromBoxChat({
      receivingCall: receivingCall,
      callAccepted: callAccepted,
      name: name,
      activeCalling: activeCalling,
    }); //đẩy biến này lên home
    console.log(name);
  };

  //socket cho trưởng nhóm chuyển nhóm trưởng
  useEffect(() => {
    props.onSendSocketToBoxChat.current.on("swapRoomMaster-by-me", (data) => {
      setRenderRoomMaster(true);
      setRoomMaster(data.roomMaster);
      setRoom(data);
    });
  }, []);

  //socket cho mọi người khi trưởng nhóm chuyển nhóm trưởng
  useEffect(() => {
    props.onSendSocketToBoxChat.current.on("swapRoomMaster", (data) => {
      setRenderRoomMaster(true);
      setRoomMaster(data.roomMaster);
      setRoom(data);
    });
  }, []);

  // socket cho mọi người khi có 1 người khác rời nhóm
  useEffect(() => {
    props.onSendSocketToBoxChat.current.on("exit-group", (data) => {
      setRenderMemberOutGroup(true);
      setArrayMember((pre) => {
        return { ...pre, new: data.users };
      });
      setRoomMaster(data.roomMaster);
      setRoom(data);
    });
  }, []);

  useEffect(() => {
    setArrayMember((pre) => {
      return { ...pre, new: props.onSendRoomToBoxChat.users };
    });
    setRoom(props.onSendRoomToBoxChat);
  }, [props.onSendRoomToBoxChat.users || arrayMember.new]);

  //socket cho những người trong group khi thành viên mới được thêm vào thì render lại member
  useEffect(() => {
    props.onSendSocketToBoxChat.current.on(
      "add-member-other-people-in-room",
      (data) => {
        setRenderAddMember(true);
        setArrayMember((pre) => {
          return { ...pre, new: data.users };
        });
        setRoomMaster(data.roomMaster);
        setRoom(data);
      }
    );
  }, []);

  //socket cho những người còn lại trong group khi có 1 thành viên bị mời ra khỏi nhóm
  useEffect(() => {
    props.onSendSocketToBoxChat.current.on(
      "remove-member-other-people",
      (data) => {
        setRenderRemoveMember(true);
        setArrayMember((pre) => {
          return { ...pre, new: data.users };
        });
        setRoomMaster(data.roomMaster);
        setRoom(data);
      }
    );
  }, []);

  //nhận true từ FUI để truyền qua FromDeleteFriend để mở FromDeleteFriend
  const openFormDeleteFriendHandler = (trueFromFormUserInfo) => {
    setIsOpenFormDeleteFriend(trueFromFormUserInfo);
  };
  //nhận false từ FromDeleteFriend để truyền qua FormUserInfo để đóng FromDeleteFriend
  const closeFormDeleteFriend = (falseFromFormDeleteFriend) => {
    setIsOpenFormDeleteFriend(falseFromFormDeleteFriend);
  };

  //nhận user từ FUI để truyền qua formdeletefriend
  const ReceiveUserFromFormUserInfo = (userFromFormUserInfo) => {
    setUserFromFUI(userFromFormUserInfo);
  };
  const closeFromFUI = (falseFromDeleteFriend) => {
    setIsFormInfomation(falseFromDeleteFriend);
  };
  // console.log(userFromFUI);
  // console.log(props.onSendActiveAnswerToBoxChat);

  useEffect(() => {
    setNameRoom(props.onSendUserToBoxChat.name);
  }, [props.onSendUserToBoxChat]);

  useEffect(() => {
    setAvatarRoom(props.onSendUserToBoxChat.avatar);
  }, [props.onSendUserToBoxChat]);

  //socket khi mình tự cập nhật room mess tự cập nhật
  useEffect(() => {
    props.onSendSocketToBoxChat.current.on("updateRooom", (data) => {
      setNameRoom(data.name);
      setAvatarRoom(data.avatar);
    });
  }, []);

  // console.log(messages);

  const gifHandler = () => {
    setIsOpenGif(!isOpenGif);
  };

  const keywordHandler = (event) => {
    setKeyword(event.target.value);
  };

  const giphyFetch = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");
  const fetchGifs = () => {
    //giphyFetch.trending({ limit: 10 })
    if (keyword === "") {
      return giphyFetch.trending({ limit: 10 });
    }
    return giphyFetch.search(keyword, { limit: 10 });
  };

  const sendGifHandler = (gif, e) => {
    e.preventDefault();
    const newMessage = {
      sender: idLogin,
      type: "gif",
      text:
        e.currentTarget.childNodes[0].childNodes[0].childNodes[1].attributes[
          "src"
        ].value,
      RoomId: props.onSendRoomToBoxChat?._id,
    };
    const fetchAddMessage = async () => {
      try {
        const res = await messageAPI.AddMessage({
          message: newMessage,
        });
        console.log(res);
        setMessages([...messages, res.data]);
        //console.log(res.data);
        //setEnteredChat("");
        setIsOpenGif(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddMessage();
  };

  useEffect(() => {
    props.onSendSocketToBoxChat.current.on("CancelMessage", (data) => {
      console.log("thu hooif");
    });
  }, [props.onSendSocketToBoxChat]);

  const [isOpenFormViewImage, setIsOpenFormViewImage] = useState(false);
  const [dataViewImage, setDataViewImage] = useState();
  const falseFromViewImage = () => {
    setIsOpenFormViewImage(false);
  };
  const receiveFormViewImageHandler = (data) => {
    setIsOpenFormViewImage(data.isOpenFormViewImage);
    setDataViewImage(data.data);
  };

  return (
    <Fragment>
      <div className={classes.second}>
        <div
          className={`${classes.secondLeft} ${
            isOpenFormBoxChatInfoHandler ? classes.openFormBoxChatInfo : ""
          } `}
        >
          <div className={classes["top-right"]}>
            <div className={classes.topName}>
              <div className={classes.avatar} onClick={openFormUserInfomation}>
                <img src={avatarRoom} alt="" />
              </div>
              <div className={classes.name}>
                <h2>{nameRoom}</h2>
                {props.onSendRoomToBoxChat.users.length > 2 ? (
                  <p onClick={openFormBoxChatInfoHandler}>
                    <i className="far fa-user"></i> {arrayMember.new?.length}{" "}
                    thành viên
                  </p>
                ) : (
                  "Các bạn đã là bạn bè"
                )}
              </div>
            </div>
            {props.onSendRoomToBoxChat.group ? (
              <div className={classes.topFunction}>
                <i className="fas fa-user-plus" onClick={addMemberHandler}></i>
                <i
                  className="fas fa-video"
                  onClick={openFormCallVideoHandler}
                ></i>
                <i
                  className="far fa-address-card"
                  onClick={openFormBoxChatInfoHandler}
                ></i>
              </div>
            ) : (
              <div
                className={`${classes.topFunction} ${classes.topFunction_active}`}
              >
                <i
                  className="fas fa-video"
                  onClick={openFormCallVideoHandler}
                ></i>
              </div>
            )}
          </div>
          <div className={`${classes["center-right"]}`}>
            <Scrollbars
              // style={{ height: "610px" }}
              className={classes["list-mess"]}
              id="style-2"
              renderTrackHorizontal={(props) => (
                <div
                  {...props}
                  style={{ display: "none" }}
                  className="track-horizontal"
                />
              )}
            >
              {messages.map((data, index) => {
                return (
                  <div
                    ref={scrollRef}
                    className={`${classes.listChat} ${
                      data.sender === idLogin ? classes.message_own : ""
                    }`}
                    key={index}
                  >
                    <Chat
                      onSendSocketToChat={props.onSendSocketToBoxChat}
                      index={index}
                      messages={messages}
                      data={data}
                      key={data._id}
                      own={data.sender === idLogin}
                      isOpenFormBoxChatInfoHandler={
                        isOpenFormBoxChatInfoHandler
                      }
                      onSendBoxChatToChat={props.onSendFromHomeToBoxChat} //Nhận true để tạo nhóm chat
                      onSendNameRoomToChat={nameRoom} //Gửi nameRoom để set ViewImage
                    />
                  </div>
                );
              })}
            </Scrollbars>
            <div className={classes.emoji}>
              {showEmoji && <Picker onEmojiClick={onEmojiClick} />}
            </div>
          </div>
          <div className={classes["botom-right"]}>
            <div className={classes.toolbar}>
              <i className="bi bi-image">
                <input type="file" onChange={fileUploadHandler} multiple />
              </i>
              <i className="bi bi-paperclip">
                <input type="file" onChange={fileUploadHandler} multiple />
              </i>
              <i className="fab fa-waze" onClick={gifHandler}></i>
            </div>
            <div className={classes["input-chat"]}>
              <input
                type="text"
                placeholder={`Nhập tin nhắn tới ` + nameRoom}
                onChange={chatHandler}
                value={enteredChat}
                onKeyPress={chatHandler}
              />
              <i
                className="far fa-paper-plane"
                onClick={SendMessageHandler}
              ></i>
              <i className="far fa-laugh-beam" onClick={showEmojiHandler}></i>
            </div>
          </div>
        </div>

        {/* THÔNG TIN NHÓM CHAT */}
        {props.onSendRoomToBoxChat.group && (
          <div
            onClick={handleClickOutside}
            ref={myRef}
            className={`${classes.secondRight} ${
              isOpenFormBoxChatInfoHandler ? classes.openFormBoxChatInfo : ""
            }`}
          >
            <Scrollbars
              // style={{ height: "610px" }}
              className={classes["list-mess"]}
              id="style-2"
            >
              <div
                data-id=""
                className={`${classes.secondRightBoxChatInfo} ${
                  isOpenFormBoxChatInfoHandler
                    ? classes.openFormBoxChatInfo
                    : ""
                }`}
              >
                <div className={classes.titleBoxChatInfo}>
                  <h2>Thông tin nhóm</h2>
                </div>
                <div className={classes.groupNameAvatar}>
                  <div className={classes.avatarBoxChatInfo}>
                    <img src={avatarRoom} alt="" />
                  </div>
                  <div className={classes.nameBoxChatInfo}>
                    <p>{nameRoom}</p>
                  </div>
                </div>
                <div className={classes.memberGroup}>
                  <h6>Thành viên nhóm ({arrayMember.new?.length})</h6>
                  <div className={classes.listMember}>
                    {/* render lại member khi chuyển nhóm trưởng, rời nhóm, thêm thành viên mới, mời thành viên khác ra khỏi nhóm */}
                    {renderRoomMaster ||
                    renderMemberOutGroup ||
                    renderAddMember ||
                    renderRemoveMember
                      ? arrayMember.new?.map((user, index) => {
                          return (
                            <Member
                              user={user}
                              master={roomMaster}
                              // room={props.onSendRoomToBoxChat}
                              room={room}
                              OpenFormRemoveMember={openRemoveMemberHandler} //nhận lệnh mở form remove member từ member
                              isCloseFormRemoveMember={isOpenFormRemoveMember} // nhận lệnh đóng form remove member từ form remove member
                              SendUserToBoxChat={ReceiveUserFromMember}
                              key={user}
                            />
                          );
                        })
                      : arrayMember.new?.map((user, index) => {
                          return (
                            <Member
                              user={user}
                              master={props.onSendRoomToBoxChat.roomMaster}
                              room={props.onSendRoomToBoxChat}
                              OpenFormRemoveMember={openRemoveMemberHandler} //nhận lệnh mở form remove member từ member
                              isCloseFormRemoveMember={isOpenFormRemoveMember} // nhận lệnh đóng form remove member từ form remove member
                              SendUserToBoxChat={ReceiveUserFromMember}
                              key={user}
                            />
                          );
                        })}
                  </div>
                </div>
                <div className={classes.image_group}>
                  <h6>Ảnh/Video</h6>
                  <div className={classes.images}>
                    {messages.map((data) => {
                      return (
                        <Image
                          data={data}
                          messages={messages}
                          onReceiveIsOpenFormViewImage={
                            receiveFormViewImageHandler
                          }
                          //onReceiveDataImage={receiveDataHandler}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className={classes.file_group}>
                  <h6>File</h6>
                  <div className={classes.files}>
                    {messages.map((data) => {
                      const uploadFile = data.text?.split(".");
                      const filesTypes = uploadFile[uploadFile?.length - 1];
                      return data.type === "file" ? (
                        <div className={classes.file}>
                          <div className={classes.imageFile}>
                            <div className={classes.fileIcon}>
                              <FileIcon
                                type="document"
                                size="2"
                                extension={filesTypes}
                                {...defaultStyles[filesTypes]}
                              ></FileIcon>
                            </div>
                          </div>
                          <div className={classes.nameFile}>
                            <p>{data.nameFile}</p>
                          </div>
                        </div>
                      ) : (
                        ""
                      );
                    })}
                  </div>
                </div>
                <div className={classes.out_deleteGroup}>
                  {renderRoomMaster
                    ? roomMaster === idLogin && (
                        <Fragment>
                          <div
                            className={classes.outgroup}
                            onClick={outGroupHandler}
                          >
                            <i className="fas fa-sign-out-alt"></i>
                            <p>Rời nhóm</p>
                          </div>
                          <div
                            className={classes.deletegroup}
                            onClick={deleteGroupHandler}
                          >
                            <i className="far fa-trash-alt"></i>
                            <p>Xóa nhóm</p>
                          </div>
                        </Fragment>
                      )
                    : props.onSendRoomToBoxChat.roomMaster === idLogin && (
                        <Fragment>
                          <div
                            className={classes.outgroup}
                            onClick={outGroupHandler}
                          >
                            <i className="fas fa-sign-out-alt"></i>
                            <p>Rời nhóm</p>
                          </div>
                          <div
                            className={classes.deletegroup}
                            onClick={deleteGroupHandler}
                          >
                            <i className="far fa-trash-alt"></i>
                            <p>Xóa nhóm</p>
                          </div>
                        </Fragment>
                      )}

                  {renderRoomMaster
                    ? roomMaster !== idLogin && (
                        <Fragment>
                          <div className={classes.outgroup}>
                            <i className="fas fa-sign-out-alt"></i>
                            <p onClick={outGroupHandler}>Rời nhóm</p>
                          </div>
                        </Fragment>
                      )
                    : props.onSendRoomToBoxChat.roomMaster !== idLogin && (
                        <Fragment>
                          <div className={classes.outgroup}>
                            <i className="fas fa-sign-out-alt"></i>
                            <p onClick={outGroupHandler}>Rời nhóm</p>
                          </div>
                        </Fragment>
                      )}
                </div>
              </div>
            </Scrollbars>
          </div>
        )}

        {/* GIF */}
        {isOpenGif && (
          <div className={classes.border_gif}>
            <div className={classes.topGif}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm"
                onChange={keywordHandler}
              />
            </div>
            <div className={classes.bottomGif}>
              <Carousel
                key={keyword}
                fetchGifs={() => fetchGifs(5)}
                gifHeight={200}
                gutter={6}
                onGifClick={sendGifHandler}
                axis="horizontal"
              />
            </div>
          </div>
        )}
      </div>

      {
        <FormUserInfomation
          isFormInfomation={isFormInfomation}
          SendFalseToBoxChat={closeFormInformation}
          user={props.onSendUserToBoxChat}
          room={props.onSendRoomToBoxChat}
          OpenFormDeleteFriendFromFormUserInfo={openFormDeleteFriendHandler}
          closeFormDeleteFriend={isOpenFormDeleteFriend}
          UserFromFormUserInfo={ReceiveUserFromFormUserInfo}
          // onSendNameToBoxChat = {receiveNameFromFUI}
        ></FormUserInfomation>
      }
      {
        <FormAddMember
          isOpenFormAddGroup={isOpenFormAddGroup}
          onFormFalse={formfalseHandler}
          onSendRoomToAddMember={props.onSendRoomToBoxChat}
        />
      }
      {isOpenFormCallVideo ? (
        <FormCallVideo
          isFormVideoCall={isOpenFormCallVideo}
          onSendFormCallVideo={props.onSendRoomToBoxChat}
          onSendSocketToFormCallVideo={props.onSendSocketToBoxChat}
          onFormFalse={closeFormCallVideo}
          onSendRoomToCallVideo={props.onSendRoomToBoxChat}
          onReceiveFromCallVideo={receiveFromCallVideoHandler} //Nhận từ form call video
          onSendActiveAnswerToCallVideo={props.onSendActiveAnswerToBoxChat}
          onIsOpenFormCallVideo={isOpenFormCallVideo}
        />
      ) : null}
      {
        <FormOutGroup
          isFormOuGroup={isOpenFormOutGroup}
          onFormFalse={closeFormOutGroup}
          room={props.onSendRoomToBoxChat}
        ></FormOutGroup>
      }

      {
        <FormDeleteGroup
          isOpenFormDeleteGroup={isOpenFormDeleteGroup}
          onFormFalse={cancelFormDeleteGroup}
          room={props.onSendRoomToBoxChat}
          // onSendSocketToDeleteGroupChat = {props.onSendSocketToBoxChat}
        ></FormDeleteGroup>
      }

      {
        <FormRemoveMember
          isOpenFormRemoveMember={isOpenFormRemoveMember}
          onFormFalse={closeFormRemoveMember}
          userFromMember={userFromMember}
          // room={props.onSendRoomToBoxChat}
          room={room}
        ></FormRemoveMember>
      }

      {
        <FormDeleteFriend
          isOpenDeleteFriendFromFUI={isOpenFormDeleteFriend}
          onFormFalse={closeFormDeleteFriend}
          user={userFromFUI}
          closeFromFUI={closeFromFUI}
        ></FormDeleteFriend>
      }

      <FormViewImage
        isOpenFormViewImage={isOpenFormViewImage}
        data={dataViewImage}
        onFormFalse={falseFromViewImage}
        messages={messages}
        nameRoom={nameRoom}
      />
    </Fragment>
  );
};
export default BoxChat;
