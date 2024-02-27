import classes from "./home.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import React, { useEffect, Fragment } from "react";
import addFriendAPI from "../../api/addFriendAPI";
// import Dropdown from 'react-dropdown';
import "react-dropdown/style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import groupAPI from "../../api/groupAPI";

toast.configure();
const Member = (props) => {
  const [user, setUser] = useState(null);
  const [isOpenFormRemoveMember, setIsOpenFormRemoveMember] = useState({
    isOpenFormRemoveMember: true,
  });
  const [activeDelete, setActiveDelete] = useState(false);

  const loggedInUser = useSelector((state) => state.user.current);
  const idLogin = loggedInUser._id;

  useEffect(() => {
    const fetchGetUser = async () => {
      try {
        const requestGetUser = await addFriendAPI.getUser({
          userID: props.user,
        });
        setUser(requestGetUser.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUser();
  }, []);

  //truyền lệnh mở form removemember lên cho boxchat
  const openFormRemoveMemberHandler = () => {
    setIsOpenFormRemoveMember((pre) => {
      return { ...pre, isOpenFormRemoveMember: true };
    });
    props.OpenFormRemoveMember(isOpenFormRemoveMember.isOpenFormRemoveMember);
    props.SendUserToBoxChat(user);
  };

  //nhận lệnh đóng form removemember từ boxchat
  useEffect(() => {
    if (props.isCloseFormRemoveMember) {
      setIsOpenFormRemoveMember({
        isOpenFormRemoveMember: props.isCloseFormRemoveMember,
      });
    }
  }, [props.isCloseFormRemoveMember]);

  const openTransLeaderHandler = (event) => {
    event.preventDefault();
    const fetchTransLeader = async () => {
      try {
        const transLeader = await groupAPI.swapRoomMaster({
          id: props.room._id,
          userWantSwap: user._id,
        });
        console.log(transLeader);
        if (transLeader.status === 200) {
          toast.success("Chuyển nhóm trưởng thành công", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
          props.onFormFalse(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransLeader();
  };

  // console.log(user);
  // console.log(props.master)
  // console.log(props.room);

  const deleteActive = () => {
    setActiveDelete(!activeDelete);
  };

  return (
    <Fragment>
      {idLogin === props.master && (
        <div className={classes.member} key={props.user}>
          <div className={classes.Memberleft}>
            <div className={classes.avatarMember}>
              <img src={user?.avatar} alt="" />
            </div>
            <div className={classes.nameMember}>
              <p>{user?.name}</p>
              <p className={classes.master}>
                {user?._id === props.master ? "Trưởng Nhóm" : ""}
              </p>
            </div>
          </div>
          {user?._id !== props.master && (
            <div className={classes.delete}>
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
                      <li onClick={openTransLeaderHandler}>
                    
                        <a>Chuyển nhóm trưởng</a>
                      </li>
                      <li
                        onClick={openFormRemoveMemberHandler}
                        className={classes.last}
                      >
            
                        <a>Mời ra khỏi nhóm</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}

      {idLogin !== props.master && (
        <div className={classes.member} key={props.user}>
          <div className={classes.Memberleft}>
            <div className={classes.avatarMember}>
              <img src={user?.avatar} alt="" />
            </div>
            <div className={classes.nameMember}>
              <p>{user?.name}</p>
              <p className={classes.master}>
                {user?._id === props.master ? "Trưởng Nhóm" : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Member;
