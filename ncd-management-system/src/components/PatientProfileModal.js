import React, { useState, useEffect } from "react";
import "./PatientProfileModal.css";

function PatientProfileModal({
  isOpen,
  patientData,
  onUpdate,
  onDelete,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [editablePatientData, setEditablePatientData] = useState(patientData);

  useEffect(() => {
    setEditablePatientData(patientData);
  }, [patientData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleChange = (section, name, value) => {
    setEditablePatientData({
      ...editablePatientData,
      [section]: {
        ...editablePatientData[section],
        [name]: value,
      },
    });
  };

  const handleUpdate = () => {
    onUpdate(editablePatientData);
  };

  const handleDelete = () => {
    onDelete(patientData.personalDetails.nicNo);
  };

  const handleCloseModal = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <div className="modal-backdrop"></div>
      <div className="patient-profile-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>
              Patient Profile:{" "}
              {editablePatientData.personalDetails?.name || "N/A"} /{" "}
              {editablePatientData.personalDetails?.nicNo || "N/A"}
            </h2>
          </div>

          <div className="tab-header">
            <button
              onClick={() => handleTabChange("personalDetails")}
              className={activeTab === "personalDetails" ? "active" : ""}
            >
              Personal Details
            </button>
            <button
              onClick={() => handleTabChange("riskBehaviour")}
              className={activeTab === "riskBehaviour" ? "active" : ""}
            >
              Risk Behaviour
            </button>
            <button
              onClick={() => handleTabChange("medicalHistory")}
              className={activeTab === "medicalHistory" ? "active" : ""}
            >
              Medical History
            </button>
            <button
              onClick={() => handleTabChange("familyHistory")}
              className={activeTab === "familyHistory" ? "active" : ""}
            >
              Family History
            </button>
            <button
              onClick={() => handleTabChange("medicalExamination")}
              className={activeTab === "medicalExamination" ? "active" : ""}
            >
              Medical Examination
            </button>
            <button
              onClick={() => handleTabChange("investigations")}
              className={activeTab === "investigations" ? "active" : ""}
            >
              Investigations
            </button>
            <button
              onClick={() => handleTabChange("riskPrediction")}
              className={activeTab === "riskPrediction" ? "active" : ""}
            >
              Risk Prediction
            </button>
            <button
              onClick={() => handleTabChange("action")}
              className={activeTab === "action" ? "active" : ""}
            >
              Action
            </button>
          </div>

          <div className="tab-content">
            {/* Personal Detials */}
            {activeTab === "personalDetails" && (
              <div>
                <label>NIC No: </label>
                <input
                  type="text"
                  name="nicNo"
                  value={editablePatientData.personalDetails?.nicNo || ""}
                  onChange={(e) =>
                    handleChange("personalDetails", "nicNo", e.target.value)
                  }
                />
                <label>Name: </label>
                <input
                  type="text"
                  name="name"
                  value={editablePatientData.personalDetails?.name || ""}
                  onChange={(e) =>
                    handleChange("personalDetails", "name", e.target.value)
                  }
                />
                <label>Gender: </label>
                <input
                  type="text"
                  name="gender"
                  value={editablePatientData.personalDetails?.gender || ""}
                  onChange={(e) =>
                    handleChange("personalDetails", "gender", e.target.value)
                  }
                />
                <label>Date of Birth: </label>
                <input
                  type="text"
                  name="dob"
                  value={editablePatientData.personalDetails?.dob || ""}
                  onChange={(e) =>
                    handleChange("personalDetails", "dob", e.target.value)
                  }
                />
                <label>Age in Years: </label>
                <input
                  type="text"
                  name="age"
                  value={editablePatientData.personalDetails?.age || ""}
                  onChange={(e) =>
                    handleChange("personalDetails", "age", e.target.value)
                  }
                />
                <label>Address: </label>
                <input
                  type="text"
                  name="address"
                  value={editablePatientData.personalDetails?.address || ""}
                  onChange={(e) =>
                    handleChange("personalDetails", "address", e.target.value)
                  }
                />
                <label>Current GN Area: </label>
                <input
                  type="text"
                  name="currentGnArea"
                  value={
                    editablePatientData.personalDetails?.currentGnArea || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "currentGnArea",
                      e.target.value
                    )
                  }
                />
                <label>Mobile Number: </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={
                    editablePatientData.personalDetails?.mobileNumber || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "mobileNumber",
                      e.target.value
                    )
                  }
                />
              </div>
            )}

            {/* Risk Behaviour */}
            {activeTab === "riskBehaviour" && (
              <div>
                <label>Physical Activity:</label>
                <select
                  name="physicalActivity"
                  value={
                    editablePatientData.riskBehaviour?.physicalActivity || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "riskBehaviour",
                      "physicalActivity",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Physically active">Physically active</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <label>Betel Chewing:</label>
                <select
                  name="betelChewing"
                  value={editablePatientData.riskBehaviour?.betelChewing || ""}
                  onChange={(e) =>
                    handleChange(
                      "riskBehaviour",
                      "betelChewing",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="User">User</option>
                  <option value="Non User">Non User</option>
                </select>

                <label>Smoking:</label>
                <select
                  name="smoking"
                  value={editablePatientData.riskBehaviour?.smoking || ""}
                  onChange={(e) =>
                    handleChange("riskBehaviour", "smoking", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Alcohol:</label>
                <select
                  name="alcohol"
                  value={editablePatientData.riskBehaviour?.alcohol || ""}
                  onChange={(e) =>
                    handleChange("riskBehaviour", "alcohol", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="User">User</option>
                  <option value="Non User">Non User</option>
                </select>

                <label>Other Substance Use:</label>
                <select
                  name="substanceUse"
                  value={editablePatientData.riskBehaviour?.substanceUse || ""}
                  onChange={(e) =>
                    handleChange(
                      "riskBehaviour",
                      "substanceUse",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="User">User</option>
                  <option value="Non User">Non User</option>
                </select>

                <label>Unhealthy Meal Intake:</label>
                <select
                  name="mealIntake"
                  value={editablePatientData.riskBehaviour?.mealIntake || ""}
                  onChange={(e) =>
                    handleChange("riskBehaviour", "mealIntake", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="High sugar">High sugar</option>
                  <option value="High fat">High fat</option>
                  <option value="High salt">High salt</option>
                  <option value="Low fiber">Low fiber</option>
                </select>

                <label>Obesity:</label>
                <select
                  name="obesity"
                  value={editablePatientData.riskBehaviour?.obesity || ""}
                  onChange={(e) =>
                    handleChange("riskBehaviour", "obesity", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Genetic Factors:</label>
                <select
                  name="geneticFactors"
                  value={
                    editablePatientData.riskBehaviour?.geneticFactors || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "riskBehaviour",
                      "geneticFactors",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}

            {/*  Medical History */}
            {activeTab === "medicalHistory" && (
              <div>
                <label>Ischemic Heart Diseases:</label>
                <select
                  name="ischemicHeartDiseases"
                  value={
                    editablePatientData.medicalHistory?.ischemicHeartDiseases ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalHistory",
                      "ischemicHeartDiseases",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Hypertension:</label>
                <select
                  name="hypertension"
                  value={editablePatientData.medicalHistory?.hypertension || ""}
                  onChange={(e) =>
                    handleChange(
                      "medicalHistory",
                      "hypertension",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Diabetes:</label>
                <select
                  name="diabetes"
                  value={editablePatientData.medicalHistory?.diabetes || ""}
                  onChange={(e) =>
                    handleChange("medicalHistory", "diabetes", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Hyperlipidemia:</label>
                <select
                  name="hyperlipidemia"
                  value={
                    editablePatientData.medicalHistory?.hyperlipidemia || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalHistory",
                      "hyperlipidemia",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Hyperthyroidism:</label>
                <select
                  name="hyperthyroidism"
                  value={
                    editablePatientData.medicalHistory?.hyperthyroidism || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalHistory",
                      "hyperthyroidism",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Chronic Kidney Diseases:</label>
                <select
                  name="chronicKidneyDiseases"
                  value={
                    editablePatientData.medicalHistory?.chronicKidneyDiseases ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalHistory",
                      "chronicKidneyDiseases",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Chronic Respiratory Diseases:</label>
                <select
                  name="chronicRespiratoryDiseases"
                  value={
                    editablePatientData.medicalHistory
                      ?.chronicRespiratoryDiseases || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalHistory",
                      "chronicRespiratoryDiseases",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Cancer:</label>
                <select
                  name="cancer"
                  value={editablePatientData.medicalHistory?.cancer || ""}
                  onChange={(e) =>
                    handleChange("medicalHistory", "cancer", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Stroke/TIA:</label>
                <select
                  name="strokeTIA"
                  value={editablePatientData.medicalHistory?.strokeTIA || ""}
                  onChange={(e) =>
                    handleChange("medicalHistory", "strokeTIA", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}

            {/* Family History */}
            {activeTab === "familyHistory" && (
              <div>
                <label>Ischemic Heart Diseases:</label>
                <select
                  name="ischemicHeartDiseases"
                  value={
                    editablePatientData.familyHistory?.ischemicHeartDiseases ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "familyHistory",
                      "ischemicHeartDiseases",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Hypertension:</label>
                <select
                  name="hypertension"
                  value={editablePatientData.familyHistory?.hypertension || ""}
                  onChange={(e) =>
                    handleChange(
                      "familyHistory",
                      "hypertension",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Diabetes:</label>
                <select
                  name="diabetes"
                  value={editablePatientData.familyHistory?.diabetes || ""}
                  onChange={(e) =>
                    handleChange("familyHistory", "diabetes", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Hyperlipidemia:</label>
                <select
                  name="hyperlipidemia"
                  value={
                    editablePatientData.familyHistory?.hyperlipidemia || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "familyHistory",
                      "hyperlipidemia",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Hyperthyroidism:</label>
                <select
                  name="hyperthyroidism"
                  value={
                    editablePatientData.familyHistory?.hyperthyroidism || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "familyHistory",
                      "hyperthyroidism",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Chronic Kidney Diseases:</label>
                <select
                  name="chronicKidneyDiseases"
                  value={
                    editablePatientData.familyHistory?.chronicKidneyDiseases ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "familyHistory",
                      "chronicKidneyDiseases",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Chronic Respiratory Diseases:</label>
                <select
                  name="chronicRespiratoryDiseases"
                  value={
                    editablePatientData.familyHistory
                      ?.chronicRespiratoryDiseases || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "familyHistory",
                      "chronicRespiratoryDiseases",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Cancer:</label>
                <select
                  name="cancer"
                  value={editablePatientData.familyHistory?.cancer || ""}
                  onChange={(e) =>
                    handleChange("familyHistory", "cancer", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Stroke/TIA:</label>
                <select
                  name="strokeTIA"
                  value={editablePatientData.familyHistory?.strokeTIA || ""}
                  onChange={(e) =>
                    handleChange("familyHistory", "strokeTIA", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Sudden Deaths Of Relatives Due To Unknown Causes:</label>
                <select
                  name="suddenDeathsOfRelativesDueToUnknownCauses"
                  value={
                    editablePatientData.familyHistory
                      ?.suddenDeathsOfRelativesDueToUnknownCauses || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "familyHistory",
                      "suddenDeathsOfRelativesDueToUnknownCauses",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}

            {/* Medical Examination */}
            {activeTab === "medicalExamination" && (
              <div>
                <label>Height (cm):</label>
                <input
                  type="text"
                  name="height"
                  value={editablePatientData.medicalExamination?.height || ""}
                  onChange={(e) =>
                    handleChange("medicalExamination", "height", e.target.value)
                  }
                />

                <label>Weight (kg):</label>
                <input
                  type="text"
                  name="weight"
                  value={editablePatientData.medicalExamination?.weight || ""}
                  onChange={(e) =>
                    handleChange("medicalExamination", "weight", e.target.value)
                  }
                />

                <label>BMI (kg/m²):</label>
                <input
                  type="text"
                  name="bmi"
                  value={editablePatientData.medicalExamination?.bmi || ""}
                  onChange={(e) =>
                    handleChange("medicalExamination", "bmi", e.target.value)
                  }
                />

                <label>Ideal Body Weight (kg):</label>
                <input
                  type="text"
                  name="idealBodyWeight"
                  value={
                    editablePatientData.medicalExamination?.idealBodyWeight ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "idealBodyWeight",
                      e.target.value
                    )
                  }
                />

                <label>Waist Circumference (cm):</label>
                <input
                  type="text"
                  name="waistCircumference"
                  value={
                    editablePatientData.medicalExamination
                      ?.waistCircumference || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "waistCircumference",
                      e.target.value
                    )
                  }
                />

                <label>Waist to Height Ratio:</label>
                <input
                  type="text"
                  name="waistToHeightRatio"
                  value={
                    editablePatientData.medicalExamination
                      ?.waistToHeightRatio || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "waistToHeightRatio",
                      e.target.value
                    )
                  }
                />

                <label>Systolic Blood Pressure (mmHg):</label>
                <input
                  type="text"
                  name="systolicBloodPressure"
                  value={
                    editablePatientData.medicalExamination
                      ?.systolicBloodPressure || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "systolicBloodPressure",
                      e.target.value
                    )
                  }
                />

                <label>Oral Examination:</label>
                <select
                  name="oralExamination"
                  value={
                    editablePatientData.medicalExamination?.oralExamination ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "oralExamination",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>

                <label>Distant Vision (Left):</label>
                <select
                  name="distantVisionLeft"
                  value={
                    editablePatientData.medicalExamination?.distantVisionLeft ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "distantVisionLeft",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>

                <label>Distant Vision (Right):</label>
                <select
                  name="distantVisionRight"
                  value={
                    editablePatientData.medicalExamination
                      ?.distantVisionRight || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "distantVisionRight",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>

                <label>Hearing (Left Ear):</label>
                <select
                  name="hearingLeftEar"
                  value={
                    editablePatientData.medicalExamination?.hearingLeftEar || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "hearingLeftEar",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>

                <label>Hearing (Right Ear):</label>
                <select
                  name="hearingRightEar"
                  value={
                    editablePatientData.medicalExamination?.hearingRightEar ||
                    ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "hearingRightEar",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>

                <label>Thyroid Enlargement:</label>
                <select
                  name="thyroidEnlargement"
                  value={
                    editablePatientData.medicalExamination
                      ?.thyroidEnlargement || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "thyroidEnlargement",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <label>Peak Flow Meter (PEF) L/Min:</label>
                <select
                  name="peakFlowMeter"
                  value={
                    editablePatientData.medicalExamination?.peakFlowMeter || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "medicalExamination",
                      "peakFlowMeter",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="Green Zone (320 - 400 LPM)">
                    Green Zone (320 - 400 LPM)
                  </option>
                  <option value="Yellow Zone (200 - 320 LPM)">
                    Yellow Zone (200 - 320 LPM)
                  </option>
                  <option value="Red Zone (Less than 200 LPM)">
                    Red Zone (Less than 200 LPM)
                  </option>
                </select>
              </div>
            )}

            {/* Investigations */}
            {activeTab === "investigations" && (
              <div>
                <label>Fasting Blood Sugar (mg/dl):</label>
                <input
                  type="text"
                  name="fastingBloodSugar"
                  value={
                    editablePatientData.investigations?.fastingBloodSugar || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "investigations",
                      "fastingBloodSugar",
                      e.target.value
                    )
                  }
                />

                <label>Serum Creatinine (mg/dl):</label>
                <input
                  type="text"
                  name="serumCreatinine"
                  value={
                    editablePatientData.investigations?.serumCreatinine || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "investigations",
                      "serumCreatinine",
                      e.target.value
                    )
                  }
                />

                <label>Total Cholesterol (mg/dl):</label>
                <input
                  type="text"
                  name="totalCholesterol"
                  value={
                    editablePatientData.investigations?.totalCholesterol || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "investigations",
                      "totalCholesterol",
                      e.target.value
                    )
                  }
                />
              </div>
            )}

            {/* Risk Prediction */}
            {activeTab === "riskPrediction" && (
              <div className="riskPrediction-span">
                <div>
                  <label>Age:</label>
                  <span>
                    {editablePatientData.personalDetails?.age || "N/A"}
                  </span>
                </div>

                <div>
                  <label>Gender:</label>
                  <span>
                    {editablePatientData.personalDetails?.gender || "N/A"}
                  </span>
                </div>

                <div>
                  <label>Hypertension:</label>
                  <span>
                    {editablePatientData.medicalHistory?.hypertension || "N/A"}
                  </span>
                </div>

                <div>
                  <label>Hyperlipidemia:</label>
                  <span>
                    {editablePatientData.medicalHistory?.hyperlipidemia ||
                      "N/A"}
                  </span>
                </div>

                <div>
                  <label>Diabetes:</label>
                  <span>
                    {editablePatientData.medicalHistory?.diabetes || "N/A"}
                  </span>
                </div>

                <div>
                  <label>Smoking:</label>
                  <span>
                    {editablePatientData.riskBehaviour?.smoking || "N/A"}
                  </span>
                </div>

                <div>
                  <label>NCD Risk Prediction:</label>
                  <span style={{ color: "red" }}>
                    {editablePatientData.riskPrediction?.riskPrediction ||
                      "N/A"}
                  </span>
                </div>

                <div>
                  <label>Action Prediction:</label>
                  <span style={{ color: "green" }}>
                    {editablePatientData.riskPrediction?.actionPrediction ||
                      "N/A"}
                  </span>
                </div>
              </div>
            )}

            {/* Action */}
            {activeTab === "action" && (
              <div>
                <label>
                  Referred to Medical Clinic:
                  <input
                    type="checkbox"
                    name="referredToMedicalClinic"
                    checked={
                      editablePatientData.action?.referredToMedicalClinic ||
                      false
                    }
                    onChange={(e) =>
                      handleChange(
                        "action",
                        "referredToMedicalClinic",
                        e.target.checked
                      )
                    }
                  />
                </label>

                <label>
                  Referred to Specialized Clinic:
                  <input
                    type="checkbox"
                    name="referredToSpecializedClinic"
                    checked={
                      editablePatientData.action?.referredToSpecializedClinic ||
                      false
                    }
                    onChange={(e) =>
                      handleChange(
                        "action",
                        "referredToSpecializedClinic",
                        e.target.checked
                      )
                    }
                  />
                </label>

                <label>
                  Referred to Dental Clinic:
                  <input
                    type="checkbox"
                    name="referredToDentalClinic"
                    checked={
                      editablePatientData.action?.referredToDentalClinic ||
                      false
                    }
                    onChange={(e) =>
                      handleChange(
                        "action",
                        "referredToDentalClinic",
                        e.target.checked
                      )
                    }
                  />
                </label>

                <label>
                  Follow-up at HLC:
                  <input
                    type="checkbox"
                    name="followUpAtHLC"
                    checked={editablePatientData.action?.followUpAtHLC || false}
                    onChange={(e) =>
                      handleChange("action", "followUpAtHLC", e.target.checked)
                    }
                  />
                </label>

                {editablePatientData.action?.followUpAtHLC && (
                  <div>
                    <label>
                      Follow-up Time:
                      <select
                        name="followUpTime"
                        value={editablePatientData.action?.followUpTime || ""}
                        onChange={(e) =>
                          handleChange("action", "followUpTime", e.target.value)
                        }
                      >
                        <option value="">Select time</option>
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="3 years">3 years</option>
                      </select>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
            <button type="button" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfileModal;
