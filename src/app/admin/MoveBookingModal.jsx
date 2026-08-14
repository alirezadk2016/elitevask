"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { buildSlotTimes, carSlotCount, isClosedDay } from "@/lib/hours";
import { T, FF, field, label, surface, fmtDateLong, todayISO, cphMinutesNow, toMinutes } from "./ui";

/* Move an existing booking to another time.
 *
 * Same availability rules as the new-booking dialog, with one addition: the
 * hours this booking already owns are shown as free, because moving onto
 * yourself is allowed. The server enforces all of it again and takes the new
 * hours before letting the old ones go, so a clash leaves the appointment
 * exactly where it was. */
export default function MoveBookingModal({ booking, secret, hours, narrow, onClose, onMoved, addToast, authFailed }) {
  const [date, setDate]   = useState(booking.date || todayISO());
  const [picked, setTime] = useState("");
  const [notify, setNotify] = useState(Boolean(booking.email));
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const slotTimes = useMemo(() => buildSlotTimes(hours), [hours]);
  const need      = carSlotCount(hours, booking.carId);
  const today     = todayISO();
  const nowMin    = cphMinutesNow();
  const dayClosed = date ? isClosedDay(hours, date) : false;
  const canMove   = ["lille", "mellem", "stor", "varebil"].includes(booking.carId);

  const load = useCallback(async (d) => {
    if (!d) return;
    setLoading(true); setLoadErr(false);
    try {
      const r = await fetch(`/api/book?date=${encodeURIComponent(d)}`, { cache: "no-store" });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setBooked(Array.isArray(data.booked) ? data.booked : []);
    } catch { setBooked([]); setLoadErr(true); }
    finally { setLoading(false); }
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(date); }, [date, load]);

  // Hours this booking itself holds don't block it.
  const mine = useMemo(
    () => new Set(date === booking.date ? (booking.slots || []) : []),
    [date, booking.date, booking.slots]
  );

  const usable = useMemo(() => {
    const taken = new Set(booked.filter(t => !mine.has(t)));
    const out = {};
    slotTimes.forEach((t, i) => {
      if (i + need > slotTimes.length) { out[t] = "range"; return; }
      for (let k = 0; k < need; k++) if (taken.has(slotTimes[i + k])) { out[t] = "taken"; return; }
      out[t] = "free";
    });
    return out;
  }, [booked, mine, slotTimes, need]);

  const time = usable[picked] === "free" ? picked : "";
  const unchanged = date === booking.date && time === booking.time;

  const endLabel = useMemo(() => {
    if (!time) return "";
    const end = toMinutes(time) + need * hours.slotMinutes;
    return `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
  }, [time, need, hours.slotMinutes]);

  async function submit(e) {
    e.preventDefault();
    if (!time || unchanged || saving) return;
    setSaving(true); setErr("");
    try {
      const r = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ token: booking.token, date, time, notify }),
      });
      if (authFailed(r.status)) return;
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        setErr(data.message || "Bookingen kunne ikke flyttes.");
        if (r.status === 409) load(date);
        return;
      }
      addToast("ok", data.emailed ? "Tid flyttet · kunden er informeret" : "Tid flyttet");
      if (notify && !data.emailed) addToast("err", "Tiden er flyttet, men e-mailen kunne ikke sendes");
      onMoved(data.booking);
    } catch { setErr("Netværksfejl — bookingen blev ikke flyttet."); }
    finally { setSaving(false); }
  }

  const maxDate = new Date(Date.parse(today + "T00:00:00Z") + 28 * 86400000).toISOString().slice(0, 10);

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.74)", backdropFilter: "blur(3px)", zIndex: 330, display: "flex", alignItems: narrow ? "flex-end" : "center", justifyContent: "center", padding: narrow ? 0 : 24 }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit}
        style={{ ...surface(), borderRadius: narrow ? "18px 18px 0 0" : 18, width: "100%", maxWidth: 560, maxHeight: narrow ? "94dvh" : "90dvh", overflowY: "auto", boxShadow: T.shadowL, boxSizing: "border-box" }}>

        <div style={{ position: "sticky", top: 0, background: T.bg1, borderBottom: `1px solid ${T.border}`, padding: "17px 21px", display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: T.blueDim, border: `1px solid ${T.blueBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h13" /><path d="m12 5 7 7-7 7" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.t1 }}>Flyt tid</p>
            <p style={{ margin: "1px 0 0", fontSize: 12, color: T.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{booking.name} · {booking.car}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Luk"
            style={{ width: 30, height: 30, borderRadius: 8, background: "transparent", border: `1px solid ${T.border}`, color: T.t3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ padding: "18px 21px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          {!canMove ? (
            <div style={{ background: T.amberDim, border: `1px solid ${T.amberBorder}`, borderRadius: 10, padding: "13px 15px", fontSize: 13, color: T.amber, lineHeight: 1.6 }}>
              Denne booking mangler en biltype, så varigheden kan ikke beregnes sikkert. Opret en ny booking og slet denne i stedet.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.022)", border: `1px solid ${T.border}`, borderRadius: 11, padding: "11px 14px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.t4, fontWeight: 700 }}>Nuværende</p>
                  <p style={{ margin: "2px 0 0", fontSize: 13.5, fontWeight: 700, color: T.t2 }}>{fmtDateLong(booking.date)} · {booking.time}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.t4} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, margin: "0 3px" }}><path d="M3 12h16" /><path d="m13 6 6 6-6 6" /></svg>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.t4, fontWeight: 700 }}>Ny</p>
                  <p style={{ margin: "2px 0 0", fontSize: 13.5, fontWeight: 800, color: time ? T.accent : T.t4 }}>
                    {time ? `${fmtDateLong(date)} · ${time}–${endLabel}` : "Vælg et tidspunkt"}
                  </p>
                </div>
              </div>

              <div>
                <p style={label}>Dato</p>
                <input type="date" value={date} min={today} max={maxDate}
                  onChange={e => { setDate(e.target.value); setTime(""); }}
                  style={field({ colorScheme: "dark" })} />
              </div>

              {dayClosed ? (
                <div style={{ background: T.amberDim, border: `1px solid ${T.amberBorder}`, borderRadius: 10, padding: "11px 14px", fontSize: 13, color: T.amber }}>
                  Der er lukket {fmtDateLong(date)}. Vælg en anden dato.
                </div>
              ) : loading ? (
                <p style={{ margin: 0, fontSize: 13, color: T.t3 }}>Henter ledige tider…</p>
              ) : (
                <div>
                  {loadErr && (
                    <div style={{ background: T.dangerDim, border: `1px solid ${T.dangerBorder}`, borderRadius: 9, padding: "9px 12px", fontSize: 12, color: T.danger, marginBottom: 9 }}>
                      Kunne ikke hente optagede tider — tjek kalenderen inden du flytter.
                    </div>
                  )}
                  <p style={label}>Nyt tidspunkt · {+(need * hours.slotMinutes / 60).toFixed(1)} timer</p>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${narrow ? 72 : 80}px, 1fr))`, gap: 6 }}>
                    {slotTimes.map(t => {
                      const isNow = date === booking.date && t === booking.time;
                      const past = date === today && toMinutes(t) <= nowMin;
                      const dis = usable[t] !== "free" || past;
                      const on = picked === t;
                      return (
                        <button key={t} type="button" disabled={dis} onClick={() => setTime(t)}
                          style={{
                            padding: "9px 6px", borderRadius: 9, fontFamily: FF, fontSize: 13, fontWeight: 600,
                            border: `1px solid ${on ? T.accentBorder : isNow ? T.blueBorder : T.border}`,
                            background: on ? T.accentDim : isNow ? T.blueDim : dis ? "transparent" : T.bg0,
                            color: on ? T.accent : isNow ? T.blue : dis ? T.t4 : T.t2,
                            cursor: dis ? "not-allowed" : "pointer",
                            textDecoration: dis ? "line-through" : "none",
                            transition: "all .12s", whiteSpace: "nowrap",
                          }}>{t}</button>
                      );
                    })}
                  </div>
                </div>
              )}

              {booking.email && (
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: T.bg0, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 14px" }}>
                  <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} style={{ accentColor: T.accent, width: 16, height: 16, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: T.t2 }}>Send en e-mail til kunden om den nye tid</span>
                </label>
              )}

              {err && <div style={{ background: T.dangerDim, border: `1px solid ${T.dangerBorder}`, borderRadius: 10, padding: "11px 14px", fontSize: 13, color: T.danger }}>{err}</div>}

              <div style={{ display: "flex", gap: 9 }}>
                <button type="submit" disabled={!time || unchanged || saving}
                  style={{ flex: 2, padding: "12px 0", background: (time && !unchanged) ? T.accent : "rgba(55,210,120,.2)", color: T.bg0, border: "none", borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: (time && !unchanged && !saving) ? "pointer" : "not-allowed", fontFamily: FF }}>
                  {saving ? "Flytter…" : "Flyt booking"}
                </button>
                <button type="button" onClick={onClose}
                  style={{ flex: 1, padding: "12px 0", background: "rgba(255,255,255,.06)", color: T.t3, border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: FF }}>Tilbage</button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
