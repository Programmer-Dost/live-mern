import axios from "axios";
import { atom, atomFamily, selectorFamily } from "recoil";
interface todoListType {
  id: number;
  text: string;
  isComplete: boolean;
}
interface todos{

}
export const todoList = atom({
  key: "todoList",
  default: [
    {
      id: 0,
      text: "",
      isComplete: false,
    } as todoListType,
  ],
});

export const myAtomFamily = atomFamily({
    key: "MyAtom",
    default: selectorFamily({//asynchronously fetch data from server. Works with atom family, do not use just selector for atom family use selector family instead for avoiding duplicate keys
      key: 'MyAtom/Default',
      get: (id) => async ({get}) => { // get function to get another atom's value
        const otherAtomValue = get(todoList);//get another atom
        const res = await axios.get(`http://localhost:3000/todos/${id?.toString()}`)
        return res.data.result;
      },
    }),
  });