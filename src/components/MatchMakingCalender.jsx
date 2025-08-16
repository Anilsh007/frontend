import { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import API_BASE_URL from "../config/Api";
import DOMPurify from "dompurify";
import {
  HiOutlineDocumentText,
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const m = String(timeStr).match(/^(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : String(timeStr);
};

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return NaN;
  const m = String(timeStr).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return NaN;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
};

const addDaysToDateString = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const calcDurationFromDateTimes = (startIso, endIso) => {
  const s = new Date(startIso);
  let e = new Date(endIso);
  if (isNaN(s) || isNaN(e)) return "—";
  if (e <= s) e = new Date(e.getTime() + 24 * 60 * 60 * 1000);
  const minutes = Math.round((e - s) / 60000);
  return `${Math.floor(minutes / 60) > 0 ? `${Math.floor(minutes / 60)}h ` : ""}${minutes % 60}m`;
};

const safeText = (s) =>
  DOMPurify.sanitize(String(s || ""), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

export default function MatchMakingCalender({ ClientId, autoCloseTime = 3000, isLoggedIn, disableClick = false }) {
  const [events, setEvents] = useState([]);
  const [overlayActive, setOverlayActive] = useState(false);
  const navigate = useNavigate();

  // Validate ClientId strictly
  const isValidClientId = typeof ClientId === "string" && /^[\w-]+$/.test(ClientId);

  useEffect(() => {
    if (!isValidClientId) {
      console.warn("Invalid ClientId");
      setEvents([]); // clear events on invalid ID
      return;
    }

    const controller = new AbortController();

    const token = sessionStorage.getItem("authToken") || sessionStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .get(`${API_BASE_URL}/matchMaking/clientMatch/${encodeURIComponent(ClientId)}`, {
        headers,
        withCredentials: true,
        signal: controller.signal, // abort support
      })
      .then((response) => {
        const mapped = (response.data || []).map((ev, idx) => {
          const startHM = formatTime(ev.StartTime);
          const endHM = formatTime(ev.EndTime);

          const startMins = parseTimeToMinutes(startHM);
          const endMins = parseTimeToMinutes(endHM);
          const endDatePart =
            isNaN(startMins) || isNaN(endMins) || endMins > startMins
              ? ev.Date
              : addDaysToDateString(ev.Date, 1);

          const startLocal = `${ev.Date}T${startHM}`;
          const endLocal = `${endDatePart}T${endHM}`;

          let clientsList = [];
          if (Array.isArray(ev.ClientsName)) {
            clientsList = ev.ClientsName.map((c) => safeText(c));
          } else if (typeof ev.ClientsName === "string") {
            clientsList = ev.ClientsName.split(",").map((c) => safeText(c.trim())).filter(Boolean);
          }

          const duration = calcDurationFromDateTimes(startLocal, endLocal);

          return {
            id: `${ev.id || idx}-${startHM}-${endHM}`,
            title: safeText(ev.Title) || "Untitled",
            start: startLocal,
            end: endLocal,
            extendedProps: {
              location: safeText(ev.Location) || "—",
              duration,
              clients: clientsList,
              startTime: startHM,
              endTime: endHM,
            },
          };
        });

        setEvents(mapped);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          toast.error("Failed to load events.");
        }
      });

    return () => controller.abort(); // cancel request on unmount or ClientId change
  }, [ClientId, isValidClientId]);

  const handleEventClick = useCallback(
    (info) => {
      const eventDate = new Date(info.event.start);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        info.jsEvent.preventDefault();
        return;
      }

      const clickedEvent = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        location: info.event.extendedProps.location,
        duration: info.event.extendedProps.duration,
        clients: info.event.extendedProps.clients,
        startTime: info.event.extendedProps.startTime,
        endTime: info.event.extendedProps.endTime,
      };

      setOverlayActive(true);

      toast.info(
        <div>
          <p>
            <b>
              <HiOutlineDocumentText className="me-2 text-primary" /> Title:
            </b>{" "}
            {clickedEvent.title}
          </p>
          <p>
            <b>
              <HiOutlineCalendarDays className="me-2 text-info" /> Date:
            </b>{" "}
            {clickedEvent.start?.toLocaleDateString() || "—"}
          </p>
          <p>
            <b>
              <HiOutlineClock className="me-2 text-warning" /> Time:
            </b>{" "}
            {clickedEvent.startTime} — {clickedEvent.endTime} ({clickedEvent.duration})
          </p>
          <p>
            <b>
              <HiOutlineMapPin className="me-2 text-danger" /> Location:
            </b>{" "}
            {clickedEvent.location}
          </p>
          <p>
            <b>
              <HiOutlineUserGroup className="me-2 text-success" /> Clients:
            </b>{" "}
            {clickedEvent.clients.join(", ")}
          </p>

          <div className="mt-4 text-center">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  if (isValidClientId) {
                    navigate(`/BookMatchMaking`, { state: { ClientId, eventDetails: clickedEvent } });
                  }
                }}
                className="btn btn-outline-primary"
              >
                Book Now
              </button>
            ) : (
              <>
                <hr />
                <div className="d-flex">
                  <div className="border-end p-4">
                    <p className="mb-3 fw-semibold text-secondary">To book this event, please login first.</p>
                    <button
                      onClick={() => {
                        if (isValidClientId) {
                          navigate(`/cvcsem/${ClientId}`);
                        }
                      }}
                      className="btn btn-outline-primary"
                    >
                      Login
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="mb-3 fw-semibold text-secondary">Don't have an account? Quick Register now.</p>
                    <button
                      onClick={() => navigate("/QuickVendorsRegister", { state: { ClientId } })}
                      className="btn btn-outline-primary"
                    >
                      Quick Register
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        {
          position: "top-center",
          className: "custom-toast",
          onClose: () => setOverlayActive(false),
          autoClose: autoCloseTime,
          closeOnClick: false,
          draggable: false,
        }
      );
    },
    [ClientId, isLoggedIn, isValidClientId, navigate, autoCloseTime]
  );

  const handleEventDidMount = (info) => {
    if (disableClick) {
      info.el.classList.add("fc-custom");
    } else {
      info.el.classList.add("fc-custom-active");
    }
  };


  return (
    <>
      {overlayActive && <div className="overlay" />}
      <div className="container">
        <h4 className="mb-4">Match Making Calendar</h4>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={disableClick ? null : handleEventClick}
          dateClick={disableClick ? null : (info) => console.log("Date clicked:", info.dateStr)}
          selectable={!disableClick}
          eventDidMount={handleEventDidMount}
          height="auto"
          dayMaxEventRows={3}
          eventDisplay="block"
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
            hour12: true,
          }}
        />


      </div>
    </>
  );
}
