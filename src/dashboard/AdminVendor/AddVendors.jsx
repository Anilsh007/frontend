import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/Api';
import CommonForm from '../../components/CommonForm';
import { useClient } from "../ClientContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlinePreview } from 'react-icons/md';
import { BsDatabaseAdd } from "react-icons/bs";
import EmailSender from './EmailSender';
import { IoMdLogIn } from 'react-icons/io';

const vendorFields = [
  { name: 'vendorcode', label: 'Vendor Code', type: 'text', required: true },
  { name: "vendorcompanyname", label: "Company Name", type: "text", required: true },
  { name: "Fname", label: "First Name", type: "text", required: true },
  { name: "Lname", label: "Last Name", type: "text", required: true },
  { name: "Email", label: "Email", type: "email", required: true },
  { name: "Phone", label: "Phone", type: "text", required: true },
  { name: 'profileImage', label: 'Profile Image (must be 150x150 in px)', type: 'file', accept: '.jpg,.jpeg,.png', required: true },
  { name: "docx", label: "Upload Document (max 1mb)", type: "file", accept: ".pdf", required: true },
];

const columns = [
  { key: "vendorcompanyname", label: "Company Name" },
  {
    key: "Full name",
    label: "Name",
    render: (_, row) => [row.Fname, row.Lname].filter(Boolean).join(" "),
  },
  { key: "Email", label: "Email" },
  { key: "Phone", label: "Phone" },
  {
    key: "docx",
    label: "Capability Statement",
    type: "file",
    render: (val) =>
      val ? (
        <a
          href={API_BASE_URL + "/files/" + val}
          target="_blank"
          rel="noopener noreferrer"
          title="View Document"
        >
          <MdOutlinePreview size={24} />
        </a>
      ) : (
        "N/A"
      ),
  },
  { key: "documentText", label: "Document Text" },
];

export default function AddVendors() {
  const { getAdminDetails } = useClient();
  const ClientId = getAdminDetails?.ClientId;

  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [formVisible, setFormVisible] = useState(false);
  const [registering, setRegistering] = useState(false);


  const {
    emailForm,
    setEmailForm,
    sendEmail,
  } = EmailSender();

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
    Naics5: '', Naics4: '', Naics3: '', Naics2: '', Naics1: '', Password: 'CVCSEM',
    CAGE: '', Duns: '', Fein: '', Samuie: '', ZipCode: '', State: '', City: '', Address2: '', Address1: '', Sbclass: '', Class: '',
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const data = new FormData();
      data.append("ClientId", formData.ClientId);
      data.append("vendorcode", formData.vendorcode);

      for (const key in formData) {
        if (["ClientId", "vendorcode"].includes(key)) continue;
        const value = formData[key];
        data.append(key, value instanceof File ? value : value);
      }

      await axios.post(`${API_BASE_URL}/vendors`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success("Vendor registered successfully!");

      // ✅ Prepare email content
      const tempEmail = {
        ...emailForm,
        to: formData.Email,
        cc: "",
        bcc: "",
        subject: "Welcome to CVCSEM - Your Account Has Been Activated",
        body: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8" />
                  <title>Welcome to CVCSEM</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <div style="max-width: 600px; margin: auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                      <img src="https://www.cvcsem.com/logo.png" alt="CVCSEM Logo" style="max-width: 150px;" />
                      <h2 style="color: #2E86C1;">Welcome to CVCSEM!</h2>
                    </div>

                    <p>Dear <strong>${formData.Fname || 'User'}</strong>,</p>

                    <p>Your account has been activated successfully. Below are your login details:</p>

                    <table style="width: 100%; margin-bottom: 20px;">
                      <tr>
                        <td><strong>Login Page:</strong></td>
                        <td><a href="http://cvcsem.com/vendor/${ClientId}">http://cvcsem.com/vendor/${ClientId}</a></td>
                      </tr>
                      <tr>
                        <td><strong>Username:</strong></td>
                        <td>${formData.Email}</td>
                      </tr>
                      <tr>
                        <td><strong>Password:</strong></td>
                        <td>${formData.Password}</td>
                      </tr>
                    </table>

                    <p style="color: #d9534f;"><strong>Please change your password after your first login.</strong></p>

                    <p>Regards,<br/><strong>Team CVCSEM</strong></p>
                  </div>
                </body>
              </html>
            `,
        attachments: [],
      };


      setEmailForm(tempEmail); // optional

      // ✅ Send email immediately with manual FormData (bypasses stale state issue)
      const emailPayload = new FormData();
      emailPayload.append("to", tempEmail.to);
      emailPayload.append("cc", tempEmail.cc);
      emailPayload.append("bcc", tempEmail.bcc);
      emailPayload.append("subject", tempEmail.subject);
      emailPayload.append("body", tempEmail.body);

      await axios.post(`${API_BASE_URL}/email/send`, emailPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Welcome email sent to vendor.");

      setFormData({
        ...initialFormState,
        ClientId,
        Type: '2',
        DateTime: formatDateTime(),
        profileImage: '',
        Aboutus: '', SecAnswer: '', SecQuestion: '', URL: '', Mobile: '',
        Nigp5: '', Nigp4: '', Nigp3: '', Nigp2: '', Nigp1: '',
        Naics5: '', Naics4: '', Naics3: '', Naics2: '', Naics1: '',
        CAGE: '', Duns: '', Fein: '', Samuie: '', ZipCode: '', State: '', City: '', Address2: '', Address1: '', Sbclass: '', Class: '',
      });

      fetchVendors();

      let timer = 5;
      setCountdown(timer);
      const interval = setInterval(() => {
        timer--;
        setCountdown(timer);
        if (timer === 0) clearInterval(interval);
      }, 1000);

    } catch (error) {
      console.error("Error submitting form:", error);
      const msg = error.response?.data?.message || error.message || 'Failed to register vendor.';
      toast.error(`Error: ${msg}`);
    } finally {
      setRegistering(false);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/searchVendor/${ClientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setVendors(data);
      setFilteredVendors(data);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load vendors.";
      setError(err.response?.status === 401 ? "Unauthorized. Please log in again." : msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ClientId) fetchVendors();
  }, [ClientId]);

  const handleClick = () => {
    setFormVisible(!formVisible);
  };

  const handleReset = () => {
    setFormData({
      ...initialFormState,
      ClientId,
      Type: '2',
      DateTime: formatDateTime(),
      profileImage: '',
      Aboutus: '', SecAnswer: '', SecQuestion: '', URL: '', Mobile: '',
      Nigp5: '', Nigp4: '', Nigp3: '', Nigp2: '', Nigp1: '',
      Naics5: '', Naics4: '', Naics3: '', Naics2: '', Naics1: '',
      CAGE: '', Duns: '', Fein: '', Samuie: '', ZipCode: '', State: '', City: '', Address2: '', Address1: '', Sbclass: '', Class: '',
    });
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />

      <h5 className="text-primary">Add New Vendor</h5>
      <CommonForm fields={vendorFields} formData={formData} setFormData={setFormData} onSubmit={handleRegister} showSubmit={false} />
      <div className="d-flex justify-content-end gap-2 mt-2">
        <button className="btn btn-outline-secondary" onClick={handleReset}>Reset <IoMdLogIn /></button>
        <button type='submit' className="btn btn-outline-primary" onClick={handleRegister} disabled={registering} // 🔒 prevent multiple clicks
        >
          {registering ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Registering...
            </>
          ) : (
            <>
              Register <BsDatabaseAdd />
            </>
          )}
        </button>

      </div>

    </>
  );
}
