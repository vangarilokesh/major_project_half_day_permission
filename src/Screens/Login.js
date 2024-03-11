import React, { useState, useEffect } from "react";
import axios from "axios";
<<<<<<< HEAD
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom";
>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c

export default function Login(props) {
  const history = useNavigate();

  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);

  const nav = () => {
    history("/signup");
  };
<<<<<<< HEAD
  const scan = () => {
    history("/scan");
  };
=======

  const scan = () => {
    history("/scan");
  };

>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c
  async function handleLogin(e) {
    e.preventDefault();

    try {
      await axios
        .post("http://127.0.0.1:8000/login", {
          userid,
          password,
        })
        .then((res) => {
          if (res.data === "exist") {
            // await axios.post("http://127.0.0.1:8000/getTeacher")
            const userData = {
              userid: userid,
            };
            localStorage.setItem("user", JSON.stringify(userData));
            history("/home");
          } else if (res.data === "not exist") {
            alert("User has not registered");
          } else if (res.data === "not exist with error") {
            alert("Error occured while login");
          }
        })
        .catch((e) => {
          alert("wrong details");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="container my-5" id="login">
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="userid">User Id</label>
          <input
            type="text"
            className="form-control"
            id="userid"
            aria-describedby="userid"
            placeholder="Enter User Id"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="userPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleLogin}>
          Submit
        </button>
        <button className="btn btn-warning mx-3" onClick={nav}>
          SignUp
        </button>
<<<<<<< HEAD
        <button className="btn btn-secondary" onClick={scan}>
=======
        <button className="btn btn-primary my-3 mx-3" onClick={scan}>
>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c
          Scan ID card
        </button>
      </form>
    </div>
  );
}
