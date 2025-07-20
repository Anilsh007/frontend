import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/Api';
import CommonForm from '../../components/CommonForm';
import { useClient } from "../ClientContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonTable from '../../components/CommonTable';
import { MdOutlinePreview } from 'react-icons/md';
import EmailSender from './EmailSender';

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
    Naics5: '', Naics4: '', Naics3: '', Naics2: '', Naics1: '',
    CAGE: '', Duns: '', Fein: '', Samuie: '', ZipCode: '', State: '', City: '', Address2: '', Address1: '', Sbclass: '', Class: '',
  });

  const handleRegister = async (e) => {
    e.preventDefault();
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
        subject: "Welcome to Our Vendor Program",
        body: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2E86C1;">Welcome, ${formData.Fname}!</h2>
          <p>Thank you for registering as a vendor with <strong>${formData.vendorcompanyname}</strong>.</p>
          
          <p>We’re excited to have you onboard. Here are your details:</p>
          <ul>
            <li><strong>Name:</strong> ${formData.Fname} ${formData.Lname}</li>
            <li><strong>Email:</strong> ${formData.Email}</li>
            <li><strong>Phone:</strong> ${formData.Phone}</li>
          </ul>

          <p>If you have any questions, feel free to contact us.</p>

          <p>Best regards,<br/>
          <strong>Vendor Management Team</strong></p>
        </div>`,
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

      <div className="d-flex">
        <h2 className="me-auto">Add Vendors</h2>
        <button className='btn btn-outline-primary w-25' onClick={handleClick}>Add Vendors</button>
      </div>

      {formVisible && (
        <>
          <CommonForm fields={vendorFields} formData={formData} setFormData={setFormData} onSubmit={handleRegister} showSubmit={false} />
          <div className="d-flex justify-content-end gap-2 mt-2">
            <button className="btn btn-outline-secondary w-25" onClick={handleReset}>Reset</button>
            <button className="btn btn-outline-primary w-25" onClick={handleRegister}>Register</button>
          </div>
        </>
      )}

      <CommonTable columns={columns} data={filteredVendors} />
    </>
  );
}
