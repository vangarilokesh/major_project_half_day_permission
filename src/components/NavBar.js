// import React, { useState } from "react";
import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

export default function Navbar(props) {
  const navigate = useNavigate();
  // const [user, setUser] = useState(null);

  function load() {
    // const loggedInUser = localStorage.getItem("user");
    // if (loggedInUser) {
    //   const foundUser = JSON.parse(loggedInUser);
    //   setUser(foundUser);
    //   console.log(foundUser);
    // } else {
    //   alert("Login first!!");
    //   navigate("/");
    // }
    return true;
  }

  async function logout() {
    localStorage.clear();
    // setUser(null);
    navigate("/");
  }

  // let name = null;
  // if (localStorage.getItem("user") !== null) {
  //   name = localStorage.getItem("user").userid;
  // }

  return (
    <div>
      <nav className={`navbar navbar-expand-lg navbar-custom`}>
        <div className="container-fluid">
          <div className="navbar-brand mx-3">
            <Link
              className="nav-link active"
              aria-current="page"
              to={true?"/home":"/"}
            >
              {props.title}
            </Link>
          </div>
          {localStorage.getItem("user") != null && load() && (
            <div className="collapse navbar-collapse mx-3" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
<<<<<<< HEAD
                  <Link className="nav-link" to="/home">
=======
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/home">
>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c
                    Home
                  </Link>
                </li>
                <li className="nav-item">
<<<<<<< HEAD
                  <Link className="nav-link" to="/addStudent">
=======
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/addStudent">
>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c
                    Add Student
                  </Link>
                </li>
                <li className="nav-item">
<<<<<<< HEAD
                  <Link className="nav-link" to="/verify">
=======
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/verify">
>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c
                    Verify
                  </Link>
                </li>
              </ul>

              <ul className="navbar-nav">
<<<<<<< HEAD
                {/* <li>`${user.classYear}/${user.branch}/${user.section}`</li> */}
                <li className="nav-item">
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => {
                      localStorage.clear();
                      history("/");
                    }}>
                    Logout
                  </button>
                </li>
=======
                {localStorage.getItem("user") !== null && (
                  <li className="nav-item">
                    <button className="btn btn-danger mx-2" onClick={logout}>
                      Logout
                    </button>
                  </li>
                )}
>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  mode: PropTypes.string,
};
