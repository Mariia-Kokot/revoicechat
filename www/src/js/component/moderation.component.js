/**
 * <moderation-panel server-id="..."></moderation-panel>
 *
 * Attributes:
 *   server-id  — UUID of the server to moderate. Can be null/absent (shows empty state).
 *
 * Usage:
 *   <script type="module" src="moderation-panel.js"></script>
 *   <moderation-panel server-id="your-server-uuid"></moderation-panel>
 */

const SANCTION_TYPES = {
    BAN:            { label: "Ban",           icon: "🔨", color: "#a22121" },
    TEXT_TIME_OUT:  { label: "Text Timeout",  icon: "✍️", color: "#fb883c" },
    VOICE_TIME_OUT: { label: "Voice Timeout", icon: "🔇", color: "#71717a" },
};

const REQUEST_STATUSES = {
    CREATED:  { label: "Pending",  color: "#fb883c" },
    ACCEPTED: { label: "Accepted", color: "#22c55e" },
    REJECTED: { label: "Rejected", color: "#a22121" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(dt) {
    if (!dt) return "Permanent";
    return new Date(dt).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function initials(name) {
    if (!name) return "??";
    return name.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === "class")        node.className = v;
        else if (k === "style")   Object.assign(node.style, v);
        else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
        else                      node.setAttribute(k, v);
    }
    for (const child of children.flat()) {
        if (child == null) continue;
        node.append(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
}

function avatar(name, size = 32) {
    return el("div", {
        class: "mp-avatar",
        style: { width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.33)}px` },
    }, initials(name));
}

function badge(label, color) {
    return el("span", { class: "mp-badge", style: { background: color } }, label);
}

// ─── API layer (replace TODOs with real fetch calls) ──────────────────────────

async function api_fetchSanctions(serverId) {
    // TODO: GET /api/servers/{serverId}/sanctions
    // Expected response: SanctionRepresentation[]
    throw new Error("TODO: implement api_fetchSanctions");
}

async function api_issueSanction(serverId, payload) {
    // TODO: POST /api/servers/{serverId}/sanctions
    // Payload: { targetedUser, type, expiresAt, reason }
    // Expected response: SanctionRepresentation
    throw new Error("TODO: implement api_issueSanction");
}

async function api_updateSanction(sanctionId, payload) {
    // TODO: PATCH /api/sanctions/{sanctionId}
    // Payload: { type, expiresAt, reason }
    // Expected response: SanctionRepresentation
    throw new Error("TODO: implement api_updateSanction");
}

async function api_revokeSanction(sanctionId) {
    // TODO: POST /api/sanctions/{sanctionId}/revoke
    // Expected response: SanctionRepresentation (with active=false, revokedAt set)
    throw new Error("TODO: implement api_revokeSanction");
}

async function api_fetchRevocationRequests(serverId) {
    // TODO: GET /api/servers/{serverId}/sanctions/revocation-requests
    // Expected response: SanctionRevocationRequestRepresentation[]
    throw new Error("TODO: implement api_fetchRevocationRequests");
}

async function api_reviewRevocationRequest(requestId, status) {
    // TODO: POST /api/sanctions/revocation-requests/{requestId}/review
    // Payload: { status }  — status: "ACCEPTED" | "REJECTED"
    // Expected response: SanctionRevocationRequestRepresentation
    throw new Error("TODO: implement api_reviewRevocationRequest");
}

async function api_fetchUser(userId) {
    // TODO: GET /api/users/{userId}
    // Expected response: { id, name, avatarUrl? }
    throw new Error("TODO: implement api_fetchUser");
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
  :host {
    display: block;
    font-family: ui-sans-serif, system-ui, sans-serif;
    color: var(--pri-text-color, #ffffff);
    background: var(--sec-bg-color, #1a1a1e);
    box-sizing: border-box;
  }

  *, *::before, *::after { box-sizing: border-box; }

  /* ── Layout ── */
  .mp-root { padding: 1.5rem; }
  .mp-inner { max-width: 820px; margin: 0 auto; }

  .mp-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 1.25rem;
  }
  .mp-header h1 {
    font-size: 1.25rem; font-weight: 800; margin: 0;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .mp-header .mp-subtitle {
    font-size: 0.75rem; color: var(--pri-placeholder-color, #9ca3af); margin-top: 0.2rem;
  }

  /* ── Stats ── */
  .mp-stats { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .mp-stat {
    flex: 1; min-width: 80px;
    background: var(--ter-bg-color, #202024);
    border: 1px solid var(--pri-bd-color, #43434d);
    border-radius: 0.25rem; padding: 0.75rem 1rem;
  }
  .mp-stat-value { font-size: 1.5rem; font-weight: 800; line-height: 1; }
  .mp-stat-label {
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--pri-placeholder-color, #9ca3af); margin-top: 0.2rem;
  }

  /* ── Tabs ── */
  .mp-tabs {
    display: flex; border-bottom: 1px solid var(--pri-bd-color, #43434d); margin-bottom: 1rem;
  }
  .mp-tab {
    background: none; border: none; border-bottom: 2px solid transparent;
    padding: 0.6rem 1rem; font-weight: 700; font-size: 0.875rem;
    cursor: pointer; color: var(--pri-placeholder-color, #9ca3af);
    margin-bottom: -1px; transition: all 0.15s; font-family: inherit;
  }
  .mp-tab.active { color: var(--pri-button-bg-color, #5E8C61); border-bottom-color: var(--pri-button-bg-color, #5E8C61); }

  /* ── Toolbar ── */
  .mp-toolbar {
    display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; align-items: center;
  }
  .mp-search {
    flex: 1; min-width: 160px;
    background: var(--ter-bg-color, #202024);
    border: 1px solid var(--pri-bd-color, #43434d);
    border-radius: 0.25rem; color: var(--pri-text-color, #fff);
    padding: 0.5rem 0.75rem; font-family: inherit; font-size: 0.875rem;
  }
  .mp-search::placeholder { color: var(--pri-placeholder-color, #9ca3af); }
  .mp-search:focus { outline: none; border-color: var(--pri-button-bg-color, #5E8C61); }
  .mp-filters { display: flex; gap: 0.25rem; flex-wrap: wrap; }
  .mp-filter {
    padding: 0.35rem 0.75rem; font-size: 0.75rem; font-weight: 700;
    background: var(--ter-bg-color, #202024); color: var(--pri-placeholder-color, #9ca3af);
    border: 1px solid var(--pri-bd-color, #43434d); border-radius: 0.25rem;
    cursor: pointer; font-family: inherit; transition: all 0.15s;
  }
  .mp-filter.active {
    background: var(--pri-button-bg-color, #5E8C61);
    color: white; border-color: var(--pri-button-bg-color, #5E8C61);
  }

  /* ── Buttons ── */
  .mp-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.5rem 1rem; font-weight: 700; font-size: 0.875rem;
    border: none; border-radius: 0.25rem; cursor: pointer;
    font-family: inherit; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .mp-btn:disabled { opacity: 0.5; cursor: default; }
  .mp-btn-primary { background: var(--pri-button-bg-color, #5E8C61); color: white; }
  .mp-btn-primary:hover:not(:disabled) { background: var(--pri-button-hover-color, #3D6B47); }
  .mp-btn-ghost {
    background: transparent; color: var(--pri-placeholder-color, #9ca3af);
    border: 1px solid var(--pri-bd-color, #43434d);
  }
  .mp-btn-ghost:hover:not(:disabled) { background: var(--sec-button-hover-color, #2c2c30); }
  .mp-btn-danger { background: #a22121; color: white; }
  .mp-btn-danger:hover:not(:disabled) { background: #9e0505; }
  .mp-btn-success { background: #22c55e; color: white; }
  .mp-btn-success:hover:not(:disabled) { background: #1b8b44; }
  .mp-btn-sm { padding: 0.3rem 0.65rem; font-size: 0.8rem; }

  /* ── Cards ── */
  .mp-card {
    background: var(--ter-bg-color, #202024);
    border: 1px solid var(--pri-bd-color, #43434d);
    border-radius: 0.25rem;
    transition: background 0.15s;
  }
  .mp-card:hover { background: var(--pri-hover-color, #242427); }
  .mp-list { display: flex; flex-direction: column; gap: 0.35rem; }

  /* ── Sanction row ── */
  .mp-row-main {
    display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.75rem;
  }
  .mp-row-meta { flex: 1; min-width: 0; }
  .mp-row-name-line {
    display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;
  }
  .mp-row-username { font-weight: 700; font-size: 0.875rem; }
  .mp-row-sub {
    font-size: 0.72rem; color: var(--pri-placeholder-color, #9ca3af); margin-top: 0.15rem;
  }
  .mp-row-sub strong { color: var(--pri-text-color, #fff); }
  .mp-row-actions { display: flex; gap: 0.25rem; flex-shrink: 0; }

  /* ── Expanded section ── */
  .mp-expand {
    border-top: 1px solid var(--pri-bd-color, #43434d);
    background: var(--ter-bg-color, #202024);
    padding: 0.75rem;
  }
  .mp-expand[hidden] { display: none; }
  .mp-section-label {
    font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--pri-placeholder-color, #9ca3af); margin-bottom: 0.3rem;
  }
  .mp-reason { font-size: 0.875rem; line-height: 1.6; user-select: text; }
  .mp-revoked-info { font-size: 0.75rem; color: #22c55e; margin-top: 0.5rem; }

  /* ── Appeal block ── */
  .mp-appeal {
    background: var(--sec-bg-color, #1a1a1e);
    border: 1px solid var(--pri-bd-color, #43434d);
    border-radius: 0.25rem; padding: 0.75rem; margin-top: 0.75rem;
  }
  .mp-appeal-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;
  }
  .mp-appeal-label {
    font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--pri-placeholder-color, #9ca3af);
  }
  .mp-appeal-msg { font-size: 0.85rem; font-style: italic; line-height: 1.6; user-select: text; }
  .mp-appeal-date { font-size: 0.72rem; color: var(--pri-placeholder-color, #9ca3af); margin-top: 0.4rem; }
  .mp-appeal-actions { display: flex; gap: 0.5rem; margin-top: 0.65rem; }

  /* ── Avatar ── */
  .mp-avatar {
    border-radius: 9999px; background: var(--pri-button-bg-color, #5E8C61);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; color: white; flex-shrink: 0;
  }

  /* ── Badge ── */
  .mp-badge {
    display: inline-block; padding: 2px 8px; border-radius: 0.25rem;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; color: white;
  }

  /* ── Overlay / modal ── */
  .mp-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.55);
    z-index: 9999; display: flex; align-items: center; justify-content: center;
  }
  .mp-overlay[hidden] { display: none; }
  .mp-modal {
    background: var(--sec-bg-color, #1a1a1e);
    border: 1px solid var(--pri-bd-color, #43434d);
    border-radius: 0.25rem; padding: 1.5rem;
    width: 460px; max-width: 95vw;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }
  .mp-modal-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;
  }
  .mp-modal-title { font-weight: 800; font-size: 1rem; }
  .mp-modal-body { display: flex; flex-direction: column; gap: 0.75rem; }
  .mp-modal-footer { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem; }

  /* ── Form elements ── */
  .mp-field { display: flex; flex-direction: column; gap: 0.3rem; }
  .mp-label { font-weight: 800; font-size: 0.875rem; }
  .mp-label-hint { font-weight: 400; color: var(--pri-placeholder-color, #9ca3af); }
  .mp-input, .mp-select, .mp-textarea {
    background: var(--ter-bg-color, #202024);
    border: 1px solid var(--pri-bd-color, #43434d);
    border-radius: 0.25rem; color: var(--pri-text-color, #fff);
    padding: 0.5rem 0.75rem; font-family: inherit; font-size: 0.875rem; width: 100%;
  }
  .mp-input:focus, .mp-select:focus, .mp-textarea:focus {
    outline: none; border-color: var(--pri-button-bg-color, #5E8C61);
  }
  .mp-input::placeholder, .mp-textarea::placeholder { color: var(--pri-placeholder-color, #9ca3af); }
  .mp-textarea { resize: vertical; }
  .mp-type-btns { display: flex; gap: 0.4rem; }
  .mp-type-btn {
    flex: 1; padding: 0.45rem 0.25rem; font-size: 0.72rem; font-weight: 700;
    border-radius: 0.25rem; cursor: pointer; font-family: inherit; transition: all 0.15s;
  }

  /* ── Empty / error / loading ── */
  .mp-empty {
    text-align: center; padding: 3rem;
    background: var(--ter-bg-color, #202024); border-radius: 0.25rem;
    color: var(--pri-placeholder-color, #9ca3af);
  }
  .mp-empty-icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
  .mp-empty-title { font-weight: 700; }
  .mp-empty-sub { font-size: 0.8rem; margin-top: 0.2rem; }
  .mp-error { color: #a22121; }
  .mp-loading-spinner {
    display: inline-block; width: 20px; height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%;
    animation: mp-spin 0.8s linear infinite;
  }
  @keyframes mp-spin { to { transform: rotate(360deg); } }

  /* ── No server state ── */
  .mp-no-server {
    display: flex; align-items: center; justify-content: center;
    min-height: 300px; color: var(--pri-placeholder-color, #9ca3af);
    font-size: 0.9rem; text-align: center;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

class ModerationPanel extends HTMLElement {

    static get observedAttributes() { return ["server-id"]; }

    constructor() {
        super();
        this._shadow      = this.attachShadow({ mode: "open" });
        this._serverId    = null;
        this._sanctions   = [];
        this._requests    = [];
        this._userCache   = {};          // userId → { name, avatarUrl }
        this._tab         = "sanctions"; // "sanctions" | "requests"
        this._filter      = "ALL";
        this._search      = "";
        this._loading     = false;
        this._modal       = null;        // null | { type: "new"|"edit"|"revoke"|"confirm-review", data? }
        this._formData    = {};          // live form state
        this._expandedIds = new Set();   // sanction ids currently expanded
    }

    // ── Lifecycle ──────────────────────────────────────────────────────────────

    connectedCallback() {
        this._render();
        if (this._serverId) this._load();
    }

    attributeChangedCallback(name, _old, value) {
        if (name === "server-id") {
            this._serverId = value || null;
            this._sanctions = [];
            this._requests  = [];
            this._render();
            if (this._serverId) this._load();
        }
    }

    // ── Data loading ───────────────────────────────────────────────────────────

    async _load() {
        this._loading = true;
        this._render();
        try {
            const [sanctions, requests] = await Promise.all([
                api_fetchSanctions(this._serverId),
                api_fetchRevocationRequests(this._serverId),
            ]);
            this._sanctions = sanctions;
            this._requests  = requests;
            await this._resolveUsers();
        } catch (e) {
            console.error("[moderation-panel] load error", e);
        } finally {
            this._loading = false;
            this._render();
        }
    }

    async _resolveUsers() {
        // Collect all unique user ids that are not yet cached
        const ids = new Set();
        for (const s of this._sanctions) {
            ids.add(s.targetedUser);
            ids.add(s.issuedBy);
            if (s.revokedBy) ids.add(s.revokedBy);
        }
        const missing = [...ids].filter(id => id && !this._userCache[id]);
        await Promise.allSettled(missing.map(async id => {
            try {
                const user = await api_fetchUser(id);
                this._userCache[id] = user;
            } catch {
                this._userCache[id] = { name: id.slice(0, 8) + "…" };
            }
        }));
    }

    _userName(id) {
        return this._userCache[id]?.name ?? id?.slice(0, 8) + "…" ?? "Unknown";
    }

    // ── Actions ────────────────────────────────────────────────────────────────

    async _issueSanction(payload) {
        try {
            const s = await api_issueSanction(this._serverId, payload);
            this._sanctions.push(s);
        } catch (e) {
            console.error("[moderation-panel] issue error", e);
        }
    }

    async _updateSanction(sanctionId, payload) {
        try {
            const s = await api_updateSanction(sanctionId, payload);
            this._sanctions = this._sanctions.map(x => x.id === s.id ? s : x);
        } catch (e) {
            console.error("[moderation-panel] update error", e);
        }
    }

    async _revokeSanction(sanctionId) {
        try {
            const s = await api_revokeSanction(sanctionId);
            this._sanctions = this._sanctions.map(x => x.id === s.id ? s : x);
        } catch (e) {
            console.error("[moderation-panel] revoke error", e);
        }
    }

    async _reviewRequest(requestId, status) {
        try {
            const r = await api_reviewRevocationRequest(requestId, status);
            this._requests = this._requests.map(x => x.id === r.id ? r : x);
            if (status === "ACCEPTED") {
                const req = this._requests.find(x => x.id === requestId);
                if (req) await this._revokeSanction(req.sanctionId);
            }
        } catch (e) {
            console.error("[moderation-panel] review error", e);
        }
    }

    // ── Filtered list ──────────────────────────────────────────────────────────

    get _filtered() {
        return this._sanctions.filter(s => {
            const matchType =
                    this._filter === "ALL"            ? true :
                            this._filter === "ACTIVE"         ? s.active :
                                    this._filter === "INACTIVE"       ? !s.active :
                                            s.type === this._filter;
            if (!matchType) return false;
            if (!this._search) return true;
            const q = this._search.toLowerCase();
            return this._userName(s.targetedUser).toLowerCase().includes(q)
                    || (s.reason ?? "").toLowerCase().includes(q);
        });
    }

    get _pendingCount() {
        return this._requests.filter(r => r.status === "CREATED").length;
    }

    // ── Render helpers ─────────────────────────────────────────────────────────

    _buildStats() {
        const active = this._sanctions.filter(s => s.active);
        const stats = [
            { label: "Active Bans",    value: active.filter(s => s.type === "BAN").length,            color: "#a22121" },
            { label: "Text Timeouts",  value: active.filter(s => s.type === "TEXT_TIME_OUT").length,  color: "#fb883c" },
            { label: "Voice Timeouts", value: active.filter(s => s.type === "VOICE_TIME_OUT").length, color: "#71717a" },
            { label: "Total",          value: this._sanctions.length,                                  color: "var(--pri-button-bg-color, #5E8C61)" },
        ];
        return el("div", { class: "mp-stats" },
                ...stats.map(s => el("div", { class: "mp-stat", style: { borderLeft: `3px solid ${s.color}` } },
                        el("div", { class: "mp-stat-value", style: { color: s.color } }, String(s.value)),
                        el("div", { class: "mp-stat-label" }, s.label),
                ))
        );
    }

    _buildTabs() {
        const mkTab = (key, label) => {
            const btn = el("button", { class: "mp-tab" + (this._tab === key ? " active" : "") }, label);
            btn.addEventListener("click", () => { this._tab = key; this._render(); });
            return btn;
        };
        const pending = this._pendingCount;
        return el("div", { class: "mp-tabs" },
                mkTab("sanctions", "Sanctions"),
                mkTab("requests",  `Revocation Requests${pending ? ` (${pending})` : ""}`),
        );
    }

    _buildToolbar() {
        const search = el("input", {
            class: "mp-search", type: "text",
            placeholder: "Search user or reason…", value: this._search,
        });
        search.addEventListener("input", e => { this._search = e.target.value; this._renderList(); });

        const filters = [
            { key: "ALL",            label: "All" },
            { key: "ACTIVE",         label: "Active" },
            { key: "BAN",            label: "🔨 Bans" },
            { key: "TEXT_TIME_OUT",  label: "✍️ Text" },
            { key: "VOICE_TIME_OUT", label: "🔇 Voice" },
            { key: "INACTIVE",       label: "Inactive" },
        ];

        const filterBtns = el("div", { class: "mp-filters" },
                ...filters.map(f => {
                    const btn = el("button", { class: "mp-filter" + (this._filter === f.key ? " active" : "") }, f.label);
                    btn.addEventListener("click", () => { this._filter = f.key; this._renderList(); });
                    return btn;
                })
        );
        return el("div", { class: "mp-toolbar" }, search, filterBtns);
    }

    _buildSanctionRow(sanction) {
        const tc       = SANCTION_TYPES[sanction.type] ?? { label: sanction.type, icon: "?", color: "#555" };
        const userName = this._userName(sanction.targetedUser);
        const modName  = this._userName(sanction.issuedBy);
        const request  = this._requests.find(r => r.sanctionId === sanction.id);
        const expanded = this._expandedIds.has(sanction.id);

        // badges
        const badges = [
            badge(`${tc.icon} ${tc.label}`, tc.color),
            sanction.revokedAt      ? badge("Revoked", "#22c55e") : null,
            !sanction.active && !sanction.revokedAt ? badge("Expired", "#71717a") : null,
            request?.status === "CREATED" ? badge("⏳ Appeal", "#fb883c") : null,
        ].filter(Boolean);

        // action buttons
        const actions = [];
        if (sanction.active) {
            const editBtn = el("button", { class: "mp-btn mp-btn-ghost mp-btn-sm", title: "Edit" }, "✏️");
            editBtn.addEventListener("click", () => this._openEditModal(sanction));
            actions.push(editBtn);

            const revokeBtn = el("button", { class: "mp-btn mp-btn-danger mp-btn-sm", title: "Revoke" }, "🚫");
            revokeBtn.addEventListener("click", () => this._openRevokeModal(sanction));
            actions.push(revokeBtn);
        }

        const expandBtn = el("button", { class: "mp-btn mp-btn-ghost mp-btn-sm" }, expanded ? "▲" : "▼");
        expandBtn.addEventListener("click", () => {
            if (this._expandedIds.has(sanction.id)) this._expandedIds.delete(sanction.id);
            else this._expandedIds.add(sanction.id);
            this._renderList();
        });
        actions.push(expandBtn);

        // expanded content
        const expandSection = el("div", { class: "mp-expand" });
        if (!expanded) { expandSection.hidden = true; }
        else {
            const revokeLine = sanction.revokedAt
                    ? el("p", { class: "mp-revoked-info" },
                            `Revoked by ${this._userName(sanction.revokedBy)} on ${fmtDate(sanction.revokedAt)}`)
                    : null;

            const appealBlock = request ? this._buildAppealBlock(request) : null;

            expandSection.append(
                    el("div", { class: "mp-section-label" }, "Reason"),
                    el("p", { class: "mp-reason" }, sanction.reason ?? "—"),
                    ...(revokeLine ? [revokeLine] : []),
                    ...(appealBlock ? [appealBlock] : []),
            );
        }

        const card = el("div", {
                    class: "mp-card",
                    style: {
                        borderLeft: `3px solid ${tc.color}`,
                        opacity: sanction.active ? "1" : "0.65",
                        overflow: "hidden",
                    }
                },
                el("div", { class: "mp-row-main" },
                        avatar(userName, 32),
                        el("div", { class: "mp-row-meta" },
                                el("div", { class: "mp-row-name-line" },
                                        el("span", { class: "mp-row-username" }, userName),
                                        ...badges,
                                ),
                                el("div", { class: "mp-row-sub" },
                                        "By ", el("strong", {}, modName),
                                        ` · ${fmtDate(sanction.startAt)} → ${fmtDate(sanction.expiresAt)}`,
                                ),
                        ),
                        el("div", { class: "mp-row-actions" }, ...actions),
                ),
                expandSection,
        );

        return card;
    }

    _buildAppealBlock(request) {
        const sc = REQUEST_STATUSES[request.status] ?? { label: request.status, color: "#555" };
        const reviewBtns = request.status === "CREATED"
                ? el("div", { class: "mp-appeal-actions" },
                        (() => {
                            const b = el("button", { class: "mp-btn mp-btn-success mp-btn-sm" }, "✓ Approve");
                            b.addEventListener("click", async () => {
                                b.disabled = true;
                                await this._reviewRequest(request.id, "ACCEPTED");
                                this._render();
                            });
                            return b;
                        })(),
                        (() => {
                            const b = el("button", { class: "mp-btn mp-btn-danger mp-btn-sm" }, "✕ Reject");
                            b.addEventListener("click", async () => {
                                b.disabled = true;
                                await this._reviewRequest(request.id, "REJECTED");
                                this._render();
                            });
                            return b;
                        })(),
                )
                : null;

        return el("div", { class: "mp-appeal" },
                el("div", { class: "mp-appeal-header" },
                        el("span", { class: "mp-appeal-label" }, "Revocation Appeal"),
                        badge(sc.label, sc.color),
                ),
                el("p", { class: "mp-appeal-msg" }, `"${request.message}"`),
                el("div", { class: "mp-appeal-date" }, `Requested ${fmtDate(request.requestAt)}`),
                ...(reviewBtns ? [reviewBtns] : []),
        );
    }

    _buildRequestCard(request) {
        const sanction  = this._sanctions.find(s => s.id === request.sanctionId);
        const userName  = sanction ? this._userName(sanction.targetedUser) : "Unknown";
        const tc        = sanction ? SANCTION_TYPES[sanction.type] : null;
        const sc        = REQUEST_STATUSES[request.status] ?? { label: request.status, color: "#555" };

        const reviewBtns = request.status === "CREATED"
                ? el("div", { class: "mp-appeal-actions" },
                        (() => {
                            const b = el("button", { class: "mp-btn mp-btn-success mp-btn-sm" }, "✓ Approve & Revoke");
                            b.addEventListener("click", async () => {
                                b.disabled = true;
                                await this._reviewRequest(request.id, "ACCEPTED");
                                this._render();
                            });
                            return b;
                        })(),
                        (() => {
                            const b = el("button", { class: "mp-btn mp-btn-danger mp-btn-sm" }, "✕ Reject");
                            b.addEventListener("click", async () => {
                                b.disabled = true;
                                await this._reviewRequest(request.id, "REJECTED");
                                this._render();
                            });
                            return b;
                        })(),
                )
                : null;

        return el("div", { class: "mp-card", style: { padding: "0.75rem" } },
                el("div", { class: "mp-row-main", style: { alignItems: "flex-start", padding: "0" } },
                        avatar(userName, 32),
                        el("div", { class: "mp-row-meta" },
                                el("div", { class: "mp-row-name-line" },
                                        el("span", { class: "mp-row-username" }, userName),
                                        tc ? badge(`${tc.icon} ${tc.label}`, tc.color) : null,
                                        badge(sc.label, sc.color),
                                ),
                                el("div", { class: "mp-row-sub" }, `Requested ${fmtDate(request.requestAt)}`),
                                el("p", { class: "mp-appeal-msg", style: { marginTop: "0.5rem", marginBottom: "0" } },
                                        `"${request.message}"`),
                                sanction
                                        ? el("div", { class: "mp-row-sub", style: { marginTop: "0.35rem" } },
                                                `Original reason: `, el("em", {}, sanction.reason ?? "—"))
                                        : null,
                                ...(reviewBtns ? [reviewBtns] : []),
                        ),
                ),
        );
    }

    // ── Modal builders ─────────────────────────────────────────────────────────

    _openNewModal() {
        this._formData = { targetedUser: "", type: "BAN", expiresAt: "", reason: "" };
        this._modal = { type: "new" };
        this._renderModal();
    }

    _openEditModal(sanction) {
        this._formData = {
            targetedUser: sanction.targetedUser,
            type:         sanction.type,
            expiresAt:    sanction.expiresAt
                    ? new Date(sanction.expiresAt).toISOString().slice(0, 16)
                    : "",
            reason:       sanction.reason ?? "",
        };
        this._modal = { type: "edit", data: sanction };
        this._renderModal();
    }

    _openRevokeModal(sanction) {
        this._modal = { type: "revoke", data: sanction };
        this._renderModal();
    }

    _buildSanctionForm(isEdit) {
        const f = this._formData;

        // Type toggle buttons
        const typeBtns = el("div", { class: "mp-type-btns" },
                ...Object.entries(SANCTION_TYPES).map(([key, tc]) => {
                    const btn = el("button", { class: "mp-type-btn", type: "button" }, `${tc.icon} ${tc.label}`);
                    const applyStyle = () => {
                        const active = f.type === key;
                        btn.style.background = active ? tc.color : "var(--ter-bg-color, #202024)";
                        btn.style.color      = active ? "white" : "var(--pri-placeholder-color, #9ca3af)";
                        btn.style.border     = `1px solid ${active ? tc.color : "var(--pri-bd-color, #43434d)"}`;
                    };
                    applyStyle();
                    btn.addEventListener("click", () => {
                        f.type = key;
                        // re-style all siblings
                        btn.closest(".mp-type-btns").querySelectorAll(".mp-type-btn").forEach(b => {
                            const k = [...Object.keys(SANCTION_TYPES)][
                                    [...btn.closest(".mp-type-btns").children].indexOf(b)
                                    ];
                            const active = f.type === k;
                            const c = SANCTION_TYPES[k].color;
                            b.style.background = active ? c : "var(--ter-bg-color, #202024)";
                            b.style.color      = active ? "white" : "var(--pri-placeholder-color, #9ca3af)";
                            b.style.border     = `1px solid ${active ? c : "var(--pri-bd-color, #43434d)"}`;
                        });
                    });
                    return btn;
                })
        );

        const targetInput = el("input", {
            class: "mp-input", type: "text",
            placeholder: "User UUID",
            value: f.targetedUser,
        });
        targetInput.addEventListener("input", e => { f.targetedUser = e.target.value.trim(); });

        const expiresInput = el("input", {
            class: "mp-input", type: "datetime-local",
            value: f.expiresAt,
            style: { colorScheme: "dark" },
        });
        expiresInput.addEventListener("input", e => { f.expiresAt = e.target.value; });

        const reasonInput = el("textarea", {
            class: "mp-textarea", rows: "3",
            placeholder: "Describe why this sanction is being issued…",
        });
        reasonInput.value = f.reason;
        reasonInput.addEventListener("input", e => { f.reason = e.target.value; });

        return el("div", { class: "mp-modal-body" },
                el("div", { class: "mp-field" },
                        el("label", { class: "mp-label" }, "Target User"),
                        targetInput,
                ),
                el("div", { class: "mp-field" },
                        el("label", { class: "mp-label" }, "Sanction Type"),
                        typeBtns,
                ),
                el("div", { class: "mp-field" },
                        el("label", { class: "mp-label" },
                                "Expires At ",
                                el("span", { class: "mp-label-hint" }, "(leave blank for permanent)"),
                        ),
                        expiresInput,
                ),
                el("div", { class: "mp-field" },
                        el("label", { class: "mp-label" }, "Reason"),
                        reasonInput,
                ),
        );
    }

    _buildModal() {
        if (!this._modal) return null;

        const { type, data } = this._modal;
        const overlay = el("div", { class: "mp-overlay" });
        overlay.addEventListener("click", e => {
            if (e.target === overlay) this._closeModal();
        });

        let title, body, footer;

        if (type === "new" || type === "edit") {
            title  = type === "new" ? "Issue New Sanction" : "Edit Sanction";
            body   = this._buildSanctionForm(type === "edit");
            const saveBtn = el("button", { class: "mp-btn mp-btn-primary" },
                    type === "new" ? "Issue Sanction" : "Save Changes");
            saveBtn.addEventListener("click", async () => {
                saveBtn.disabled = true;
                const payload = { ...this._formData, expiresAt: this._formData.expiresAt || null };
                if (type === "new") await this._issueSanction(payload);
                else                await this._updateSanction(data.id, payload);
                this._closeModal();
                this._render();
            });
            footer = el("div", { class: "mp-modal-footer" },
                    el("button", { class: "mp-btn mp-btn-ghost", onclick: () => this._closeModal() }, "Cancel"),
                    saveBtn,
            );
        } else if (type === "revoke") {
            title = "Revoke Sanction";
            body  = el("p", { style: { color: "var(--pri-placeholder-color, #9ca3af)", lineHeight: "1.6" } },
                    `Are you sure you want to revoke the `,
                    el("strong", { style: { color: "var(--pri-text-color, #fff)" } }, SANCTION_TYPES[data.type]?.label ?? data.type),
                    ` on `,
                    el("strong", { style: { color: "var(--pri-text-color, #fff)" } }, this._userName(data.targetedUser)),
                    `? This action cannot be undone.`,
            );
            const confirmBtn = el("button", { class: "mp-btn mp-btn-danger" }, "Revoke");
            confirmBtn.addEventListener("click", async () => {
                confirmBtn.disabled = true;
                await this._revokeSanction(data.id);
                this._closeModal();
                this._render();
            });
            footer = el("div", { class: "mp-modal-footer" },
                    el("button", { class: "mp-btn mp-btn-ghost", onclick: () => this._closeModal() }, "Cancel"),
                    confirmBtn,
            );
        }

        const closeBtn = el("button", { class: "mp-btn mp-btn-ghost", style: { padding: "0.2rem 0.5rem" } }, "✕");
        closeBtn.addEventListener("click", () => this._closeModal());

        overlay.append(el("div", { class: "mp-modal" },
                el("div", { class: "mp-modal-header" },
                        el("span", { class: "mp-modal-title" }, title),
                        closeBtn,
                ),
                body,
                footer,
        ));

        return overlay;
    }

    _closeModal() {
        this._modal = null;
        this._shadow.querySelector(".mp-overlay")?.remove();
    }

    // ── Targeted re-renders ────────────────────────────────────────────────────

    /** Re-render only the list area (search/filter changes) */
    _renderList() {
        const listEl = this._shadow.querySelector(".mp-list-container");
        if (!listEl) { this._render(); return; }
        listEl.replaceWith(this._buildListContainer());

        // also re-sync filter buttons
        this._shadow.querySelectorAll(".mp-filter").forEach(btn => {
            // match by text isn't reliable; rely on data-key
            btn.classList.toggle("active", btn.dataset.key === this._filter);
        });
    }

    _buildListContainer() {
        const wrap = el("div", { class: "mp-list-container" });

        if (this._tab === "sanctions") {
            const items = this._filtered;
            if (items.length === 0) {
                wrap.append(el("div", { class: "mp-empty" },
                        el("div", { class: "mp-empty-icon" }, "🔍"),
                        el("div", { class: "mp-empty-title" }, "No sanctions found"),
                        el("div", { class: "mp-empty-sub" }, "Try adjusting your filters"),
                ));
            } else {
                wrap.append(el("div", { class: "mp-list" }, ...items.map(s => this._buildSanctionRow(s))));
            }
        } else {
            const reqs = this._requests;
            if (reqs.length === 0) {
                wrap.append(el("div", { class: "mp-empty" },
                        el("div", { class: "mp-empty-icon" }, "📭"),
                        el("div", { class: "mp-empty-title" }, "No revocation requests"),
                ));
            } else {
                wrap.append(el("div", { class: "mp-list" }, ...reqs.map(r => this._buildRequestCard(r))));
            }
        }
        return wrap;
    }

    _renderModal() {
        this._shadow.querySelector(".mp-overlay")?.remove();
        const m = this._buildModal();
        if (m) this._shadow.append(m);
    }

    // ── Full render ────────────────────────────────────────────────────────────

    _render() {
        this._shadow.innerHTML = "";

        // Styles
        const style = document.createElement("style");
        style.textContent = STYLES;
        this._shadow.append(style);

        // No server
        if (!this._serverId) {
            this._shadow.append(
                    el("div", { class: "mp-root" },
                            el("div", { class: "mp-no-server" },
                                    el("div", {},
                                            el("div", { style: { fontSize: "2rem", marginBottom: "0.5rem" } }, "🛡️"),
                                            el("div", { style: { fontWeight: 700 } }, "No server selected"),
                                            el("div", { style: { fontSize: "0.8rem", marginTop: "0.25rem" } }, "Set the server-id attribute to load moderation data."),
                                    ),
                            ),
                    ),
            );
            return;
        }

        // Loading
        if (this._loading) {
            this._shadow.append(
                    el("div", { class: "mp-root" },
                            el("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "0.75rem" } },
                                    el("div", { class: "mp-loading-spinner" }),
                                    el("span", { style: { color: "var(--pri-placeholder-color, #9ca3af)" } }, "Loading…"),
                            ),
                    ),
            );
            return;
        }

        // Header
        const issueBtn = el("button", { class: "mp-btn mp-btn-primary" }, "+ Issue Sanction");
        issueBtn.addEventListener("click", () => this._openNewModal());

        const header = el("div", { class: "mp-header" },
                el("div", {},
                        el("h1", {}, "🛡️ Moderation"),
                        el("div", { class: "mp-subtitle" }, "Server-wide sanction management"),
                ),
                issueBtn,
        );

        const inner = el("div", { class: "mp-inner" },
                header,
                this._buildStats(),
                this._buildTabs(),
                this._tab === "sanctions" ? this._buildToolbar() : null,
                this._buildListContainer(),
        );

        this._shadow.append(el("div", { class: "mp-root" }, inner));

        // Re-attach modal if one was open
        this._renderModal();
    }
}

customElements.define("revoice-moderation-panel", ModerationPanel);