import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const history = useNavigate();
  const [allStudents, setAllStudents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    } else {
      alert("Login first!!");
      history("/");
    }
  }, []);

  async function getAllStudents(e) {
    try {
      await axios
        .post("http://127.0.0.1:8000/getClass", {
          userid: user.userid,
        })
        .then((res) => {
          if (res.data !== null) {
            setAllStudents(res.data);
            // console.log(res.data);
          } else {
            alert("failed to load");
          }
        })
        .catch((e) => {
          alert("error");
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="container my-3">
      <h1 style={{ fontFamily: "fantasy" }}>Home</h1>
      {allStudents.length === 0 && <h4>Click here to get students list</h4>}
      {allStudents.length !== 0 && (
        <h4>Select student for pass generation: </h4>
      )}
      {allStudents.length === 0 && (
        <button className="btn btn-success" onClick={getAllStudents}>
          Click
        </button>
      )}
      <div className="row my-3">
        {allStudents.length !== 0 &&
          allStudents.map((student, index) => (
            <div className="col-md-4 my-3" key={index}>
              <Card name={student.name} rollno={student.rollno} />
            </div>
          ))}
      </div>
    </div>
  );
}
