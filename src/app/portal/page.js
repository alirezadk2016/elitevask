"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MONTHS = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
function fmtDate(d) {
  if (!d) return "–";
  const [y, m, day] = d.split("-");
  return `${parseInt(day)}. ${MONTHS[parseInt(m)-1]} ${y}`;
}

const STATUS = {
  confirmed: { label: "Bekræftet", color: "#37d278" },
  pending:   { label: "Afventer",  color: "#d4af37" },
  completed: { label: "Udført",    color: "#37d278" },
  cancelled: { label: "Annulleret",color: "#e74c3c" },
};

export default function PortalPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState(null);
  const [email, setEmail] = useState("");
  const [fetchErr, setFetchErr] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setFetchErr(null);
    fetch("/api/customer/bookings")
      .then(async r => {
        if (r.status === 401) { router.push("/portal/login"); return; }
        if (!r.ok) throw new Error();
        const data = await r.json();
        setBookings(data.bookings || []);
        setEmail(data.email || "");
      })
      .catch(() => setFetchErr("Kunne ikke hente bookings. Prøv at genindlæse siden."));
  }, [refresh]);

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
      if (!r.ok) { alert(data.message || "Kunne ikke annullere. Kontakt os på +45 24 44 03 21."); return; }
      setRefresh(n => n + 1);
    } catch {
      alert("Netværksfejl. Prøv igen.");
    } finally {
      setCancelling(null);
    }
  }

  const upcoming = bookings?.filter(b => b.status !== "cancelled" && b.date >= new Date().toISOString().slice(0,10)) || [];
  const past     = bookings?.filter(b => b.status === "cancelled" || (b.date && b.date < new Date().toISOString().slice(0,10))) || [];

  return (
    <div className="portal-page">
      <header className="portal-header">
        <div className="portal-header-inner">
          <a href="/" className="portal-logo">
            <span className="portal-logo-mark">EV</span>
            <span>Elite Vask</span>
          </a>
          <div className="portal-header-right">
            <span className="portal-email-label">{email}</span>
            <button className="portal-logout-btn" onClick={handleLogout}>Log ud</button>
          </div>
        </div>
      </header>

      <main className="portal-main">
        <div className="portal-wrap">
          <div className="portal-welcome">
            <h1>Mine bookings</h1>
            <p>Se dine aftaler og annuller hvis nødvendigt — mindst 24 timer inden aftalt tid.</p>
          </div>

          {fetchErr && <div className="portal-error-box">{fetchErr}</div>}

          {bookings === null && !fetchErr && (
            <div className="portal-loading">
              <div className="portal-spinner" />
              <p>Henter dine bookings…</p>
            </div>
          )}

          {bookings !== null && bookings.length === 0 && (
            <div className="portal-empty">
              <div className="portal-empty-icon">📋</div>
              <h2>Ingen bookings endnu</h2>
              <p>Du har ingen registrerede bookings på denne e-mail.</p>
              <a href="/#vaelg" className="portal-btn-primary" style={{marginTop:"8px",display:"inline-block"}}>Book din første vask →</a>
            </div>
          )}

          {upcoming.length > 0 && (
            <section className="portal-section">
              <h2 className="portal-section-title">Kommende</h2>
              <div className="portal-bookings">
                {upcoming.map(b => <BookingCard key={b.token} b={b} onCancel={handleCancel} cancelling={cancelling} />)}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section className="portal-section">
              <h2 className="portal-section-title">Historik</h2>
              <div className="portal-bookings">
                {past.map(b => <BookingCard key={b.token} b={b} onCancel={handleCancel} cancelling={cancelling} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function BookingCard({ b, onCancel, cancelling }) {
  const st = STATUS[b.status] || STATUS.confirmed;
  return (
    <div className="portal-booking-card">
      <div className="portal-booking-top">
        <div className="portal-booking-date">
          <span className="portal-booking-day">{fmtDate(b.date)}</span>
          {b.time && <span className="portal-booking-time">kl. {b.time}</span>}
        </div>
        <span className="portal-status-chip" style={{color:st.color,borderColor:st.color+"55",background:st.color+"14"}}>
          {st.label}
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
