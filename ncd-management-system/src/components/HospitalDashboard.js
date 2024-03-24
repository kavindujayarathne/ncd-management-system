import "./HospitalDashboard.css";
import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import PatientProfileModal from "./PatientProfileModal";

//React Toastify
import { /*ToastContainer*/ toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HospitalDashboard() {
  const options = [
    "Personal Details",
    "Risk Behaviour",
    "Medical History",
    "Family History",
    "Medical Examination",
    "Investigations",
    "Risk Prediction",
    "Action",
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [commonIdentifier, setCommonIdentifier] = useState("");

  const [riskPrediction, setRiskPrediction] = useState(null);
  const [actionPrediction, setActionPrediction] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const [searchNIC, setSearchNIC] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handlePersonalDetailsChange = (event) => {
    const { name, value } = event.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value,
    });
  };

  const handleRiskBehaviourChange = (event) => {
    const { name, value } = event.target;
    setRiskBehaviour({
      ...riskBehaviour,
      [name]: value,
    });
  };

  const handleMedicalHistoryChange = (event) => {
    const { name, value } = event.target;
    setMedicalHistory({
      ...medicalHistory,
      [name]: value,
    });
  };

  const handleFamilyHistoryChange = (event) => {
    const { name, value } = event.target;
    setFamilyHistory({
      ...familyHistory,
      [name]: value,
    });
  };

  const handleMedicalExaminationChange = (event) => {
    const { name, value } = event.target;
    setMedicalExamination({
      ...medicalExamination,
      [name]: value,
    });
  };

  const handleInvestigationsChange = (event) => {
    const { name, value } = event.target;
    setInvestigations({
      ...investigations,
      [name]: value,
    });
  };

  const handleActionChange = (event) => {
    const { name, checked, type } = event.target;
    const value = type === "checkbox" ? checked : event.target.value;

    setAction({
      ...action,
      [name]: value,
    });
  };

  const handleUpdateModalData = async (updatedData) => {
    try {
      const patientDocRef = doc(
        database,
        "patients",
        updatedData.personalDetails.nicNo
      );
      const structuredData = (data) => {
        return {
          PersonalDetails: data.personalDetails,
          MedicalHistory: data.medicalHistory,
          RiskBehaviour: data.riskBehaviour,
          FamilyHistory: data.familyHistory,
          MedicalExamination: data.medicalExamination,
          Investigations: data.investigations,
          RiskPrediction: data.riskPrediction,
          Action: data.action,
        };
      };
      const data = structuredData(updatedData);
      await setDoc(patientDocRef, data, { merge: true });
      toast.success("Patient data updated successfully");
    } catch (error) {
      toast.error(`Failed to update patient data: ${error.message}`);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteModalData = async (nicNo) => {
    try {
      const patientDocRef = doc(database, "patients", nicNo);
      await deleteDoc(patientDocRef);
      toast.success("Patient data deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete patient data: ${error.message}`);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchNIC(e.target.value);
  };

  const handleSearch = async () => {
    const trimmedSearchNIC = searchNIC.trim();

    if (!trimmedSearchNIC) {
      toast.error("Please enter a NIC number to search.");
      return;
    }

    const patientRef = doc(database, "patients", searchNIC.trim());

    try {
      const patientDoc = await getDoc(patientRef);

      if (patientDoc.exists()) {
        const rawData = patientDoc.data();

        const structuredData = (data) => {
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

        setPatientData(structuredData(rawData));
        setIsModalOpen(true);
        toast.success("Patient data loaded successfully");
      } else {
        toast.error("No patient found with that NIC");
        setPatientData(null);
      }
    } catch (error) {
      toast.error(`Error searching for patient: ${error.message}`);
    }
  };

  const handleRiskPrediction = async () => {
    if (
      !personalDetails.age ||
      !personalDetails.gender ||
      !medicalHistory.hypertension ||
      !medicalHistory.hyperlipidemia ||
      !medicalHistory.diabetes ||
      !riskBehaviour.smoking
    ) {
      toast.error("All fields must be filled in to predict risk and action.");
      return;
    }

    const predictionData = {
      Age: parseInt(personalDetails.age, 10),
      Gender: personalDetails.gender,
      Hypertension: medicalHistory.hypertension,
      Hyperlipidemia: medicalHistory.hyperlipidemia,
      Diabetes: medicalHistory.diabetes,
      Smoking: riskBehaviour.smoking,
    };

    try {
      // Predict risk
      const riskResponse = await fetch("http://127.0.0.1:5000/predict_risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(predictionData),
      });

      if (!riskResponse.ok) {
        throw new Error(`HTTP error! status: ${riskResponse.status}`);
      }
      const riskResult = await riskResponse.json();
      setRiskPrediction(riskResult.risk_prediction);

      // Predict action
      const actionResponse = await fetch(
        "http://127.0.0.1:5000/predict_action",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(predictionData),
        }
      );

      if (!actionResponse.ok) {
        throw new Error(`HTTP error! status: ${actionResponse.status}`);
      }
      const actionResult = await actionResponse.json();
      setActionPrediction(actionResult.action_prediction);
    } catch (error) {
      toast.error(`Error during prediction: ${error.message}`);
    }
  };

  const checkIfNICExists = async (nic) => {
    const patientRef = doc(database, "patients", nic.trim());

    try {
      const patientDoc = await getDoc(patientRef);
      return patientDoc.exists(); // Returns true if NIC exists, false otherwise
    } catch (error) {
      toast.error(`Error checking NIC: ${error.message}`);
      return true; // Consider existence to prevent accidental overwrites in case of error
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const handleDone = async () => {
      const patientDataToBePassed = {
        personalDetails,
        riskBehaviour,
        medicalHistory,
        familyHistory,
        medicalExamination,
        investigations,
        riskPrediction: { riskPrediction, actionPrediction },
        action,
      };

      setPatientData(patientDataToBePassed);
      setIsModalOpen(true);
    };

    // Check if the NIC already exists when submitting personal details
    if (selectedOption === "Personal Details") {
      const nicExists = await checkIfNICExists(personalDetails.nicNo);
      if (nicExists) {
        toast.error("A patient with this NIC already exists.");
        return; // Stop the submission if NIC exists
      }
    }

    if (selectedOption === "Action") {
      const atLeastOneCheckboxSelected = Object.entries(action).some(
        ([key, value]) => key !== "followUpTime" && value === true
      );

      const followUpTimeSelected = action.followUpTime !== "";

      if (!atLeastOneCheckboxSelected && !followUpTimeSelected) {
        toast.error("Please select at least one action.");
        return;
      }
    }

    try {
      const patientDocRef = doc(database, "patients", commonIdentifier);

      const formData = getFormData(selectedOption);

      await setDoc(
        patientDocRef,
        { [selectedOption.replace(" ", "")]: formData },
        { merge: true }
      );
      toast.success(`Successfully Added ${selectedOption}`);

      const nextOptionIndex = options.indexOf(selectedOption) + 1;

      if (nextOptionIndex < options.length) {
        const nextOption = options[nextOptionIndex];
        handleOptionClick(nextOption);
      } else {
        handleDone();
      }
    } catch (error) {
      toast.error(`Error saving ${selectedOption} data`);
    }
  };

  const [personalDetails, setPersonalDetails] = useState({
    nicNo: "",
    name: "",
    gender: "",
    dob: "",
    age: "",
    address: "",
    currentGnArea: "",
    mobileNumber: "",
  });

  const [riskBehaviour, setRiskBehaviour] = useState({
    physicalActivity: "",
    betelChewing: "",
    smoking: "",
    alcohol: "",
    substanceUse: "",
    mealIntake: "",
    obesity: "",
    geneticFactors: "",
  });

  const [medicalHistory, setMedicalHistory] = useState({
    ischemicHeartDiseases: "",
    hypertension: "",
    diabetes: "",
    hyperlipidemia: "",
    hyperthyroidism: "",
    chronicKidneyDiseases: "",
    chronicRespiratoryDiseases: "",
    cancer: "",
    strokeTIA: "",
  });

  const [familyHistory, setFamilyHistory] = useState({
    ischemicHeartDiseases: "",
    hypertension: "",
    diabetes: "",
    hyperlipidemia: "",
    hyperthyroidism: "",
    chronicKidneyDiseases: "",
    chronicRespiratoryDiseases: "",
    cancer: "",
    strokeTIA: "",
    suddenDeathsOfRelativesDueToUnknownCauses: "",
  });

  const [medicalExamination, setMedicalExamination] = useState({
    height: "",
    weight: "",
    bmi: "",
    idealBodyWeight: "",
    waistCircumference: "",
    waistToHeightRatio: "",
    systolicBloodPressure: "",
    oralExamination: "",
    distantVisionLeft: "",
    distantVisionRight: "",
    hearingLeftEar: "",
    hearingRightEar: "",
    thyroidEnlargement: "",
    peakFlowMeter: "",
  });

  const [investigations, setInvestigations] = useState({
    fastingBloodSugar: "",
    serumCreatinine: "",
    totalCholesterol: "",
  });

  const [riskPredictionData, setRiskPredictionData] = useState({
    age: "",
    gender: "",
    hypertension: "",
    hyperlipidemia: "",
    diabetes: "",
    smoking: "",
  });

  const [action, setAction] = useState({
    referredToMedicalClinic: false,
    referredToSpecializedClinic: false,
    referredToDentalClinic: false,
    followUpAtHLC: false,
    followUpTime: "",
  });

  useEffect(() => {
    setCommonIdentifier(personalDetails.nicNo);
  }, [personalDetails.nicNo]);

  useEffect(() => {
    if (selectedOption === "Risk Prediction") {
      setRiskPredictionData({
        age: personalDetails.age,
        gender: personalDetails.gender,
        hypertension: medicalHistory.hypertension,
        hyperlipidemia: medicalHistory.hyperlipidemia,
        diabetes: medicalHistory.diabetes,
        smoking: riskBehaviour.smoking,
      });
    }
  }, [selectedOption, personalDetails, medicalHistory, riskBehaviour]);

  const getFormData = (option) => {
    switch (option) {
      case "Personal Details":
        return personalDetails;
      case "Risk Behaviour":
        return riskBehaviour;
      case "Medical History":
        return medicalHistory;
      case "Family History":
        return familyHistory;
      case "Medical Examination":
        return medicalExamination;
      case "Investigations":
        return investigations;
      case "Risk Prediction":
        return {
          riskPrediction: riskPrediction,
          actionPrediction: actionPrediction,
        };
      case "Action":
        const selectedActions = Object.entries(action).reduce(
          (acc, [key, value]) => {
            if (
              (key !== "followUpTime" && value === true) ||
              (key === "followUpTime" && value !== "")
            ) {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );

        return selectedActions;
      default:
        return {};
    }
  };

  return (
    <div className="container">
      {/* Side Navigation Bar */}
      <div className="sidebar">
        <div className="sidebar-cards">
          {options.map((option) => (
            <div
              key={option}
              className={`sidebar-card ${
                selectedOption === option ? "active" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <div className="card-body">{option}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            value={searchNIC}
            onChange={handleSearchChange}
            placeholder="Enter NIC to search..."
            className="search-input"
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
          {isModalOpen && (
            <PatientProfileModal
              isOpen={isModalOpen}
              patientData={patientData}
              onSave={handleUpdateModalData}
              onDelete={handleDeleteModalData}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
        <div className="form-content-container">
          <h1>{selectedOption}</h1>
          {selectedOption === "Personal Details" && (
            <form onSubmit={handleSubmit}>
              <div className="form-group-gap">
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="nic">NIC No.</label>
                    <input
                      type="text"
                      id="nic"
                      name="nicNo"
                      value={personalDetails.nicNo}
                      onChange={handlePersonalDetailsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={personalDetails.name}
                      onChange={handlePersonalDetailsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={personalDetails.gender}
                      onChange={handlePersonalDetailsChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={personalDetails.dob}
                      onChange={handlePersonalDetailsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Age in Years</label>
                    <input
                      type="number"
                      name="age"
                      value={personalDetails.age}
                      onChange={handlePersonalDetailsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={personalDetails.address}
                      onChange={handlePersonalDetailsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Current GN Area</label>
                    <input
                      type="text"
                      name="currentGnArea"
                      value={personalDetails.currentGnArea}
                      onChange={handlePersonalDetailsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={personalDetails.mobileNumber}
                      onChange={handlePersonalDetailsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-button">
                  <button className="btn btn-primary" type="submit">
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}
          {selectedOption === "Risk Behaviour" && (
            <form onSubmit={handleSubmit}>
              <div className="form-group-gap">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Physical Activity</label>
                    <select
                      name="physicalActivity"
                      value={riskBehaviour.physicalActivity}
                      onChange={handleRiskBehaviourChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Physically active">
                        Physically active
                      </option>
                      <option value="Moderate">Moderate</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Betel Chewing</label>
                    <select
                      name="betelChewing"
                      value={riskBehaviour.betelChewing}
                      onChange={handleRiskBehaviourChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="User">User</option>
                      <option value="Non User">Non User</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Smoking</label>
                    <select
                      name="smoking"
                      value={riskBehaviour.smoking}
                      onChange={handleRiskBehaviourChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Alcohol</label>
                    <select
                      name="alcohol"
                      value={riskBehaviour.alcohol}
                      onChange={handleRiskBehaviourChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="User">User</option>
                      <option value="Non User">Non User</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Other Substance Use</label>
                    <select
                      name="substanceUse"
                      value={riskBehaviour.substanceUse}
                      onChange={handleRiskBehaviourChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="User">User</option>
                      <option value="Non User">Non User</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Unhealthy Meal Intake</label>
                    <select
                      name="mealIntake"
                      value={riskBehaviour.mealIntake}
                      onChange={handleRiskBehaviourChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="High sugar">High sugar</option>
                      <option value="High fat">High fat</option>
                      <option value="High salt">High salt</option>
                      <option value="Low fiber">Low fiber</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Obesity</label>
                    <select
                      name="obesity"
                      value={riskBehaviour.obesity}
                      onChange={handleRiskBehaviourChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Genetic Factors</label>
                    <select
                      name="geneticFactors"
                      value={riskBehaviour.geneticFactors}
                      onChange={handleRiskBehaviourChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-button">
                  <button className="btn btn-primary" type="submit">
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}
          {selectedOption === "Medical History" && (
            <form onSubmit={handleSubmit}>
              <div className="form-group-gap">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Ischemic Heart Diseases</label>
                    <select
                      name="ischemicHeartDiseases"
                      value={medicalHistory.ischemicHeartDiseases}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Hypertension</label>
                    <select
                      name="hypertension"
                      value={medicalHistory.hypertension}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Diabetes</label>
                    <select
                      name="diabetes"
                      value={medicalHistory.diabetes}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Hyperlipidemia</label>
                    <select
                      name="hyperlipidemia"
                      value={medicalHistory.hyperlipidemia}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Hyperthyroidism</label>
                    <select
                      name="hyperthyroidism"
                      value={medicalHistory.hyperthyroidism}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Chronic Kidney Diseases</label>
                    <select
                      name="chronicKidneyDiseases"
                      value={medicalHistory.chronicKidneyDiseases}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Chronic Respiratory Diseases</label>
                    <select
                      name="chronicRespiratoryDiseases"
                      value={medicalHistory.chronicRespiratoryDiseases}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Cancer</label>
                    <select
                      name="cancer"
                      value={medicalHistory.cancer}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Stroke/TIA</label>
                    <select
                      name="strokeTIA"
                      value={medicalHistory.strokeTIA}
                      onChange={handleMedicalHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-button">
                  <button className="btn btn-primary" type="submit">
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}
          {selectedOption === "Family History" && (
            <form onSubmit={handleSubmit}>
              <div className="form-group-gap">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Ischemic Heart Diseases</label>
                    <select
                      name="ischemicHeartDiseases"
                      value={familyHistory.ischemicHeartDiseases}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Hypertension</label>
                    <select
                      name="hypertension"
                      value={familyHistory.hypertension}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Diabetes</label>
                    <select
                      name="diabetes"
                      value={familyHistory.diabetes}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Hyperlipidemia</label>
                    <select
                      name="hyperlipidemia"
                      value={familyHistory.hyperlipidemia}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Hyperthyroidism</label>
                    <select
                      name="hyperthyroidism"
                      value={familyHistory.hyperthyroidism}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Chronic Kidney Diseases</label>
                    <select
                      name="chronicKidneyDiseases"
                      value={familyHistory.chronicKidneyDiseases}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Chronic Respiratory Diseases</label>
                    <select
                      name="chronicRespiratoryDiseases"
                      value={familyHistory.chronicRespiratoryDiseases}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Cancer</label>
                    <select
                      name="cancer"
                      value={familyHistory.cancer}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Stroke/TIA</label>
                    <select
                      name="strokeTIA"
                      value={familyHistory.strokeTIA}
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>
                      Sudden Deaths of Relatives Due to Unknown Causes
                    </label>
                    <select
                      name="suddenDeathsOfRelativesDueToUnknownCauses"
                      value={
                        familyHistory.suddenDeathsOfRelativesDueToUnknownCauses
                      }
                      onChange={handleFamilyHistoryChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-button">
                  <button className="btn btn-primary" type="submit">
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}
          {selectedOption === "Medical Examination" && (
            <form onSubmit={handleSubmit}>
              <div className="form-group-gap">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="text"
                      name="height"
                      value={medicalExamination.height}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="text"
                      name="weight"
                      value={medicalExamination.weight}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>BMI (kg/m2)</label>
                    <input
                      type="text"
                      name="bmi"
                      value={medicalExamination.bmi}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Ideal Body Weight (kg)</label>
                    <input
                      type="text"
                      name="idealBodyWeight"
                      value={medicalExamination.idealBodyWeight}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Waist Circumference (cm)</label>
                    <input
                      type="text"
                      name="waistCircumference"
                      value={medicalExamination.waistCircumference}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Waist to Height Ratio</label>
                    <input
                      type="text"
                      name="waistToHeightRatio"
                      value={medicalExamination.waistToHeightRatio}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Systolic Blood Pressure (mmHg)</label>
                    <input
                      type="text"
                      name="systolicBloodPressure"
                      value={medicalExamination.systolicBloodPressure}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Oral Examination</label>
                    <select
                      name="oralExamination"
                      value={medicalExamination.oralExamination}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Abnormal">Abnormal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Distant Vision (Left)</label>
                    <select
                      name="distantVisionLeft"
                      value={medicalExamination.distantVisionLeft}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Abnormal">Abnormal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Distant Vision (Right)</label>
                    <select
                      name="distantVisionRight"
                      value={medicalExamination.distantVisionRight}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Abnormal">Abnormal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Hearing (Left Ear)</label>
                    <select
                      name="hearingLeftEar"
                      value={medicalExamination.hearingLeftEar}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Abnormal">Abnormal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Hearing (Right Ear)</label>
                    <select
                      name="hearingRightEar"
                      value={medicalExamination.hearingRightEar}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Abnormal">Abnormal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Thyroid Enlargement</label>
                    <select
                      name="thyroidEnlargement"
                      value={medicalExamination.thyroidEnlargement}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Peak Flow Meter (PEF) L/Min</label>
                    <select
                      name="peakFlowMeter"
                      value={medicalExamination.peakFlowMeter}
                      onChange={handleMedicalExaminationChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Green Zone (320 - 400 LPM)">
                        Green Zone (320 - 400 LPM)
                      </option>
                      <option value="Yellow Zone (200 - 320 LPM)">
                        Yellow Zone (200 - 320 LPM)
                      </option>
                      <option value="Red Zone (Less 200 LPM)">
                        Red Zone (Less 200 LPM)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="form-group-button">
                  <button className="btn btn-primary" type="submit">
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}
          {selectedOption === "Investigations" && (
            <form onSubmit={handleSubmit}>
              <div className="form-group-gap">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Fasting Blood Sugar (mg/dl)</label>
                    <input
                      type="text"
                      name="fastingBloodSugar"
                      value={investigations.fastingBloodSugar}
                      onChange={handleInvestigationsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Serum Creatinine (mg/dl)</label>
                    <input
                      type="text"
                      name="serumCreatinine"
                      value={investigations.serumCreatinine}
                      onChange={handleInvestigationsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Total Cholesterol (mg/dl)</label>
                    <input
                      type="text"
                      name="totalCholesterol"
                      value={investigations.totalCholesterol}
                      onChange={handleInvestigationsChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-button">
                  <button className="btn btn-primary" type="submit">
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}
          {selectedOption === "Risk Prediction" && (
            <form onSubmit={handleSubmit}>
              <div className="risk-prediction-data">
                <div>
                  <strong>Age:</strong> {personalDetails.age}
                </div>
                <div>
                  <strong>Gender:</strong> {personalDetails.gender}
                </div>
                <div>
                  <strong>Hypertension:</strong> {medicalHistory.hypertension}
                </div>
                <div>
                  <strong>Hyperlipidemia:</strong>{" "}
                  {medicalHistory.hyperlipidemia}
                </div>
                <div>
                  <strong>Diabetes:</strong> {medicalHistory.diabetes}
                </div>
                <div>
                  <strong>Smoking:</strong> {riskBehaviour.smoking}
                </div>
                {riskPrediction && (
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      NCD Risk Prediction:
                    </span>{" "}
                    {riskPrediction}
                  </p>
                )}
                {actionPrediction && (
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Action Prediction:
                    </span>{" "}
                    {actionPrediction}
                  </p>
                )}
              </div>

              {/* Prediction button */}
              <div className="form-group-button">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleRiskPrediction}
                >
                  Predict Risk and Action
                </button>
              </div>

              {/* Submit button for saving predictions */}
              <div className="form-group-button">
                <button className="btn btn-primary" type="submit">
                  Next
                </button>
              </div>
            </form>
          )}
          {selectedOption === "Action" && (
            <form onSubmit={handleSubmit}>
              <div className="form-group-gap">
                <div className="form-group-row">
                  <label>
                    <input
                      type="checkbox"
                      name="referredToMedicalClinic"
                      checked={action.referredToMedicalClinic}
                      onChange={handleActionChange}
                    />
                    Referred to Medical Clinic
                  </label>
                </div>

                <div className="form-group-row">
                  <label>
                    <input
                      type="checkbox"
                      name="referredToSpecializedClinic"
                      checked={action.referredToSpecializedClinic}
                      onChange={handleActionChange}
                    />
                    Referred to Specialized Clinic
                  </label>
                </div>

                <div className="form-group-row">
                  <label>
                    <input
                      type="checkbox"
                      name="referredToDentalClinic"
                      checked={action.referredToDentalClinic}
                      onChange={handleActionChange}
                    />
                    Referred to Dental Clinic
                  </label>
                </div>

                <div className="form-group-row">
                  <label>
                    <input
                      type="checkbox"
                      id="followUpAtHLC"
                      name="followUpAtHLC"
                      checked={action.followUpAtHLC}
                      onChange={handleActionChange}
                    />
                    Will be Followed up at HLC
                  </label>
                  {action.followUpAtHLC && (
                    <select
                      name="followUpTime"
                      value={action.followUpTime}
                      onChange={handleActionChange}
                      className="form-control"
                    >
                      <option value="">Select time</option>
                      <option value="3 months">
                        Follow up in 3 months at HLC
                      </option>
                      <option value="6 months">
                        Follow up in 6 months at HLC
                      </option>
                      <option value="1 year">Follow up in 1 year at HLC</option>
                      <option value="3 years">
                        Follow up in 3 years at HLC
                      </option>
                    </select>
                  )}
                </div>

                <div className="form-group-button">
                  <button className="btn btn-primary" type="submit">
                    Done
                  </button>
                </div>
              </div>
            </form>
          )}
          {isModalOpen && patientData && (
            <PatientProfileModal
              isOpen={isModalOpen}
              patientData={patientData}
              onUpdate={handleUpdateModalData}
              onDelete={handleDeleteModalData}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
    // </div>
  );
}

export default HospitalDashboard;
