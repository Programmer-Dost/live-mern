import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Landing from "./components/landing";
import GetCount from "./components/getCount";
import SignIn from "./components/signIn";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import Signup from "./components/Signup";
import Admin from "./components/admin";
import TodoList from "./components/TodoList";
const Dashboard = React.lazy(() => import("./components/dashboard"));
// import Dashboard from "./components/dashboard";
function App() {
  return (
    <div>
      <RecoilRoot>
        <BrowserRouter>
          <Appbar />
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<Loading />}>
                  <Dashboard />{" "}
                </Suspense>
              }
            />

            <Route path="/" element={<GetCount />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/todo" element={<TodoList />} />
          </Routes>
          {/* <Rerender /> */}
        </BrowserRouter>
      </RecoilRoot>
      {/* <div>
   <button onClick={() => (window.location.href = "/dashboard")}>
   Dashboard
   </button>
   Will refresh the page each time, re-bundle js and re-load index.js 
   <button onClick={() => (window.location.href = "/landing")}>
   landing
   </button>
 </div> */}
    </div>
  );
}
function Loading() {
  return <div>Loading</div>;
}
function Appbar() {
  const navigate = useNavigate();
  return (
    <div>
            <button
        className="border bg-blue-400 hover:bg-blue-700 mt-4 ml-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      <button
        className="border bg-blue-400 hover:bg-blue-700 mt-4    text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Dashboard
      </button>
      {/*  Will refresh the page each time, re-bundle js and re-load index.js */}
      <button
        className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        onClick={() => {
          navigate("/signin");
        }}
      >
        Sign In
      </button>
      <button
        className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        onClick={() => {
          navigate("/admin");
        }}
      >
        Admin
      </button>
      <button
        className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        onClick={() => {
          navigate("/signin");
        }}
      >
        Sign Up
      </button>
      <button
        className="border bg-blue-400 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        onClick={() => {
          navigate("/todo");
        }}
      >
       Todo
      </button>
    </div>
  );
}

function Rerender() {
  console.log("Rerender");
  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default App;
