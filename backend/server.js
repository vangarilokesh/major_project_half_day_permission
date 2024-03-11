const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://lokesh:qwerty56@cluster0.yhoanuy.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("mongodb-login connected");
  })
  .catch((e) => {
    console.log(e);
    console.log("failed");
  });

const newTeacherSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  classYear: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const passHistory = new mongoose.Schema({
  rollno: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  passGeneratedDate: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const outPassSchema = new mongoose.Schema({
  rollno: {
    type: String,
    required: true,
    unique: true,
  },
  reason: {
    type: String,
    required: true,
  },
  passGeneratedDate: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const newStudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  yearOfJoining: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
});

// we use teacherDB fro storing teacher details for login and other purposes
const teacherdb = mongoose.model("teacherdb", newTeacherSchema);

const outPassCollection = mongoose.model("outPassCollection", outPassSchema);

const passCollections = mongoose.model("passCollections", passHistory);

const studentdb = mongoose.model("studentdb", newStudentSchema);

app.get("/", cors(), (req, res) => {});

app.post("/login", async (req, res) => {
  const { userid, password } = req.body;
  try {
    const check = await teacherdb.findOne({
      userid: userid,
      password: password,
    });
    if (check) {
      res.json("exist");
    } else {
      res.json("not exist");
    }
  } catch (e) {
    res.json("not exist with error");
  }
});

app.post("/signup", async (req, res) => {
  const { name, userid, password, branch, classYear, section, phoneNumber } =
    req.body;

  const data = {
    name: name,
    userid: userid,
    password: password,
    branch: branch,
    classYear: classYear,
    section: section,
    phoneNumber: phoneNumber,
  };

  try {
    const check = await teacherdb.findOne({
      branch: branch,
      classYear: classYear,
      section: section,
    });
    if (check) {
      res.json("already exist");
    } else {
      await teacherdb.insertMany([data]);
      res.json("added");
    }
  } catch (e) {
    res.json("not exist with error");
    console.log(e);
  }
});

app.post("/addStudent", async (req, res) => {
  const { userid, name, rollno, yearOfJoining, branch, section, phoneNumber } =
    req.body;
  //var currentTime = new Date();
  //let currentYear = currentTime.getFullYear();
  // console.log("User id: "+userid);
  const userDetails = await teacherdb.findOne({
    userid: userid,
  });
  // console.log("User Details: " + userDetails);
  const data = {
    name: name,
    rollno: rollno,
    yearOfJoining: yearOfJoining,
    branch: branch,
    section: section,
    phoneNumber: phoneNumber,
  };

  if (
    userDetails.branch !== branch ||
    /* userDetails.classYear !== currentYear - yearOfJoining + 1 ||*/
    userDetails.section !== section
  ) {
    res.json("Can't add other class student");
  } else {
    try {
      const check = await studentdb.findOne({
        name: name,
        rollno: rollno,
        yearOfJoining: yearOfJoining,
        branch: branch,
        section: section,
      });
      if (check) {
        console.log("Line 177");
        res.json("already exist");
      } else {
        console.log("Line 180");
        await studentdb.insertMany([data]);
        console.log("Line 182");
        res.json("added");
      }
    } catch (e) {
      console.log(e);
      res.json("not exist with error");
    }
  }
});

// need to change getAllStudents to get userid then process year and class then get class data
app.post("/getClass", async (req, res) => {
  try {
    var currentTime = new Date();
    let currentYear = currentTime.getFullYear();
    const { userid } = req.body;
    // console.log(userid);
    const userDetails = await teacherdb.findOne({
      userid: userid,
    });
    console.log("User Details: " + userDetails);
    const arr = await studentdb.find({
      yearOfJoining: currentYear - userDetails.classYear + 1,
      branch: userDetails.branch,
      section: userDetails.section,
    });
    res.json(arr);
  } catch (e) {
    console.log(e);
    res.json("error in reading from student db");
  }
});

// generatePass will generate pass and add it to outPassCollection
app.post("/generatePass", async (req, res) => {
  const { rollno, reason, startDate, endDate } = req.body;
  var currentTime = new Date();
  const passData = {
    rollno: rollno,
    reason: reason,
    startDate: startDate,
    endDate: endDate,
    passGeneratedDate: currentTime,
  };
  try {
    const check = await outPassCollection.findOne({
      rollno,
    });
    if (check) {
      res.json("already exists");
    } else {
      await outPassCollection.insertMany([passData]);
      res.json("added");
    }
  } catch (e) {
    console.log(e);
    res.json("not exist with error");
  }
});

// verify pass is in outPassCollection or not; if present need to add it to passCollection and then delete from outPassCollection
app.post("/verifyPass", async (req, res) => {
  let currentTime = new Date();
  const { rollno } = req.body;
  console.log("roll number: " + rollno);
  try {
    const check = await outPassCollection.findOne({
      rollno,
    });
    if (check) {
      console.log("checked" + check);
      const passData = {
        rollno: rollno,
        reason: check.reason,
        passGeneratedDate: check.passGeneratedDate,
        startDate: currentTime,
        endDate: check.endDate,
      };
      await outPassCollection.deleteOne({
        rollno,
      });
<<<<<<< HEAD
      // console.log("deleted from outPass");
      // console.log("Going to insert into history");
      //await passCollection.insertMany([passData]);
      //console.log("inserted to history");
=======
      console.log("deleted from outPass");
      console.log("Going to insert into history");
      await passCollections.insertMany([passData]);
      console.log("inserted to history");
>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c
      if (check.endDate > currentTime && check.startDate <= currentTime) {
        const data = {
          rollno: rollno,
          reason: check.reason,
          startDate: currentTime + 1, // creating pass for next day automatically add it to collection
          endDate: check.endDate,
          passGeneratedDate: currentTime,
        };
        console.log("Inside if");
<<<<<<< HEAD
        // await outPassCollection.insertMany(data);
=======
        await outPassCollection.insertOne(data);
>>>>>>> 099caba9cccd6b77915aca32b369972477799a5c
        console.log("added to outPass");
      }
      res.json("valid");
    } else {
      res.json("invalid");
    }
  } catch (error) {
    console.log(error);
    res.json("error");
  }
});

// app.post("/update", async (req, res) => {
//   const { name, rollno, phoneno, college } = req.body;

//   const data = {
//     name: name,
//     rollno: rollno,
//     phoneno: phoneno,
//     college: college,
//   };
//   try {
//     console.log("149");
//     const check = await studentdb.findOne({ rollno: rollno });
//     if (check) {
//       await studentdb.updateOne(
//         { rollno: rollno },
//         {
//           name: name,
//           phoneno: phoneno,
//           college: college,
//         }
//       );
//       res.json("updated");
//     } else {
//       await studentdb.insertMany([data]);
//       res.json("added");
//     }
//   } catch (e) {}
// });

// app.post("/delete", async (req, res) => {
//   const { rollno } = req.body;

//   try {
//     console.log("172");
//     const check = await studentdb.findOne({ rollno: rollno });
//     if (check) {
//       console.log(check);
//       await studentdb.deleteOne({ rollno: rollno });
//       res.json("deleted");
//     } else {
//       res.json("not existing");
//     }
//   } catch (e) {}
// });

// app.post("/search", async (req, res) => {
//   console.log(req.body);
//   const { rollno } = req.body;
//   try {
//     console.log(rollno);
//     const check = await studentdb.findOne({ rollno: rollno });
//     if (check != null) {
//       console.log(check);
//       res.json(check);
//     } else {
//       res.json("not existing");
//     }
//   } catch (e) {}
// });

app.post("/delete", async (req, res) => {
  try {
    console.log(req.body);
    const { rollno } = req.body;

    if (!rollno) {
      return res.status(400).json({ error: "Roll number is required." });
    }
    console.log("one");
    if (typeof rollno !== "string" || rollno.trim() === "") {
      return res.status(400).json({ error: "Invalid roll number format." });
    }
    console.log("two");
    const deletedOutPass = await studentdb.deleteOne({ rollno });

    if (deletedOutPass.deletedCount === 0) {
      return res.status(404).json({ error: "Roll number not found." });
    }
    console.log("three");

    return res.status(200).json({ message: "Deletion successful." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(8000, () => {
  console.log("running backend at 8000");
});
