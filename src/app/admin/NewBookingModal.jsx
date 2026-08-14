"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { buildSlotTimes, carSlotCount, isClosedDay } from "@/lib/hours";
import { T, FF, field, label, CAR_LABELS, PKG_LABELS, CAR_IDS, PKG_IDS, fmtDateLong, todayISO, cphMinutesNow, toMinutes } from "./ui";

/* Manual booking — for the customer who phones instead of using the website.
 *
 * The dialog only ever OFFERS times the server would accept: it loads the
 * slots already taken that day, greys out anything that clashes with the job's
 * full duration, and hides times that can't finish before closing. The server
 * validates all of it again and reserves atomically, so a race with a website
 * customer still ends in a clean "that time was just taken" instead of a
 * double booking. */
export default function NewBookingModal({ secret, hours, extrasItems, prices, narrow, onClose, onCreated, addToast, authFailed }) {
  const [date, setDate]   = useState(todayISO());
  const [picked, setTime] = useState("");
  const [carId, setCarId] = useState("mellem");
  const [pkgId, setPkgId] = useState("hele");
  const [extraIds, setExtraIds] = useState([]);
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addr, setAddr]   = useState("");
  const [zip, setZip]     = useState("");
  const [city, setCity]   = useState("");
  const [msg, setMsg]     = useState("");
  const [notify, setNotify] = useState(true);

  const [booked, setBooked] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const slotTimes  = useMemo(() => buildSlotTimes(hours), [hours]);
  const need       = carSlotCount(hours, carId);
  const dayClosed  = date ? isClosedDay(hours, date) : false;
  const today      = todayISO();
  // Re-read on every render so the grid greys out slots as the evening passes
  // while the dialog is open.
  const nowMinCph  = cphMinutesNow();

  const loadSlots = useCallback(async (d) => {
    if (!d) return;
    setSlotsLoading(true); setSlotsError(false);
    try {
      const r = await fetch(`/api/book?date=${encodeURIComponent(d)}`, { cache: "no-store" });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setBooked(Array.isArray(data.booked) ? data.booked : []);
    } catch {
      // Unknown availability must not look like "everything is free".
      setBooked([]); setSlotsError(true);
    } finally { setSlotsLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadSlots(date); }, [date, loadSlots]);

  // A start time is only usable when every slot the job needs is free and the
  // whole duration finishes inside opening hours.
  const usable = useMemo(() => {
    const set = new Set(booked);
    const out = {};
    slotTimes.forEach((t, i) => {
      if (i + need > slotTimes.length) { out[t] = "range"; return; }
      for (let k = 0; k < need; k++) if (set.has(slotTimes[i + k])) { out[t] = "taken"; return; }
      out[t] = "free";
    });
    return out;
  }, [booked, slotTimes, need]);

  // Switching to a bigger car can make an already-picked start time invalid
  // (it no longer fits, or it now overlaps a booked hour). Deriving the
  // effective selection beats resetting state from an effect: the chip
  // deselects in the same render the car type changes.
  const time = usable[picked] === "free" ? picked : "";

  const endLabel = useMemo(() => {
    if (!time) return "";
    const i = slotTimes.indexOf(time);
    if (i < 0) return "";
    const start = parseInt(time.slice(0, 2), 10) * 60 + parseInt(time.slice(3, 5), 10);
    const end = start + need * hours.slotMinutes;
    return `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
  }, [time, slotTimes, need, hours.slotMinutes]);

  const priceNum = useMemo(() => {
    const base = Number(prices?.[carId]?.[pkgId]) || 0;
    const add = extraIds.reduce((s, id) => s + (Number(extrasItems.find(e => e.id === id)?.price) || 0), 0);
    return base + add;
  }, [prices, carId, pkgId, extraIds, extrasItems]);

  const canSave = name.trim() && (phone.trim() || email.trim()) && date && time && !saving && !dayClosed;

  async function submit(e) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true); setErr("");
    try {
      const r = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, addr, zip, city, msg, date, time, carId, pkgId, extraIds, notify }),
      });
      if (authFailed(r.status)) return;
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        setErr(data.message || "Bookingen kunne ikke oprettes.");
        // The hour may have been taken by a website customer while the manager
        // typed — refresh so the grid tells the truth immediately.
        if (r.status === 409) loadSlots(date);
        return;
      }
      addToast("ok", data.emailed ? "Booking oprettet · bekræftelse sendt" : "Booking oprettet");
      if (notify && !data.emailed) addToast("err", "Bookingen er gemt, men bekræftelsen kunne ikke sendes");
      onCreated(data.booking);
    } catch {
      setErr("Netværksfejl — bookingen blev ikke oprettet.");
    } finally { setSaving(false); }
  }

  const maxDate = new Date(Date.parse(today + "T00:00:00Z") + 28 * 86400000).toISOString().slice(0, 10);

  const chip = (active, disabled, onClick, children, key) => (
    <button key={key} type="button" onClick={onClick} disabled={disabled}
      style={{
        padding: "9px 12px", borderRadius: 9, fontFamily: FF, fontSize: 13, fontWeight: 600,
        border: `1px solid ${active ? T.accentBorder : T.border}`,
        background: active ? T.accentDim : disabled ? "transparent" : T.bg0,
        color: active ? T.accent : disabled ? T.t4 : T.t2,
        cursor: disabled ? "not-allowed" : "pointer",
        textDecoration: disabled ? "line-through" : "none",
        transition: "all .12s", whiteSpace: "nowrap",
      }}>{children}</button>
  );

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", backdropFilter: "blur(3px)", zIndex: 320, display: "flex", alignItems: narrow ? "flex-end" : "center", justifyContent: "center", padding: narrow ? 0 : 24 }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit}
        style={{
          background: T.bg1, border: `1px solid ${T.border}`, borderRadius: narrow ? "18px 18px 0 0" : 18,
          width: "100%", maxWidth: 620, maxHeight: narrow ? "94dvh" : "90dvh", overflowY: "auto",
          boxShadow: T.shadowL, boxSizing: "border-box",
        }}>

        {/* Header */}
        <div style={{ position: "sticky", top: 0, background: T.bg1, borderBottom: `1px solid ${T.border}`, padding: "18px 22px", display: "flex", alignItems: "center", gap: 12, zIndex: 2, borderRadius: narrow ? "18px 18px 0 0" : "18px 18px 0 0" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.t1 }}>Ny booking</p>
            <p style={{ margin: "1px 0 0", fontSize: 12, color: T.t3 }}>Tiden spærres med det samme på hjemmesiden</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Luk"
            style={{ width: 30, height: 30, borderRadius: 8, background: "transparent", border: `1px solid ${T.border}`, color: T.t3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* 1 — car & package */}
          <section>
            <p style={label}>1 · Biltype</p>
            <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr 1fr" : "repeat(4,1fr)", gap: 7 }}>
              {CAR_IDS.map(id => chip(carId === id, false, () => setCarId(id), CAR_LABELS[id], id))}
            </div>
            <p style={{ ...label, marginTop: 16 }}>2 · Pakke</p>
            <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr 1fr" : "repeat(4,1fr)", gap: 7 }}>
              {PKG_IDS.map(id => chip(pkgId === id, false, () => setPkgId(id), PKG_LABELS[id], id))}
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: T.t3 }}>
              Varighed: <strong style={{ color: T.t2 }}>{+(need * hours.slotMinutes / 60).toFixed(1)} timer</strong>
              {priceNum > 0 && <> · Pris: <strong style={{ color: T.accent }}>{priceNum.toLocaleString("da-DK")} kr</strong></>}
            </p>
          </section>

          {/* extras */}
          {extrasItems.length > 0 && (
            <section>
              <p style={label}>Ekstra ydelser</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {extrasItems.map(ex => {
                  const on = extraIds.includes(ex.id);
                  const nm = ex.name?.da || ex.name || ex.id;
                  return chip(on, false, () => setExtraIds(v => on ? v.filter(x => x !== ex.id) : [...v, ex.id]),
                    <>{nm}{ex.price ? <span style={{ opacity: .6 }}> +{ex.price}</span> : null}</>, ex.id);
                })}
              </div>
            </section>
          )}

          {/* 3 — date & time */}
          <section>
            <p style={label}>3 · Dato & tidspunkt</p>
            <input type="date" value={date} min={today} max={maxDate}
              onChange={e => { setDate(e.target.value); setTime(""); }}
              style={field({ colorScheme: "dark", marginBottom: 10 })} />

            {dayClosed ? (
              <div style={{ background: T.amberDim, border: `1px solid ${T.amberBorder}`, borderRadius: 9, padding: "11px 14px", fontSize: 13, color: T.amber }}>
                Der er lukket {fmtDateLong(date)}. Åbn dagen under Åbningstider, eller vælg en anden dato.
              </div>
            ) : slotsLoading ? (
              <p style={{ margin: 0, fontSize: 13, color: T.t3 }}>Henter ledige tider…</p>
            ) : (
              <>
                {slotsError && (
                  <div style={{ background: T.dangerDim, border: `1px solid ${T.dangerBorder}`, borderRadius: 9, padding: "9px 12px", fontSize: 12, color: T.danger, marginBottom: 9 }}>
                    Kunne ikke hente optagede tider. Tjek kalenderen inden du gemmer.
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${narrow ? 72 : 80}px, 1fr))`, gap: 6 }}>
                  {slotTimes.map(t => {
                    const state = usable[t];
                    // Compared against Copenhagen time, not the device clock:
                    // a manager travelling (or a laptop left on another
                    // timezone) would otherwise be offered hours that have
                    // already passed, and only find out on submit.
                    const past = date === today && toMinutes(t) <= nowMinCph;
                    const dis = state !== "free" || past;
                    return chip(time === t, dis, () => setTime(t), t, t);
                  })}
                </div>
                {time && (
                  <p style={{ margin: "10px 0 0", fontSize: 13, color: T.accent, fontWeight: 600 }}>
                    {fmtDateLong(date)} · {time}–{endLabel}
                  </p>
                )}
              </>
            )}
          </section>

          {/* 4 — customer */}
          <section>
            <p style={label}>4 · Kunde</p>
            <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: 9 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Navn *" style={field()} />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefon" inputMode="tel" style={field()} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" inputMode="email" style={field()} />
              <input value={addr} onChange={e => setAddr(e.target.value)} placeholder="Adresse" style={field()} />
              <input value={zip} onChange={e => setZip(e.target.value)} placeholder="Postnr." inputMode="numeric" style={field()} />
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="By" style={field()} />
            </div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={2} placeholder="Note (valgfri)"
              style={field({ marginTop: 9, resize: "vertical" })} />
            <p style={{ margin: "7px 0 0", fontSize: 11.5, color: T.t3 }}>Navn og enten telefon eller e-mail er påkrævet.</p>
          </section>

          {/* notify */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", background: T.bg0, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} style={{ accentColor: T.accent, width: 16, height: 16, marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: T.t2, lineHeight: 1.5 }}>
              Send bekræftelse på e-mail til kunden
              <span style={{ display: "block", fontSize: 11.5, color: T.t3, marginTop: 2 }}>
                Kræver en e-mailadresse. Kunden får også en påmindelse dagen før.
              </span>
            </span>
          </label>

          {err && (
            <div style={{ background: T.dangerDim, border: `1px solid ${T.dangerBorder}`, borderRadius: 10, padding: "11px 14px", fontSize: 13, color: T.danger }}>{err}</div>
          )}

          <div style={{ display: "flex", gap: 9 }}>
            <button type="submit" disabled={!canSave}
              style={{ flex: 2, padding: "13px 0", background: canSave ? T.accent : "rgba(55,210,120,.2)", color: T.bg0, border: "none", borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: canSave ? "pointer" : "not-allowed", fontFamily: FF }}>
              {saving ? "Opretter…" : "Opret booking"}
            </button>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "13px 0", background: "rgba(255,255,255,.06)", color: T.t3, border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: FF }}>
              Annuller
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
