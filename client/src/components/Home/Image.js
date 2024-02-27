import React, { Fragment } from "react";
import classes from "./home.module.scss";
import { useState, useEffect } from "react";
import FormViewImage from "./form-video/FormViewImage";

const Image = (props) => {
  const [isOpenFormViewImage, setIsOpenFormViewImage] = useState(false);
  const viewImageHandler = () => {
    setIsOpenFormViewImage(true);
  };

  useEffect(() => {
    props.onReceiveIsOpenFormViewImage({isOpenFormViewImage: isOpenFormViewImage,data: props.data})
  },[isOpenFormViewImage])

  return (
    <Fragment>
      {props.data.type === "img" ? (
        <div
          className={classes.image}
          data-id={props.data}
          onClick={viewImageHandler}
        >
          <img src={props.data.text} alt="" onClick={viewImageHandler} />
        </div>
      ) : props.data.type === "video" ? (
        <div className={classes.image}>
          <video src={props.data.text}></video>
        </div>
      ) : (
        ""
      )}
      {/* <FormViewImage
        messages={props.messages}
        isOpenFormViewImage={isOpenFormViewImage}
        onFormFalse={falseFromViewImage}
        data={props.data}
      /> */}
    </Fragment>
  );
};

export default Image;
