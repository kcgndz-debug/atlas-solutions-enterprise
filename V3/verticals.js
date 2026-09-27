(() => {
  "use strict";

  const verticals = {
    construction: {
      key: "construction",
      productName: "Atlas Enterprise",
      subtitle: "Fence & Railing Operating System",
      demoCompanyId: "delamere",
      demoCompanyName: "Delamere Industries",
      storageKey: "atlas_v4_demo_state",
      terminology: {
        project: "Project",
        projects: "Projects",
        crew: "Crew",
        crews: "Crews",
        field: "Field Operations",
        materials: "Material Requests"
      }
    },
    marine: {
      key: "marine",
      productName: "Atlas Marine",
      subtitle: "Yacht Manufacturing Operating System",
      environmentLabel: "BERTRAM DEMONSTRATION ENVIRONMENT",
      demoCompanyId: "bertram-demo",
      demoCompanyName: "Bertram Demonstration Environment",
      storageKey: "atlas_marine_bertram_demo_state",
      terminology: {
        project: "Hull",
        projects: "Hull Registry",
        crew: "Production Team",
        crews: "Production Teams",
        field: "Work Packages",
        materials: "Materials & Purchasing"
      },
      navigation: {
        dashboard: "Command Center",
        executive: "Executive Overview",
        mission: "Production Control",
        projects: "Hull Registry",
        estimates: "Build Planning",
        schedule: "Production Schedule",
        crews: "Production Teams",
        field: "Work Packages",
        materials: "Materials & Purchasing",
        finance: "Build Cost",
        users: "User Management",
        athena: "Athena",
        settings: "Settings"
      }
    }
  };

  function current() {
    const key = window.ATLAS_CONFIG?.vertical || "construction";
    return verticals[key] || verticals.construction;
  }

  window.ATLAS_VERTICALS = verticals;
  window.AtlasVertical = { current };
})();