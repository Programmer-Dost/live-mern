import { atom, selector } from "recoil";
export const userAtom =  atom({
    key: "userStates", // unique ID (with respect to other atoms/selectors)
    default: {
        email:null,
        signedIn:localStorage.getItem('user') !== null,
        userId:0
    }, // default value (aka initial value)
  });
  
export const adminAtom =  atom({
    key: "adminStates", // unique ID (with respect to other atoms/selectors)
    default: {
        email:null,
        signedIn:false,
        adminId:0
    }, // default value (aka initial value)
  });
  