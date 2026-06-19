"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


function CancelContent() {
  const params = useSearchParams();
  const token = params.get("token");

  const [state, setState] = useState("loading"); // loading | found | not_found | expired | already_cancelled | cancelled | error
  const [booking, setBooking] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!token) { setState("not_found"); return; }
    fetch(`/api/cancel?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const data = await r.json();
        if (r.status === 404) { setState("not_found"); return; }
        if (r.status === 409) { setState("already_cancelled"); return; }
        if (r.status === 410) { setState("expired"); return; }
        if (!r.ok) { setState("not_found"); return; }
        setBooking(data);
        setState("found");
      })
      .catch(() => setState("not_found"));
  }, [token]);

  async function handleCancel() {
    setConfirming(true);
    try {
      const r = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (r.status === 404) { setState("not_found"); return; }
      if (r.status === 409) { setState("already_cancelled"); return; }
      if (r.status === 410) { setState("expired"); return; }
      if (!r.ok) throw new Error();
      setState("cancelled");
    } catch {
      setState("error");
    } finally {
      setConfirming(false);
    }
  }

  const da = !booking || booking.lang !== "en";

  const fmt = (d) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    const months = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
    return `${parseInt(day)}. ${months[parseInt(m)-1]} ${y}`;
  };

  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <a href="/" className="legal-back">← {da ? "Tilbage til forsiden" : "Back to home"}</a>

        {state === "loading" && (
          <div className="cancel-loading">
            <div className="cancel-spinner"></div>
            <p>{da ? "Henter bookingoplysninger…" : "Loading booking details…"}</p>
          </div>
        )}

        {state === "not_found" && (
          <div className="cancel-card cancel-invalid">
            <div className="cancel-icon">❌</div>
            <h1>{da ? "Link ikke gyldigt" : "Link not valid"}</h1>
            <p>{da
              ? "Dette annulleringslink er ugyldigt eller booking er allerede annulleret."
              : "This cancellation link is invalid or the booking has already been cancelled."
            }</p>
            <p>{da
              ? "Kontakt os direkte på +45 24 44 03 21 eller info@elite-vask.dk."
              : "Contact us directly at +45 24 44 03 21 or info@elite-vask.dk."
            }</p>
            <a href="/" className="btn btn-green" style={{display:"inline-block",marginTop:"16px"}}>
              {da ? "Gå til forsiden" : "Go to homepage"}
            </a>
          </div>
        )}

        {state === "expired" && (
          <div className="cancel-card cancel-invalid">
            <div className="cancel-icon">⏱</div>
            <h1>{da ? "Link udløbet" : "Link expired"}</h1>
            <p>{da
              ? "Dette annulleringslink er udløbet (gyldigt i 24 timer). Kontakt os direkte for at ændre din booking."
              : "This cancellation link has expired (valid for 24 hours). Contact us directly to change your booking."
            }</p>
            <p>{da ? "Telefon: +45 24 44 03 21 · info@elite-vask.dk" : "Phone: +45 24 44 03 21 · info@elite-vask.dk"}</p>
            <a href="/" className="btn btn-green" style={{display:"inline-block",marginTop:"16px"}}>
              {da ? "Gå til forsiden" : "Go to homepage"}
            </a>
          </div>
        )}

        {state === "already_cancelled" && (
          <div className="cancel-card cancel-success-card">
            <div className="cancel-icon">✅</div>
            <h1>{da ? "Allerede annulleret" : "Already cancelled"}</h1>
            <p>{da
              ? "Denne booking er allerede annulleret."
              : "This booking has already been cancelled."
            }</p>
            <a href="/" className="btn btn-green" style={{display:"inline-block",marginTop:"20px"}}>
              {da ? "Book en ny tid" : "Book a new time"}
            </a>
          </div>
        )}

        {state === "found" && booking && (
          <div className="cancel-card">
            <h1>{da ? "Annuller booking" : "Cancel booking"}</h1>
            <p className="cancel-sub">{da
              ? "Du er ved at annullere følgende booking. Handlingen kan ikke fortrydes."
              : "You are about to cancel the following booking. This action cannot be undone."
            }</p>

            <div className="cancel-details">
              <div className="cancel-row">
                <span className="cancel-label">{da ? "Dato & tid" : "Date & time"}</span>
                <span className="cancel-val">{fmt(booking.date)} · {booking.time}</span>
              </div>
              <div className="cancel-row">
                <span className="cancel-label">{da ? "Bil" : "Car"}</span>
                <span className="cancel-val">{booking.car}</span>
              </div>
              <div className="cancel-row">
                <span className="cancel-label">{da ? "Pakke" : "Package"}</span>
                <span className="cancel-val">{booking.pkg}</span>
              </div>
              <div className="cancel-row">
                <span className="cancel-label">{da ? "Navn" : "Name"}</span>
                <span className="cancel-val">{booking.name}</span>
              </div>
            </div>

            <div className="cancel-actions">
              <button
                className="cancel-btn-destroy"
                onClick={handleCancel}
                disabled={confirming}
              >
                {confirming
                  ? (da ? "Annullerer…" : "Cancelling…")
                  : (da ? "Bekræft annullering" : "Confirm cancellation")
                }
              </button>
              <a href="/" className="cancel-btn-keep">
                {da ? "Behold booking" : "Keep booking"}
              </a>
            </div>
          </div>
        )}

        {state === "cancelled" && (
          <div className="cancel-card cancel-success-card">
            <div className="cancel-icon">✅</div>
            <h1>{da ? "Booking annulleret" : "Booking cancelled"}</h1>
            <p>{da
              ? "Din booking er nu annulleret. Du modtager en bekræftelse på e-mail."
              : "Your booking has been cancelled. You will receive a confirmation by email."
            }</p>
            <a href="/" className="btn btn-green" style={{display:"inline-block",marginTop:"20px"}}>
              {da ? "Book en ny tid" : "Book a new time"}
            </a>
          </div>
        )}

        {state === "error" && (
          <div className="cancel-card cancel-invalid">
            <div className="cancel-icon">⚠️</div>
            <h1>{da ? "Noget gik galt" : "Something went wrong"}</h1>
            <p>{da
              ? "Vi kunne ikke annullere din booking. Kontakt os direkte på +45 24 44 03 21."
              : "We couldn't cancel your booking. Contact us directly at +45 24 44 03 21."
            }</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div className="legal-page"><div className="legal-wrap"><p>Indlæser…</p></div></div>}>
      <CancelContent />
    </Suspense>
  );
}
