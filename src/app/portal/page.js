"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_LABEL = {
  confirmed: { da: "Bekræftet", color: "#37d278" },
  pending: { da: "Afventer", color: "#d4af37" },
  completed: { da: "Udført", color: "#37d278" },
  cancelled: { da: "Annulleret", color: "#e74c3c" },
};

function fmtDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  const months = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
  return `${parseInt(day)}. ${months[parseInt(m)-1]} ${y}`;
}

export default function PortalPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [cancelDone, setCancelDone] = useState(null);

  useEffect(() => {
    fetch("/api/customer/bookings")
      .then(async r => {
        if (r.status === 401) { router.push("/portal/login"); return; }
        if (!r.ok) throw new Error();
        const data = await r.json();
        setBookings(data.bookings || []);
        setEmail(data.email || "");
      })
      .catch(() => setError("Kunne ikke hente bookings. Prøv at genindlæse siden."));
  }, [cancelDone]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
  }

  async function handleCancel(token) {
    if (!confirm("Er du sikker på, at du vil annullere denne booking?")) return;
    setCancelling(token);
    try {
      const r = await fetch("/api/customer/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json();
      if (!r.ok) {
        alert(data.message || "Kunne ikke annullere. Kontakt os på +45 24 44 03 21.");
        return;
      }
      setCancelDone(Date.now());
    } catch {
      alert("Netværksfejl. Prøv igen.");
    } finally {
      setCancelling(null);
    }
  }

  const upcoming = bookings?.filter(b => b.status !== "cancelled" && b.date >= new Date().toISOString().slice(0, 10)) || [];
  const past = bookings?.filter(b => b.status === "cancelled" || (b.date && b.date < new Date().toISOString().slice(0, 10))) || [];

  return (
    <div className="portal-page">
      <header className="portal-header">
        <div className="portal-header-inner">
          <a href="/" className="portal-logo">
            <span className="portal-logo-mark">EV</span>
            <span>Elite Vask</span>
          </a>
          <div className="portal-header-right">
            <span className="portal-email">{email}</span>
            <button className="portal-logout-btn" onClick={handleLogout}>Log ud</button>
          </div>
        </div>
      </header>

      <main className="portal-main">
        <div className="portal-wrap">
          <div className="portal-welcome">
            <h1>Mine bookings</h1>
            <p>Her kan du se dine bookings og annullere fremtidige aftaler.</p>
          </div>

          {error && <div className="portal-error-box">{error}</div>}

          {bookings === null && !error && (
            <div className="portal-loading">
              <div className="portal-spinner"></div>
              <p>Henter dine bookings…</p>
            </div>
          )}

          {bookings !== null && bookings.length === 0 && (
            <div className="portal-empty">
              <div className="portal-empty-icon">📋</div>
              <h2>Ingen bookings endnu</h2>
              <p>Du har ikke nogen registrerede bookings på denne e-mail.</p>
              <a href="/#vaelg" className="portal-btn-primary">Book din første vask →</a>
            </div>
          )}

          {upcoming.length > 0 && (
            <section className="portal-section">
              <h2 className="portal-section-title">Kommende</h2>
              <div className="portal-bookings">
                {upcoming.map(b => (
                  <BookingCard key={b.token} b={b} onCancel={handleCancel} cancelling={cancelling} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section className="portal-section">
              <h2 className="portal-section-title">Historik</h2>
              <div className="portal-bookings">
                {past.map(b => (
                  <BookingCard key={b.token} b={b} onCancel={handleCancel} cancelling={cancelling} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function BookingCard({ b, onCancel, cancelling }) {
  const st = STATUS_LABEL[b.status] || STATUS_LABEL.confirmed;
  return (
    <div className="portal-booking-card">
      <div className="portal-booking-top">
        <div className="portal-booking-date">
          <span className="portal-booking-day">{b.date ? fmtDate(b.date) : "–"}</span>
          {b.time && <span className="portal-booking-time">kl. {b.time}</span>}
        </div>
        <span className="portal-status-chip" style={{ color: st.color, borderColor: st.color + "44", background: st.color + "12" }}>
          {st.da}
        </span>
      </div>
      <div className="portal-booking-body">
        <div className="portal-booking-row"><span>Bil</span><span>{b.car || "–"}</span></div>
        <div className="portal-booking-row"><span>Pakke</span><span>{b.pkg || "–"}</span></div>
        {b.addr && <div className="portal-booking-row"><span>Adresse</span><span>{b.addr}</span></div>}
        {b.price && <div className="portal-booking-row"><span>Pris</span><span>{b.price}</span></div>}
      </div>
      {b.canCancel && (
        <div className="portal-booking-actions">
          <button
            className="portal-cancel-btn"
            onClick={() => onCancel(b.token)}
            disabled={cancelling === b.token}
          >
            {cancelling === b.token ? "Annullerer…" : "Annuller booking"}
          </button>
        </div>
      )}
      {b.status === "cancelled" && b.cancelledAt && (
        <p className="portal-cancelled-note">Annulleret {new Date(b.cancelledAt).toLocaleDateString("da-DK")}</p>
      )}
    </div>
  );
}
