(() => {
  "use strict";

  let bound = false;
  const safe = value => typeof escapeHtml === "function" ? escapeHtml(value) : String(value || "");
  const num = value => Number(value) || 0;
  const now = () => Date.now();
  const today = () => new Date().toLocaleDateString();
  const companyItems = list => (list || []).filter(item => !item.company || item.company === state.company);

  function migrate() {
    if (typeof state === "undefined") return;
    state.crewShifts ||= [];
    state.crewPhotos ||= [];
    state.safetyChecks ||= [];
    state.equipmentAssignments ||= [];
    state.crewRoster ||= [
      { id: "crew-kendall", name: "Kendall", role: "Project Manager", company: "Delamere Industries", active: true },
      { id: "crew-lead-1", name: "Crew Lead 1", role: "Crew Lead", company: "Delamere Industries", active: true },
      { id: "crew-member-1", name: "Crew Member 1", role: "Crew Member", company: "Delamere Industries", active: true },
      { id: "crew-member-2", name: "Crew Member 2", role: "Crew Member", company: "Delamere Industries", active: true }
    ];
    state.fieldReports ||= [];
    state.materialRequests ||= [];
    state.activityLog ||= [];
    localStorage.setItem(DBKEY, JSON.stringify(state));
  }

  function projects() {
    return companyItems(state.projects).filter(project => !["Completed", "Closed"].includes(project.status));
  }

  function activeShift() {
    return companyItems(state.crewShifts).find(shift => !shift.clockOut);
  }

  function activity(type, project, message) {
    state.activityLog ||= [];
    state.activityLog.unshift({ id: `activity-${now()}-${Math.random().toString(36).slice(2, 6)}`, company: state.company, type, project: project || "Company-wide", message, createdAt: now() });
  }

  function populateProjects() {
    const options = projects().map(project => `<option value="${safe(project.name)}">${safe(project.name)} — ${safe(project.location || "No location")}</option>`).join("");
    document.querySelectorAll("[data-crew-project-select]").forEach(select => {
      const selected = select.value;
      select.innerHTML = options || '<option value="">No active projects</option>';
      if ([...select.options].some(option => option.value === selected)) select.value = selected;
    });
  }

  function renderShift() {
    const shift = activeShift();
    const status = document.getElementById("crewClockStatus");
    const button = document.getElementById("crewClockButton");
    const projectSelect = document.getElementById("crewClockProject");
    if (!status || !button) return;
    if (shift) {
      const elapsed = Math.max(0, (now() - shift.clockIn) / 3600000);
      status.innerHTML = `<strong>Clocked in</strong><small>${safe(shift.project)} · ${new Date(shift.clockIn).toLocaleTimeString()} · ${elapsed.toFixed(1)} hrs</small>`;
      button.textContent = "Clock Out";
      button.classList.add("danger-button");
      if (projectSelect) { projectSelect.value = shift.project; projectSelect.disabled = true; }
    } else {
      status.innerHTML = `<strong>Not clocked in</strong><small>Select a project and start the workday.</small>`;
      button.textContent = "Clock In";
      button.classList.remove("danger-button");
      if (projectSelect) projectSelect.disabled = false;
    }
  }

  function renderAssignments() {
    const target = document.getElementById("crewAssignments");
    if (!target) return;
    const rows = projects();
    target.innerHTML = rows.length ? rows.map(project => {
      const reportCount = companyItems(state.fieldReports).filter(report => report.project === project.name && report.date === today()).length;
      return `<article class="crew-job-card">
        <div><span class="badge">${safe(project.status || "Active")}</span><h3>${safe(project.name)}</h3><p>${safe(project.location || "No address entered")}</p></div>
        <div class="crew-job-details"><small>PM: ${safe(project.pm || "Unassigned")}</small><small>Lead: ${safe(project.crewLead || "Unassigned")}</small><small>${reportCount ? "Daily report submitted" : "Daily report pending"}</small></div>
        <div class="entity-actions"><button class="small" type="button" data-crew-report-project="${safe(project.name)}">Daily Report</button><button class="small secondary" type="button" data-crew-photo-project="${safe(project.name)}">Add Photo</button><button class="small secondary" type="button" data-crew-material-project="${safe(project.name)}">Request Material</button>${project.location ? `<button class="small secondary" type="button" data-crew-navigate="${safe(project.location)}">Navigate</button>` : ""}</div>
      </article>`;
    }).join("") : '<div class="empty">No active projects are assigned to this workspace.</div>';
  }

  function renderMetrics() {
    const reports = companyItems(state.fieldReports);
    const todayReports = reports.filter(report => report.date === today());
    const installed = todayReports.reduce((sum, report) => sum + num(report.installed), 0);
    const photos = companyItems(state.crewPhotos).filter(photo => photo.date === today()).length;
    const openRequests = companyItems(state.materialRequests).filter(request => !["Fulfilled", "Closed"].includes(request.status)).length;
    const set = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
    set("crewMetricJobs", projects().length);
    set("crewMetricInstalled", `${installed} LF`);
    set("crewMetricPhotos", photos);
    set("crewMetricRequests", openRequests);
  }

  function renderReports() {
    const target = document.getElementById("crewRecentReports");
    if (!target) return;
    const reports = companyItems(state.fieldReports).slice().sort((a, b) => num(b.createdAt) - num(a.createdAt)).slice(0, 8);
    target.innerHTML = reports.length ? reports.map(report => `<div class="list-row"><div><strong>${safe(report.project)}</strong><small>${safe(report.date)} · ${num(report.crewCount || 0)} crew · ${num(report.hours || 0)} hrs<br>${safe(report.notes || "No notes")}</small></div><span class="badge green">${num(report.installed)} LF</span></div>`).join("") : '<div class="empty">No crew reports have been submitted.</div>';
  }

  function renderPhotos() {
    const target = document.getElementById("crewPhotoTimeline");
    if (!target) return;
    const photos = companyItems(state.crewPhotos).slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 12);
    target.innerHTML = photos.length ? photos.map(photo => `<article class="crew-photo-card">${photo.dataUrl ? `<img src="${photo.dataUrl}" alt="${safe(photo.caption || "Project photo")}">` : '<div class="crew-photo-placeholder">Photo record</div>'}<div><span class="badge">${safe(photo.category)}</span><strong>${safe(photo.project)}</strong><p>${safe(photo.caption || "No caption")}</p><small>${new Date(photo.createdAt).toLocaleString()}</small></div></article>`).join("") : '<div class="empty">No project photos have been added.</div>';
  }

  function renderSafety() {
    const target = document.getElementById("crewSafetyStatus");
    if (!target) return;
    const checks = companyItems(state.safetyChecks).filter(check => check.date === today());
    target.innerHTML = checks.length ? checks.slice(0, 6).map(check => `<div class="list-row"><div><strong>${safe(check.project)}</strong><small>${safe(check.completedBy)} · ${safe(check.notes || "Checklist complete")}</small></div><span class="badge ${check.incident ? "red" : "green"}">${check.incident ? "Issue" : "Complete"}</span></div>`).join("") : '<div class="empty">No safety checklist has been submitted today.</div>';
  }

  function renderEquipment() {
    const target = document.getElementById("crewEquipmentList");
    if (!target) return;
    const equipment = companyItems(state.equipmentAssignments).slice().sort((a, b) => b.createdAt - a.createdAt);
    target.innerHTML = equipment.length ? equipment.map(item => `<div class="list-row"><div><strong>${safe(item.equipment)}</strong><small>${safe(item.project)} · ${safe(item.assignedTo)}</small></div><button type="button" class="small ${item.checkedIn ? "secondary" : ""}" data-equipment-toggle="${safe(item.id)}">${item.checkedIn ? "Check Out" : "Check In"}</button></div>`).join("") : '<div class="empty">No equipment is currently assigned.</div>';
  }

  function render() {
    if (typeof state === "undefined") return;
    populateProjects();
    renderShift();
    renderAssignments();
    renderMetrics();
    renderReports();
    renderPhotos();
    renderSafety();
    renderEquipment();
  }

  function openDialog(id, project = "") {
    populateProjects();
    const dialog = document.getElementById(id);
    const select = dialog?.querySelector("[data-crew-project-select]");
    if (select && project) select.value = project;
    dialog?.showModal();
  }

  function closeDialogs() {
    document.querySelectorAll("dialog[open]").forEach(dialog => dialog.close());
  }

  function clockToggle() {
    const shift = activeShift();
    if (shift) {
      shift.clockOut = now();
      shift.hours = Math.round(((shift.clockOut - shift.clockIn) / 3600000) * 100) / 100;
      activity("Crew Update", shift.project, `Crew clocked out after ${shift.hours.toFixed(2)} hours.`);
    } else {
      const project = document.getElementById("crewClockProject")?.value;
      if (!project) return alert("Select an active project first.");
      state.crewShifts.unshift({ id: uid(), company: state.company, project, crewLead: window.atlasCurrentUser?.displayName || "Crew Lead", clockIn: now(), clockOut: null, date: today() });
      activity("Crew Update", project, "Crew clocked in and started the workday.");
    }
    persist();
  }

  function submitReport(event) {
    event.preventDefault();
    const project = document.getElementById("crewReportProject").value;
    const installed = num(document.getElementById("crewReportInstalled").value);
    const report = {
      id: uid(), company: state.company, project, date: today(), createdAt: now(),
      crewLead: document.getElementById("crewReportLead").value || window.atlasCurrentUser?.displayName || "Crew Lead",
      crewCount: num(document.getElementById("crewReportCount").value),
      hours: num(document.getElementById("crewReportHours").value),
      installed,
      materialsUsed: document.getElementById("crewReportMaterials").value.trim(),
      equipmentUsed: document.getElementById("crewReportEquipment").value.trim(),
      delays: document.getElementById("crewReportDelays").value.trim(),
      notes: document.getElementById("crewReportNotes").value.trim()
    };
    state.fieldReports.unshift(report);
    const projectRecord = state.projects.find(item => item.company === state.company && item.name === project);
    if (projectRecord && installed > 0) { projectRecord.status = ["Estimating", "Awarded", "Engineering", "Scheduling", "Materials Ordered"].includes(projectRecord.status) ? "In Production" : projectRecord.status; projectRecord.updatedAt = now(); }
    activity("Crew Report", project, `Daily report submitted: ${installed} LF installed by a ${report.crewCount}-person crew.`);
    event.target.reset(); closeDialogs(); persist();
  }

  function submitMaterial(event) {
    event.preventDefault();
    const project = document.getElementById("crewMaterialProject").value;
    const items = document.getElementById("crewMaterialItems").value.trim();
    state.materialRequests.unshift({ id: uid(), company: state.company, project, items, requester: window.atlasCurrentUser?.displayName || "Field Crew", notes: document.getElementById("crewMaterialNotes").value.trim(), urgency: document.getElementById("crewMaterialUrgency").value, status: "Submitted", date: today(), createdAt: now(), approvalStatus: "Pending PM Review", purchasingStatus: "Not Ordered" });
    activity("Material Update", project, `New ${document.getElementById("crewMaterialUrgency").value.toLowerCase()} material request: ${items}.`);
    event.target.reset(); closeDialogs(); persist();
  }

  function submitSafety(event) {
    event.preventDefault();
    const project = document.getElementById("crewSafetyProject").value;
    const incident = document.getElementById("crewSafetyIncident").checked;
    const required = ["crewSafetyPPE", "crewSafetyBriefing", "crewSafetyArea", "crewSafetyTools"];
    if (!required.every(id => document.getElementById(id).checked)) return alert("Complete every required safety confirmation.");
    state.safetyChecks.unshift({ id: uid(), company: state.company, project, date: today(), createdAt: now(), completedBy: window.atlasCurrentUser?.displayName || "Crew Lead", incident, notes: document.getElementById("crewSafetyNotes").value.trim() });
    activity("Safety Update", project, incident ? "Safety checklist submitted with an issue requiring review." : "Daily safety checklist completed.");
    event.target.reset(); closeDialogs(); persist();
  }

  function submitEquipment(event) {
    event.preventDefault();
    const project = document.getElementById("crewEquipmentProject").value;
    const equipment = document.getElementById("crewEquipmentName").value.trim();
    state.equipmentAssignments.unshift({ id: uid(), company: state.company, project, equipment, assignedTo: document.getElementById("crewEquipmentAssignedTo").value.trim() || "Crew Lead", condition: document.getElementById("crewEquipmentCondition").value, checkedIn: false, createdAt: now() });
    activity("Equipment Update", project, `${equipment} checked out to the field crew.`);
    event.target.reset(); closeDialogs(); persist();
  }

  function submitPhoto(event) {
    event.preventDefault();
    const file = document.getElementById("crewPhotoFile").files[0];
    if (!file) return alert("Choose a photo first.");
    if (!file.type.startsWith("image/")) return alert("Choose an image file.");
    if (file.size > 2 * 1024 * 1024) return alert("For offline demo storage, use a photo smaller than 2 MB.");
    const project = document.getElementById("crewPhotoProject").value;
    const category = document.getElementById("crewPhotoCategory").value;
    const caption = document.getElementById("crewPhotoCaption").value.trim();
    const reader = new FileReader();
    reader.onload = () => {
      state.crewPhotos.unshift({ id: uid(), company: state.company, project, category, caption, filename: file.name, dataUrl: reader.result, date: today(), createdAt: now(), uploadedBy: window.atlasCurrentUser?.displayName || "Field Crew" });
      activity("Photo Upload", project, `${category} photo uploaded${caption ? `: ${caption}` : "."}`);
      event.target.reset(); closeDialogs(); persist();
    };
    reader.onerror = () => alert("Atlas could not read that photo.");
    reader.readAsDataURL(file);
  }

  function handleClicks(event) {
    const report = event.target.closest("[data-crew-report-project]"); if (report) return openDialog("crewReportDialog", report.dataset.crewReportProject);
    const photo = event.target.closest("[data-crew-photo-project]"); if (photo) return openDialog("crewPhotoDialog", photo.dataset.crewPhotoProject);
    const material = event.target.closest("[data-crew-material-project]"); if (material) return openDialog("crewMaterialDialog", material.dataset.crewMaterialProject);
    const nav = event.target.closest("[data-crew-navigate]"); if (nav) return window.AtlasTravel?.openGoogleMaps(nav.dataset.crewNavigate);
    const equipment = event.target.closest("[data-equipment-toggle]");
    if (equipment) {
      const item = state.equipmentAssignments.find(row => String(row.id) === equipment.dataset.equipmentToggle);
      if (!item) return;
      item.checkedIn = !item.checkedIn; item.updatedAt = now();
      activity("Equipment Update", item.project, `${item.equipment} ${item.checkedIn ? "checked in" : "checked out"}.`); persist();
    }
  }

  function bind() {
    if (bound) return;
    bound = true;
    document.getElementById("crewClockButton")?.addEventListener("click", clockToggle);
    document.getElementById("openCrewReport")?.addEventListener("click", () => openDialog("crewReportDialog"));
    document.getElementById("openCrewPhoto")?.addEventListener("click", () => openDialog("crewPhotoDialog"));
    document.getElementById("openCrewMaterial")?.addEventListener("click", () => openDialog("crewMaterialDialog"));
    document.getElementById("openCrewSafety")?.addEventListener("click", () => openDialog("crewSafetyDialog"));
    document.getElementById("openCrewEquipment")?.addEventListener("click", () => openDialog("crewEquipmentDialog"));
    document.querySelectorAll("[data-close-crew-dialog]").forEach(button => button.addEventListener("click", closeDialogs));
    document.getElementById("crewReportForm")?.addEventListener("submit", submitReport);
    document.getElementById("crewMaterialForm")?.addEventListener("submit", submitMaterial);
    document.getElementById("crewSafetyForm")?.addEventListener("submit", submitSafety);
    document.getElementById("crewEquipmentForm")?.addEventListener("submit", submitEquipment);
    document.getElementById("crewPhotoForm")?.addEventListener("submit", submitPhoto);
    document.getElementById("crew")?.addEventListener("click", handleClicks);
  }

  window.AtlasCrewOperations = { migrate, bind, render };
})();
