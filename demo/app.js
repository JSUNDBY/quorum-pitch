/* =====================================================================
   Quorum — client-side demo
   Single-file vanilla JS SPA. State persists to localStorage.
   Three roles (resident, board, manager) share one data cabinet.
   ===================================================================== */

/* ----- seed data ----- */
const SEED = {
  version: 4,
  currentRole: "resident",
  currentUserId: "sarah",
  currentHoaId: "sunset-ridge",

  hoas: [
    { id: "sunset-ridge", name: "Sunset Ridge HOA", city: "Minneapolis, MN", units: 412, dues: 285, reserve: 184200, collected: 87, status: "red" },
    { id: "oak-terrace", name: "Oak Terrace Condos", city: "St. Paul, MN", units: 128, dues: 320, reserve: 92400, collected: 94, status: "amber" },
    { id: "pine-grove", name: "Pine Grove Estates", city: "Edina, MN", units: 86, dues: 245, reserve: 147000, collected: 99, status: "green" },
    { id: "cedar-creek", name: "Cedar Creek HOA", city: "Bloomington, MN", units: 204, dues: 310, reserve: 218500, collected: 96, status: "green" },
    { id: "lakeside-village", name: "Lakeside Village", city: "Minnetonka, MN", units: 164, dues: 275, reserve: 104800, collected: 91, status: "amber" },
  ],

  units: [
    { id: "u42", hoaId: "sunset-ridge", number: "42", address: "142 Sunset Ridge Dr" },
    { id: "u8",  hoaId: "sunset-ridge", number: "8",  address: "108 Sunset Ridge Dr" },
    { id: "u19", hoaId: "sunset-ridge", number: "19", address: "119 Sunset Ridge Dr" },
    { id: "u7",  hoaId: "sunset-ridge", number: "7",  address: "107 Sunset Ridge Dr" },
    { id: "u23", hoaId: "sunset-ridge", number: "23", address: "123 Sunset Ridge Dr" },
  ],

  people: [
    { id: "sarah",   hoaId: "sunset-ridge", name: "Sarah Chen",         email: "sarah.chen@email.com",    unitId: "u42", role: "resident" },
    { id: "walter",  hoaId: "sunset-ridge", name: "Walter Martinez",    email: "walter.m@email.com",      unitId: "u8",  role: "board-president" },
    { id: "angela",  hoaId: null,           name: "Angela Thompson",    email: "angela@acmepm.com",       unitId: null,  role: "property-manager" },
    { id: "p-james", hoaId: "sunset-ridge", name: "James O'Brien",      email: "jim.obrien@email.com",    unitId: "u19", role: "resident" },
    { id: "p-donna", hoaId: "sunset-ridge", name: "Donna Patel",        email: "donna.patel@email.com",   unitId: "u7",  role: "resident" },
    { id: "p-ruth",  hoaId: "sunset-ridge", name: "Ruth Schumann",      email: "ruth.s@email.com",        unitId: "u23", role: "resident" },
  ],

  charges: [
    { id: "c1", unitId: "u42", description: "April dues",     amount: 285, status: "paid", date: "2026-04-01" },
    { id: "c2", unitId: "u42", description: "March dues",     amount: 285, status: "paid", date: "2026-03-01" },
    { id: "c3", unitId: "u42", description: "February dues",  amount: 285, status: "paid", date: "2026-02-01" },
    { id: "c4", unitId: "u42", description: "January dues",   amount: 285, status: "paid", date: "2026-01-01" },
    { id: "c5", unitId: "u42", description: "Annual assessment", amount: 120, status: "paid", date: "2026-01-15" },
    { id: "c6", unitId: "u42", description: "May dues",       amount: 285, status: "open", date: "2026-05-01" },
  ],

  announcements: [
    { id: "a1", hoaId: "sunset-ridge", authorId: "walter", subject: "Pool opens this Saturday, May 3rd",
      body: "Good news, neighbors. The pool is officially open for the season starting Saturday at 10am. New pool rules are attached below. See you there.\n\nKey reminders:\n• Residents and registered guests only\n• No glass containers on the deck\n• Children under 12 must be accompanied by an adult",
      date: "2026-04-14", channels: ["email", "sms", "in-app"], recipients: 412 },
    { id: "a2", hoaId: "sunset-ridge", authorId: "walter", subject: "April board meeting minutes posted",
      body: "The minutes from the April 3rd board meeting are now available in the documents library. Highlights include the approval of the fence-height policy amendment and the new landscaping contract with Green Valley.",
      date: "2026-04-08", channels: ["email", "in-app"], recipients: 412 },
    { id: "a3", hoaId: "sunset-ridge", authorId: "walter", subject: "Street resurfacing — April 22-24",
      body: "The city will be resurfacing our main drive on April 22-24. Please move vehicles from the street by 7am on each morning. We'll send a reminder the night before.",
      date: "2026-04-02", channels: ["email", "sms"], recipients: 412 },
  ],

  meetings: [
    { id: "m1", hoaId: "sunset-ridge", title: "May Board Meeting", date: "2026-05-07", time: "7:00 PM",
      location: "Community clubhouse", rsvps: 12, status: "upcoming",
      agenda: [
        { title: "Review April financials", desc: "Walter to present collection and reserve updates." },
        { title: "Vote on revised pool hours", desc: "Proposal to extend hours to 10pm on Fridays and Saturdays." },
        { title: "Landscaping contract renewal", desc: "Discussion of Green Valley proposal for the 2026 season." },
        { title: "New architectural requests", desc: "Three requests pending board review." },
        { title: "Open comment period", desc: "Residents welcome to speak for up to 3 minutes each." },
      ] },
    { id: "m2", hoaId: "sunset-ridge", title: "April Board Meeting", date: "2026-04-03", time: "7:00 PM",
      location: "Community clubhouse", rsvps: 18, status: "complete",
      agenda: [
        { title: "Fence-height policy amendment", desc: "Motion passed 4–1." },
        { title: "Landscaping contract", desc: "Green Valley selected." },
        { title: "Pool season prep", desc: "Approved opening for May 3." },
      ] },
  ],

  workOrders: [
    { id: "wo1", hoaId: "sunset-ridge", unitId: "u42", reporterId: "sarah",
      title: "Broken sprinkler head", description: "The sprinkler at the front corner of Unit 42 is spraying the walkway instead of the lawn.",
      assignedTo: "Green Valley Landscaping", status: "in-progress", date: "2026-04-12", priority: "medium" },
    { id: "wo2", hoaId: "sunset-ridge", unitId: null, reporterId: "walter",
      title: "Clubhouse thermostat replacement", description: "Thermostat has been intermittent for two weeks.",
      assignedTo: "Ace HVAC", status: "in-progress", date: "2026-04-10", priority: "low" },
    { id: "wo3", hoaId: "sunset-ridge", unitId: null, reporterId: "p-donna",
      title: "Playground swing chain", description: "One of the swing chains is rusting and needs replacement before the season.",
      assignedTo: null, status: "new", date: "2026-04-15", priority: "high" },
  ],

  violations: [
    { id: "v1", hoaId: "sunset-ridge", unitId: "u19", type: "Trash cans left out", notice: 2, status: "pending-review", date: "2026-04-14" },
    { id: "v2", hoaId: "sunset-ridge", unitId: "u7",  type: "Fence color change request", notice: 1, status: "pending-review", date: "2026-04-11" },
    { id: "v3", hoaId: "sunset-ridge", unitId: "u23", type: "Unapproved holiday lights still up", notice: 1, status: "resolved", date: "2026-03-28" },
  ],

  documents: [
    { id: "d1", hoaId: "sunset-ridge", title: "Bylaws (2024 revision)", type: "PDF", size: "2.4 MB", date: "2024-06-01" },
    { id: "d2", hoaId: "sunset-ridge", title: "CC&Rs", type: "PDF", size: "1.8 MB", date: "2019-03-15" },
    { id: "d3", hoaId: "sunset-ridge", title: "April 2026 meeting minutes", type: "PDF", size: "340 KB", date: "2026-04-08" },
    { id: "d4", hoaId: "sunset-ridge", title: "March 2026 meeting minutes", type: "PDF", size: "310 KB", date: "2026-03-09" },
    { id: "d5", hoaId: "sunset-ridge", title: "2026 approved budget", type: "PDF", size: "220 KB", date: "2025-12-05" },
    { id: "d6", hoaId: "sunset-ridge", title: "Pool rules & guidelines", type: "PDF", size: "180 KB", date: "2026-04-14" },
    { id: "d7", hoaId: "sunset-ridge", title: "Architectural request form", type: "PDF", size: "90 KB", date: "2025-01-01" },
  ],
};

/* ----- state persistence ----- */
const STORAGE_KEY = "quorum.demo.state.v4";
let STATE;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === SEED.version) return parsed;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(SEED));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  STATE = JSON.parse(JSON.stringify(SEED));
  saveState();
  window.location.hash = "#/";
  render();
  showToast("Demo reset");
}

/* ----- helpers ----- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function esc(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function money(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d) {
  const [y, m, day] = d.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return months[m-1] + " " + day + ", " + y;
}

function shortDate(d) {
  const [y, m, day] = d.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[m-1] + " " + day;
}

function daysAgo(d) {
  const then = new Date(d).getTime();
  const now = new Date("2026-04-16").getTime();
  const diff = Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  if (diff < 7) return diff + " days ago";
  if (diff < 30) return Math.floor(diff / 7) + " weeks ago";
  return Math.floor(diff / 30) + " months ago";
}

function today() { return "2026-04-16"; }

function byId(collection, id) { return STATE[collection].find(x => x.id === id); }

function currentUser() { return byId("people", STATE.currentUserId); }
function currentHoa() { return byId("hoas", STATE.currentHoaId); }

function balanceForUnit(unitId) {
  return STATE.charges.filter(c => c.unitId === unitId && c.status === "open").reduce((sum, c) => sum + c.amount, 0);
}

/* ----- toast ----- */
let toastTimer;
function showToast(msg) {
  const toast = $("#toast");
  $("#toast-msg").textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

/* ----- routing ----- */
function go(path) { window.location.hash = path; }

/* =====================================================================
   SPLASH
   ===================================================================== */

function renderSplash() {
  return `
    <div class="splash">
      <div class="splash-logo">
        <img src="../assets/logo-wordmark.svg" alt="Quorum" width="220" height="58" />
      </div>
      <h1>Step into the demo. Pick who you are today.</h1>
      <p>This is a live click-through of the Quorum product. Pay dues, send an announcement, report a broken sprinkler — actions persist across views, so the board president sees what the resident just did.</p>
      <div class="role-cards">
        <div class="role-card" onclick="pickRole('resident')">
          <div class="ico">🏠</div>
          <h3>Resident</h3>
          <div class="who">Sarah Chen · Unit 42</div>
          <p class="desc">Pay your dues, read announcements, RSVP to meetings, report an issue.</p>
          <div class="go">Enter as Sarah →</div>
        </div>
        <div class="role-card" onclick="pickRole('board')">
          <div class="ico">🪑</div>
          <h3>Board member</h3>
          <div class="who">Walter Martinez · President</div>
          <p class="desc">See what needs you. Send an announcement that lands in every resident's pocket.</p>
          <div class="go">Enter as Walter →</div>
        </div>
        <div class="role-card" onclick="pickRole('manager')">
          <div class="ico">👔</div>
          <h3>Property manager</h3>
          <div class="who">Angela Thompson · Acme PM</div>
          <p class="desc">Portfolio view across 5 associations. Drill into any one of them.</p>
          <div class="go">Enter as Angela →</div>
        </div>
      </div>
      <div class="splash-link">
        <a href="../index.html">← Back to the Quorum pitch</a>
      </div>
    </div>
  `;
}

function pickRole(role) {
  STATE.currentRole = role;
  if (role === "resident") { STATE.currentUserId = "sarah"; go("#/resident"); }
  else if (role === "board") { STATE.currentUserId = "walter"; go("#/board"); }
  else if (role === "manager") { STATE.currentUserId = "angela"; go("#/manager"); }
  saveState();
}

/* =====================================================================
   APP SHELL
   ===================================================================== */

function shell(inner, opts = {}) {
  const role = STATE.currentRole;
  const user = currentUser();
  const hoa = currentHoa();
  const back = opts.back;

  let topBrand = "";
  if (role === "resident") {
    const unit = byId("units", user.unitId);
    topBrand = `
      <div class="top-brand">
        <img src="../assets/favicon.svg" alt="" />
        <div class="where">
          <h4>${esc(hoa.name)}</h4>
          <div class="sub">Unit ${esc(unit.number)} · ${esc(user.name)}</div>
        </div>
      </div>`;
  } else if (role === "board") {
    topBrand = `
      <div class="top-brand">
        <img src="../assets/favicon.svg" alt="" />
        <div class="where">
          <h4>${esc(hoa.name)} · Board</h4>
          <div class="sub">${esc(user.name)} · President</div>
        </div>
      </div>`;
  } else {
    topBrand = `
      <div class="top-brand">
        <img src="../assets/favicon.svg" alt="" />
        <div class="where">
          <h4>Acme Property Management</h4>
          <div class="sub">${esc(user.name)}</div>
        </div>
      </div>`;
  }

  let tabs = "";
  const path = window.location.hash || "#/";
  if (role === "resident") {
    tabs = `
      <div class="nav-tabs">
        <button class="nav-tab ${path === "#/resident" ? "active" : ""}" onclick="go('#/resident')">Home</button>
        <button class="nav-tab ${path.startsWith("#/resident/pay") ? "active" : ""}" onclick="go('#/resident/pay')">Pay</button>
        <button class="nav-tab ${path === "#/resident/docs" ? "active" : ""}" onclick="go('#/resident/docs')">Documents</button>
      </div>`;
  } else if (role === "board") {
    tabs = `
      <div class="nav-tabs">
        <button class="nav-tab ${path === "#/board" ? "active" : ""}" onclick="go('#/board')">Dashboard</button>
        <button class="nav-tab ${path === "#/board/announce" ? "active" : ""}" onclick="go('#/board/announce')">Announce</button>
        <button class="nav-tab ${path === "#/board/residents" ? "active" : ""}" onclick="go('#/board/residents')">Residents</button>
        <button class="nav-tab ${path === "#/board/meetings" ? "active" : ""}" onclick="go('#/board/meetings')">Meetings</button>
      </div>`;
  } else if (role === "manager") {
    tabs = `
      <div class="nav-tabs">
        <button class="nav-tab ${path === "#/manager" ? "active" : ""}" onclick="go('#/manager')">Portfolio</button>
      </div>`;
  }

  const backBtn = back ? `<button class="back-btn" onclick="go('${back}')">← Back</button>` : "";

  return `
    <div class="demo-banner">You're in the Quorum demo — tap anything. State persists across roles. <a href="#" onclick="resetState();return false;">Reset demo</a></div>
    <div class="app-top">
      <div class="wrap">
        ${backBtn}
        ${topBrand}
        ${tabs}
      </div>
    </div>
    ${inner}
    ${renderRoleSwitcher()}
  `;
}

function renderRoleSwitcher() {
  const r = STATE.currentRole;
  return `
    <div class="role-switcher">
      <button class="role-switch-btn ${r === "resident" ? "active" : ""}" onclick="pickRole('resident')">🏠 Resident</button>
      <button class="role-switch-btn ${r === "board" ? "active" : ""}" onclick="pickRole('board')">🪑 Board</button>
      <button class="role-switch-btn ${r === "manager" ? "active" : ""}" onclick="pickRole('manager')">👔 Manager</button>
      <button class="role-switch-btn reset" onclick="resetState()">Reset</button>
    </div>
  `;
}

/* =====================================================================
   RESIDENT
   ===================================================================== */

function renderResidentHome() {
  const user = currentUser();
  const unit = byId("units", user.unitId);
  const balance = balanceForUnit(user.unitId);
  const hoa = currentHoa();
  const meetings = STATE.meetings.filter(m => m.hoaId === hoa.id && m.status === "upcoming");
  const announcements = STATE.announcements.filter(a => a.hoaId === hoa.id).sort((a,b) => b.date.localeCompare(a.date));
  const myWorkOrders = STATE.workOrders.filter(wo => wo.reporterId === user.id && wo.status !== "done");

  const balanceCard = balance > 0 ? `
    <div class="balance-hero">
      <div>
        <div class="label">Amount due</div>
        <div class="amount">${money(balance)}</div>
        <div class="sub">Due ${fmtDate("2026-05-01")}</div>
      </div>
      <button class="btn btn-primary" onclick="go('#/resident/pay')">Pay now →</button>
    </div>
  ` : `
    <div class="balance-hero">
      <div>
        <div class="label">Balance</div>
        <div class="amount">${money(0)}</div>
        <div class="sub">You're all caught up. Next dues due May 1.</div>
      </div>
      <button class="btn btn-ghost" style="background:rgba(255,255,255,0.1); color:#fff; border-color:rgba(255,255,255,0.3);" onclick="go('#/resident/pay')">View history</button>
    </div>
  `;

  const quickActions = `
    <div class="quick-actions">
      <div class="qa" onclick="go('#/resident/report')"><div class="ico">🔧</div><div class="lbl">Report an issue</div></div>
      <div class="qa" onclick="go('#/resident/docs')"><div class="ico">📄</div><div class="lbl">Documents</div></div>
      <div class="qa" onclick="go('#/resident/pay')"><div class="ico">💳</div><div class="lbl">Pay & history</div></div>
      <div class="qa" onclick="showToast('Neighbor directory coming in Phase 2')"><div class="ico">👋</div><div class="lbl">Neighbors</div></div>
    </div>
  `;

  const meetingCard = meetings.length ? (() => {
    const m = meetings[0];
    return `
      <div class="row" onclick="showToast('RSVP recorded — see you there')">
        <div class="icon sage">📅</div>
        <div class="body">
          <div class="title">${esc(m.title)} — ${fmtDate(m.date)}, ${esc(m.time)}</div>
          <div class="meta">${esc(m.location)} · ${m.rsvps} neighbors attending</div>
        </div>
        <div class="action">RSVP →</div>
      </div>
    `;
  })() : "";

  const workOrderCards = myWorkOrders.map(wo => `
    <div class="row" onclick="go('#/resident/workorder/${wo.id}')">
      <div class="icon sage">🔧</div>
      <div class="body">
        <div class="title">Your report: ${esc(wo.title)}</div>
        <div class="meta">${wo.assignedTo ? "Assigned to " + esc(wo.assignedTo) : "Awaiting assignment"} · reported ${daysAgo(wo.date)}</div>
      </div>
      <div class="action">Details →</div>
    </div>
  `).join("");

  const announcementCards = announcements.slice(0, 4).map(a => `
    <div class="row" onclick="go('#/resident/announcement/${a.id}')">
      <div class="icon">📣</div>
      <div class="body">
        <div class="title">${esc(a.subject)}</div>
        <div class="meta">Posted ${daysAgo(a.date)} · ${a.recipients} residents</div>
      </div>
      <div class="action">Read →</div>
    </div>
  `).join("");

  return shell(`
    <div class="page">
      <div class="wrap">
        <div class="page-header">
          <h1>Good morning, ${esc(user.name.split(" ")[0])}.</h1>
          <p>Unit ${esc(unit.number)} · ${esc(unit.address)}</p>
        </div>
        ${balanceCard}
        ${quickActions}
        ${meetingCard}
        ${workOrderCards}
        <h2 style="margin: 28px 0 12px; font-size: 19px;">Announcements</h2>
        ${announcementCards}
      </div>
    </div>
  `);
}

/* ----- pay flow ----- */
function renderResidentPay() {
  const user = currentUser();
  const openCharges = STATE.charges.filter(c => c.unitId === user.unitId && c.status === "open");
  const total = openCharges.reduce((s,c) => s + c.amount, 0);
  const paid = STATE.charges.filter(c => c.unitId === user.unitId && c.status === "paid").sort((a,b) => b.date.localeCompare(a.date));

  const hasDue = openCharges.length > 0;

  return shell(`
    <div class="page">
      <div class="wrap-narrow">
        <div class="page-header">
          <h1>${hasDue ? "Pay your dues" : "Payment history"}</h1>
          <p>${hasDue ? "One tap. No portal. Secure via Stripe." : "You're all caught up."}</p>
        </div>

        ${hasDue ? `
          <div class="card-lg">
            <h2 style="margin-bottom: 18px;">Open charges</h2>
            ${openCharges.map(c => `
              <div style="display:flex; justify-content:space-between; padding: 10px 0; border-bottom: 1px solid var(--line);">
                <span>${esc(c.description)} · ${fmtDate(c.date)}</span>
                <strong>${money(c.amount)}</strong>
              </div>
            `).join("")}
            <div style="display:flex; justify-content:space-between; padding: 16px 0 0; font-size: 19px; font-weight: 600; color: var(--accent);">
              <span>Total due</span>
              <span>${money(total)}</span>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary btn-block" onclick="payCharges()">Pay ${money(total)} now →</button>
            </div>
            <p style="font-size: 13px; color: var(--ink-soft); margin: 16px 0 0; text-align: center;">Funds arrive in the association's operating account in 1–2 business days.</p>
          </div>
        ` : ""}

        <div class="card-lg">
          <h2 style="margin-bottom: 16px;">Past payments</h2>
          ${paid.length === 0 ? `<div class="empty">No history yet.</div>` : paid.map(c => `
            <div style="display:flex; justify-content:space-between; padding: 12px 0; border-bottom: 1px solid var(--line); font-size: 15px;">
              <div>
                <div style="font-weight: 500;">${esc(c.description)}</div>
                <div style="font-size: 13px; color: var(--ink-soft);">${fmtDate(c.date)}</div>
              </div>
              <div style="color: var(--green); font-weight: 500;">Paid ${money(c.amount)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `, { back: "#/resident" });
}

function payCharges() {
  const user = currentUser();
  const openCharges = STATE.charges.filter(c => c.unitId === user.unitId && c.status === "open");
  const total = openCharges.reduce((s,c) => s + c.amount, 0);
  openCharges.forEach(c => { c.status = "paid"; c.date = today(); });
  saveState();
  go("#/resident/pay-receipt?total=" + total);
}

function renderPayReceipt() {
  const total = new URLSearchParams(window.location.hash.split("?")[1] || "").get("total") || "0";
  return shell(`
    <div class="page">
      <div class="wrap-narrow">
        <div class="receipt">
          <div class="checkbig">✓</div>
          <h2>Payment received</h2>
          <p>Thanks, ${esc(currentUser().name.split(" ")[0])}. A receipt has been emailed.</p>
          <div class="lines">
            <div class="lines-row"><span>Amount</span><strong>${money(total)}</strong></div>
            <div class="lines-row"><span>Method</span><span>Bank · ACH</span></div>
            <div class="lines-row"><span>Date</span><span>${fmtDate(today())}</span></div>
            <div class="lines-row total"><span>Status</span><span style="color: var(--green);">Complete</span></div>
          </div>
          <button class="btn btn-primary btn-block" onclick="go('#/resident')">Back to home</button>
        </div>
      </div>
    </div>
  `, { back: "#/resident" });
}

/* ----- announcement detail ----- */
function renderAnnouncement(id) {
  const a = byId("announcements", id);
  if (!a) return shell(`<div class="page"><div class="wrap"><div class="empty">Announcement not found.</div></div></div>`, { back: "#/resident" });
  const author = byId("people", a.authorId);
  return shell(`
    <div class="page">
      <div class="wrap-narrow">
        <div class="card-lg">
          <div class="card-header">
            <div>
              <span class="pill sage">Announcement</span>
              <h1 style="margin: 12px 0 6px;">${esc(a.subject)}</h1>
              <p style="color: var(--ink-soft); margin: 0;">From ${esc(author.name)} · ${fmtDate(a.date)} · sent to ${a.recipients} residents</p>
            </div>
          </div>
          <div style="font-size: 17px; line-height: 1.65; white-space: pre-wrap; padding-top: 20px; border-top: 1px solid var(--line); margin-top: 20px;">${esc(a.body)}</div>
          <div style="display: flex; gap: 8px; margin-top: 24px;">
            ${a.channels.map(c => `<span class="pill neutral">${esc(c)}</span>`).join("")}
          </div>
        </div>
      </div>
    </div>
  `, { back: "#/resident" });
}

/* ----- report issue ----- */
function renderReportIssue() {
  return shell(`
    <div class="page">
      <div class="wrap-narrow">
        <div class="page-header">
          <h1>Report an issue</h1>
          <p>Send this straight to the board queue. Takes 30 seconds.</p>
        </div>
        <div class="card-lg">
          <form onsubmit="submitReport(event)">
            <div class="field">
              <label class="field-label">What's going on?</label>
              <input class="field-input" name="title" required placeholder="e.g. Broken gate, dog off leash, graffiti" />
            </div>
            <div class="field">
              <label class="field-label">A few more details</label>
              <textarea class="field-textarea" name="description" required placeholder="Where is it? Any other context that helps the board or a vendor show up prepared."></textarea>
            </div>
            <div class="field">
              <label class="field-label">Priority</label>
              <select class="field-select" name="priority">
                <option value="low">Low — whenever</option>
                <option value="medium" selected>Medium — this week</option>
                <option value="high">High — urgent</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">Photo (optional)</label>
              <div class="field-input" style="cursor:pointer; color: var(--ink-soft);" onclick="showToast('Camera roll would open here')">📷 Tap to attach a photo</div>
            </div>
            <div class="btn-row">
              <button type="submit" class="btn btn-primary btn-block">Submit to the board →</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `, { back: "#/resident" });
}

function submitReport(e) {
  e.preventDefault();
  const form = e.target;
  const user = currentUser();
  const newWO = {
    id: "wo" + Date.now(),
    hoaId: STATE.currentHoaId,
    unitId: user.unitId,
    reporterId: user.id,
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    assignedTo: null,
    status: "new",
    date: today(),
    priority: form.priority.value,
  };
  STATE.workOrders.unshift(newWO);
  saveState();
  showToast("Sent to the board — you'll get updates");
  go("#/resident");
}

/* ----- documents ----- */
function renderDocuments() {
  const docs = STATE.documents.filter(d => d.hoaId === STATE.currentHoaId).sort((a,b) => b.date.localeCompare(a.date));
  return shell(`
    <div class="page">
      <div class="wrap">
        <div class="page-header">
          <h1>Documents</h1>
          <p>Everything the community has ever published, in one place.</p>
        </div>
        ${docs.map(d => `
          <div class="row" onclick="showToast('Would open ${esc(d.title)}')">
            <div class="icon neutral">📄</div>
            <div class="body">
              <div class="title">${esc(d.title)}</div>
              <div class="meta">${esc(d.type)} · ${esc(d.size)} · added ${daysAgo(d.date)}</div>
            </div>
            <div class="action">Open →</div>
          </div>
        `).join("")}
      </div>
    </div>
  `, { back: "#/resident" });
}

/* ----- work order detail ----- */
function renderWorkOrderDetail(id) {
  const wo = byId("workOrders", id);
  if (!wo) return shell(`<div class="page"><div class="wrap"><div class="empty">Not found.</div></div></div>`, { back: "#/resident" });
  const statusPill = {
    "new": '<span class="pill amber">New · awaiting assignment</span>',
    "in-progress": '<span class="pill sage">In progress</span>',
    "done": '<span class="pill green">Complete</span>',
  }[wo.status];
  return shell(`
    <div class="page">
      <div class="wrap-narrow">
        <div class="card-lg">
          ${statusPill}
          <h1 style="margin: 12px 0 6px;">${esc(wo.title)}</h1>
          <p style="color: var(--ink-soft);">Reported ${daysAgo(wo.date)} · priority ${esc(wo.priority)}</p>
          <div style="padding: 20px 0; border-top: 1px solid var(--line); margin-top: 20px; font-size: 16px; line-height: 1.6;">${esc(wo.description)}</div>
          ${wo.assignedTo ? `<div style="padding: 16px; background: var(--bg-soft); border-radius: 10px; font-size: 15px;"><strong>Assigned to:</strong> ${esc(wo.assignedTo)}</div>` : ""}
        </div>
      </div>
    </div>
  `, { back: "#/resident" });
}

/* =====================================================================
   BOARD
   ===================================================================== */

function renderBoardDashboard() {
  const hoa = currentHoa();
  const pendingViolations = STATE.violations.filter(v => v.hoaId === hoa.id && v.status === "pending-review");
  const newWorkOrders = STATE.workOrders.filter(wo => wo.hoaId === hoa.id && wo.status === "new");
  const upcomingMeeting = STATE.meetings.find(m => m.hoaId === hoa.id && m.status === "upcoming");

  const needsMe = [
    ...pendingViolations.map(v => ({ kind: "violation", pill: "Violation", pillClass: "", title: `${esc(v.type)} — Unit ${esc(byId("units", v.unitId).number)} (notice ${v.notice})`, meta: "Review", id: v.id })),
    ...newWorkOrders.map(wo => ({ kind: "workorder", pill: "Work order", pillClass: "", title: esc(wo.title), meta: "Assign vendor", id: wo.id })),
    { kind: "announcement", pill: "Announcement", pillClass: "sage", title: "Draft: Pool opening weekend", meta: "Review & send", id: "draft1" },
  ];

  return shell(`
    <div class="page">
      <div class="wrap">
        <div class="page-header">
          <h1>Sunday morning, ${esc(currentUser().name.split(" ")[0])}.</h1>
          <p>Here's what needs you at ${esc(hoa.name)}.</p>
        </div>

        <div class="kpi-grid">
          <div class="kpi">
            <div class="label">Collected MTD</div>
            <div class="num">${hoa.collected}%</div>
            <div class="trend">▲ 4% vs last month</div>
          </div>
          <div class="kpi">
            <div class="label">Delinquent units</div>
            <div class="num">12</div>
            <div class="trend">2 in legal</div>
          </div>
          <div class="kpi">
            <div class="label">Reserve balance</div>
            <div class="num">${money(hoa.reserve).replace(".00","")}</div>
            <div class="trend">on target</div>
          </div>
        </div>

        <div class="card-lg">
          <div class="card-header">
            <h2>Needs you</h2>
            <div class="meta">${needsMe.length} items · tap to resolve</div>
          </div>
          ${needsMe.map(item => `
            <div class="row" onclick="resolveNeedsMe('${item.kind}','${item.id}', this)">
              <span class="pill ${item.pillClass}">${item.pill}</span>
              <div class="body">
                <div class="title">${item.title}</div>
              </div>
              <div class="action">${item.meta}</div>
            </div>
          `).join("")}
        </div>

        <div class="grid-2">
          <div class="card-lg">
            <div class="card-header">
              <h2>Next meeting</h2>
              <div class="meta">${upcomingMeeting ? daysAgo(upcomingMeeting.date).replace("ago","from now").replace("today","today") : ""}</div>
            </div>
            ${upcomingMeeting ? `
              <h3 style="margin-bottom: 6px;">${esc(upcomingMeeting.title)}</h3>
              <p style="color: var(--ink-soft);">${fmtDate(upcomingMeeting.date)} · ${esc(upcomingMeeting.time)} · ${esc(upcomingMeeting.location)}</p>
              <p style="color: var(--ink-soft); margin-bottom: 0;"><strong>${upcomingMeeting.rsvps}</strong> neighbors have RSVP'd · ${upcomingMeeting.agenda.length} agenda items</p>
              <div class="btn-row">
                <button class="btn btn-ghost btn-sm" onclick="go('#/board/meetings/${upcomingMeeting.id}')">View agenda →</button>
              </div>
            ` : `<div class="empty">No upcoming meetings.</div>`}
          </div>
          <div class="card-lg">
            <div class="card-header">
              <h2>Send an announcement</h2>
            </div>
            <p style="color: var(--ink-soft);">Reach every resident in two minutes — email, SMS, or in-app.</p>
            <div class="btn-row">
              <button class="btn btn-primary" onclick="go('#/board/announce')">New announcement →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}

function resolveNeedsMe(kind, id, rowEl) {
  rowEl.classList.toggle("done");
  const msgs = { violation: "Violation resolved", workorder: "Work order assigned", announcement: "Announcement sent" };
  showToast(msgs[kind] || "Done");
}

/* ----- compose announcement ----- */
function renderCompose() {
  const hoa = currentHoa();
  const resCount = STATE.people.filter(p => p.hoaId === hoa.id && p.role === "resident").length;

  return shell(`
    <div class="page">
      <div class="wrap-narrow">
        <div class="page-header">
          <h1>New announcement</h1>
          <p>From blank screen to every resident's inbox. Two minutes, tops.</p>
        </div>

        <div class="card-lg">
          <form onsubmit="sendAnnouncement(event)">
            <div class="field">
              <label class="field-label">Subject</label>
              <input class="field-input" name="subject" required placeholder="What's this about?" value="Reminder: move cars before Tuesday resurfacing" />
            </div>

            <div class="field">
              <label class="field-label">Message</label>
              <textarea class="field-textarea" name="body" required style="min-height: 140px;">Quick reminder — the city will be resurfacing Sunset Ridge Drive on Tuesday morning. Please move any street-parked vehicles by 7:00 AM Tuesday.

Thanks,
Walter</textarea>
              <div class="field-help">You can use multiple paragraphs. No attachments today; we're keeping it simple.</div>
            </div>

            <div class="field">
              <label class="field-label">Audience</label>
              <div>
                <span class="audience-chip">All residents · ${resCount * 100}</span>
                <span class="audience-chip add" onclick="showToast('Filter builder coming in Phase 2')">+ Filter by building / delinquency / owners</span>
              </div>
            </div>

            <div class="field">
              <label class="field-label">Send through</label>
              <div class="channel-row">
                <div class="channel on" onclick="this.classList.toggle('on')"><span class="check"></span><span>Email</span></div>
                <div class="channel on" onclick="this.classList.toggle('on')"><span class="check"></span><span>SMS</span></div>
                <div class="channel on" onclick="this.classList.toggle('on')"><span class="check"></span><span>In-app</span></div>
              </div>
            </div>

            <div class="btn-row">
              <button type="submit" class="btn btn-primary btn-block" id="sendBtn">Send to 412 residents →</button>
            </div>
            <p style="font-size: 13px; color: var(--ink-soft); margin: 14px 0 0; text-align: center;">After you send, switch to the Resident role to see it land in Sarah's feed.</p>
          </form>
        </div>
      </div>
    </div>
  `, { back: "#/board" });
}

function sendAnnouncement(e) {
  e.preventDefault();
  const form = e.target;
  const btn = $("#sendBtn");
  btn.disabled = true;
  btn.textContent = "Sending…";

  const channels = Array.from(form.querySelectorAll(".channel.on span:last-child")).map(s => s.textContent.toLowerCase());

  setTimeout(() => {
    const newAnn = {
      id: "a" + Date.now(),
      hoaId: STATE.currentHoaId,
      authorId: STATE.currentUserId,
      subject: form.subject.value.trim(),
      body: form.body.value.trim(),
      date: today(),
      channels,
      recipients: 412,
    };
    STATE.announcements.unshift(newAnn);
    saveState();
    showToast("Sent to 412 residents · switch to Resident to see it");
    go("#/board");
  }, 900);
}

/* ----- residents directory ----- */
function renderResidents() {
  const hoa = currentHoa();
  const residents = STATE.people.filter(p => p.hoaId === hoa.id && p.role === "resident");
  const withExtras = [
    { unit: "42", name: "Sarah Chen", email: "sarah.chen@email.com", status: "Current" },
    { unit: "8",  name: "Walter Martinez", email: "walter.m@email.com", status: "Current · Board" },
    { unit: "19", name: "James O'Brien", email: "jim.obrien@email.com", status: "2 violations" },
    { unit: "7",  name: "Donna Patel", email: "donna.patel@email.com", status: "Current" },
    { unit: "23", name: "Ruth Schumann", email: "ruth.s@email.com", status: "Current" },
    { unit: "15", name: "Marco Valente", email: "marco.v@email.com", status: "30 days past due" },
    { unit: "31", name: "Lisa Nakamura", email: "lisa.n@email.com", status: "Current" },
    { unit: "47", name: "Theo Okafor", email: "theo.o@email.com", status: "Current" },
    { unit: "50", name: "Elena Ruiz", email: "e.ruiz@email.com", status: "60 days past due" },
    { unit: "61", name: "Paul Andersson", email: "paul.a@email.com", status: "Current" },
  ];
  return shell(`
    <div class="page">
      <div class="wrap">
        <div class="page-header">
          <h1>Residents</h1>
          <p>${residents.length * 80} residents across ${hoa.units} units.</p>
        </div>
        <div class="card-lg" style="padding: 0; overflow: hidden;">
          <div class="resident-row head">
            <div>Name</div>
            <div>Contact</div>
            <div>Unit</div>
            <div>Status</div>
          </div>
          ${withExtras.map(r => `
            <div class="resident-row">
              <div class="r-name">${esc(r.name)}</div>
              <div class="r-contact">${esc(r.email)}</div>
              <div>Unit ${esc(r.unit)}</div>
              <div class="r-status">${r.status.includes("past due") ? '<span class="pill red">' + esc(r.status) + '</span>' : r.status.includes("violation") ? '<span class="pill amber">' + esc(r.status) + '</span>' : '<span class="pill green">' + esc(r.status) + '</span>'}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `);
}

/* ----- meetings ----- */
function renderMeetings() {
  const hoa = currentHoa();
  const meetings = STATE.meetings.filter(m => m.hoaId === hoa.id).sort((a,b) => b.date.localeCompare(a.date));
  return shell(`
    <div class="page">
      <div class="wrap">
        <div class="page-header">
          <h1>Meetings</h1>
          <p>Agendas, attendance, minutes, and votes — recorded the way they should be.</p>
        </div>
        ${meetings.map(m => `
          <div class="row" onclick="go('#/board/meetings/${m.id}')">
            <div class="icon sage">📅</div>
            <div class="body">
              <div class="title">${esc(m.title)}</div>
              <div class="meta">${fmtDate(m.date)} · ${esc(m.time)} · ${esc(m.location)} · ${m.rsvps} attending</div>
            </div>
            <div class="action">${m.status === "upcoming" ? "Agenda →" : "Minutes →"}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `);
}

function renderMeetingDetail(id) {
  const m = byId("meetings", id);
  if (!m) return shell(`<div class="page"><div class="wrap"><div class="empty">Not found.</div></div></div>`, { back: "#/board/meetings" });
  return shell(`
    <div class="page">
      <div class="wrap-narrow">
        <div class="card-lg">
          <span class="pill ${m.status === "upcoming" ? "sage" : "neutral"}">${m.status === "upcoming" ? "Upcoming" : "Complete"}</span>
          <h1 style="margin: 12px 0 6px;">${esc(m.title)}</h1>
          <p style="color: var(--ink-soft);">${fmtDate(m.date)} · ${esc(m.time)} · ${esc(m.location)} · ${m.rsvps} neighbors attending</p>

          <h3 style="margin: 24px 0 4px;">Agenda</h3>
          ${m.agenda.map((item, i) => `
            <div class="agenda-item">
              <div class="ah">
                <span class="num">${i + 1}.</span>
                <span class="title">${esc(item.title)}</span>
              </div>
              <p>${esc(item.desc)}</p>
            </div>
          `).join("")}

          ${m.status === "upcoming" ? `
            <div class="btn-row">
              <button class="btn btn-primary" onclick="showToast('Pre-meeting packet sent to board')">Send packet to board</button>
              <button class="btn btn-ghost" onclick="showToast('Reminder queued for 24 hours before')">Remind residents</button>
            </div>
          ` : ""}
        </div>
      </div>
    </div>
  `, { back: "#/board/meetings" });
}

/* =====================================================================
   MANAGER
   ===================================================================== */

function renderManagerPortfolio() {
  const totalUnits = STATE.hoas.reduce((s,h) => s + h.units, 0);
  const avgCollected = Math.round(STATE.hoas.reduce((s,h) => s + h.collected, 0) / STATE.hoas.length);
  const openItems = STATE.workOrders.filter(w => w.status !== "done").length + STATE.violations.filter(v => v.status === "pending-review").length;

  return shell(`
    <div class="page">
      <div class="wrap">
        <div class="page-header">
          <h1>Acme Property Management</h1>
          <p>${STATE.hoas.length} associations · ${totalUnits.toLocaleString()} units · this week</p>
        </div>

        <div class="kpi-grid">
          <div class="kpi">
            <div class="label">Portfolio health</div>
            <div class="num">${avgCollected}%</div>
            <div class="trend">collection rate</div>
          </div>
          <div class="kpi">
            <div class="label">Open items</div>
            <div class="num">${openItems}</div>
            <div class="trend">across portfolio</div>
          </div>
          <div class="kpi">
            <div class="label">Collected MTD</div>
            <div class="num">$312k</div>
            <div class="trend">▲ 6%</div>
          </div>
        </div>

        <div class="card-lg">
          <div class="card-header">
            <h2>Communities</h2>
            <div class="meta">tap to drill in</div>
          </div>
          ${STATE.hoas.map(h => `
            <div class="hoa-row" onclick="drillIntoHoa('${h.id}')">
              <span class="status-dot ${h.status}"></span>
              <div style="flex:1; min-width:0;">
                <div class="name">${esc(h.name)}</div>
                <div class="meta" style="font-size:13px; color: var(--ink-soft); margin-top:2px;">${esc(h.city)} · ${h.units} units</div>
              </div>
              <div class="stat">${h.collected}% collected</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `);
}

function drillIntoHoa(hoaId) {
  STATE.currentHoaId = hoaId;
  STATE.currentRole = "board";
  STATE.currentUserId = "walter";
  saveState();
  showToast("Switched to " + byId("hoas", hoaId).name);
  go("#/board");
}

/* =====================================================================
   ROUTER
   ===================================================================== */

function render() {
  const path = (window.location.hash || "#/").split("?")[0];
  const app = $("#app");

  let out;
  if (path === "#/") out = renderSplash();
  else if (path === "#/resident") out = renderResidentHome();
  else if (path === "#/resident/pay") out = renderResidentPay();
  else if (path === "#/resident/pay-receipt") out = renderPayReceipt();
  else if (path.startsWith("#/resident/announcement/")) out = renderAnnouncement(path.split("/")[3]);
  else if (path === "#/resident/report") out = renderReportIssue();
  else if (path === "#/resident/docs") out = renderDocuments();
  else if (path.startsWith("#/resident/workorder/")) out = renderWorkOrderDetail(path.split("/")[3]);
  else if (path === "#/board") out = renderBoardDashboard();
  else if (path === "#/board/announce") out = renderCompose();
  else if (path === "#/board/residents") out = renderResidents();
  else if (path === "#/board/meetings") out = renderMeetings();
  else if (path.startsWith("#/board/meetings/")) out = renderMeetingDetail(path.split("/")[3]);
  else if (path === "#/manager") out = renderManagerPortfolio();
  else out = renderSplash();

  app.innerHTML = out;
  window.scrollTo(0, 0);
}

/* ----- boot ----- */
STATE = loadState();
saveState();
window.addEventListener("hashchange", render);
render();
