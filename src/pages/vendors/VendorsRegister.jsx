import React, { useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/Api';
import CommonForm from '../../components/CommonForm';
import statesJson from "../../components/states.json"; // adjust path if needed
import QandA from "../../components/QandA"; // adjust path if needed

const vendorFields = [
  { name: 'vendorcode', label: 'Vendor Code', type: 'text', required: true },
  { name: "vendorcompanyname", label: "Company Name", type: "text", required: true },
  { name: "Fname", label: "First Name", type: "text", required: true },
  { name: "Lname", label: "Last Name", type: "text" },
  { name: "Email", label: "Email", type: "email", required: true },
  { name: "Address1", label: "Address 1", type: "text", required: true },
  { name: "Address2", label: "Address 2", type: "text" },
  { name: "City", label: "City", type: "text", },
  { name: "State", label: "State", type: "select", options: statesJson.map(state => ({ label: state, value: state })), required: true },
  { name: "ZipCode", label: "Zip Code", type: "text", required: true },
  { name: "Samuie", label: "Sam UIE", type: "text" },
  { name: "Fein", label: "FEIN", type: "text" },
  { name: "Duns", label: "DUNS", type: "text" },
  { name: "CAGE", label: "CAGE Code", type: "text" },
  { name: "Naics1", label: "NAICS 1", type: "text" },
  { name: "Naics2", label: "NAICS 2", type: "text" },
  { name: "Naics3", label: "NAICS 3", type: "text" },
  { name: "Naics4", label: "NAICS 4", type: "text" },
  { name: "Naics5", label: "NAICS 5", type: "text" },
  { name: "Nigp1", label: "NIGP 1", type: "text" },
  { name: "Nigp2", label: "NIGP 2", type: "text" },
  { name: "Nigp3", label: "NIGP 3", type: "text" },
  { name: "Nigp4", label: "NIGP 4", type: "text" },
  { name: "Nigp5", label: "NIGP 5", type: "text" },
  { name: "Phone", label: "Phone", type: "text" },
  { name: "Mobile", label: "Mobile", type: "text", required: true },
  { name: "Sbclass", label: "Small Business Classification", type: "select", options: QandA.smallBusiness.map(item => ({ label: item, value: item })) },
  { name: "Class", label: "Business Classification", type: "select", options: QandA["Business Classification"].map(item => ({ label: item, value: item })) },
  { name: "URL", label: "Company URL", type: "text" },
  { name: "Password", label: "Password", type: "password", required: true },
  { name: "SecQuestion", label: "Security Question", type: "text" },
  { name: "SecAnswer", label: "Security Answer", type: "text" },
  { name: 'profileImage', label: 'Profile Image (must be 150x150 in px)', type: 'file', accept: '.jpg,.jpeg,.png', required: true },
  { name: "docx", label: "Upload Document (max 1mb)", type: "file", accept: ".pdf,.doc,.docx", required: true },
  { name: "Aboutus", label: "About Us", type: "textarea", rows: 4 },
  { name: 'Type', type: 'text', options: [{ value: '2', label: 'Type 2' }] },
  { name: 'DateTime', type: 'text' },
  { name: 'ClientId', type: 'text' },
];

export default function vendorRegister() {
  const [popupData, setPopupData] = useState({ email: '', password: '' });
  const [countdown, setCountdown] = useState(5); // <-- Make sure this is declared
  const [showPopup, setShowPopup] = useState(false); // <-- Also added for conditional rendering

  const location = useLocation();
  const passClientId = location.state?.passClientId;
  const ClientId = passClientId;

  const initialFormState = vendorFields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {});

  function formatDateTime() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  const [formData, setFormData] = useState({
    ...initialFormState,
    ClientId,
    Type: '2',
    DateTime: formatDateTime()
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // Append all form fields to FormData
      data.append("ClientId", formData.ClientId);
      data.append("vendorcode", formData.vendorcode);

      // Add the rest
      for (const key in formData) {
        if (["ClientId", "vendorcode"].includes(key)) continue;

        const value = formData[key];
        if (value instanceof File) {
          data.append(key, value);
        } else {
          data.append(key, value);
        }
      }


      // ✅ Log all form data before sending
      console.log("Submitting form data:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      await axios.post(`${API_BASE_URL}/vendors`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({ ...initialFormState, ClientId, Type: '2', DateTime: formatDateTime() });

      setPopupData({
        email: formData.Email,
        password: formData.Password
      });
      setShowPopup(true); // Show popup using state

      // Start countdown
      let timer = 5;
      setCountdown(timer);
      const interval = setInterval(() => {
        timer--;
        setCountdown(timer);
        if (timer === 0) {
          clearInterval(interval);
          window.location.href = `/cvcsem/${ClientId}`;
        }
      }, 1000);


    } catch (error) {
      console.error("Full error object:", error);
      const msg = error.response?.data?.message || error.message || 'Failed to register vendor.';
      alert(`Error: ${msg}`);
    }
  };


  return (
    <>
      <div className="bg-primary text-white py-3 px-3 mb-4">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div>
              <h3 className="mb-1">New Vendor Registration</h3>
              <p className="mb-0">Register your company</p>
            </div>
            <div className="mt-3 mt-md-0">
              <span className="fw-bold fs-5 text-white">
                Client Name: <span className="text-warning">{ClientId}</span>
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="container mt-5">

        <CommonForm
          fields={vendorFields}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleRegister}
          buttonLabel="Register"
        />
      </div>

      {/* Success popup (Bootstrap-based modal lookalike) */}
      {showPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
          <div className="bg-white rounded-4 shadow-lg p-4 text-center w-100" style={{ maxWidth: '500px' }}>
            <h2 className="text-success fs-3 fw-bold mb-3">Vendor Registered Successfully!</h2>
            <p className="text-muted fs-6 mb-2">Your vendor has been registered successfully.</p>

            <div className="my-3">
              <p className="fs-6 mb-1">
                <strong className="text-primary">Email:</strong>{' '}
                <span className="text-dark">{popupData.email}</span>
              </p>
              <p className="fs-6 mb-1">
                <strong className="text-primary">Password:</strong>{' '}
                <span className="text-dark">{popupData.password}</span>
              </p>
            </div>

            <p className="text-warning fs-6">Thank you for registering.</p>
            <p className="text-secondary fs-6">You can now log in with your credentials.</p>
            <p className="text-danger fs-6 mt-3">
              Redirecting in <strong>{countdown}</strong> seconds...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
