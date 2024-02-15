import { atom, selector } from "recoil";
interface userAuth{
  email: string | null,
  signedIn: boolean,
  userId:number
}
export const userAtom =  atom({
    key: "userStates", // unique ID (with respect to other atoms/selectors)
    default: {
        email:null,
        signedIn:localStorage.getItem('user') !== null,
        userId:0
    } as userAuth, // default value (aka initial value)
  });
  
export const adminAtom =  atom({
    key: "adminStates", // unique ID (with respect to other atoms/selectors)
    default: {
        email:null,
        signedIn:false,
        adminId:0
    }, // default value (aka initial value)
  });
  