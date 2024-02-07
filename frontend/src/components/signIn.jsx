import React, { useState } from "react";
import { userAtom } from "../store/atoms/authAtom";
import { useRecoilState } from "recoil";
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userAtoms, setUserAtoms] = useRecoilState(userAtom);
  async function signIn(e) {
    e.preventDefault();
    console.log("sign in clicked");
    try {
      const res = await fetch("http://localhost:8080/api/signin", {
        headers: {
          "Content-Type": "application/json",
          username: email,
          password: password,
        },//who moved my cheese
      });
      const responseData = await res.json();
      if (responseData.result.id) {
        setUserAtoms({
          email: responseData.result.email,
          signedIn: true,
          id: responseData.result.id,
        });
        // console.log(responseData.token)
        localStorage.setItem('user', responseData.result.email)
        console.log("Signed in");
        console.log(responseData.result);
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div>
      <p className="text-gray-400 mx-6 mt-4">   {userAtoms.signedIn ? `User Signed In ${userAtoms.email}` : "Sign In"}</p>
      <form method="GET" onSubmit={signIn}>
        <input className="border-2 bg-gray-200 rounded mx-4 p-2"
          type="Email"
          name="Email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
        className="border-2 bg-gray-200 rounded mr-4 p-2"
          type="password"
          name="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
