import { useClient } from "./ClientContext";
import API_BASE_URL from "../config/Api";
import { useEffect, useState } from "react";
import axios from "axios";
import CommonTable from "../components/CommonTable";

const fileBaseURL = API_BASE_URL.replace(/\/api$/, "") + "/uploads/";


const columns = [
  { key: "ClientId", label: "Client ID" },
  { key: "vendorcode", label: "Vendor Code" },
  { key: "vendorcompanyname", label: "Company Name" },
  { key: "Full name", label:"Name",render: (_, row) => [row.Fname, row.Lname].filter(Boolean).join(" ")},
  { key: "Email", label: "Email" },
  { key: "Mobile", label: "Mobile" },
  {
    key: "profileImage",
    label: "Profile Image",
    type: "image",
    render: (val) => val ? <img src={fileBaseURL + val} alt="" style={{ width: 50, height: 50, borderRadius: "50%" }} /> : "N/A"
  },
  {
    key: "docx",
    label: "Document",
    type: "file",
    render: (val) => val ? <a href={fileBaseURL + val} target="_blank" rel="noopener noreferrer">View</a> : "N/A"
  },
];

export default function AdminVendors() {
  const { getAdminDetails } = useClient();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const clientId = getAdminDetails?.ClientId;

    if (!clientId) {
      setError("Client ID not available.");
      setLoading(false);
      return;
    }

    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/vendors/searchVendor/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data;

        // Ensure we always set an array
        console.log(data)
        setVendors(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError(err.response?.data?.message || "Failed to load vendors.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [getAdminDetails]);

  return (
    <div className="container mt-5">
      <h2>Admin Vendors</h2>

      {loading && <div>Loading vendors...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && vendors.length === 0 && (
        <div>No vendors found for this client.</div>
      )}

      <CommonTable columns={columns} data={vendors} title="Admin vendor"/>

    </div>
  );
}
