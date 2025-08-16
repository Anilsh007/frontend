import React, { useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/Api';
import CommonForm from '../../components/CommonForm';
import Header from '../../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../components/Footer';

const vendorFields = [
  { name: 'vendorcode', label: 'Vendor Code', type: 'text', required: true },
  { name: "vendorcompanyname", label: "Company Name", type: "text", required: true },
  { name: "Fname", label: "First Name", type: "text", required: true },
  { name: "Lname", label: "Last Name", type: "text", required: true },
  { name: "Email", label: "Email", type: "email", required: true },
  { name: "Phone", label: "Phone", type: "text", required: true },
  { name: "Password", label: "Password", type: "password", required: true },
  { name: 'profileImage', label: 'Profile Image (must be 150x150 in px)', type: 'file', accept: '.jpg,.jpeg,.png', required: true },
  { name: "docx", label: "Upload Document (max 1mb)", type: "file", accept: ".pdf", required: true },
];

export default function QuickVendorsRegister() {
  const location = useLocation();
  const passClientId = location.state?.ClientId;
  const ClientId = passClientId;
  const navigate = useNavigate();

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
    DateTime: formatDateTime(),
    profileImage: '',
    Aboutus: '', SecAnswer: '', SecQuestion: '', URL: '', Mobile: '',
    Nigp5: '', Nigp4: '', Nigp3: '', Nigp2: '', Nigp1: '',
    Naics5: '', Naics4: '', Naics3: '', Naics2: '', Naics1: '',
    CAGE: '', Duns: '', Fein: '', Samuie: '',
    ZipCode: '', State: '', City: '', Address2: '', Address1: '',
    Sbclass: '', Class: '',
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("ClientId", formData.ClientId);
      data.append("vendorcode", formData.vendorcode);

      for (const key in formData) {
        if (["ClientId", "vendorcode"].includes(key)) continue;
        const value = formData[key];
        data.append(key, value);
      }

      console.log("Submitting form data:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      await axios.post(`${API_BASE_URL}/vendors`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Show toast (manual close)
      toast.success(
        <div>
          <h4>Vendor Registered Successfully!</h4>
          <p><strong>Email:</strong> {formData.Email}</p>
          <p><strong>Password:</strong> {formData.Password}</p>
          <button
            style={{
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => {
              toast.dismiss();
              navigate(`/cvcsem/${ClientId}`);
            }}
          >
            Go to Login
          </button>
        </div>,
        { autoClose: false, closeOnClick: false, onClose: () => (navigate(`/cvcsem/${ClientId}`), setLoading(false)) }
      );

      setFormData({ ...initialFormState, ClientId, Type: '2', DateTime: formatDateTime() });

    } catch (error) {
      console.error("Full error object:", error);
      const msg = error.response?.data?.message || error.message || 'Failed to register vendor.';
      toast.error(`Error: ${msg}`, {
        autoClose: false,
        onClose: () => setLoading(false)
      });

    }
  };

  return (
    <>
      <Header passClientId={ClientId} />

      <div className='custom-div'></div>
      <div className="container mb-5">
        <div className="bg-black text-white py-3 px-3 mb-4">
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div>
                <h3 className="mb-1">Quick Vendor Registration</h3>
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

        <CommonForm
          fields={vendorFields}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleRegister}
          buttonLabel={loading ? <span><i className="fa fa-spinner fa-spin"></i> Registering...</span> : "Register"}
          disabled={loading}
        />
      </div>

      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <Footer />

      {/* Toast container */}
      <ToastContainer position="top-center" />
    </>
  );
}
