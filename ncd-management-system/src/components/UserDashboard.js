import "./UserDashboard.css";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function UserDashboard() {
  const location = useLocation();
  const patientData = location.state?.patientData;
  const [activeTab, setActiveTab] = useState("personalDetails");

  if (!patientData) {
    return (
      <div className="Error-styling">
        <h2>No patient data available.</h2>
      </div>
    );
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      <h2>
        Patient Profile: {patientData.personalDetails?.name || "N/A"} /{" "}
        {patientData.personalDetails?.nicNo || "N/A"}
      </h2>

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
          Medical Examinations
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
        {activeTab === "personalDetails" && (
          <div>
            <p>NIC No: {patientData.personalDetails?.nicNo || "N/A"}</p>
            <p>Name: {patientData.personalDetails?.name || "N/A"}</p>
            <p>Gender: {patientData.personalDetails?.gender || "N/A"}</p>
            <p>Date of Birth: {patientData.personalDetails?.dob || "N/A"}</p>
            <p>Age in Years: {patientData.personalDetails?.age || "N/A"}</p>
            <p>Address: {patientData.personalDetails?.address || "N/A"}</p>
            <p>
              Current GN Area:{" "}
              {patientData.personalDetails?.currentGnArea || "N/A"}
            </p>
            <p>
              Mobile Number:{" "}
              {patientData.personalDetails?.mobileNumber || "N/A"}
            </p>
          </div>
        )}

        {activeTab === "riskBehaviour" && (
          <div>
            <p>
              Physical Activity:{" "}
              {patientData.riskBehaviour?.physicalActivity || "N/A"}
            </p>
            <p>
              Betel Chewing: {patientData.riskBehaviour?.betelChewing || "N/A"}
            </p>
            <p>Smoking: {patientData.riskBehaviour?.smoking || "N/A"}</p>
            <p>Alcohol: {patientData.riskBehaviour?.alcohol || "N/A"}</p>
            <p>
              Substance Use: {patientData.riskBehaviour?.substanceUse || "N/A"}
            </p>
            <p>Meal Intake: {patientData.riskBehaviour?.mealIntake || "N/A"}</p>
            <p>Obesity: {patientData.riskBehaviour?.obesity || "N/A"}</p>
            <p>
              Genetic Factors:{" "}
              {patientData.riskBehaviour?.geneticFactors || "N/A"}
            </p>
          </div>
        )}

        {activeTab === "medicalHistory" && (
          <div>
            <p>
              Ischemic Heart Diseases:{" "}
              {patientData.medicalHistory?.ischemicHeartDiseases || "N/A"}
            </p>
            <p>
              Hypertension: {patientData.medicalHistory?.hypertension || "N/A"}
            </p>
            <p>Diabetes: {patientData.medicalHistory?.diabetes || "N/A"}</p>
            <p>
              Hyperlipidemia:{" "}
              {patientData.medicalHistory?.hyperlipidemia || "N/A"}
            </p>
            <p>
              Hyperthyroidism:{" "}
              {patientData.medicalHistory?.hyperthyroidism || "N/A"}
            </p>
            <p>
              Chronic Kidney Diseases:{" "}
              {patientData.medicalHistory?.chronicKidneyDiseases || "N/A"}
            </p>
            <p>
              Chronic Respiratory Diseases:{" "}
              {patientData.medicalHistory?.chronicRespiratoryDiseases || "N/A"}
            </p>
            <p>Cancer: {patientData.medicalHistory?.cancer || "N/A"}</p>
            <p>Stroke TIA: {patientData.medicalHistory?.strokeTIA || "N/A"}</p>
          </div>
        )}

        {activeTab === "familyHistory" && (
          <div>
            <p>
              Ischemic Heart Diseases:{" "}
              {patientData.familyHistory?.ischemicHeartDiseases || "N/A"}
            </p>
            <p>
              Hypertension: {patientData.familyHistory?.hypertension || "N/A"}
            </p>
            <p>Diabetes: {patientData.familyHistory?.diabetes || "N/A"}</p>
            <p>
              Hyperlipidemia:{" "}
              {patientData.familyHistory?.hyperlipidemia || "N/A"}
            </p>
            <p>
              Hyperthyroidism:{" "}
              {patientData.familyHistory?.hyperthyroidism || "N/A"}
            </p>
            <p>
              Chronic Kidney Diseases:{" "}
              {patientData.familyHistory?.chronicKidneyDiseases || "N/A"}
            </p>
            <p>
              Chronic Respiratory Diseases:{" "}
              {patientData.familyHistory?.chronicRespiratoryDiseases || "N/A"}
            </p>
            <p>Cancer: {patientData.familyHistory?.cancer || "N/A"}</p>
            <p>Stroke TIA: {patientData.familyHistory?.strokeTIA || "N/A"}</p>
            <p>
              Sudden Deaths Of Relatives Due To Unknown Causes:{" "}
              {patientData.familyHistory
                ?.suddenDeathsOfRelativesDueToUnknownCauses || "N/A"}
            </p>
          </div>
        )}
        {activeTab === "medicalExamination" && (
          <div>
            <p>
              Height (cm): {patientData.medicalExamination?.height || "N/A"}
            </p>
            <p>
              Weight (kg): {patientData.medicalExamination?.weight || "N/A"}
            </p>
            <p>BMI (kg/m2): {patientData.medicalExamination?.bmi || "N/A"}</p>
            <p>
              Ideal Body Weight (kg):{" "}
              {patientData.medicalExamination?.idealBodyWeight || "N/A"}
            </p>
            <p>
              Waist Circumference (cm):{" "}
              {patientData.medicalExamination?.waistCircumference || "N/A"}
            </p>
            <p>
              Waist to Height Ratio:{" "}
              {patientData.medicalExamination?.waistToHeightRatio || "N/A"}
            </p>
            <p>
              Systolic Blood Pressure (mmHg):{" "}
              {patientData.medicalExamination?.systolicBloodPressure || "N/A"}
            </p>
            <p>
              Oral Examination:{" "}
              {patientData.medicalExamination?.oralExamination || "N/A"}
            </p>
            <p>
              Distant Vision (Left):{" "}
              {patientData.medicalExamination?.distantVisionLeft || "N/A"}
            </p>
            <p>
              Distant Vision (Right):{" "}
              {patientData.medicalExamination?.distantVisionRight || "N/A"}
            </p>
            <p>
              Hearing (Left Ear):{" "}
              {patientData.medicalExamination?.hearingLeftEar || "N/A"}
            </p>
            <p>
              Hearing (Right Ear):{" "}
              {patientData.medicalExamination?.hearingRightEar || "N/A"}
            </p>
            <p>
              Thyroid Enlargement:{" "}
              {patientData.medicalExamination?.thyroidEnlargement || "N/A"}
            </p>
            <p>
              Peak Flow Meter (PEF) L/Min:{" "}
              {patientData.medicalExamination?.peakFlowMeter || "N/A"}
            </p>
          </div>
        )}
        {activeTab === "investigations" && (
          <div>
            <p>
              Fasting Blood Sugar:{" "}
              {patientData.investigations?.fastingBloodSugar || "N/A"}
            </p>
            <p>
              Serum Creatinine:{" "}
              {patientData.investigations?.serumCreatinine || "N/A"}
            </p>
            <p>
              Total Cholesterol:{" "}
              {patientData.investigations?.totalCholesterol || "N/A"}
            </p>
          </div>
        )}
        {activeTab === "riskPrediction" && (
          <div>
            <p>Age: {patientData.personalDetails?.age || "N/A"}</p>
            <p>Gender: {patientData.personalDetails?.gender || "N/A"}</p>
            <p>
              Hypertension: {patientData.medicalHistory?.hypertension || "N/A"}
            </p>
            <p>
              Hyperlipidemia:{" "}
              {patientData.medicalHistory?.hyperlipidemia || "N/A"}
            </p>
            <p>Diabetes: {patientData.medicalHistory?.diabetes || "N/A"}</p>
            <p>Smoking: {patientData.riskBehaviour?.smoking || "N/A"}</p>

            <div>
              <div>------------Predictions-------------</div>

              <p>
                NCD Risk Prediction:{" "}
                {patientData.riskPrediction?.riskPrediction || "N/A"}
              </p>
              <p>
                Action Prediction:{" "}
                {patientData.riskPrediction?.actionPrediction || "N/A"}
              </p>
            </div>
          </div>
        )}

        {activeTab === "action" && (
          <div className="action-content">
            <div className="action-item">
              <label>Referred to Medical Clinic:</label>
              <span
                className={
                  patientData.action?.referredToMedicalClinic
                    ? "checked"
                    : "unchecked"
                }
              >
                {patientData.action?.referredToMedicalClinic ? "☑" : "☐"}
              </span>
            </div>

            <div className="action-item">
              <label>Referred to Specialized Clinic:</label>
              <span
                className={
                  patientData.action?.referredToSpecializedClinic
                    ? "checked"
                    : "unchecked"
                }
              >
                {patientData.action?.referredToSpecializedClinic ? "☑" : "☐"}
              </span>
            </div>

            <div className="action-item">
              <label>Referred to Dental Clinic:</label>
              <span
                className={
                  patientData.action?.referredToDentalClinic
                    ? "checked"
                    : "unchecked"
                }
              >
                {patientData.action?.referredToDentalClinic ? "☑" : "☐"}
              </span>
            </div>

            <div className="action-item">
              <label>Follow-up at HLC:</label>
              <span
                className={
                  patientData.action?.followUpAtHLC ? "checked" : "unchecked"
                }
              >
                {patientData.action?.followUpAtHLC ? "☑" : "☐"}
              </span>
            </div>

            {patientData.action?.followUpAtHLC && (
              <div className="action-item">
                <label>Follow-up Time:</label>
                <input
                  type="text"
                  value={patientData.action?.followUpTime || "N/A"}
                  readOnly
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
