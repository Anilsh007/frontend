import React, { useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/Api';
import CommonForm from '../../components/CommonForm';

const vendorFields = [
  { name: 'DateTime', label: 'Date & Time', type: 'datetime-local', readonly: true, disabled: true },
  { name: 'ClientId', label: 'Client ID', type: 'text', readOnly: true, disabled: true },
  { name: 'vendorcode', label: 'Vendor Code', type: 'text' },
  { name: 'vendorcompanyname', label: 'Vendor Company Name', type: 'text' },
  { name: 'Fname', label: 'First Name', type: 'text' },
  { name: 'Lname', label: 'Last Name', type: 'text' },
  { name: 'Email', label: 'Email', type: 'email', required: true },
  { name: 'Password', label: 'Password', type: 'password' },
  { name: 'City', label: 'City', type: 'text' },
  { name: 'Address1', label: 'Address 1', type: 'textarea' },
  { name: 'Address2', label: 'Address 2', type: 'textarea' },
  { name: 'Aboutus', label: 'About Us', type: 'textarea' },
  { name: 'State', label: 'State', type: 'text' },
  { name: 'ZipCode', label: 'Zip Code', type: 'number' },
  { name: 'Samuin', label: 'SAM UIN', type: 'text' },
  { name: 'Fein', label: 'FEIN', type: 'number' },
  { name: 'Duns', label: 'DUNS', type: 'number' },
  { name: 'Naics1', label: 'NAICS 1', type: 'number' },
  { name: 'Naics2', label: 'NAICS 2', type: 'number' },
  { name: 'Naics3', label: 'NAICS 3', type: 'number' },
  { name: 'Naics4', label: 'NAICS 4', type: 'number' },
  { name: 'Naics5', label: 'NAICS 5', type: 'number' },
  { name: 'Nigp1', label: 'NIGP 1', type: 'number' },
  { name: 'Nigp2', label: 'NIGP 2', type: 'number' },
  { name: 'Nigp3', label: 'NIGP 3', type: 'number' },
  { name: 'Nigp4', label: 'NIGP 4', type: 'number' },
  { name: 'Nigp5', label: 'NIGP 5', type: 'number' },
  { name: 'Phone', label: 'Phone', type: 'number' },
  { name: 'Mobile', label: 'Mobile', type: 'number' },
  { name: 'Sbclass', label: 'Small Business Certification', type: 'text' },
  { name: 'Class', label: 'Business Classification', type: 'text' },
  { name: 'UserId', label: 'User ID', type: 'text' },
  { name: 'SecQuestion', label: 'Security Question', type: 'text' },
  { name: 'SecAnswer', label: 'Security Answer', type: 'text' },
  { name: 'profileImage', label: 'Profile Image (must be 150x150 in px)', type: 'file', accept: '.jpg,.jpeg,.png' },
  { name: "docx", label: "Upload Document (max 1mb)", type: "file", accept: ".pdf,.doc,.docx" },
  { name: 'Type', label: 'Type', type: 'select', options: [{ value: '2', label: 'Type 2' }] }
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
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          // For file inputs, append the file itself
          if (formData[key] instanceof File) {
            data.append(key, formData[key]);
          } else {
            data.append(key, formData[key]);
          }
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
