(() => {
  "use strict";

  const ROLE_ALIASES = {
    owner: "company-owner",
    admin: "company-admin",
    operations: "operations-manager",
    ops: "operations-manager",
    finance_manager: "finance",
    project_manager: "project-manager",
    pm: "project-manager",
    crew_leader: "crew-lead",
    field_lead: "crew-lead",
    field: "crew-member",
    client: "customer"
  };

  const ROLE_LABELS = {
    "platform-owner": "Platform Owner",
    "company-owner": "Company Owner",
    "company-admin": "Company Admin",
    "operations-manager": "Operations Manager",
    finance: "Finance",
    estimator: "Estimator",
    "project-manager": "Project Manager",
    "crew-lead": "Crew Lead",
    "crew-member": "Crew Member",
    customer: "Customer"
  };

  const PERMISSIONS = {
    "platform-owner": ["*"],
    "company-owner": ["dashboard.view","mission.view","crew.view","estimator.view","projects.view.all","customers.view","materials.view","documents.view","field.view","settings.view","users.manage","companies.switch","finance.view","reports.view","records.edit","records.delete"],
    "company-admin": ["dashboard.view","mission.view","crew.view","estimator.view","projects.view.all","customers.view","materials.view","documents.view","field.view","settings.view","users.manage","records.edit","records.delete"],
    "operations-manager": ["dashboard.view","mission.view","crew.view","projects.view.all","customers.view","materials.view","documents.view","field.view","records.edit"],
    finance: ["dashboard.view","mission.view","projects.view.all","customers.view","documents.view","finance.view","reports.view"],
    estimator: ["dashboard.view","estimator.view","projects.view.assigned","customers.view","documents.view","records.edit"],
    "project-manager": ["dashboard.view","mission.view","crew.view","estimator.view","projects.view.assigned","customers.view","materials.view","documents.view","field.view","records.edit"],
    "crew-lead": ["dashboard.view","crew.view","projects.view.assigned","materials.view","documents.view","field.view","records.edit"],
    "crew-member": ["crew.view","projects.view.assigned","materials.view","field.view"],
    customer: ["projects.view.assigned","documents.view"]
  };

  const VIEW_PERMISSIONS = {
    dashboard: "dashboard.view",
    mission: "mission.view",
    crew: "crew.view",
    estimator: "estimator.view",
    projects: ["projects.view.all", "projects.view.assigned"],
    customers: "customers.view",
    materials: "materials.view",
    documents: "documents.view",
    field: "field.view",
    settings: "settings.view",
    users: "users.manage"
  };

  const DEFAULT_VIEW = {
    "platform-owner": "dashboard",
    "company-owner": "dashboard",
    "company-admin": "dashboard",
    "operations-manager": "mission",
    finance: "dashboard",
    estimator: "estimator",
    "project-manager": "projects",
    "crew-lead": "crew",
    "crew-member": "crew",
    customer: "projects"
  };

  function slug(value) {
    return String(value || "").trim().toLowerCase().replace(/[_\s]+/g, "-");
  }

  function resolveRole(profile = {}) {
    if (profile.is_platform_owner) return "platform-owner";
    const prefs = profile.preferences || {};
    const raw = prefs.role || profile.role || profile.job_title || "crew-member";
    const normalized = slug(raw);
    return ROLE_ALIASES[normalized] || normalized;
  }

  function buildContext(user = {}) {
    const profile = user.profile || {};
    const prefs = profile.preferences || {};
    const role = user.isPlatformOwner ? "platform-owner" : resolveRole(profile);
    return {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role,
      roleLabel: ROLE_LABELS[role] || role,
      companyId: prefs.company_id || profile.company_id || null,
      companyName: prefs.company_name || profile.company_name || "Delamere Industries",
      assignedProjectIds: Array.isArray(prefs.assigned_project_ids) ? prefs.assigned_project_ids : [],
      permissions: PERMISSIONS[role] || []
    };
  }

  function can(permission) {
    const ctx = window.atlasAccessContext;
    if (!ctx) return false;
    const checks = Array.isArray(permission) ? permission : [permission];
    return ctx.permissions.includes("*") || checks.some(item => ctx.permissions.includes(item));
  }

  function canView(view) {
    return can(VIEW_PERMISSIONS[view] || `${view}.view`);
  }

  function firstAllowedView() {
    const role = window.atlasAccessContext?.role || "crew-member";
    const preferred = DEFAULT_VIEW[role];
    if (preferred && canView(preferred)) return preferred;
    return Object.keys(VIEW_PERMISSIONS).find(canView) || null;
  }

  function applyNavigation() {
    document.querySelectorAll(".nav[data-view]").forEach(button => {
      const allowed = canView(button.dataset.view);
      button.hidden = !allowed;
      button.setAttribute("aria-hidden", String(!allowed));
      button.disabled = !allowed;
    });

    document.querySelectorAll("[data-view-target]").forEach(button => {
      button.hidden = !canView(button.dataset.viewTarget);
    });

    document.querySelectorAll("[data-permission]").forEach(element => {
      const allowed = can(element.dataset.permission.split(",").map(v => v.trim()));
      element.hidden = !allowed;
      if ("disabled" in element) element.disabled = !allowed;
    });

    const companySelect = document.getElementById("companySelect");
    if (companySelect) {
      companySelect.disabled = !can("companies.switch");
      if (!can("companies.switch") && window.atlasAccessContext?.companyName) {
        [...companySelect.options].forEach(option => {
          option.hidden = option.value !== window.atlasAccessContext.companyName;
        });
        if ([...companySelect.options].some(o => o.value === window.atlasAccessContext.companyName)) {
          companySelect.value = window.atlasAccessContext.companyName;
        }
      }
    }
  }

  function protectView(requestedView) {
    if (canView(requestedView)) return requestedView;
    const fallback = firstAllowedView();
    window.dispatchEvent(new CustomEvent("atlas:access-denied", { detail: { requestedView, fallback } }));
    return fallback;
  }

  function filterProjects(projects = []) {
    const ctx = window.atlasAccessContext;
    if (!ctx || can("projects.view.all")) return projects;
    const ids = new Set(ctx.assignedProjectIds || []);
    return projects.filter(project => {
      if (ids.has(project.id)) return true;
      if (project.assignedUserId === ctx.userId || project.pmUserId === ctx.userId || project.crewLeadUserId === ctx.userId) return true;
      if (Array.isArray(project.assignedUserIds) && project.assignedUserIds.includes(ctx.userId)) return true;
      return false;
    });
  }

  function applyUser(user) {
    window.atlasAccessContext = buildContext(user);
    document.documentElement.dataset.atlasRole = window.atlasAccessContext.role;
    document.documentElement.dataset.atlasCompany = window.atlasAccessContext.companyId || "";
    applyNavigation();

    const workspace = document.getElementById("atlasCurrentWorkspace");
    if (workspace) workspace.textContent = `${window.atlasAccessContext.companyName} · ${window.atlasAccessContext.roleLabel}`;

    window.dispatchEvent(new CustomEvent("atlas:permissions-ready", { detail: window.atlasAccessContext }));
  }

  window.addEventListener("atlas:user-ready", event => applyUser(event.detail));

  window.AtlasPermissions = {
    ROLE_LABELS,
    PERMISSIONS,
    VIEW_PERMISSIONS,
    resolveRole,
    buildContext,
    can,
    canView,
    firstAllowedView,
    protectView,
    filterProjects,
    applyNavigation,
    applyUser
  };
})();
