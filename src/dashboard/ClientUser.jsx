import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/Api";
import CommonForm from "../components/CommonForm";
import CommonTable from "../components/CommonTable"; // ✅ Import your reusable table
import { useClient } from "./ClientContext";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiUserPlus } from "react-icons/fi";
import { BsDatabaseAdd } from "react-icons/bs";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  DateTime: "",
  Type: "3",
  profileImage: null,
};

export default function ClientUser() {
  const { getAdminDetails } = useClient();
  const [clientUsers, setClientUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
      required: !editId, // required only when adding
      placeholder: editId ? "Leave blank to keep current password" : "",
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


  useEffect(() => {
    if (!getAdminDetails || !getAdminDetails.ClientId) {
      setError("Client ID not available");
      toast.error("Client ID not available");
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
      toast.error(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const openUserForm = (user = null) => {
    if (user) {
      setFormData({
        ...user,
        profileImage: null,
        Password: "",
      });
      setEditId(user.id);
    } else {
      setFormData({
        ...initialForm,
        ClientId: getAdminDetails.ClientId,
      });
      setEditId(null);
    }
    setFormError("");
    setShowForm((show) => !show);
  };

  const closeModal = () => {
    setShowForm(false);
    setFormError("");
    setFormData(initialForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "profileImage") {
          if (val) formPayload.append("profileImage", val);
        } else {
          formPayload.append(key, val || "");
        }
      });
      formPayload.set("DateTime", new Date().toISOString());

      const url = editId
        ? `${API_BASE_URL}/clientUser/${editId}`
        : `${API_BASE_URL}/clientUser`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formPayload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save user");
        throw new Error(errorData.message || "Failed to save user");
      }

      await fetchUsers();
      closeModal();
      toast.success(editId ? "User updated successfully" : "User registered successfully");
    } catch (err) {
      setFormError(err.message);
      toast.error(err.message);
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
        toast.error(errorData.message || "Failed to delete user");
        throw new Error(errorData.message || "Failed to delete user");
      }
      await fetchUsers();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    {
      key: "DateTime",
      label: "Date & Time",
      render: (val) => new Date(val).toLocaleString(),
    },
    { key: "ClientId", label: "Client ID" },
    { key: "UserCode", label: "User Code" },
    { key: "Fname", label: "First Name" },
    { key: "Lname", label: "Last Name" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Mobile" },
    { key: "Gender", label: "Gender" },
    {
      key: "profileImage",
      label: "Profile",
      type: "image",
      render: (val) =>
        val ? (
          <img
            src={`${API_BASE_URL.replace(/\/api$/, "")}/uploads/${val}`}
            alt="Profile"
            style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
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
        ),
    },
    { key: "Type", label: "Type" },
    {
      key: "actions",
      label: "Actions",
      render: (_, item) => (
        <div className="d-flex">
          <button
            className="btn btn-outline-primary me-2 w-auto"
            onClick={() => openUserForm(item)}
          >
            <LiaEdit />
          </button>
          <button
            className="btn btn-outline-danger w-auto"
            onClick={() => handleDelete(item.id)}
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Client Users</h2>
        <button className="btn btn-outline-primary" onClick={() => openUserForm()}>
          Add User <FiUserPlus />
        </button>
      </div>

      {showForm && (
        <>
          <CommonForm
            fields={formFields}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            buttonLabel={
              editId ? (
                <>
                  Update <MdOutlineSystemUpdateAlt />
                </>
              ) : (
                <>
                  Register <BsDatabaseAdd />
                </>
              )
            }
          />
        </>
      )}

      {loading ? (
        <div className="text-center text-muted">Loading users...</div>
      ) : (
        <CommonTable columns={columns} data={clientUsers} />
      )}
    </>
  );
}
