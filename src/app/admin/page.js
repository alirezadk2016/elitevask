"use client";
import { useState, useEffect, useCallback } from "react";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async (s) => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${s}` },
      });
      if (r.status === 401) { setError("Forkert adgangskode."); setAuthed(false); return; }
      const data = await r.json();
      setBookings(data.bookings || []);
      setAuthed(true);
    } catch { setError("Netværksfejl."); }
    finally { setLoading(false); }
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    load(secret);
  }

  async function handleDelete(token) {
    if (!confirm("Slet denne booking?")) return;
    setDeleting(token);
    try {
      const r = await fetch("/api/admin/delete-booking", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (r.ok) setBookings(b => b.filter(x => x.token !== token));
    } catch {}
    finally { setDeleting(null); }
  }

  function fmtDate(d) {
    if (!d) return "-";
    const [y, m, day] = d.split("-");
    const months = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
    return `${parseInt(day)}. ${months[parseInt(m)-1]} ${y}`;
  }

  function fmtBooked(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString("da-DK", { timeZone: "Europe/Copenhagen", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  const STATUS_COLOR = { confirmed: "#37d278", pending: "#d4af37", cancelled: "#e74c3c", completed: "#37d278" };

  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0f0c", fontFamily: "system-ui, sans-serif" }}>
      <form onSubmit={handleLogin} style={{ background: "#111a14", border: "1px solid rgba(55,210,120,.2)", borderRadius: 16, padding: "40px 48px", width: 340 }}>
        <h2 style={{ color: "#37d278", margin: "0 0 24px", fontSize: 22 }}>Elite Vask Admin</h2>
        <label style={{ color: "#aaa", fontSize: 13, display: "block", marginBottom: 6 }}>Adgangskode</label>
        <input
          type="password"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,.15)", background: "#0a0f0c", color: "#fff", fontSize: 15, boxSizing: "border-box", marginBottom: 16, outline: "none" }}
          autoFocus
        />
        {error && <p style={{ color: "#e74c3c", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: "11px", background: "#37d278", color: "#0a0f0c", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          Log ind
        </button>
      </form>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0c", fontFamily: "system-ui, sans-serif", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h1 style={{ color: "#37d278", margin: 0, fontSize: 26 }}>Bookinger ({bookings.length})</h1>
          <button onClick={() => load(secret)} style={{ background: "rgba(55,210,120,.15)", color: "#37d278", border: "1px solid rgba(55,210,120,.3)", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 14 }}>
            🔄 Opdater
          </button>
        </div>

        {loading && <p style={{ color: "#aaa" }}>Indlæser...</p>}

        {!loading && bookings.length === 0 && (
          <p style={{ color: "#666", textAlign: "center", marginTop: 80, fontSize: 18 }}>Ingen bookinger fundet.</p>
        )}

        {bookings.map(b => (
          <div key={b.token} style={{ background: "#111a14", border: "1px solid rgba(55,210,120,.15)", borderRadius: 14, padding: "20px 24px", marginBottom: 16, display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px 24px" }}>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Navn</span>
                <div style={{ color: "#fff", fontWeight: 600, marginTop: 2 }}>{b.name || "-"}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Dato & tid</span>
                <div style={{ color: "#fff", fontWeight: 600, marginTop: 2 }}>{fmtDate(b.date)} · kl. {b.time}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Bil</span>
                <div style={{ color: "#fff", marginTop: 2 }}>{b.car || "-"}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Pakke</span>
                <div style={{ color: "#fff", marginTop: 2 }}>{b.pkg || "-"}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Pris</span>
                <div style={{ color: "#37d278", fontWeight: 700, marginTop: 2 }}>{b.price || "-"}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Adresse</span>
                <div style={{ color: "#fff", marginTop: 2 }}>{b.addr ? `${b.addr}, ${b.zip} ${b.city}` : "-"}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>E-mail</span>
                <div style={{ color: "#fff", marginTop: 2 }}>{b.email || "-"}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Telefon</span>
                <div style={{ color: "#fff", marginTop: 2 }}>{b.phone || "-"}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Booket</span>
                <div style={{ color: "#aaa", fontSize: 13, marginTop: 2 }}>{fmtBooked(b.bookedAt)}</div>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Status</span>
                <div style={{ color: STATUS_COLOR[b.status] || "#aaa", fontWeight: 600, marginTop: 2 }}>{b.status || "-"}</div>
              </div>
              {b.msg && (
                <div style={{ gridColumn: "1/-1" }}>
                  <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Besked</span>
                  <div style={{ color: "#ccc", marginTop: 2, fontStyle: "italic" }}>{b.msg}</div>
                </div>
              )}
            </div>
            <button
              onClick={() => handleDelete(b.token)}
              disabled={deleting === b.token}
              style={{ background: "rgba(231,76,60,.15)", color: "#e74c3c", border: "1px solid rgba(231,76,60,.3)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
            >
              {deleting === b.token ? "..." : "🗑 Slet"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
