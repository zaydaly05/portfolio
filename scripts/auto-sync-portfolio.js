/**
 * Checks GitHub for repositories that are not in the portfolio yet and asks the owner to approve them.
 *
 * The real work happens on the server (it also runs there once a day via Vercel Cron): a new
 * repository becomes a *pending change*; nothing is published until the owner approves it on
 * WhatsApp or in the admin app. Approving adds it to the portfolio and the CV, rebuilds the CV
 * and sends the new PDF.
 *
 * Usage:  PORTFOLIO_URL=https://your-site ADMIN_API_KEY=... node scripts/auto-sync-portfolio.js
 */
async function main() {
  const siteUrl = (process.env.PORTFOLIO_URL || '').replace(/\/+$/, '');
  const adminKey = process.env.ADMIN_API_KEY || '';
  if (!siteUrl || !adminKey) {
    console.error('Set PORTFOLIO_URL and ADMIN_API_KEY first.');
    process.exit(1);
  }

  const response = await fetch(`${siteUrl}/api/admin/changes/sync`, {
    method: 'POST',
    headers: { 'x-admin-key': adminKey }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`❌ Sync failed (${response.status}): ${result.error || 'unknown error'}`);
    process.exit(1);
  }

  if (!result.created) {
    console.log(`🎉 Nothing new: checked ${result.checked} GitHub repositories.`);
    return;
  }
  console.log(`🔔 Change ${result.created.code} is waiting for approval: ${result.created.summary}`);
  console.log(result.notified ? '📱 The owner was notified on WhatsApp.' : `ℹ️ Not sent on WhatsApp (${result.notifyError || 'disabled'}) — approve it in the admin app.`);
}

main().catch((err) => {
  console.error('❌ Sync error:', err.message);
  process.exit(1);
});
