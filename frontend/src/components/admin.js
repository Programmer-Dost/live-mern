import React, { useEffect, useState } from "react";
import { adminAtom } from "../store/atoms/authAtom";
import { useRecoilValue } from "recoil";
import axios from "axios";

function Admin() {
  const adminDetails = useRecoilValue(adminAtom);
  const [UserList, setUserList] = useState([]);
  async function fetchUsers() {
    console.log("Fetching users...");
    let response = await axios.get("http://localhost:8080/api/admin", {
      headers: {
       "username": "admin@gmail.com",
        "password": "abhijeet@gmail.com",
      },
    });
    console.log(response)
    setUserList(response.data.users);
  }
  useEffect(() => {
  if(adminDetails.adminId){
    fetchUsers()
  }
  }, [adminDetails]);

  return (
    <div>
      <p className="text-gray-400 mx-6 my-2">
      Admin
        </p> 
      <button onClick={fetchUsers} className="border mx-4 mb-4 bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">Get Users</button>
      <div className="m-4">
      {UserList?.map((user)=>(
        <div key={user.id} className="bg-gray-200 m-2 w-64 p-4 rounded ">
        <h1 className="text-gray-500">{user.firstName}</h1>
        <p className="text-gray-600">Last Name: {user.lastName}</p>
        <p className="text-gray-600">Email:{user.email}</p>
        <button className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">Edit</button>
        </div>
        ))}
        </div>
    </div>
  );
}

export default Admin;
