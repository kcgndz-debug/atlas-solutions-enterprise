(() => {
  "use strict";
  const KEY = "atlas_enterprise_v3_demo_users";
  const defaults = [
    { id:"u-owner", name:"Kendall", email:"owner@atlas.demo", role:"platform-owner", company:"All Companies", status:"Active" },
    { id:"u-pm", name:"Project Manager", email:"pm@delamere.demo", role:"project-manager", company:"Delamere Industries", status:"Active" },
    { id:"u-crew", name:"Crew Lead", email:"crew@delamere.demo", role:"crew-lead", company:"Delamere Industries", status:"Active" },
    { id:"u-fin", name:"Finance User", email:"finance@delamere.demo", role:"finance", company:"Delamere Industries", status:"Active" }
  ];
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || defaults; } catch { return defaults; } };
  const save = users => localStorage.setItem(KEY, JSON.stringify(users));
  const esc = value => String(value || "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

  function renderMatrix() {
    const body = document.getElementById("roleMatrixBody");
    if (!body || !window.AtlasPermissions) return;
    const primary = {"platform-owner":"All modules","company-owner":"Executive dashboard","company-admin":"Dashboard","operations-manager":"Mission Control",finance:"Finance / Dashboard",estimator:"Estimator","project-manager":"Assigned Projects","crew-lead":"Crew Operations","crew-member":"My Jobs",customer:"Customer Projects"};
    body.innerHTML = Object.entries(AtlasPermissions.ROLE_LABELS).map(([role,label]) => `<tr><td><strong>${esc(label)}</strong></td><td>${esc(primary[role])}</td><td>${["platform-owner","company-owner","company-admin","operations-manager","finance"].includes(role)?"All company projects":"Assigned projects only"}</td><td>${AtlasPermissions.PERMISSIONS?.[role]?.includes("users.manage") || ["platform-owner","company-owner","company-admin"].includes(role)?"User management":"No"}</td></tr>`).join("");
  }

  function renderUsers() {
    const list = document.getElementById("atlasUserList");
    if (!list) return;
    const users = load();
    list.innerHTML = users.map(user => `<div class="user-access-row"><div><strong>${esc(user.name)}</strong><small>${esc(user.email)}</small></div><span>${esc(AtlasPermissions.ROLE_LABELS[user.role] || user.role)}</span><span>${esc(user.company)}</span><span class="status-pill">${esc(user.status)}</span></div>`).join("") || '<div class="empty">No users configured.</div>';
  }

  function renderSummary() {
    const el = document.getElementById("permissionSummary");
    const ctx = window.atlasAccessContext;
    if (!el || !ctx) return;
    el.innerHTML = `<strong>Signed in as ${esc(ctx.roleLabel)}</strong><span>${esc(ctx.companyName)}</span><span>${ctx.permissions.includes("*") ? "Full platform access" : `${ctx.permissions.length} permissions assigned`}</span>`;
  }

  function addDemoUser() {
    if (!AtlasPermissions.can("users.manage")) return alert("Your role cannot manage users.");
    const name = prompt("User name"); if (!name) return;
    const email = prompt("Email address") || "";
    const role = prompt("Role: company-owner, company-admin, operations-manager, finance, estimator, project-manager, crew-lead, crew-member, customer", "project-manager") || "project-manager";
    const users = load();
    users.unshift({ id:`u-${Date.now()}`, name, email, role, company:window.atlasAccessContext?.companyName || "Delamere Industries", status:"Active" });
    save(users); renderUsers();
  }

  function render() { renderMatrix(); renderUsers(); renderSummary(); }
  window.addEventListener("atlas:permissions-ready", render);
  document.addEventListener("DOMContentLoaded", () => document.getElementById("addDemoUser")?.addEventListener("click", addDemoUser));
  window.AtlasUserManagement = { render };
})();
