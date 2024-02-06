import React, {Suspense} from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Landing from "./components/landing";
import GetCount from "./components/getCount";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
const Dashboard = React.lazy(() => import("./components/dashboard"));

// import Dashboard from "./components/dashboard";
function App() {
  return (
    <div>
      {/* <div>
      <button onClick={() => (window.location.href = "/dashboard")}>
      Dashboard
      </button>
      Will refresh the page each time, re-bundle js and re-load index.js 
      <button onClick={() => (window.location.href = "/landing")}>
      landing
      </button>
    </div> */}
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
        </Routes>
        <Rerender />
      </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}
function Loading() {
  return <div>Loading</div>;
}
function Appbar() {
  const navigate = useNavigate();
  // function handleNavigate() {
  //   navigate("/");
  // }
  return (
    <div>
      <button
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Dashboard
      </button>
      {/*  Will refresh the page each time, re-bundle js and re-load index.js */}
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        landing
      </button>
    </div>
  );
}

function Rerender() {
  console.log("Rerender")
  return (
    <div><Dashboard /></div>
  )
}

export default App;
