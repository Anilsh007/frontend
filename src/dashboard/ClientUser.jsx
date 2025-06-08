import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/Api";
import CommonForm from "../components/CommonForm";
import { useClient } from "./ClientContext";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

const initialForm = {
  ClientId: "",
  UserCode: "",
  Fname: "",
  Lname: "",
  Email: "",
  Password: "",
  Mobile: "",
  Gender: "",
  Question: "",
  Answer: "",
  DateTime: "", // will set automatically on submit
  Type: "3",
  profileImage: null, // file object
};

export default function ClientUser() {
  const { getAdminDetails } = useClient();
  const [clientUsers, setClientUsers] = useState([]);  // fixed typo: clientUser -> clientUsers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const formFields = [
    { name: "ClientId", label: "Client ID", type: "text", disabled: true },
    { name: "UserCode", label: "User Code", type: "text", required: true },
    { name: "Fname", label: "First Name", type: "text", required: true },
    { name: "Lname", label: "Last Name", type: "text", required: true },
    { name: "Email", label: "Email", type: "email", required: true },
    { 
      name: "Password", 
      label: "Password", 
      type: "password", 
      required: !editId,  // required only if adding new user
      placeholder: editId ? "Leave blank to keep current password" : "" 
    },
    { name: "Mobile", label: "Mobile", type: "text" },
    {
      name: "Gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      name: "Question",
      label: "Security Question",
      type: "select",
      options: [
        { value: "What is your birth place?", label: "What is your birth place?" },
        { value: "What is your mother name?", label: "What is your mother name?" },
        { value: "What is your father name?", label: "What is your father name?" },
      ],
    },
    { name: "Answer", label: "Security Answer", type: "text" },
    { name: "Type", label: "Type", type: "text", disabled: true },
    {
      name: "profileImage",
      label: "Profile Image",
      type: "file",
      accept: ".png,.jpg,.jpeg",
    },
  ];

  // Load users on mount or when getAdminDetails changes
  useEffect(() => {
    if (!getAdminDetails || !getAdminDetails.ClientId) {
      setError("Client ID not available");
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [getAdminDetails]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/clientUser/searchUser/${getAdminDetails.ClientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }
      const data = await res.json();
      setClientUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      // Load user data for edit, clear file input
      setFormData({
        ...user,
        profileImage: null,
        Password: "", // Clear password input when editing
      });
      setEditId(user.id);
    } else {
      // New user, set ClientId from admin details
      setFormData({
        ...initialForm,
        ClientId: getAdminDetails.ClientId,
      });
      setEditId(null);
    }
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError("");
    setFormData(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const formPayload = new FormData();

      // Append formData fields
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "profileImage") {
          if (val) formPayload.append("profileImage", val);
        } else {
          formPayload.append(key, val || "");
        }
      });

      // Set current date time
      formPayload.set("DateTime", new Date().toISOString());

      const url = editId
        ? `${API_BASE_URL}/clientUser/${editId}`
        : `${API_BASE_URL}/clientUser`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Don't set Content-Type; let browser set it for FormData
        },
        body: formPayload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save user");
      }

      await fetchUsers();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/clientUser/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Client Users</h2>
        <button className="btn btn-outline-primary w-25" onClick={() => openModal()}>
          Add User
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center text-muted">Loading users...</div>
      ) : clientUsers.length === 0 ? (
        <div className="text-center text-muted">No users found.</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Client ID</th>
              <th>User Code</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Gender</th>
              <th>Profile</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientUsers.map((user) => {
              const profileUrl = user.profileImage
                ? `${API_BASE_URL.replace(/\/api$/, "")}/uploads/${user.profileImage}`
                : null;
              return (
                <tr key={user.id}>
                  <td>{new Date(user.DateTime).toLocaleString()}</td>
                  <td>{user.ClientId}</td>
                  <td>{user.UserCode}</td>
                  <td>{user.Fname}</td>
                  <td>{user.Lname}</td>
                  <td>{user.Email}</td>
                  <td>{user.Mobile}</td>
                  <td>{user.Gender}</td>
                  <td>
                    {profileUrl ? (
                      <img
                        src={profileUrl}
                        alt="Profile"
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          backgroundColor: "#ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          color: "#666",
                        }}
                      >
                        N/A
                      </div>
                    )}
                  </td>
                  <td>{user.Type}</td>
                  <td className="d-flex">
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={() => openModal(user)}
                    >
                      <LiaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-scrollable"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Edit User" : "Add User"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <CommonForm
                  fields={formFields}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  buttonLabel={editId ? "Update" : "Create"}
                />
                {formError && (
                  <div className="alert alert-danger mt-3">{formError}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
