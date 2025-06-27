import { useState, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/Api";

const fileBaseURL = API_BASE_URL.replace(/\/api$/, "") + "/uploads/";

export default function EmailSender(vendors = []) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const buildEmailBody = useCallback((selectedVendorData) => {
        return selectedVendorData
            .map((vendor, i) => `
                ${i + 1}.
                Name: ${vendor.Fname || ""} ${vendor.Lname || ""}
                Email: ${vendor.Email || "N/A"}
                Mobile: ${vendor.Mobile || "N/A"}
                Company: ${vendor.vendorcompanyname || "N/A"}
                Vendor Code: ${vendor.vendorcode || "N/A"}
                Profile Image: ${vendor.profileImage ? fileBaseURL + vendor.profileImage : "N/A"}
                Document: ${vendor.docx ? fileBaseURL + vendor.docx : "N/A"}
                    `)
            .join("\n\n");
    }, []);

    const sendEmail = async (selectedIndexes) => {
        const selectedVendorData = selectedIndexes.map((i) => vendors[i]);

        if (!selectedVendorData.length) {
            alert("Please select vendors to email.");
            return false;
        }

        const emailBody = buildEmailBody(selectedVendorData);

        setLoading(true);
        setError(null);

        try {
            await axios.post(`${API_BASE_URL}/sendVendorEmail`, {
                to: "admin@example.com",
                cc: "cc@sncde.dfd",
                bcc: "bcc@sfr.dfdr",
                subject: "Selected Vendor Info",
                body: emailBody,
            });

            alert("Email sent successfully!");
            return true;
        } catch (err) {
            console.error("Email send failed:", err);
            setError("Failed to send email");
            alert("Failed to send email");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { sendEmail, loading, error };
}