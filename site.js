document.getElementById('y').textContent = new Date().getFullYear();

// Portal: purely cosmetic. Credentials are never sent anywhere or stored.
const overlay = document.getElementById('portal');
const pForm = document.getElementById('portal-form');
const pMsg = document.getElementById('p-msg');
const pBtn = document.getElementById('p-submit');
function openPortal(e) { if (e) e.preventDefault(); overlay.classList.add('open'); pMsg.textContent = ''; setTimeout(() => document.getElementById('p-user').focus(), 50); }
function closePortal() { overlay.classList.remove('open'); pForm.reset(); pMsg.textContent = ''; }
document.querySelectorAll('[data-portal]').forEach(el => el.addEventListener('click', openPortal));
document.querySelector('[data-close]').addEventListener('click', closePortal);
overlay.addEventListener('click', e => { if (e.target === overlay) closePortal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closePortal(); });
document.getElementById('p-forgot').addEventListener('click', () => {
  pMsg.textContent = 'Please contact your account manager to reset your access.';
});
pForm.addEventListener('submit', e => {
  e.preventDefault();
  pBtn.disabled = true; pBtn.textContent = 'Verifying...'; pMsg.textContent = '';
  setTimeout(() => {
    document.getElementById('p-pass').value = '';
    pBtn.disabled = false; pBtn.textContent = 'Sign In';
    pMsg.textContent = 'Username not found. Please check your username and try again.';
  }, 1200);
});

// Contact form via Web3Forms
const cForm = document.getElementById('contact-form');
if (cForm) {
  const cStatus = document.getElementById('f-status');
  const cBtn = document.getElementById('f-submit');
  cForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!cForm.checkValidity()) { cStatus.className = 'status err'; cStatus.textContent = 'Please complete your name, email and message.'; return; }
    const data = new FormData(cForm);
    if (String(data.get('access_key')).startsWith('YOUR_')) { cStatus.className = 'status err'; cStatus.textContent = 'This form is not yet active. Please try again soon.'; return; }
    cBtn.disabled = true; cBtn.textContent = 'Sending...'; cStatus.textContent = '';
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Accept': 'application/json' }, body: data });
      const out = await res.json();
      if (out.success) { cForm.reset(); cStatus.className = 'status ok'; cStatus.textContent = 'Thank you. Your inquiry has been received.'; }
      else { throw new Error(); }
    } catch {
      cStatus.className = 'status err'; cStatus.textContent = 'Something went wrong. Please try again later.';
    } finally { cBtn.disabled = false; cBtn.textContent = 'Send Inquiry'; }
  });
}
