import { countState, getSelector } from "../store/atoms/countAtom";
import { useState, useEffect, ChangeEvent } from "react";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/authAtom";
import { useNavigate } from "react-router-dom";

function GetCount() {
  const [number, setNumber] = useRecoilState<number>(countState);
  console.log("rerendering count");
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value)>0) {
      let inputValue = event.target.value;
      const parsedValue = parseInt(inputValue);
      setNumber(parsedValue);
    }
  };
  const [userDetails, setUserDetails] = useRecoilState(userAtom);
  const getSelectore = useRecoilValue(getSelector)
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
        Echo: {number} {getSelectore? "is Even" : "is Odd"}
      </p>
      <span className="text-gray-500 ml-4">{userDetails.email}</span>
    </div>
  );
}

export default GetCount;
