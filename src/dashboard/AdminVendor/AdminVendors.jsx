import { useClient } from "../ClientContext";
import API_BASE_URL from "../../config/Api";
import { useEffect, useState } from "react";
import axios from "axios";
import CommonTable from "../../components/CommonTable";
import { MdAttachFile, MdOutlineContactMail, MdOutlinePreview } from "react-icons/md";
import SearchDocument from "./SearchDocument";
import EmailSender from "./EmailSender";
import { IoCloseSharp } from "react-icons/io5";

const fileBaseURL = API_BASE_URL.replace(/\/api$/, "") + "/uploads/";

const columns = [
  { key: "vendorcompanyname", label: "Company Name" },
  { key: "Full name", label: "Name", render: (_, row) => [row.Fname, row.Lname].filter(Boolean).join(" "), },
  { key: "Email", label: "Email" },
  { key: "Phone", label: "Phone" },
  {
    key: "docx",
    label: "Capability Statement",
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
  const [hasSearched, setHasSearched] = useState(false);


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
      <SearchDocument
        vendors={vendors}
        setFilteredVendors={setFilteredVendors}
        setHasSearched={setHasSearched}
      />


      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status" />
          <div>Loading vendors...</div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && !hasSearched && (
        <div className="alert alert-info mt-3">
          Please search to view vendor results.
        </div>
      )}

      {!loading && !error && hasSearched && (
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
              <h5 className="mb-3"><MdOutlineContactMail /> Compose Email</h5>

              <div className="row">
                <div className="col-2 col-sm-1 col-form-label">
                  <label>From</label>
                </div>
                <div className="col-10 col-sm-11">
                  <input className="form-control" value="admin@cvcsem.com" disabled />
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-2 col-sm-1 col-form-label">
                  <label>To</label>
                </div>
                <div className="col-10 col-sm-11">
                  <input className="form-control" value={emailForm.to} onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })} />
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-2 col-sm-1 col-form-label">
                  <label>CC</label>
                </div>
                <div className="col-10 col-sm-11">
                  <input className="form-control" value={emailForm.cc} onChange={(e) => setEmailForm({ ...emailForm, cc: e.target.value })} />
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-2 col-sm-1 col-form-label">
                  <label>BCC</label>
                </div>
                <div className="col-10 col-sm-11">
                  <input className="form-control" value={emailForm.bcc} onChange={(e) => setEmailForm({ ...emailForm, bcc: e.target.value })} />
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-2 col-sm-1 col-form-label">
                  <label>Subject</label>
                </div>
                <div className="col-10 col-sm-11">
                  <input className="form-control" value={emailForm.subject} onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })} />
                </div>
              </div>

              <div className="d-flex justify-content-end align-items-center mt-2">

                <ul className="mb-0 mail-attachments">
                  {emailForm.attachments && emailForm.attachments.length > 0 &&
                    emailForm.attachments.map((file, index) => (
                      <li key={index} className="badge"> <span>{file.name}</span>
                        <button type="button"
                          onClick={() => {
                            setEmailForm((prev) => ({
                              ...prev,
                              attachments: prev.attachments.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <IoCloseSharp />
                        </button>
                      </li>
                    ))}
                </ul>

                <label htmlFor="file-upload" className="  me-2" title="Attach files"><MdAttachFile /></label>
                <input id="file-upload" type="file"
                  style={{ display: 'none' }}
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    setEmailForm((prev) => {
                      const existingFiles = prev.attachments || [];
                      const combined = [...existingFiles, ...newFiles];

                      // Remove duplicates by name
                      const uniqueFiles = Array.from(new Map(combined.map(f => [f.name, f])).values());

                      return {
                        ...prev,
                        attachments: uniqueFiles,
                      };
                    });
                  }}

                />

              </div>

              <textarea rows={6} placeholder="Compose your mail" className="form-control mt-2" value={emailForm.body} onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })} />

              <div className="mb-3 d-flex justify-content-end">
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
