import React, { useEffect, useState } from "react";
import { adminAtom } from "../store/atoms/authAtom";
import { useRecoilValue } from "recoil";
import axios from "axios";

function Admin() {
  const adminDetails = useRecoilValue(adminAtom);
  const [UserList, setUserList] = useState([]);
   // Just for fun request interceptor
   axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers['username']= "admin@gmail.com";//modify config.headers and return new config
    console.log("HTTP request interceptor")
    return config;//return modified config
  }, function (error) {
    // Do something with request error
    console.log("HTTP error interceptor")
    return Promise.reject(error);//rejecting promise chain for handling encountered error
  });
  async function fetchUsers() {
    console.log("Fetching users...");
    let response = await axios.get("http://localhost:8080/api/admin", {
      headers: {
        username: "admin.com",
        password: "abhijeet@gmail.com",
      },
    });
    console.log(response);
    setUserList(response.data.users);
  }
  useEffect(() => {
    if (adminDetails.adminId) {
      fetchUsers();
    }
  }, [adminDetails]);
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  return (
    <div>
      <p className="text-gray-400 mx-6 my-2">Admin</p>
      <button
        onClick={fetchUsers}
        className="border mx-4 mb-4 bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
      >
        Get Users
      </button>
      <div className="m-4">
        {UserList?.map((user: User) => (
          <div key={user.id} className="bg-gray-200 m-2 w-64 p-4 rounded ">
            <h1 className="text-gray-500">{user.firstName}</h1>
            <p className="text-gray-600">Last Name: {user.lastName}</p>
            <p className="text-gray-600">Email:{user.email}</p>
            <button className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
