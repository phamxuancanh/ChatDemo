import classes from "./home.module.scss";
import { useState } from "react";
import React, { Fragment, useEffect } from "react";
import addFriendAPI from "../../api/addFriendAPI";
import messageAPI from "../../api/messageAPI";
import moment from "moment";
import Moment from "react-moment";
import { format, register } from "timeago.js";
import 'moment/locale/vi'
import config from "../../config/config"
import '@fortawesome/fontawesome-free/css/all.min.css';

const ListMess = (props) => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastMess, setLastMess] = useState("");
  const [nameSender, setNameSender] = useState("");

  var localeFunc = function (number, index, totalSec) {
    // number: the timeago / timein number;
    // index: the index of array below;
    // totalSec: total seconds between date to be formatted and today's date;
    return [
      ["just now", "right now"],
      ["%s seconds ago", "in %s seconds"],
      ["1 minute ago", "in 1 minute"],
      ["%s minutes ago", "in %s minutes"],
      ["1 hour ago", "in 1 hour"],
      ["%s hours ago", "in %s hours"],
      ["1 day ago", "in 1 day"],
      ["%s days ago", "in %s days"],
      ["1 week ago", "in 1 week"],
      ["%s weeks ago", "in %s weeks"],
      ["1 month ago", "in 1 month"],
      ["%s months ago", "in %s months"],
      ["1 year ago", "in 1 year"],
      ["%s years ago", "in %s years"],
    ][index];

  };
  // register your locale with timeago
  register('my-locale', config);
  // use it


  // console.log(props.socket);

  // console.log(props.data);
  useEffect(() => {
    if (props.data.users.length > 2) {
      setUser(props.data);
      const fetchGetUser = async () => {
        try {
          setUser(props.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchGetUser();
    } else {
      const nameMessUserId = props.data.users.find((m) => m !== props.idLogin);
      const fetchGetUser = async () => {
        try {
          const requestGetUser = await addFriendAPI.getUser({
            userID: nameMessUserId,
          });
          setUser(requestGetUser.data.users);
        } catch (error) {
          console.log(error);
        }
      };
      fetchGetUser();
    }
  }, [props.data]);

  const isChatHandler = (e) => {
    props.onSendListMess({
      user: user,
      room: props.data,
    });
    //console.log(lastMess._id);
    //Đã xem(true) và chưa xem(false)
    const ReadMessage = async () => {
      try {
        const ReadMessageAPI = await messageAPI.readMessage({
          messageId: lastMess?._id,
        });
        if (ReadMessageAPI.status === 200) {
          setLastMess(ReadMessageAPI.data);
          //console.log(cancelMess.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    ReadMessage();
  };

  //  console.log(props.index);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await messageAPI.GetMessage({
          idRoom: props.data._id,
        });
        setLastMess(res.data.pop());
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, [props.onSendRoomToBoxChat]);

  // useEffect(() => {
  //   // var lastItem = messages.pop();
  //   // setLastMess(lastItem)
  // }, [messages || lastMess]) ahahahahhhhhhhhhhhhhhhh

  const time = format(lastMess?.createdAt, 'my-locale');


  useEffect(() => {
    props.socket.current.on("send-message", (data) => {
      const fetchMessage = async () => {
        try {
          const res = await messageAPI.GetMessage({
            idRoom: props.data._id,
          });
          setLastMess(res.data.pop());
        } catch (error) {
          console.log(error);
        }
      };
      fetchMessage();
    });
  }, []);

  useEffect(() => {
    props.socket.current.on("CancelMessage", (data) => {
      const fetchMessage = async () => {
        try {
          const res = await messageAPI.GetMessage({
            idRoom: props.data._id,
          });
          setLastMess(res.data.pop());
        } catch (error) {
          console.log(error);
        }
      };
      fetchMessage();
    });
  }, []);

  useEffect(() => {
    const fetchGetUser = async () => {
      try {
        const requestGetUser = await addFriendAPI.getUser({
          userID: lastMess.sender,
        });
        setNameSender(requestGetUser.data.users.name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUser();
  }, [props.onSendRoomToBoxChat || lastMess]);

  return (
    <div
      className={`${classes.mess}`}
      //key={user?._id}
      data-id={props.data._id}
      onClick={isChatHandler}
    >
      <div className={classes.avatar}>
        <img src={user?.avatar} alt="" />
      </div>
      <div className={classes.background_name_lasttext}>
        <div className={classes.name}>

          {lastMess?.readMessage ? (
            <p >{user?.name}</p>
          ) : (
            <p className={classes.unreadMessage}>{user?.name}</p>
          )}

          <p className={classes.timeago}>{time}</p>
        </div>

        <div className={classes.Lasttext}>

          {/* nếu là mình */}
          {props.idLogin === lastMess?.sender && lastMess?.type === "img" && (
            <p>
              {lastMess?.active ? (
                <p>
                  Bạn: <i className="far fa-image"></i> Hình ảnh
                </p>
              ) : (
                "Bạn: Tin nhắn đã được thu hồi"
              )}
            </p>
          )}
          {props.idLogin === lastMess?.sender && lastMess?.type === "text" && (
            <p>
              {lastMess?.active ? (
                <p>Bạn: {lastMess?.text}</p>
              ) : (
                "Bạn: Tin nhắn đã được thu hồi"
              )}
            </p>
          )}
          {props.idLogin === lastMess?.sender && lastMess?.type === "file" && (
            <p>
              {" "}
              {lastMess?.active ? (
                <p>
                  Bạn: <i className="far fa-file-alt"></i> một file
                </p>
              ) : (
                "Bạn: Tin nhắn đã được thu hồi"
              )}{" "}
            </p>
          )}
          {props.idLogin === lastMess?.sender && lastMess?.type === "video" && (
            <p>
              {" "}
              {lastMess?.active ? (
                <p>
                  Bạn: <i className="far fa-file-video"></i> một video
                </p>
              ) : (
                "Bạn: Tin nhắn đã được thu hồi"
              )}{" "}
            </p>
          )}
          {props.idLogin === lastMess?.sender && lastMess?.type === "gif" && (
            <p>
              {" "}
              {lastMess?.active ? (
                <p>
                  Bạn: <i className="fab fa-waze"></i> GIF
                </p>
              ) : (
                "Bạn: Tin nhắn đã được thu hồi"
              )}{" "}
            </p>
          )}

          {/* Nếu không phải là mình */}
          {props.idLogin !== lastMess?.sender && lastMess?.type === "img" && (
            <p>
              {lastMess?.active ? (
                lastMess?.readMessage ? (
                  <p>
                    {nameSender}: <i className="far fa-image"></i> Hình ảnh
                  </p>
                ) : (
                  <Fragment>
                    <p className={classes.unreadMessage}>
                      {nameSender}: <i className="far fa-image"></i> Hình ảnh
                    </p>
                    <div className={classes.signalUnreadMessage}>
                      <span>!</span>
                    </div>
                  </Fragment>
                )
              ) : (
                <p>{nameSender}: Tin nhắn đã được thu hồi</p>
              )}
            </p>
          )}
          {props.idLogin !== lastMess?.sender && lastMess?.type === "text" && (
            <p>
              {lastMess?.active ? (
                lastMess?.readMessage ? (
                  <p>
                    {nameSender}: {lastMess?.text}
                  </p>
                ) : (
                  <Fragment>
                    <p className={classes.unreadMessage}>
                      {nameSender}: {lastMess?.text}
                    </p>
                    <div className={classes.signalUnreadMessage}>
                      <span>!</span>
                    </div>
                  </Fragment>
                )
              ) : (
                <p>{nameSender}: Tin nhắn đã được thu hồi</p>
              )}
            </p>
          )}
          {props.idLogin !== lastMess?.sender && lastMess?.type === "file" && (
            <p>
              {lastMess?.active ? (
                lastMess?.readMessage ? (
                  <p>
                    {nameSender}: <i className="far fa-file-alt"></i> File
                  </p>
                ) : (
                  <Fragment>
                    <p className={classes.unreadMessage}>
                      {nameSender}: <i className="far fa-file-alt"></i> File
                    </p>
                    <div className={classes.signalUnreadMessage}>
                      <span>!</span>
                    </div>
                  </Fragment>
                )
              ) : (
                <p>{nameSender}: Tin nhắn đã được thu hồi</p>
              )}
            </p>
          )}
          {props.idLogin !== lastMess?.sender && lastMess?.type === "video" && (
            <p>
              {lastMess?.active ? (
                lastMess?.readMessage ? (
                  <p>
                    {nameSender}: <i className="far fa-file-video"></i> Video
                  </p>
                ) : (
                  <Fragment>
                    <p className={classes.unreadMessage}>
                      {nameSender}: <i className="far fa-file-video"></i> Video
                    </p>
                    <div className={classes.signalUnreadMessage}>
                      <span>!</span>
                    </div>
                  </Fragment>
                )
              ) : (
                <p>{nameSender}: Tin nhắn đã được thu hồi</p>
              )}
            </p>
          )}
          {props.idLogin !== lastMess?.sender && lastMess?.type === "gif" && (
            <p>
              {lastMess?.active ? (
                lastMess?.readMessage ? (
                  <p>
                    {nameSender}: <i className="fab fa-waze"></i> GIF
                  </p>
                ) : (
                  <Fragment>
                    <p className={classes.unreadMessage}>
                      {nameSender}: <i className="fab fa-waze"></i> GIF
                    </p>
                    <div className={classes.signalUnreadMessage}>
                      <span>!</span>
                    </div>
                  </Fragment>
                )
              ) : (
                <p>{nameSender}: Tin nhắn đã được thu hồi</p>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListMess;
