import { useClient } from "../ClientContext";
import API_BASE_URL from "../../config/Api";
import { useEffect, useState } from "react";
import axios from "axios";
import CommonTable from "../../components/CommonTable";
import { MdOutlinePreview } from "react-icons/md";
import { RiMailSendLine } from "react-icons/ri";
import SearchDocument from "./SearchDocument";
import EmailSender from "./EmailSender";

const fileBaseURL = API_BASE_URL.replace(/\/api$/, "") + "/uploads/";

const columns = [
  { key: "vendorcode", label: "Vendor Code" },
  { key: "vendorcompanyname", label: "Company Name" },
  {
    key: "Full name",
    label: "Name",
    render: (_, row) => [row.Fname, row.Lname].filter(Boolean).join(" "),
  },
  { key: "Email", label: "Email" },
  { key: "Mobile", label: "Mobile" },
  { key: "Duns", label: "DUNS" },
  { key: "Naics1", label: "NAICS 1" },
  { key: "Naics2", label: "NAICS 2" },
  { key: "Naics3", label: "NAICS 3" },
  { key: "Naics4", label: "NAICS 4" },
  { key: "Naics5", label: "NAICS 5" },
  { key: "Nigp1", label: "Nigp 1" },
  { key: "Nigp2", label: "Nigp 2" },
  { key: "Nigp3", label: "Nigp 3" },
  { key: "Nigp4", label: "Nigp 4" },
  { key: "Nigp5", label: "Nigp 5" },
  {
    key: "docx",
    label: "Document",
    type: "file",
    render: (val) =>
      val ? (
        <a
          href={fileBaseURL + val}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center d-block"
          title="View Document"
        >
          <MdOutlinePreview size={24} />
        </a>
      ) : (
        "N/A"
      ),
  },
  { key: "documentText", label: "document Text" },
];

export default function AdminVendors() {
  const { getAdminDetails } = useClient();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const { sendEmail, loading: emailSending } = EmailSender(filteredVendors);

  useEffect(() => {
    const clientId = getAdminDetails?.ClientId;
    if (!clientId) {
      setError("Client ID not available.");
      setLoading(false);
      return;
    }

    const fetchVendors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/vendors/searchVendor/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = Array.isArray(response.data) ? response.data : [response.data];
        setVendors(data);
        setFilteredVendors(data);
      } catch (err) {
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

  const handleSendEmail = () => {
    sendEmail(selectedRows);
  };

  return (
    <div className="mt-5">
      <SearchDocument vendors={vendors} setFilteredVendors={setFilteredVendors} />

      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status" />
          <div>Loading vendors...</div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <CommonTable
            columns={columns}
            data={filteredVendors}
            showCheckbox={true}
            selectedRows={selectedRows}
            onRowSelect={setSelectedRows}
          />

          {selectedRows.length > 0 && (
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-outline-primary w-auto px-3 d-flex align-items-center gap-2"
                onClick={handleSendEmail}
                title="Send Email to Admin"
                disabled={emailSending}
              >
                {emailSending ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RiMailSendLine size={20} /> Ready To Email
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}