import React from "react";

export default function TileView({
    data = [],
    title = "Matchmaking List",
    className = "",
    onCardClick
}) {
    if (!Array.isArray(data) || data.length === 0) {
        return <div className="text-muted text-center">No matchmakings found.</div>;
    }

    // Simple time formatter
    const formatTime = (timeStr) => {
        if (!timeStr) return "—";
        return timeStr.split(".")[0]; // Removes microseconds
    };

    return (
        <div className={`matchmaking-tile-view ${className}`}>
            {title && <h4 className="mb-3">{title}</h4>}

            <div className="row">
                {data.map((ev, idx) => (
                    <div
                        key={ev.id || idx}
                        className="col-md-4"
                        onClick={onCardClick ? () => onCardClick(ev) : undefined}
                        style={{ cursor: onCardClick ? "pointer" : "default" }}
                    >
                        <div className="card mb-3 shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title">{ev.Title || "Untitled"}</h5>
                                <p className="card-text">
                                    📅 {ev.Date || "—"}<br />
                                    ⏰ {formatTime(ev.StartTime)} - {formatTime(ev.EndTime)}{" "}
                                    {ev.TimeDuration && `(${ev.TimeDuration})`}<br />
                                    📍 {ev.Location || "—"}<br />
                                    👥 {ev.ClientsName || "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
