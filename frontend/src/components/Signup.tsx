import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/authAtom";
import axios from "axios";
function Signup() {
  const userDetails = useRecoilValue(userAtom);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    lastName: "",
    firstName: "",
  });

  async function signUp(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Sign Up");
    console.log(formData);
    let body = JSON.stringify({firstName:formData.firstName, lastName:formData.lastName});

    try {
        console.log({body})
      const response = await axios.post("http://localhost:8080/api/signup", 
        body,
       {headers: {'Content-Type': 'application/json',
      username: formData.email,
      password: formData.password,
    
    }});

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div>
        <p className="text-gray-400 mx-6 mt-4">

      {userDetails.signedIn ? `User Signed In ${userDetails.email}` : "Sign Up"}
        </p>
      <div className={`${userDetails.signedIn ? "hidden" : "block"}`}>
        <form method="POST" onSubmit={signUp}>
          <input 
    className="border-2 bg-gray-200 rounded mx-4 p-2"
            type="Email"
            name="Email"
            placeholder="enter Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <input
          className="border-2 bg-gray-200 rounded mx-4 p-2"
            type="password"
            name="password"
            placeholder="enter password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <input
          className="border-2 bg-gray-200 rounded mx-4 p-2"
            type="name"
            name="lastName"
            placeholder="enter last name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
          <input
          className="border-2 bg-gray-200 rounded mx-4 p-2"
            type="firstName"
            name="firstName"
            placeholder="enter firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
          <button type="submit" className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
