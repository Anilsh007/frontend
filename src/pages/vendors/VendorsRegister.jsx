import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/Api';
import CommonForm from '../../components/CommonForm';

const vendorFields = [
  { name: 'vendorcode', label: 'Vendor Code', type: 'text' },
  { name: 'vendorcompanyname', label: 'Vendor Company Name', type: 'text' },
  { name: 'Fname', label: 'First Name', type: 'text' },
  { name: 'Lname', label: 'Last Name', type: 'text' },
  { name: 'Email', label: 'Email', type: 'email', required: true },
  { name: 'Password', label: 'Password', type: 'password' },
  { name: 'Address1', label: 'Address 1', type: 'textarea' },
  { name: 'Address2', label: 'Address 2', type: 'textarea' },
  { name: 'Aboutus', label: 'About Us', type: 'textarea' },
  { name: 'City', label: 'City', type: 'text' },
  { name: 'State', label: 'State', type: 'text' },
  { name: 'ZipCode', label: 'Zip Code', type: 'number' },
  { name: 'Samuin', label: 'SAM UIN', type: 'text' },
  { name: 'Fein', label: 'FEIN', type: 'text' },
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
  { name: 'Sbclass', label: 'SB Class', type: 'text' },
  { name: 'Class', label: 'Class', type: 'text' },
  { name: 'UserId', label: 'User ID', type: 'text' },
  { name: 'SecQuestion', label: 'Security Question', type: 'text' },
  { name: 'SecAnswer', label: 'Security Answer', type: 'text' },
  { name: "document", label: "Upload Document", type: "file", accept: ".pdf,.doc,.docx,.jpg,.png" },
  { name: 'DateTime', label: 'Date & Time', type: 'datetime-local', readonly: true, disabled: true },
  { name: 'Type', label: 'Type', type: 'select', options: [{ value: '2', label: 'Type 2' }] }
];

export default function LoginRegister({ passClientId }) {
  const { ClientId: routeClientId } = useParams();
  const ClientId = passClientId || routeClientId;
  const modalCloseRef = useRef(null);

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

      await axios.post(`${API_BASE_URL}/vendors`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Vendor registered successfully!');
      setFormData({ ...initialFormState, ClientId, Type: '2', DateTime: formatDateTime() });
      modalCloseRef.current?.click();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to register vendor.';
      alert(`Error: ${msg}`);
    }
  };


  return (
    <>
      <h3>New Vendor Registration</h3>
      <p><strong>Register your company</strong></p>
      <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#registerModal" >REGISTER</button>


      {/* Modal */}
      <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title" id="registerModalLabel">
                Vendor Registration <br />
                <span className="text-primary">Client Name ({ClientId})</span>
              </h5>
              <button
                ref={modalCloseRef}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <CommonForm
                fields={vendorFields}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleRegister}
                buttonLabel="Register"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
