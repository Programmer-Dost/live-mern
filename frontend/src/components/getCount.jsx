// import React from 'react'
import { countState } from '../store/atoms/countAtom';
import { useState } from 'react';
import {
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';

  
  function GetCount() {
    const [number, setNumber] = useRecoilState(countState);
    console.log("rerendering count")
    const onChange = (event) => {
      setNumber(event.target.value);
    };
  
    return (
      <div>
        <input type="number" value={number} onChange={onChange} />
        <br />
        Echo: {number}
   <p>{number%2==0 ? "Even" : ""}</p>
      </div>
    );
  }
  
  export default GetCount