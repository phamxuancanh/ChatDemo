import React from "react";
import { Fragment } from "react";
import OwlCarousel from "react-owl-carousel";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
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

  const navigate = useNavigate();

  useEffect(() => {
    setAvatar(loggedInUser.avatar);
  }, []);
  return (
    <Fragment>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <div className={classes.avatar} onClick={formInformationHandler}>
            <img src={avatar} alt="" />
            <div className={classes.active}></div>
          </div>
          <div
            className={`${classes.mess} ${
              isBtnMess ? classes.activetoggle : ""
            } `}
            onClick={btnMessHandler}
          >
            <i className="fas fa-comment" title="Tin nhắn"></i>
          </div>
          <div
            className={`${classes.friend} ${
              isBtnPhoneBook ? classes.activetoggle : ""
            } `}
            onClick={friendHandler}
          >
            <i className="fas fa-address-book" title="Danh bạ"></i>
          </div>
          <div className={classes.logout} onClick={logOutHandler}>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>

        <div
          className={`${classes.center} ${
            isChatInput ? classes.activeChat : ""
          }`}
        >
          {isBtnMess && (
            <ListMess
              onSendRoomToListMess={room}
              onOpenChat={isChatHandler}
              onSendSocketToListMess={socket}
            />
          )}

          {isBtnPhoneBook && (
            <ListFriend
              onSendSocketToListFriend={socket}
              isListSenderRequest={isListSenderRequestHandler}
              onOpenChat={isChatHandlerFriend}
              onSendFromListFriendToHome={onReceiveListFriend} //Để lấy biến true khi tạo nhóm chat
            />
          )}
        </div>

        <div
          className={`${classes.right} ${
            isChatInput ? classes.activeChat : ""
          }`}
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
              <div className={classes.owl}>
                <OwlCarousel options={options}>
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
                </OwlCarousel>
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
            <ListSenderRequest onSendSocketToListSenderRequest={socket} />
          )}
          {!isListSenderRequest && <ListGroup></ListGroup>}
        </div>
      </div>
    </Fragment>
  );
};
export default Home;
