// src/components/BookMatchMaking.js
import React, { useState, useCallback, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import API_BASE_URL from "../../config/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    parseTime,
    generateSlots15Min,
    extractDate,
    isSlotBookedFromBackend,
    handleSlotToggle,
    prepareBookingPayload,
    normalizeBookedSlots
} from "../../components/slotUtils";

export default function BookMatchMaking() {
    const location = useLocation();
    const eventDetails = location.state?.eventDetails || {};
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedSlotsMap, setSelectedSlotsMap] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const isAuthenticated = true;

    const [user, setUser] = useState({});
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                if (parsed.vendorCode && parsed.clientId && parsed.fullName) {
                    setUser(parsed);
                } else {
                    localStorage.removeItem("user");
                }
            }
        } catch {
            localStorage.removeItem("user");
        }
    }, []);


    const start = parseTime(eventDetails.startTime);
    const end = parseTime(eventDetails.endTime);
    const slots = generateSlots15Min(start, end);

    const clientData = (eventDetails.clients || []).map((clientName, idx) => ({
        id: `client-${idx}`,
        ClientName: clientName,
        slots,
    }));

    const handleSlotClick = useCallback((slot, clientId, clientName) => {
        if (!isAuthenticated) return;
        setSelectedSlotsMap(prev =>
            handleSlotToggle(clientName, slot, prev, bookedSlots, extractDate(eventDetails.start))
        );
    }, [isAuthenticated, bookedSlots, eventDetails.start]);

    const hasSelection = Object.keys(selectedSlotsMap).some(client => selectedSlotsMap[client]);

    const getSelectedData = () => {
        return Object.keys(selectedSlotsMap).map(clientId => ({
            clientId,
            clientName: clientId,
            slot: selectedSlotsMap[clientId]
        })).filter(b => b.slot);
    };

    const fetchBookedSlots = async () => {
        if (!eventDetails.id) return;
        try {
            const res = await fetch(`${API_BASE_URL}/mmSlotBook/status/${eventDetails.id}`);
            const data = await res.json();
            setBookedSlots(normalizeBookedSlots(data, extractDate(eventDetails.start)));
        } catch (err) {
            console.error("❌ Error fetching booked slots:", err);
        }
    };

    useEffect(() => { fetchBookedSlots(); }, [eventDetails.id]);

    const confirmBooking = () => {
        setPendingBookings(getSelectedData());
        setShowOverlay(true);
        setShowConfirm(true);
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setShowOverlay(false);
        setSelectedSlotsMap({});
        fetchBookedSlots();
    };

    const [isBookingProcessing, setIsBookingProcessing] = useState(false);

    const handleConfirm = async () => {
        if (isBookingProcessing) return; // prevent double click
        setIsBookingProcessing(true);

        try {
            setShowConfirm(false);
            setShowOverlay(false);

            const payloads = prepareBookingPayload(pendingBookings, user, eventDetails.id, extractDate(eventDetails.start));

            for (let payload of payloads) {
                const res = await fetch(`${API_BASE_URL}/mmSlotBook`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (res.ok) {
                    toast.success(`Booking confirmed for ${payload.ClientName} (${payload.SlotStart} - ${payload.SlotEnd})`);
                } else {
                    toast.error(data.message || "Booking failed!");
                }
            }

            await fetchBookedSlots();
            setSelectedSlotsMap({});
        } catch (err) {
            toast.error("Something went wrong while booking.");
            console.error("❌ Booking error:", err);
        } finally {
            setIsBookingProcessing(false);
        }
    };


    return (
        <>
            <Header />
            <div className="container custom-div">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div><h5>Welcome {user.fullName}!</h5></div>
                    <div><h5>Book Match Making</h5></div>
                </div>

                {eventDetails.id && (
                    <div className="mb-4 d-flex justify-content-between text-white border rounded bg-grey text-center">
                        <div className="p-1 bg-primary flex-fill"><strong>Event Date:</strong> {extractDate(eventDetails.start)}</div>
                        <div className="p-1 bg-success flex-fill"><strong>Start Time:</strong> {eventDetails.startTime}</div>
                        <div className="p-1 bg-danger flex-fill"><strong>End Time:</strong> {eventDetails.endTime}</div>
                        <div className="p-1 bg-info flex-fill"><strong>Duration:</strong> {eventDetails.duration || "—"}</div>
                    </div>
                )}

                {!isAuthenticated && <div className="alert alert-warning">Please login to book slots.</div>}

                <div className="mb-3">
                    <strong>Legend:</strong>{" "}
                    <span className="badge bg-success me-2">Selected (you)</span>
                    <span className="badge bg-danger me-2">Already booked</span>
                    <span className="badge btn-outline-primary border text-body">Available</span>
                </div>

                {clientData.length === 0 ? (
                    <div className="text-center text-muted">No clients available.</div>
                ) : (
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr><th style={{ width: 180 }}>Client Name</th><th>Time Slots (15 min)</th></tr>
                        </thead>
                        <tbody>
                            {clientData.map(client => (
                                <tr key={client.id}>
                                    <td className="align-middle">{client.ClientName}</td>
                                    <td>
                                        {client.slots.map(slot => {
                                            const isOwnedByThis = selectedSlotsMap[client.ClientName] === slot;
                                            const isBooked = isSlotBookedFromBackend(slot, client.ClientName, bookedSlots, extractDate(eventDetails.start));
                                            let btnClass = "btn btn-outline-primary me-2 w-auto p-1";
                                            if (isBooked) btnClass = "btn btn-danger me-2 w-auto p-1";
                                            else if (isOwnedByThis) btnClass = "btn btn-success me-2 w-auto p-1";

                                            return (
                                                <button
                                                    key={`${client.id}-${slot}`}
                                                    className={btnClass}
                                                    onClick={() => handleSlotClick(slot, client.id, client.ClientName)}
                                                    disabled={isBooked}
                                                >
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {hasSelection && (
                    <div className="text-end mt-4">
                        <button className="btn btn-outline-primary btn-lg" onClick={confirmBooking}>Book Now</button>
                    </div>
                )}

                {showConfirm && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Booking</h5>
                                    <button type="button" className="btn-close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Please confirm the following bookings:</p>
                                    <p>Name: {user.fullName}</p>
                                    <ul>
                                        {pendingBookings.map((b, idx) => (<li key={idx}>{b.clientName} — {b.slot}</li>))}
                                    </ul>
                                </div>
                                <div className="modal-footer justify-content-around">
                                    <button className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
                                    <button className="btn btn-outline-primary" onClick={handleConfirm}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            {showOverlay && <div className="overlay"></div>}
            <ToastContainer position="top-center" autoClose={3000} />
        </>
    );
}
