// import React from 'react'
import { countState } from "../store/atoms/countAtom";
import { useState, useEffect } from "react";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/authAtom";
import { useNavigate } from "react-router-dom";
// const jwt = require("jsonwebtoken");

function GetCount() {
  const [number, setNumber] = useRecoilState(countState);
  console.log("rerendering count");
  const onChange = (event) => {
    setNumber(event.target.value);
  };
  const [userDetails, setUserDetails] = useRecoilState(userAtom);
  const Router = useNavigate();
  useEffect(() => {
    if (!userDetails.signedIn) {
      Router("/signin");
    }
    if (window != undefined) {
      let userEmail = localStorage.getItem("user");
      setUserDetails((prev) => ({
        ...prev,
        email: userEmail,
      }));
      //   let email = jwt.decode(token, "jwt-sign");
      //   console.log(email);
    }
  }, []);
  return (
    <div>
      <input
        type="number"
        value={number}
        onChange={onChange}
        className="border-2 bg-gray-200 rounded mx-4 p-2 mt-4"
      />
      <br />
      <p className="text-gray-500 ml-4">
        Echo: {number} {number > 0 && number % 2 == 0 ? "is Even" : "is Odd"}
      </p>
      <span className="text-gray-500 ml-4"></span>
    </div>
  );
}

export default GetCount;
