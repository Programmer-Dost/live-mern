import React from "react";
import { atom, selector, atomFamily, selectorFamily } from "recoil";
import axios from "axios";
export const countState = atom({
  key: "countStates", // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});

export const getSelector = selector({
  key: "getSelector", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const count = get(countState);
    // const anotherItem = get(antherItemState);
    return count % 2 === 0;
  },
});
async function getData() {
  let response = await axios.get("/api/fruits");
  return response.data.result;
}
export const fruitData = atom({
  key: "fruitData",
  default: selector({
    key: "fruitSelector",
    get: getData
  }),
});
let arr = [{ id: 2 }, { id: 3 }, { id: 5 }, { id: 2 }];
export const fruitFamily = atomFamily({
  key: "fruitFamily",
  default: id => {
    return arr.find(x => x.id === id);
  },
});

export const myAtomFamily = atomFamily({
  key: "MyAtom",
  default: selectorFamily({//asynchronously fetch data from server. Works with atom family, do not use just selector for atom family use selector family instead for avoiding duplicate keys
    key: 'MyAtom/Default',
    get: (id) => async ({get}) => { // get function to get another atom's value
      const otherAtomValue = get(fruitData);//get another atom
      const res = await axios.get(`http://localhost:3000/fruits/${id?.toString()}`)
      return res.data.result;
    },
  }),
});
