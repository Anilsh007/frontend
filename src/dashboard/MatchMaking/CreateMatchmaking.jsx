import React, { useState, useMemo, useEffect } from "react";
import CommonForm from "../../components/CommonForm";
import { GoStopwatch } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useClient } from "../ClientContext";
import API_BASE_URL from "../../config/Api";
import axios from "axios";
import MatchMakingCalender from "../../components/MatchMakingCalender";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import CommonTable from "../../components/CommonTable";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

function calculateDuration(start, end) {
    if (!start || !end) return "";
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);

    let startMinutes = h1 * 60 + m1;
    let endMinutes = h2 * 60 + m2;
    if (endMinutes < startMinutes) endMinutes += 24 * 60;

    const diff = endMinutes - startMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
}

const MatchMakingFields = [
    { name: "Title", label: "Title", type: "text", required: true },
    { name: "Date", label: "Date", type: "date", required: true },
    { name: "Location", label: "Location", type: "text", required: true },
    {
        name: "TimeDuration",
        label: "Time Duration",
        type: "custom",
        required: true,
        render: (formData, setFormData) => (
            <>
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="time"
                        className="form-control"
                        value={formData.StartTime || ""}
                        onChange={(e) => {
                            const newData = { ...formData, StartTime: e.target.value };
                            if (newData.EndTime) {
                                newData.TimeDuration = calculateDuration(
                                    e.target.value,
                                    newData.EndTime
                                );
                            }
                            setFormData(newData);
                        }}
                        required
                    />
                    <span>to</span>
                    <input
                        type="time"
                        className="form-control"
                        value={formData.EndTime || ""}
                        onChange={(e) => {
                            const newData = { ...formData, EndTime: e.target.value };
                            if (newData.StartTime) {
                                newData.TimeDuration = calculateDuration(
                                    newData.StartTime,
                                    e.target.value
                                );
                            }
                            setFormData(newData);
                        }}
                        required
                    />
                </div>
                {formData.TimeDuration && (
                    <span className="d-flex align-items-center text-muted small ms-2">
                        <GoStopwatch /> Duration: {formData.TimeDuration}
                    </span>
                )}
            </>
        ),
    },
    { name: "ClientsName", label: "Clients Name", type: "tags", required: true },
];

export default function CreateMatchmaking() {
    const { getAdminDetails } = useClient();
    const ClientId = getAdminDetails.ClientId;

    const [formData, setFormData] = useState({
        Title: "",
        Date: "",
        Location: "",
        StartTime: "",
        EndTime: "",
        TimeDuration: "",
        ClientsName: [],
    });

    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [viewMode, setViewMode] = useState("table");

    const sanitize = (str) => String(str || "").replace(/[<>]/g, "");

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/matchMaking?ClientId=${ClientId}`, {
                withCredentials: true,
            });
            setEvents(res.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load events");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [ClientId]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (loading) return;

        if (!Array.isArray(formData.ClientsName) || formData.ClientsName.length === 0) {
            toast.error("Please enter at least one client name.");
            return;
        }

        const payload = {
            ClientId,
            Title: sanitize(formData.Title.trim()),
            Date: formData.Date,
            StartTime: formData.StartTime,
            EndTime: formData.EndTime,
            Location: sanitize(formData.Location.trim()),
            TimeDuration: formData.TimeDuration,
            ClientsName: formData.ClientsName.map((c) => sanitize(c.trim())).filter(Boolean).join(", "),
        };

        try {
            setLoading(true);
            await axios.post(`${API_BASE_URL}/matchMaking`, payload, { withCredentials: true });
            toast.success("Matchmaking created successfully!");
            setFormData({
                Title: "",
                Date: "",
                Location: "",
                StartTime: "",
                EndTime: "",
                TimeDuration: "",
                ClientsName: [],
            });
            fetchEvents();
        } catch (err) {
            console.error(err);
            toast.error(String(err.response?.data?.message || "Something went wrong!"));
        } finally {
            setLoading(false);
        }
    };

    const MemoizedCalendar = useMemo(
        () => <MatchMakingCalender ClientId={ClientId} disableClick={true} />,
        [ClientId]
    );


    // Add inside CreateMatchmaking component
    const handleEdit = (match) => {
        setFormData({
            Title: match.Title,
            Date: match.Date,
            Location: match.Location,
            StartTime: match.StartTime,
            EndTime: match.EndTime,
            TimeDuration: match.TimeDuration,
            ClientsName: match.ClientsName?.split(",").map(c => c.trim()) || []
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!id) {
            toast.error("Invalid ID");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this matchmaking?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/matchMaking/${id}`, { withCredentials: true });
            toast.success("Deleted successfully!");
            fetchEvents();
        } catch (err) {
            toast.error("Failed to delete matchmaking");
            console.error(err);
        }
    };



    const tableColumns = [
        { key: "Title", label: "Title" },
        { key: "Date", label: "Date" },
        { key: "StartTime", label: "Start Time" },
        { key: "EndTime", label: "End Time" },
        { key: "TimeDuration", label: "Duration" },
        { key: "Location", label: "Location" },
        { key: "ClientsName", label: "Clients Name" },
        {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
                <>
                    <button className="btn action-btn btn-outline-warning me-2" onClick={() => handleEdit(row)} > <LiaEdit /> </button>
                    <button className="btn action-btn btn-outline-danger" onClick={() => handleDelete(row.id)} ><RiDeleteBinLine /></button>
                </>
            )
        }

    ];


    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="container py-4">
                <h2>Create Matchmaking</h2>

                <div className={loading ? "opacity-50 pe-none" : ""}>
                    <CommonForm fields={MatchMakingFields} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} showSubmit={false} />
                </div>

                <div className="text-end mt-3">
                    <button className="btn btn-outline-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                Create Match Making <VscGitPullRequestCreate />
                            </>
                        )}
                    </button>
                </div>

                <hr />

                {/* View Mode Buttons */}
                <div className="d-flex gap-2 my-4">
                    <button className={`btn ${viewMode === "table" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setViewMode("table")} > Table View </button>
                    <button className={`btn ${viewMode === "calendar" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setViewMode("calendar")} > Calendar View </button>
                </div>

                {/* Conditional Rendering */}
                {viewMode === "calendar" && MemoizedCalendar}

                {viewMode === "table" && (
                    <CommonTable columns={tableColumns} data={events} title="Matchmaking List" />
                )}
            </div>
        </>
    );
}
