import { useClient } from "../ClientContext";
import API_BASE_URL from "../../config/Api";
import { useEffect, useState } from "react";
import axios from "axios";
import CommonTable from "../../components/CommonTable";
import { MdOutlinePreview } from "react-icons/md";
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
  const [showEmailForm, setShowEmailForm] = useState(false);

  const {
    emailForm,
    setEmailForm,
    updateFormWithSelection,
    sendEmail,
    loading: emailSending,
  } = EmailSender(filteredVendors);

  useEffect(() => {
    if (selectedRows.length > 0) {
      updateFormWithSelection(selectedRows, getAdminDetails?.AdminEmail || "");
      setShowEmailForm(true);
    } else {
      setShowEmailForm(false);
    }
  }, [selectedRows]);

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
        console.log("Total vendors:", data.length);
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

          {showEmailForm && (
            <div className="card mt-4 p-3 border shadow-sm bg-light">
              <h5 className="mb-3">📧 Compose Email</h5>

              <div className="d-flex align-items-center">
                <label>From</label>
                <input className="form-control ms-2" value="admin@cvcsem.com" disabled />
              </div>

              <div className="d-flex align-items-center">
                <label>To</label>
                <input className="form-control" value={emailForm.to} onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })} />
              </div>

              <div className="d-flex align-items-center">
                <label>CC</label>
                <input className="form-control" value={emailForm.cc} onChange={(e) => setEmailForm({ ...emailForm, cc: e.target.value })} />
              </div>

              <div className="d-flex align-items-center">
                <label>BCC</label>
                <input className="form-control" value={emailForm.bcc} onChange={(e) => setEmailForm({ ...emailForm, bcc: e.target.value })} />
              </div>

              <div className="d-flex align-items-center">
                <label>Subject</label>
                <input className="form-control" value={emailForm.subject} onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })} />
              </div>

              <div className="mb-2">
                <label>Body</label>
                <textarea rows={6} placeholder="Compose your mail" className="form-control" value={emailForm.body} onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })} />
              </div>

              <div className="mb-3 d-flex flex-end align-items-center items-end">
                <div>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setEmailForm((prev) => ({
                        ...prev,
                        attachments: files,
                      }));
                    }}
                  />
                  <ul>
                    {emailForm.attachments && emailForm.attachments.length > 0 &&
                      emailForm.attachments.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                  </ul>
                </div>

                <button className="btn btn-outline-primary w-25" onClick={sendEmail} disabled={emailSending}>
                  {emailSending ? "Sending..." : "Send Composed Email"}
                </button>
              </div>

            </div>
            
          )}
        </>
      )}
    </div>
  );
}
