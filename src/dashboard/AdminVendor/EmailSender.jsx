import { useCallback, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/Api";

export default function EmailSender(vendors = []) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fileBaseURL = API_BASE_URL.replace(/\/api$/, "") + "/uploads/";

    const [emailForm, setEmailForm] = useState({
        to: "",              // Admin email (auto-filled)
        cc: "",
        bcc: "",             // All selected vendor emails
        subject: "",
        body: "",            // Empty to allow custom message
        attachments: [],
    });

    // ✅ Prepare form fields when vendors are selected
    const updateFormWithSelection = useCallback((selectedIndexes, adminEmail = "") => {
        const selectedVendorData = selectedIndexes.map(i => vendors[i]);

        const bccList = selectedVendorData
            .map(v => v.Email)
            .filter(Boolean)
            .join(",");

        setEmailForm(prev => ({
            ...prev,
            to: adminEmail || "",
            bcc: bccList,
            body: "", // Empty body so admin can compose manually
            attachments: [],
        }));
    }, [vendors]);

    // ✅ Send email
    const sendEmail = async () => {
        if (!emailForm.to || !emailForm.subject || !emailForm.body) {
            alert("To, Subject, and Body are required!");
            return;
        }

        const formData = new FormData();
        formData.append("to", emailForm.to);
        formData.append("cc", emailForm.cc);
        formData.append("bcc", emailForm.bcc);
        formData.append("subject", emailForm.subject);
        formData.append("body", emailForm.body);

        if (emailForm.attachments?.length) {
            emailForm.attachments.forEach((file, i) => {
                formData.append("attachments", file); // key name must match backend
            });
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post(`${API_BASE_URL}/email/send`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
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


    return {
        emailForm,
        setEmailForm,
        updateFormWithSelection,
        sendEmail,
        loading,
        error,
    };
}
