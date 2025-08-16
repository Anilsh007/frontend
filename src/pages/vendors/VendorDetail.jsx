import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import API_BASE_URL from "../../config/Api";
import CommonForm from '../../components/CommonForm';
import statesJson from "../../components/states.json"; // adjust path if needed
import QandA from "../../components/QandA"; // adjust path if needed
import { GrUpdate } from "react-icons/gr";


export default function VendorDetail() {
    const location = useLocation();
    const { vendorcode } = location.state || {};

    const [vendorData, setVendorData] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [ClientId, setClientId] = useState();
    const [clientData, setClientData] = useState(null);
    const [states, setStates] = useState([]);
    const [qAndA, setQAndA] = useState([]);

    useEffect(() => {
        setStates(statesJson); // you can also fetch from API if needed
    }, []);

    // ✅ Fetch Vendor Detail only once
    useEffect(() => {
        if (!vendorcode) return;

        const fetchVendor = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/vendors/${vendorcode}`);
                if (!res.ok) throw new Error("Vendor not found for this code.");
                const data = await res.json();
                setVendorData(data);
                setFormData(data);
                setClientId(data.ClientId);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [vendorcode]);

    // ✅ Update Profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/vendors/${vendorData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to update vendor.");
            const updatedData = await res.json();
            setShowModal(false);
            alert("Vendor updated successfully!");
            setVendorData(formData); // local update
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    };

    // ✅ Field Definitions
    const fields = [
        { name: "vendorcompanyname", label: "Company Name", type: "text" },
        { name: "Fname", label: "First Name", type: "text" },
        { name: "Lname", label: "Last Name", type: "text" },
        { name: "Email", label: "Email", type: "email" },
        { name: "Address1", label: "Address 1", type: "text" },
        { name: "Address2", label: "Address 2", type: "text" },
        { name: "City", label: "City", type: "text" },
        { name: "State", label: "State", type: "select", options: states.map(state => ({ label: state, value: state })) },
        { name: "ZipCode", label: "Zip Code", type: "text" },
        { name: "Samuie", label: "Sam UIE", type: "text" },
        { name: "Fein", label: "FEIN", type: "text" },
        { name: "Duns", label: "DUNS", type: "text" },
        { name: "CAGE", label: "CAGE Code", type: "text" },
        { name: "Naics1", label: "NAICS 1", type: "text" },
        { name: "Naics2", label: "NAICS 2", type: "text" },
        { name: "Naics3", label: "NAICS 3", type: "text" },
        { name: "Naics4", label: "NAICS 4", type: "text" },
        { name: "Naics5", label: "NAICS 5", type: "text" },
        { name: "Nigp1", label: "NIGP 1", type: "text" },
        { name: "Nigp2", label: "NIGP 2", type: "text" },
        { name: "Nigp3", label: "NIGP 3", type: "text" },
        { name: "Nigp4", label: "NIGP 4", type: "text" },
        { name: "Nigp5", label: "NIGP 5", type: "text" },
        { name: "Phone", label: "Phone", type: "text" },
        { name: "Mobile", label: "Mobile", type: "text" },
        { name: "Sbclass", label: "Small Business Classification", type: "select", options: QandA.smallBusiness.map(item => ({ label: item, value: item })) },
        { name: "Class", label: "Business Classification", type: "select", options: QandA["Business Classification"].map(item => ({ label: item, value: item })) },
        { name: "Password", label: "Password", type: "password" },
        { name: "SecQuestion", label: "Security Question", type: "text" },
        { name: "SecAnswer", label: "Security Answer", type: "text" },
        { name: "Aboutus", label: "About Us", type: "textarea", rows: 4 },
    ];


    useEffect(() => {

        const fetchClient = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/client-admins/client/${ClientId}`);
                if (!res.ok) throw new Error("Vendor not found for this code.");
                const data = await res.json();
                setClientData(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [ClientId]);

    return (
        <>
            <Header getClientId={ClientId} />
            <div className="VendorDetailPage">
                {clientData && (
                    <>
                        <div className="p-3 bg-light border">
                            <div className="row">
                                <div className="col-md-2 text-center">
                                    <img src={`https://api.cvcsem.com/uploads${clientData.companylogo}`} alt="Logo" className="img-fluid vendor-profile" />
                                    <p className="m-0">{clientData.ClientId}</p>
                                    <p className="m-0">{clientData.CompanyName}</p>
                                </div>
                                <div className="col-md-10">
                                    <p className="m-0">{clientData.AboutUs}</p>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
            <div className="container mt-5 mb-5">

                {error && <div className="alert alert-danger">{error}</div>}
                {loading && (
                    <div className="text-center">
                        Loading <div className="spinner-border text-primary ms-2"></div>
                    </div>
                )}

                {vendorData && (
                    <>
                        <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3 rounded mb-4">
                            <div>
                                <h2>{vendorData.Fname} {vendorData.Lname}</h2>
                                <p><strong>Vendor Code:</strong> {vendorData.vendorcode}</p>
                                <p><strong>About Us:</strong> {vendorData.Aboutus}</p>
                                <p><strong>Registered On:</strong> {new Date(vendorData.DateTime).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <img
                                    src={vendorData.profileImage
                                        ? `https://api.cvcsem.com/uploads/${vendorData.profileImage}`
                                        : "https://via.placeholder.com/100"}
                                    alt="Vendor"
                                    className="img-thumbnail vendor-profile"
                                />
                            </div>
                        </div>

                        <div className="d-grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                            <div className="p-3 bg-info text-white rounded">
                                <h5>Contact Information</h5>
                                <p><strong>Email:</strong> {vendorData.Email}</p>
                                <p><strong>Phone:</strong> {vendorData.Phone}</p>
                                <p><strong>Mobile:</strong> {vendorData.Mobile}</p>
                            </div>
                            <div className="p-3 bg-success text-white rounded">
                                <h5>Address</h5>
                                <p>{vendorData.Address1}, {vendorData.Address2}</p>
                                <p>{vendorData.City}, {vendorData.State} {vendorData.ZipCode}</p>
                            </div>
                            <div className="p-3 bg-warning text-dark rounded">
                                <h5>Company</h5>
                                <p><strong>Company:</strong> {vendorData.vendorcompanyname}</p>
                                <p><strong>URL:</strong> <a href={vendorData.URL} target="_blank" rel="noopener noreferrer">{vendorData.URL}</a></p>
                                <p><strong>Sam UIE:</strong> {vendorData.Samuie}</p>
                                <p><strong>NAICS:</strong> {[vendorData.Naics1, vendorData.Naics2, vendorData.Naics3, vendorData.Naics4, vendorData.Naics5].filter(Boolean).join(', ')}</p>

                            </div>
                        </div>

                        <div className="d-grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                            <div className="p-3 bg-dark text-white rounded">
                                <h5>Additional Company Info</h5>
                                <p><strong>NIGP:</strong> {[vendorData.Nigp1, vendorData.Nigp2, vendorData.Nigp3, vendorData.Nigp4, vendorData.Nigp5].filter(Boolean).join(', ')}</p>
                                <p><strong>FEIN:</strong> {vendorData.Fein}</p>
                                <p><strong>DUNS:</strong> {vendorData.Duns}</p>
                            </div>

                            <div className="p-3 bg-secondary text-white rounded">
                                <h5>Additional Info</h5>
                                <p><strong>SB Class:</strong> {vendorData.Sbclass}</p>
                                <p><strong>Class:</strong> {vendorData.Class}</p>
                            </div>
                            <div className="p-3 bg-danger text-white rounded">
                                <h5>Security Info</h5>
                                <p><strong>Q:</strong> {vendorData.SecQuestion}</p>
                                <p><strong>A:</strong> {vendorData.SecAnswer}</p>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setShowModal(true)}
                            >
                                Update Detail <GrUpdate />
                            </button>
                        </div>
                    </>
                )}

                {/* 🧾 Modal Form */}
                {showModal && (
                    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update Vendor Details</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <CommonForm
                                        fields={fields}
                                        formData={formData}
                                        setFormData={setFormData}
                                        onSubmit={handleSubmit}
                                        buttonLabel="Update"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
