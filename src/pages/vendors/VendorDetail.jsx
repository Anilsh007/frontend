import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import API_BASE_URL from "../../config/Api";
import CommonForm from '../../components/CommonForm';

export default function VendorDetail() {
    const location = useLocation();
    const { vendorcode } = location.state || {};

    const [vendorData, setVendorData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});


    const fetchVendorData = async () => {
        try {
            setLoading(true); // Optional: if you want to show loading during update refresh
            const response = await fetch(`${API_BASE_URL}/vendors/${vendorcode}`);
            if (!response.ok) throw new Error("No vendor found for this vendor code.");
            const data = await response.json();
            setVendorData(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (vendorcode) fetchVendorData();
    }, [vendorcode]);


    const fields = [
        { name: "ClientId", label: "Client ID", type: "text", required: true, disabled: true },
        { name: "vendorcode", label: "Vendor Code", type: "text", required: true, disabled: true },
        { name: "vendorcompanyname", label: "Company Name", type: "text" },
        { name: "Fname", label: "First Name", type: "text" },
        { name: "Lname", label: "Last Name", type: "text" },
        { name: "Email", label: "Email", type: "email" },
        { name: "Address1", label: "Address 1", type: "text" },
        { name: "Address2", label: "Address 2", type: "text" },
        { name: "City", label: "City", type: "text" },
        { name: "State", label: "State", type: "text" },
        { name: "ZipCode", label: "Zip Code", type: "text" },
        { name: "Samuin", label: "Sam UIN", type: "text" },
        { name: "Fein", label: "FEIN", type: "text" },
        { name: "Duns", label: "DUNS", type: "text" },
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
        { name: "Sbclass", label: "SB Class", type: "text" },
        { name: "Class", label: "Class", type: "text" },
        { name: "UserId", label: "User ID", type: "text",disabled: true },
        { name: "Password", label: "Password", type: "password" },
        { name: "SecQuestion", label: "Security Question", type: "text" },
        { name: "SecAnswer", label: "Security Answer", type: "text" },
        { name: "Aboutus", label: "About Us", type: "textarea", rows: 4 },
        { name: "Type", label: "Type", type: "text" },
        { name: "DateTime", label: "Date Registered", type: "text", disabled: true },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Optionally validate or transform data before sending

        try {
            const response = await fetch(`${API_BASE_URL}/vendors/${vendorData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update vendor");

            await fetchVendorData();
            setShowModal(false); // Close modal after success

            alert("Vendor updated successfully!");
        } catch (error) {
            alert("Update failed: " + error.message);
        }
    };

    useEffect(() => {
        if (vendorData) {
            setFormData(vendorData);
        }
    }, [vendorData]);


    return (
        <>
            <Header />
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
                                <p>Vendor code: <strong>{vendorData.vendorcode}</strong></p>
                                <p>Client Id: <strong>{vendorData.ClientId}</strong></p>
                                <p>About Us: {vendorData.Aboutus}</p>
                            </div>
                            <div>
                                {/* Placeholder image */}
                                <img src={`https://api.cvcsem.com/uploads/${vendorData.profileImage}` || "https://via.placeholder.com/100"} alt="Vendor" className="img-thumbnail vendor-profile" />
                            </div>
                        </div>

                        <div className="d-grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                            <div className="p-3 bg-info text-white rounded">
                                <h5>Contact Information</h5>
                                <p>Email: {vendorData.Email}</p>
                                <p>Phone: {vendorData.Phone}</p>
                                <p>Mobile: {vendorData.Mobile}</p>
                            </div>
                            <div className="p-3 bg-success text-white rounded">
                                <h5>Address</h5>
                                <p>{vendorData.Address1}, {vendorData.Address2}</p>
                                <p>{vendorData.City}, {vendorData.State} {vendorData.ZipCode}</p>
                            </div>
                            <div className="p-3 bg-warning text-dark rounded">
                                <h5>Company Information</h5>
                                <p>Company Name: {vendorData.vendorcompanyname}</p>
                                <p>NAICS: {vendorData.Naics1}, {vendorData.Naics2}, {vendorData.Naics3}, {vendorData.Naics4}, {vendorData.Naics5}</p>
                                <p>NIGP: {vendorData.Nigp1}, {vendorData.Nigp2}, {vendorData.Nigp3}, {vendorData.Nigp4}, {vendorData.Nigp5}</p>
                            </div>
                        </div>

                        <div className="d-grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                            <div className="p-3 bg-secondary text-white rounded">
                                <h5>Additional Information</h5>
                                <p>SB Class: {vendorData.Sbclass}</p>
                                <p>Class: {vendorData.Class}</p>
                            </div>
                            <div className="p-3 bg-danger text-white rounded">
                                <h5>Security Information</h5>
                                <p>Question: {vendorData.SecQuestion}</p>
                                <p>Answer: {vendorData.SecAnswer}</p>
                            </div>
                            <div className="p-3 bg-dark text-white rounded">
                                <h5>Account Information</h5>
                                <p>User ID: {vendorData.UserId}</p>
                            </div>
                        </div>

                        <div className="d-grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                            <div className="p-3 bg-light rounded">
                                <h5>Registration Details</h5>
                                <p>Date Registered: {new Date(vendorData.DateTime).toLocaleDateString()}</p>
                            </div>
                            <div className="p-3 bg-light rounded">
                                <h5>Identifiers</h5>
                                <p>FEIN: {vendorData.Fein}</p>
                                <p>DUNS: {vendorData.Duns}</p>
                            </div>
                        </div>

                        <button className="btn btn-outline-primary mt-3" onClick={() => setShowModal(true)}>
                            Update Detail
                        </button>
                    </>
                )}

                {/* Basic Modal */}
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
