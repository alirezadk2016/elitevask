import nodemailer from 'nodemailer';

// ─── Email addresses ────────────────────────────────────────────────────────
export const BOOKING_EMAIL = 'booking@elite-vask.dk';  // SMTP sender, receives booking alerts
export const INFO_EMAIL    = 'info@elite-vask.dk';     // Public website, footer, legal pages
export const CONTACT_EMAIL = 'kontakt@elite-vask.dk';  // Reply-To on all customer emails

// ─── SMTP via one.com ───────────────────────────────────────────────────────
// Env vars to set in Vercel:
//   SMTP_USER = booking@elite-vask.dk
//   SMTP_PASS = <password from one.com control panel>
//   SMTP_HOST = send.one.com  (default, can be overridden)
//   SMTP_PORT = 465           (default, SSL/TLS)
export function buildTransport() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS;
  if (!user || !pass) return null;
  const host = process.env.SMTP_HOST || 'send.one.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

// ─── Branded email wrapper ──────────────────────────────────────────────────
// Wraps any HTML body in the standard Elite Vask email shell.
export function emailShell({ title, preheader = '', body, lang = 'da' }) {
  const L = lang !== 'en';
  return `<!DOCTYPE html>
<html lang="${L ? 'da' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f2f4f3;font-family:Arial,Helvetica,sans-serif">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f2f4f3">${preheader}&nbsp;‌&nbsp;‌&nbsp;‌</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f3;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d5e3d9">

        <!-- Header -->
        <tr><td style="background:#0d4a25;padding:28px 32px">
          <p style="margin:0 0 6px;color:#6fcf97;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Elite Vask</p>
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;line-height:1.3">${title}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:28px 32px">
          ${body}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f7f8f7;padding:18px 32px;border-top:1px solid #e5ebe7">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:11px;color:#888;line-height:1.6">
                <strong style="color:#555">Elite Vask</strong> · CVR 46392264<br>
                <a href="mailto:${INFO_EMAIL}" style="color:#0d4a25;text-decoration:none">${INFO_EMAIL}</a> · <a href="tel:+4524440321" style="color:#0d4a25;text-decoration:none">+45 24 44 03 21</a>
              </td>
              <td align="right" style="font-size:11px;color:#bbb">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://elite-vask.dk'}" style="color:#0d4a25;text-decoration:none">elite-vask.dk</a>
              </td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Reusable table row ─────────────────────────────────────────────────────
export function tr(label, value, shade = false) {
  const bg = shade ? 'background:#f4f8f5;' : '';
  return `<tr>
    <td style="${bg}padding:10px 14px;color:#666;font-size:14px;width:38%;border-bottom:1px solid #eaefeb">${label}</td>
    <td style="${bg}padding:10px 14px;font-size:14px;font-weight:600;color:#1a1a1a;border-bottom:1px solid #eaefeb">${value}</td>
  </tr>`;
}
