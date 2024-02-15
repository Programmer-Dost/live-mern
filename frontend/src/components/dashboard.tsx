import { useRecoilValue } from "recoil";
import { countState, fruitFamily } from "../store/atoms/countAtom";
import { userAtom } from "../store/atoms/authAtom";
interface props{
  id:number
}
function Fruits({id}:props) {
  let myfruit = useRecoilValue(fruitFamily(id));
  return (
    <div>fruit type {myfruit && myfruit.id}</div>
  )
}
function Dashboard() {
  const userDetails = useRecoilValue(userAtom);
  const number = useRecoilValue(countState);
  
  return (
    <div className=" mx-6 mt-4 text-gray-500">
      {" "}
      <p className="text-gray-400">
        {userDetails.signedIn
          ? `User Signed In ${userDetails.email}`
          : "Sign In"}{" "}
      </p>
      Notice: Dashboard is getting {number} count value from recoil atom
<Fruits id={2} />
    
    </div>
  );
}


export default Dashboard;
