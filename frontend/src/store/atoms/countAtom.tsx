import React from "react";
import { atom, selector } from "recoil";

export const countState = atom({
  key: "countStates", // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});

export const getSelector = selector({
  key: "getSelector", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const count = get(countState);
    return count % 2 === 0; 
  },
});
