import React, { useState } from "react";
import { database } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

//React Toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [nic, setNIC] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("hospital");
  const [patientData, setPatientData] = useState("");

  const handleNICChange = (event) => {
    setNIC(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const fetchPatientData = async () => {
    const patientRef = doc(database, "patients", nic);
    try {
      const patientDoc = await getDoc(patientRef);

      if (patientDoc.exists()) {
        const rawData = patientDoc.data();

        const dashboardData = (data) => {
          return {
            personalDetails: data.PersonalDetails || {},
            medicalHistory: data.MedicalHistory || {},
            riskBehaviour: data.RiskBehaviour || {},
            familyHistory: data.FamilyHistory || {},
            medicalExamination: data.MedicalExamination || {},
            investigations: data.Investigations || {},
            riskPrediction: data.RiskPrediction || {},
            action: data.Action || {},
          };
        };

        const patientData = dashboardData(rawData);

        return patientData;
      } else {
        toast.error("No patient found with that NIC");
      }
    } catch (error) {
      toast.error(`Error searching for patient: ${error.message}`);
    }
  };

  const handleSuccessfulLogin = async (event) => {
    event.preventDefault();

    try {
      if (userType === "normal") {
        const usersRef = collection(database, "users");
        const q = query(usersRef, where("nic", "==", nic));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast.error("Normal user not found");
          return;
        }

        querySnapshot.forEach(async (doc) => {
          const user = doc.data();
          if (user.password === password) {
            const patientData = await fetchPatientData();
            console.log("patient data", patientData);
            toast.success("Successfully logged in!");
            navigate("/UserDashboard", { state: { patientData } });
            handleLogin("normal");
          } else {
            toast.error("Incorrect password!");
          }
        });
      } else if (userType === "hospital") {
        const hospitalsRef = collection(database, "hospitals");
        const q = query(hospitalsRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast.error("Hospital not found");
          return;
        }

        querySnapshot.forEach((doc) => {
          const hospital = doc.data();
          if (hospital.password === password) {
            toast.success("Successfully logged in!");
            navigate("/HospitalDashboard");
            handleLogin("hospital");
          } else {
            toast.error("Incorrect password");
          }
        });
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="login-form">
      <h2>Login to NCDMS</h2>

      <form onSubmit={handleSuccessfulLogin}>
        <div className="form-group">
          <label htmlFor="userType">User Type:</label>
          <select
            id="userType"
            value={userType}
            onChange={handleUserTypeChange}
          >
            <option value="normal">Normal User</option>
            <option value="hospital">Authorized Hospital</option>
          </select>
        </div>

        {userType === "normal" && (
          <div>
            <div className="form-group">
              <label htmlFor="nic">NIC Number:</label>
              <input
                type="text"
                id="nic"
                value={nic}
                onChange={handleNICChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>
        )}

        {userType === "hospital" && (
          <div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>
        )}
        <button type="submit">Login</button>
      </form>

      <div className="extra-links">
        <a href="/SignUp">New to NCDMS? Create an account.</a>
        <a href="/SignUp">Forgot password?</a>
      </div>
    </div>
  );
};

export default Login;
