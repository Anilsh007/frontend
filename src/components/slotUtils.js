// src/components/slotUtils.js

export const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
};

export const formatTime = (date) => {
    if (!date) return "";
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const generateSlots15Min = (startDate, endDate) => {
    const slots = [];
    let cur = new Date(startDate);
    while (cur < endDate) {
        const next = new Date(cur.getTime() + 15 * 60000);
        if (next <= endDate) {
            const slotStr = `${formatTime(cur)} - ${formatTime(next)}`;
            slots.push(slotStr);
        }
        cur = next;
    }
    return slots;
};

export const extractDate = (isoDateStr) => {
    if (!isoDateStr) return "—";
    const d = new Date(isoDateStr);
    if (isNaN(d)) return "—";
    return d.toISOString().split("T")[0];
};

export const to24HourWithSeconds = (timeHHMM) => timeHHMM + ":00";

export const isSlotBookedFromBackend = (slot, clientName, bookedSlots, eventDate) => {
    if (!Array.isArray(bookedSlots)) return false;
    const [slotStart, slotEnd] = slot.split(" - ").map(s => to24HourWithSeconds(s.trim()));
    return bookedSlots.some(b =>
        b.ClientName.trim().toLowerCase() === clientName.trim().toLowerCase() &&
        b.SlotStart.trim() === slotStart &&
        b.SlotEnd.trim() === slotEnd &&
        b.eventDate === eventDate
    );
};

// -------------------- NEW HELPERS --------------------

// Toggle selection for a client
export const handleSlotToggle = (clientName, slot, prevSelected, bookedSlots, eventDate) => {
    const currentSlot = prevSelected[clientName];
    if (currentSlot === slot) return { ...prevSelected, [clientName]: null };

    const alreadyBooked = bookedSlots.some(
        b =>
            b.ClientName.trim().toLowerCase() === clientName.trim().toLowerCase() &&
            b.SlotStart === slot.split(" - ")[0] &&
            b.SlotEnd === slot.split(" - ")[1] &&
            b.eventDate === eventDate
    );
    if (alreadyBooked) return prevSelected;

    const updated = { ...prevSelected };
    Object.keys(updated).forEach(c => {
        if (c !== clientName && updated[c] === slot) updated[c] = null;
    });

    updated[clientName] = slot;
    return updated;
};

// Prepare payload for API
export const prepareBookingPayload = (pendingBookings, user, eventId, eventDate) => {
    return pendingBookings.map(booking => ({
        MatchMakingId: eventId,
        ClientName: booking.clientName,
        SlotStart: booking.slot.split(" - ")[0],
        SlotEnd: booking.slot.split(" - ")[1],
        BookedByVendor: user.vendorCode,
        ClientId: user.clientId,
        userName: user.fullName,
        eventDate
    }));
};

// Normalize backend booked slots
export const normalizeBookedSlots = (bookedSlotsData, eventDate) => {
    return bookedSlotsData.map(b => ({
        ClientName: b.ClientName.trim().toLowerCase(),
        SlotStart: b.SlotStart.trim(),
        SlotEnd: b.SlotEnd.trim(),
        eventDate
    }));
};
