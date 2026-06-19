"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CancelContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading | found | not_found | cancelled | error
  const [booking, setBooking] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!token) { setStatus('not_found'); return; }
    fetch(`/api/cancel?token=${encodeURIComponent(token)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setStatus('not_found'); return; }
        setBooking(data);
        setStatus('found');
      })
      .catch(() => setStatus('not_found'));
  }, [token]);

  async function handleCancel() {
    if (!token || confirming) return;
    setConfirming(true);
    try {
      const r = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (r.ok) {
        setStatus('cancelled');
      } else {
        const data = await r.json().catch(() => ({}));
        if (r.status === 404) {
          setStatus('not_found');
        } else {
          setStatus('error');
        }
      }
    } catch {
      setStatus('error');
    } finally {
      setConfirming(false);
    }
  }

  const isDA = !booking || booking.lang !== 'en';

  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <a href="/" className="legal-back">← {isDA ? 'Tilbage til forsiden' : 'Back to home'}</a>

        {status === 'loading' && (
          <div className="cancel-card">
            <p className="cancel-loading">{isDA ? 'Henter booking…' : 'Loading booking…'}</p>
          </div>
        )}

        {status === 'not_found' && (
          <div className="cancel-card">
            <div className="cancel-icon cancel-icon-warn">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1>{isDA ? 'Link ugyldigt' : 'Link invalid'}</h1>
            <p>{isDA
              ? 'Dette annulleringslink er ugyldigt eller din booking er allerede annulleret.'
              : 'This cancellation link is invalid or your booking has already been cancelled.'
            }</p>
            <a href="/" className="btn btn-green" style={{marginTop: '20px', display: 'inline-flex'}}>
              {isDA ? 'Gå til forsiden' : 'Go to homepage'}
            </a>
          </div>
        )}

        {status === 'found' && booking && (
          <div className="cancel-card">
            <h1>{isDA ? 'Annuller booking' : 'Cancel booking'}</h1>
            <p style={{color: 'var(--muted)', marginBottom: '24px'}}>
              {isDA
                ? 'Er du sikker på, at du ønsker at annullere følgende booking?'
                : 'Are you sure you want to cancel the following booking?'
              }
            </p>
            <div className="cancel-details">
              {booking.name && (
                <div className="cancel-row">
                  <span className="cancel-label">{isDA ? 'Navn' : 'Name'}</span>
                  <span className="cancel-value">{booking.name}</span>
                </div>
              )}
              <div className="cancel-row">
                <span className="cancel-label">{isDA ? 'Bil' : 'Car'}</span>
                <span className="cancel-value">{booking.car || '-'}</span>
              </div>
              <div className="cancel-row">
                <span className="cancel-label">{isDA ? 'Pakke' : 'Package'}</span>
                <span className="cancel-value">{booking.pkg || '-'}</span>
              </div>
              <div className="cancel-row">
                <span className="cancel-label">{isDA ? 'Dato' : 'Date'}</span>
                <span className="cancel-value">{booking.date || '-'}</span>
              </div>
              <div className="cancel-row">
                <span className="cancel-label">{isDA ? 'Tidspunkt' : 'Time'}</span>
                <span className="cancel-value">{booking.time || '-'}</span>
              </div>
              {booking.price && (
                <div className="cancel-row">
                  <span className="cancel-label">{isDA ? 'Pris' : 'Price'}</span>
                  <span className="cancel-value">{booking.price}</span>
                </div>
              )}
            </div>
            <p className="cancel-policy">
              {isDA
                ? 'Vi beder om, at aflysning sker senest 24 timer før den aftalte tid.'
                : 'We ask that cancellations are made at least 24 hours before the appointment.'
              }
            </p>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={confirming}
            >
              {confirming
                ? (isDA ? 'Annullerer…' : 'Cancelling…')
                : (isDA ? 'Bekræft annullering' : 'Confirm cancellation')
              }
            </button>
            <a href="/" style={{display: 'block', textAlign: 'center', marginTop: '14px', color: 'var(--muted)', fontSize: '14px'}}>
              {isDA ? 'Fortryd – behold booking' : 'Never mind – keep booking'}
            </a>
          </div>
        )}

        {status === 'cancelled' && (
          <div className="cancel-card cancel-success">
            <div className="cancel-icon cancel-icon-ok">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1>{isDA ? 'Booking annulleret' : 'Booking cancelled'}</h1>
            <p>
              {isDA
                ? 'Din booking er nu annulleret. Du modtager en bekræftelse på e-mail.'
                : 'Your booking has been cancelled. You will receive a confirmation by email.'
              }
            </p>
            <a href="/" className="btn btn-green" style={{marginTop: '20px', display: 'inline-flex'}}>
              {isDA ? 'Book en ny tid' : 'Book a new appointment'}
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="cancel-card">
            <h1>{isDA ? 'Noget gik galt' : 'Something went wrong'}</h1>
            <p>{isDA
              ? 'Der opstod en fejl. Prøv igen eller kontakt os på +45 24 44 03 21.'
              : 'An error occurred. Please try again or contact us at +45 24 44 03 21.'
            }</p>
            <button className="cancel-btn" onClick={handleCancel} style={{marginTop: '20px'}}>
              {isDA ? 'Prøv igen' : 'Try again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="legal-page">
        <div className="legal-wrap">
          <div className="cancel-card">
            <p style={{color: 'var(--muted)'}}>Indlæser…</p>
          </div>
        </div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
