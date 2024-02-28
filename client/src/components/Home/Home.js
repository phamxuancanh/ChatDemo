import React from "react";
import { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

// import OwlCarousel from "react-owl-carousel2";
// import "react-owl-carousel2/lib/styles.css";
// import "react-owl-carousel2/src/owl.theme.default.css";
import Slick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import classes from "./home.module.scss";
import io from "socket.io-client";

import img1 from "../../assets/owl_1.png";
import img2 from "../../assets/owl_2.jpg";
import img3 from "../../assets/owl_3.jpg";
import img4 from "../../assets/owl_4.png";
import img5 from "../../assets/owl_5.jpg";
import img6 from "../../assets/owl_6.jpg";

import FormLogOut from "./formLogOut/formLogOut";
import ListMess from "./ListMess";
import BoxChat from "./BoxChat";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Home = (props) => {

  const [receivingCall, setReceivingCall] = useState(false);
  const [nameFromCallVideo, setNameFromCallVideo] = useState("");
  const [nameFromCallVideoSocket, setNameFromCallVideoSocket] = useState("");
  const [avatarFromCallVideoSocket, setAvatarFromCallVideoSocket] = useState("");
  const [callAcceptFromVideo, setCallAcceptFromVideo] = useState(false);

  const [activeAnswer, setAciveAnswer] = useState(false);
  const [activeCalling, setActiveCalling] = useState(false);
  const [checkOpenFormCalling, setCheckOpenFormCalling] = useState(false);
  const [dataSignal, setDataSignal] = useState(null);
  const [isWelcome, setIsWelcome] = useState(true);
  const [isBtnMess, setIsBtnMess] = useState(true);
  const [isBtnPhoneBook, setIsBtnPhoneBook] = useState(false);
  const [isInviteFriend, setIsInviteFriend] = useState(false);
  const [isChatInput, setIsChatInput] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [isOpenFormLogOut, seIsOpenFormLogOut] = useState(false);
  const [isListSenderRequest, setIsListSenderRequest] = useState(true);
  const [isOpenFormCallVideo, setIsOpenFormCallVideo] = useState(""); //Cho form call video
  const [avatar, setAvatar] = useState(""); //Lưu tên mess khi nhận từ boxchat để truyền xuống ListMess
  const socket = useRef();

  const ENDPOINT = "localhost:8000";

  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.user.current);

  useEffect(() => {
    setAvatar(loggedInUser.avatar);
  }, []);
  console.log(loggedInUser.name);
  useEffect(() => {
    socket.current = io(ENDPOINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const isChatHandler = ({ user, room }) => {
    setIsWelcome(false);
    setIsChatInput(true);
    setUser(user);
    setRoom(room);
    //socket.emit('join',room);
  };

  const isChatHandlerFriend = ({ user, room }) => {
    setUser(user);
    setRoom(room);
    setIsWelcome(false);
    setIsChatInput(true);
    setIsListSenderRequest(true);
    setIsInviteFriend(false);
    console.log("haha");
    // socket.emit("join", room);
  };

  const btnMessHandler = () => {
    setIsBtnMess(true);
    setIsBtnPhoneBook(false);
    setIsInviteFriend(false);
    setIsWelcome(true);
    setIsListSenderRequest(true);
  };

  const friendHandler = () => {
    setIsBtnPhoneBook(true);
    setIsBtnMess(false);
    setIsInviteFriend(true);
    setIsWelcome(false);
    setIsChatInput(false);

  };
  const formInformationHandler = () => {
    setIsForm(true);
  };
  const formfalseHandler = (falseFromForm) => {
    setIsForm(falseFromForm);
  };
  const options = {
    items: 1,
    nav: true,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    loop: true,
  };

  const logOutHandler = () => {
    console.log("logOutHandler");
    seIsOpenFormLogOut(true);
  };
  const falseFromLogOut = () => {
    seIsOpenFormLogOut(false);
  };

  const isListSenderRequestHandler = (isListSenderRequest) => {
    // console.log(isListSenderRequest);
    setIsListSenderRequest(isListSenderRequest);
  };


  //call

  useEffect(() => {
    socket.current.on("abc", (data) => {
      setNameFromCallVideoSocket(data.name);
      setAvatarFromCallVideoSocket(data.avatar);
      setTimeout(() => {
        setCheckOpenFormCalling(true);
      }, 4000);
    });

    socket.current.on("calling", (data) => {
      setDataSignal(data);
    });
  }, [activeCalling]);

  //call tu boxchat
  const receiveCallingHandler = ({
    receivingCall,
    callAccepted,
    name,
    activeCalling,
  }) => {
    setReceivingCall(receivingCall);
    setCallAcceptFromVideo(callAccepted);
    setNameFromCallVideo(name);
    setActiveCalling(activeCalling);
  };

  const ActiveAnswerCall = () => {
    setAciveAnswer(true);
    setCheckOpenFormCalling(false);
  };
  const formfalseHandlerFromBoxChat = (falseFromForm) => {
    setAciveAnswer(falseFromForm);
  };
  const closeFormCallVideo = (falseFromCallVideo) => {
    setAciveAnswer(falseFromCallVideo);
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenFormCallVideo("");
  };

  useEffect(() => {
    if (checkOpenFormCalling) {
      setCheckOpenFormCalling(classes.active);
    } else {
      setCheckOpenFormCalling("");
    }
  }, [checkOpenFormCalling]);
  // console.log(checkOpenFormCalling);

  useEffect(() => {
    socket.current.on("delete-group-by-me", (data) => {
      setIsBtnMess(true);
      setIsBtnPhoneBook(false);
      setIsInviteFriend(false);
      setIsWelcome(true);
      setIsListSenderRequest(true);
    });
  }, []);

  //socket khi ngta xóa nhóm thì mình hiện welcome
  useEffect(() => {
    socket.current.on("delete-group", (data) => {
      setIsBtnMess(true);
      setIsBtnPhoneBook(false);
      setIsInviteFriend(false);
      setIsWelcome(true);
      setIsListSenderRequest(true);
      toast.warn(`"Nhóm ${data.name} đã bị xóa!"`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false,
      });
    });
  }, []);

  //socket khi mình tự rời nhóm thì nó hiện welcome
  useEffect(() => {
    socket.current.on("exit-group-by-me", (data) => {
      setIsBtnMess(true);
      setIsBtnPhoneBook(false);
      setIsInviteFriend(false);
      setIsWelcome(true);
      setIsListSenderRequest(true);
    });
  }, []);

  //socket khi mình khi bị người khác mời ra khỏi nhóm thì nó hiện welcome
  useEffect(() => {
    socket.current.on("removed-by-other-person", (data) => {
      setIsBtnMess(true);
      setIsBtnPhoneBook(false);
      setIsInviteFriend(false);
      setIsWelcome(true);
      setIsListSenderRequest(true);
      toast.warn(`"Bạn đã bị mời ra khỏi nhóm ${data.name}!"`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false,
      });
    });
  }, []);

  //socket khi mình xóa bạn trong formUserInformation thì nó hiện welcome
  useEffect(() => {
    socket.current.on("delete-friend-by-me", (data) => {
      setIsBtnMess(true);
      setIsBtnPhoneBook(false);
      setIsInviteFriend(false);
      setIsWelcome(true);
      setIsListSenderRequest(true);
    });
  }, []);

  // const onReceiveNameFromBoxChat = (name) => {
  //   setNameMess(name);
  // };

  const ReceiveAvatarFromFI = (avatar) => {
    setAvatar(avatar);
  };

  const [createGroup, setCreateGroup] = useState(false); //Khi tạo group
  const onReceiveListFriend = (createGroup) => {
    setCreateGroup(createGroup);
  };



  return (
    <Fragment>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <div className={classes.avatar} onClick={formInformationHandler}>
            <img src={avatar} alt="" />
            <div className={classes.active}></div>
          </div>

          <div className={classes.mess + " " + (isBtnMess ? classes.activetoggle : "")}
            onClick={btnMessHandler}
          >
            <i className="fas fa-comment" title="Tin nhắn"></i>
          </div>
          <div
            className={classes.friend + " " + (isBtnPhoneBook ? classes.activetoggle : "")}
            onClick={friendHandler}
          >
            <i className="fas fa-address-book" title="Danh bạ"></i>
          </div>
          <div className={classes.logout} onClick={logOutHandler}>
            <i class="fa-solid fa-right-from-bracket"></i>
          </div>
        </div>

        <div
          className={classes.center + " " + (isChatInput ? classes.activeChat : "")}
        >
          {isBtnMess && (
            <ListMess
              onSendRoomToListMess={room}
              onOpenChat={isChatHandler}
              onSendSocketToListMess={socket}
            />
          )}

          {isBtnPhoneBook && (
            // <ListFriend
            //   onSendSocketToListFriend={socket} 
            //   isListSenderRequest={isListSenderRequestHandler} 
            //   onOpenChat={isChatHandlerFriend} 
            //   onSendFromListFriendToHome={onReceiveListFriend} //Để lấy biến true khi tạo nhóm chat
            // />
            <div>List Fen</div>
          )}
        </div>
        <div
          className={classes.right + " " + (isChatInput ? classes.activeChat : "")}
        >
          {isWelcome && (
            <div className={classes.first}>
              <div className={classes.content}>
                <p className={classes.tittle}>
                  Chào mừng đến với <b>ZOLA PC!</b>{" "}
                </p>
                <p className={classes.text}>
                  Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng
                  người thân, bạn bè được tối ưu hóa cho máy tính của bạn.
                </p>
              </div>
              <div className={classes.slick}>
                <Slick {...settings}>
                  <div className={classes.item}>
                    <img src={img1} alt="1" />
                    <h4>Nhắn tin nhiều hơn, soạn thảo ít hơn</h4>
                    <p>
                      Sử dụng <b>Tin Nhắn Nhanh</b> để lưu trữ các tin nhắn
                      thường dùng và gửi nhanh trong hộp thoại bất kì
                    </p>
                  </div>
                  <div className={classes.item}>
                    <img src={img2} alt="2" />
                    <h4>Gọi nhóm và làm việc hiệu quả với Lazo Group Call</h4>
                    <p>Trao đổi công việc mọi lúc mọi nơi</p>
                  </div>
                  <div className={classes.item}>
                    <img src={img3} alt="3" />
                    <h4>Trải nghiệm xuyên suốt</h4>
                    <p>
                      Kết nối và giải quyết công việc trên mọi thiết bị với dữ
                      liệu luôn được đồng bộ
                    </p>
                  </div>
                  <div className={classes.item}>
                    <img src={img4} alt="4" />
                    <h4>Gửi file năng?</h4>
                    <p>Đã có ZOLA PC "xử" hết</p>
                  </div>
                  <div className={classes.item}>
                    <img src={img5} alt="5" />
                    <h4>Chat nhóm với đồng nghiệp</h4>
                    <p>Tiện lợi hơn, nhờ các công cụ chat trên máy tính</p>
                  </div>
                  <div className={classes.item}>
                    <img src={img6} alt="6" />
                    <h4>Giải quyết công việc hiệu quả hơn, lên đến 40%</h4>
                    <p>Với ZOLA PC</p>
                  </div>
                </Slick>


              </div>
            </div>
          )}

          {isChatInput && (
            <BoxChat
              onSendSocketToBoxChat={socket}
              onSendUserToBoxChat={user}
              onSendRoomToBoxChat={room}
              onReceiveCallingFromBoxChat={receiveCallingHandler}
              onSendActiveAnswerToBoxChat={activeAnswer}
              onFormFalseFromBoxChat={formfalseHandlerFromBoxChat}
              onSendFromHomeToBoxChat={createGroup}
            />
          )}

          {isInviteFriend && isListSenderRequest && (
            // <ListSenderRequest onSendSocketToListSenderRequest={socket} />
            <div>ListSenderRequset</div>
          )}
          {!isListSenderRequest && <div>ListGroup</div>}
        </div>
      </div>
      {
        <FormLogOut
          isOpenFormLogOut={isOpenFormLogOut}
          onFormFalse={falseFromLogOut}
        ></FormLogOut>
      }
    </Fragment>
  );
};
export default Home;
