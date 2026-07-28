(() => {
  "use strict";

  let bound = false;

  const statuses = ["Estimating", "Awarded", "Engineering", "Scheduling", "Materials Ordered", "In Production", "Installed", "Punch List", "Completed", "Closed"];
  const openStatuses = new Set(statuses.slice(0, -2));

  const number = value => Number(value) || 0;
  const todayKey = () => new Date().toLocaleDateString();
  const safe = value => typeof escapeHtml === "function" ? escapeHtml(value) : String(value || "");
  const currency = value => typeof money === "function" ? money(value) : `$${number(value).toFixed(2)}`;

  function migrate() {
    if (typeof state === "undefined") return;
    state.activityLog ||= [];
    state.projects ||= [];
    state.projects.forEach((project, index) => {
      project.status ||= "Awarded";
      project.contractValue = number(project.contractValue || project.value || 0);
      project.pm ||= index % 2 ? "Kendall" : "Unassigned";
      project.crewLead ||= "Unassigned";
      project.progress = Math.max(0, Math.min(100, number(project.progress)));
      project.updatedAt ||= Date.now() - index * 3600000;
    });
    if (!state.activityLog.length) {
      state.activityLog.push(
        { id: `activity-${Date.now()}-1`, company: state.company, type: "System", project: "Atlas", message: "Mission Control enabled for this workspace.", createdAt: Date.now() },
        { id: `activity-${Date.now()}-2`, company: state.company, type: "Project Update", project: state.projects[0]?.name || "Project", message: "Project workflow is ready for PM and crew assignment.", createdAt: Date.now() - 900000 }
      );
      localStorage.setItem(DBKEY, JSON.stringify(state));
    }
  }

  function projectHealth(project) {
    const urgentMaterial = (state.materialRequests || []).some(req => req.company === state.company && req.project === project.name && req.urgency === "Urgent" && !["Fulfilled", "Closed"].includes(req.status));
    const reports = (state.fieldReports || []).filter(rep => rep.company === state.company && rep.project === project.name);
    const lacksNextAction = !String(project.next || "").trim();
    const status = project.status || "Awarded";
    let score = 0;
    const reasons = [];
    if (urgentMaterial) { score += 2; reasons.push("urgent material request"); }
    if (lacksNextAction && openStatuses.has(status)) { score += 1; reasons.push("no next action"); }
    if (["In Production", "Installed", "Punch List"].includes(status) && !reports.length) { score += 1; reasons.push("no field report"); }
    if (number(project.progress) < 25 && ["In Production", "Installed"].includes(status)) { score += 1; reasons.push("low reported progress"); }
    if (score >= 3) return { level: "Critical", className: "red", reasons };
    if (score >= 1) return { level: "At Risk", className: "amber", reasons };
    return { level: "Healthy", className: "green", reasons: ["workflow on track"] };
  }

  function companyProjects() {
    return (state.projects || []).filter(project => !project.company || project.company === state.company);
  }

  function renderProjectHealth(projects) {
    const target = document.getElementById("missionProjectHealth");
    if (!target) return;
    target.innerHTML = projects.length ? projects.map(project => {
      const health = projectHealth(project);
      const index = Math.max(0, statuses.indexOf(project.status));
      const nextStatus = statuses[Math.min(statuses.length - 1, index + 1)];
      return `<article class="mission-project-row">
        <div class="mission-project-main"><strong>${safe(project.name)}</strong><small>${safe(project.pm || "Unassigned PM")} · ${safe(project.crewLead || "Unassigned Crew Lead")}</small></div>
        <div class="mission-project-progress"><span style="width:${number(project.progress)}%"></span></div>
        <div class="mission-project-meta"><span class="badge ${health.className}">${health.level}</span><small>${safe(project.status)} · ${number(project.progress)}%</small></div>
        <button type="button" class="small secondary" data-mission-advance="${safe(project.id)}" ${project.status === "Closed" ? "disabled" : ""}>${project.status === "Closed" ? "Closed" : `Advance to ${safe(nextStatus)}`}</button>
      </article>`;
    }).join("") : '<div class="empty">No project records for this company.</div>';
  }

  function renderActivity() {
    const target = document.getElementById("missionActivity");
    if (!target) return;
    const entries = (state.activityLog || []).filter(item => !item.company || item.company === state.company).sort((a, b) => b.createdAt - a.createdAt).slice(0, 12);
    target.innerHTML = entries.length ? entries.map(item => `<div class="mission-activity-row"><span class="mission-activity-dot"></span><div><strong>${safe(item.type)}</strong><p>${safe(item.message)}</p><small>${safe(item.project || "Company-wide")} · ${new Date(item.createdAt).toLocaleString()}</small></div></div>`).join("") : '<div class="empty">No activity has been logged.</div>';
  }

  function renderWorkload(projects) {
    const target = document.getElementById("missionWorkload");
    if (!target) return;
    const summary = projects.filter(p => openStatuses.has(p.status)).reduce((map, project) => {
      const pm = project.pm || "Unassigned";
      map[pm] ||= { count: 0, value: 0, risk: 0 };
      map[pm].count += 1;
      map[pm].value += number(project.contractValue);
      if (projectHealth(project).level !== "Healthy") map[pm].risk += 1;
      return map;
    }, {});
    const rows = Object.entries(summary).sort((a, b) => b[1].value - a[1].value);
    target.innerHTML = rows.length ? rows.map(([pm, data]) => `<div class="list-row"><div><strong>${safe(pm)}</strong><small>${data.count} active project${data.count === 1 ? "" : "s"} · ${data.risk} at risk</small></div><strong>${currency(data.value)}</strong></div>`).join("") : '<div class="empty">No active PM assignments.</div>';
  }

  function renderActions(projects) {
    const target = document.getElementById("missionActions");
    if (!target) return;
    const actions = [];
    projects.forEach(project => {
      const health = projectHealth(project);
      if (health.level !== "Healthy") actions.push({ title: project.name, detail: health.reasons.join(", "), severity: health.className });
      if (!project.pm || project.pm === "Unassigned") actions.push({ title: project.name, detail: "Assign a project manager", severity: "amber" });
      if (["Scheduling", "Materials Ordered", "In Production"].includes(project.status) && (!project.crewLead || project.crewLead === "Unassigned")) actions.push({ title: project.name, detail: "Assign a crew lead", severity: "amber" });
    });
    (state.materialRequests || []).filter(req => req.company === state.company && req.urgency === "Urgent" && !["Fulfilled", "Closed"].includes(req.status)).forEach(req => actions.push({ title: req.project, detail: `Urgent material request: ${req.items}`, severity: "red" }));
    target.innerHTML = actions.length ? actions.slice(0, 10).map(action => `<div class="list-row"><div><strong>${safe(action.title)}</strong><small>${safe(action.detail)}</small></div><span class="badge ${action.severity}">${action.severity === "red" ? "Urgent" : "Review"}</span></div>`).join("") : '<div class="empty">No immediate actions. Operations are clear.</div>';
  }

  function render() {
    if (typeof state === "undefined") return;
    const projects = companyProjects();
    const health = projects.map(projectHealth);
    const backlog = projects.filter(p => openStatuses.has(p.status)).reduce((sum, p) => sum + number(p.contractValue), 0);
    const todayReports = (state.fieldReports || []).filter(rep => rep.company === state.company && rep.date === todayKey()).length;
    const set = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
    set("mcBacklog", currency(backlog));
    set("mcHealthy", health.filter(item => item.level === "Healthy").length);
    set("mcAtRisk", health.filter(item => item.level !== "Healthy").length);
    set("mcCrews", todayReports);
    renderProjectHealth(projects);
    renderActivity();
    renderWorkload(projects);
    renderActions(projects);
    populateProjectSelect(projects);
  }

  function populateProjectSelect(projects = companyProjects()) {
    const select = document.getElementById("missionActivityProject");
    if (!select) return;
    select.innerHTML = '<option value="Company-wide">Company-wide</option>' + projects.map(project => `<option>${safe(project.name)}</option>`).join("");
  }

  function openDialog() {
    const dialog = document.getElementById("missionActivityDialog");
    populateProjectSelect();
    document.getElementById("missionActivityMessage").value = "";
    dialog?.showModal();
  }

  function closeDialog() {
    document.getElementById("missionActivityDialog")?.close();
  }

  function advanceProject(id) {
    const project = (state.projects || []).find(item => String(item.id) === String(id));
    if (!project) return;
    const current = Math.max(0, statuses.indexOf(project.status));
    const next = statuses[Math.min(statuses.length - 1, current + 1)];
    if (next === project.status) return;
    project.status = next;
    project.progress = Math.max(number(project.progress), Math.round((statuses.indexOf(next) / (statuses.length - 1)) * 100));
    project.updatedAt = Date.now();
    state.activityLog.unshift({ id: `activity-${Date.now()}`, company: state.company, type: "Workflow", project: project.name, message: `${project.name} advanced to ${next}.`, createdAt: Date.now() });
    persist();
  }

  function bind() {
    if (bound) return;
    bound = true;
    document.getElementById("addMissionActivity")?.addEventListener("click", openDialog);
    document.getElementById("refreshMission")?.addEventListener("click", render);
    document.querySelectorAll("[data-close-mission-dialog]").forEach(button => button.addEventListener("click", closeDialog));
    document.getElementById("missionActivityForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const message = document.getElementById("missionActivityMessage")?.value.trim();
      if (!message) return;
      state.activityLog.unshift({
        id: `activity-${Date.now()}`,
        company: state.company,
        type: document.getElementById("missionActivityType")?.value || "Project Update",
        project: document.getElementById("missionActivityProject")?.value || "Company-wide",
        message,
        createdAt: Date.now()
      });
      closeDialog();
      persist();
    });
    document.getElementById("missionProjectHealth")?.addEventListener("click", event => {
      const button = event.target.closest("[data-mission-advance]");
      if (button) advanceProject(button.dataset.missionAdvance);
    });
  }

  window.AtlasMissionControl = { migrate, bind, render, projectHealth };
})();
