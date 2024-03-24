import "./SignUp.css";
import React, { useState } from "react";
import { database } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

//React Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nic, setNIC] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleNICChange = (event) => {
    setNIC(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleDOBChange = (event) => {
    setDOB(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const validatePassword = () => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const navigate = useNavigate();
  const handleSignUp = async (event) => {
    event.preventDefault();

    const passwordError = validatePassword();

    if (passwordError) {
      setFormError(passwordError);
      setPassword("");
      setConfirmPassword("");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      const usersCollectionRef = collection(database, "users");
      const q = query(usersCollectionRef, where("nic", "==", nic));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.error("NIC already exists");
        return;
      }

      await addDoc(usersCollectionRef, {
        firstName,
        lastName,
        nic,
        dob,
        gender,
        password,
      });
      toast.success("Successfully Registered");
      navigate("/Login");
    } catch (error) {
      console.error("Error saving user data:", error);
      setFormError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="signup-form">
        <h2>Sign Up to NCDMS</h2>
        {successMessage && (
          <div className="success-card">
            <span className="success">{successMessage}</span>
          </div>
        )}
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              required
            />
          </div>
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
          {password.length > 0 && password.length < 8 && (
            <div className="error-card">
              <span className="error">
                Password must be at least 8 characters long
              </span>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={handleDOBChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              value={gender}
              onChange={handleGenderChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {formError && (
            <div className="error-card">
              <span className="error">{formError}</span>
            </div>
          )}
          <button type="submit">Sign Up</button>
        </form>
        <div className="extra-links">
          <a href="/Login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
