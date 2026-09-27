(() => {
  "use strict";

  const marine = {
    key: "marine",

    demoSeed({ iso, startOfWeek }) {
      const companyId = "bertram-demo";
      const today = new Date();
      const datePlus = days => {
        const d = new Date(today);
        d.setDate(d.getDate() + days);
        return iso(d);
      };

      const companies = [
        { id: companyId, name: "Bertram Demonstration Environment" }
      ];

      const users = [
        { id:"bertram-exec", firstName:"Bertram", lastName:"Executive", name:"Bertram Executive", email:"executive@bertram.demo", role:"owner", companyId, status:"Active" },
        { id:"prod-mgr-1", firstName:"Maria", lastName:"Santos", name:"Maria Santos", email:"maria@bertram.demo", role:"project_manager", companyId, status:"Active" },
        { id:"prod-mgr-2", firstName:"David", lastName:"Chen", name:"David Chen", email:"david@bertram.demo", role:"project_manager", companyId, status:"Active" },
        { id:"prod-mgr-3", firstName:"Alex", lastName:"Rivera", name:"Alex Rivera", email:"alex@bertram.demo", role:"project_manager", companyId, status:"Active" },
        { id:"purchasing-1", firstName:"Taylor", lastName:"Brooks", name:"Taylor Brooks", email:"purchasing@bertram.demo", role:"purchasing", companyId, status:"Active" },
        { id:"finance-1", firstName:"Jordan", lastName:"Lee", name:"Jordan Lee", email:"cost@bertram.demo", role:"finance", companyId, status:"Active" },
        { id:"lead-elec", firstName:"Chris", lastName:"M.", name:"Chris M.", email:"electrical@bertram.demo", role:"crew_leader", companyId, status:"Active" },
        { id:"lead-mech", firstName:"Andre", lastName:"P.", name:"Andre P.", email:"mechanical@bertram.demo", role:"crew_leader", companyId, status:"Active" },
        { id:"lead-finish", firstName:"Luis", lastName:"R.", name:"Luis R.", email:"finish@bertram.demo", role:"crew_leader", companyId, status:"Active" }
      ];

      const projects = [
        {id:"h39-026",companyId,name:"B39-026",model:"39CC",customer:"Gulf Coast Dealer Demo",location:"Tampa · Bay 3",scope:"Bertram 39CC · Triple V10 · Ice Blue",pmId:"prod-mgr-1",pmName:"Maria Santos",status:"Electrical",progress:72,contractValue:720000,paidAmount:498000,startDate:datePlus(-47),targetDelivery:datePlus(48),materialReadiness:96,qaOpen:2,risk:"On Schedule",configRev:"C",stage:"Electrical"},
        {id:"h34-041",companyId,name:"B34-041",model:"34CC",customer:"Atlantic Dealer Demo",location:"Tampa · Bay 2",scope:"Bertram 34CC · Twin V10 · White",pmId:"prod-mgr-2",pmName:"David Chen",status:"Assembly",progress:61,contractValue:510000,paidAmount:332000,startDate:datePlus(-39),targetDelivery:datePlus(55),materialReadiness:83,qaOpen:0,risk:"Material Risk",configRev:"B",stage:"Assembly"},
        {id:"h50-008",companyId,name:"B50-008",model:"50 Sport",customer:"Northeast Dealer Demo",location:"Tampa · Bay 5",scope:"Bertram 50 Sport · Generator + Stabilizer",pmId:"prod-mgr-3",pmName:"Alex Rivera",status:"Mechanical",progress:54,contractValue:1450000,paidAmount:812000,startDate:datePlus(-64),targetDelivery:datePlus(69),materialReadiness:74,qaOpen:1,risk:"Critical",configRev:"D",stage:"Mechanical"},
        {id:"h35-019",companyId,name:"B35-019",model:"35 Flybridge",customer:"Southeast Dealer Demo",location:"Tampa · Finish",scope:"Bertram 35 Flybridge · Atlantic Interior",pmId:"prod-mgr-1",pmName:"Maria Santos",status:"Final Finish",progress:89,contractValue:880000,paidAmount:751000,startDate:datePlus(-72),targetDelivery:datePlus(24),materialReadiness:100,qaOpen:0,risk:"On Schedule",configRev:"C",stage:"Final Finish"},
        {id:"h61-004",companyId,name:"B61-004",model:"61 Convertible",customer:"International Dealer Demo",location:"Tampa · Bay 6",scope:"Bertram 61 Convertible · Custom Electronics",pmId:"prod-mgr-3",pmName:"Alex Rivera",status:"Interior",progress:67,contractValue:2650000,paidAmount:1712000,startDate:datePlus(-103),targetDelivery:datePlus(88),materialReadiness:91,qaOpen:3,risk:"Schedule Risk",configRev:"E",stage:"Interior"},
        {id:"h28-063",companyId,name:"B28-063",model:"28CC",customer:"Florida Dealer Demo",location:"Tampa · Final QA",scope:"Bertram 28CC · Twin Outboard",pmId:"prod-mgr-2",pmName:"David Chen",status:"Final QA",progress:96,contractValue:310000,paidAmount:294000,startDate:datePlus(-42),targetDelivery:datePlus(11),materialReadiness:100,qaOpen:1,risk:"QA Hold",configRev:"B",stage:"Final QA"},
        {id:"h39-027",companyId,name:"B39-027",model:"39CC",customer:"Mid-Atlantic Dealer Demo",location:"Tampa · Lamination",scope:"Bertram 39CC · Triple V10 · Glacier Gray",pmId:"prod-mgr-1",pmName:"Maria Santos",status:"Lamination",progress:24,contractValue:735000,paidAmount:165000,startDate:datePlus(-14),targetDelivery:datePlus(104),materialReadiness:88,qaOpen:0,risk:"On Schedule",configRev:"A",stage:"Lamination"},
        {id:"h34-042",companyId,name:"B34-042",model:"34CC",customer:"Dealer Stock Demo",location:"Tampa · Engineering",scope:"Bertram 34CC · Dealer Stock Configuration",pmId:"prod-mgr-2",pmName:"David Chen",status:"Engineering Release",progress:8,contractValue:525000,paidAmount:42000,startDate:datePlus(-3),targetDelivery:datePlus(128),materialReadiness:68,qaOpen:0,risk:"On Schedule",configRev:"A",stage:"Engineering Release"}
      ];

      const crews = [
        {id:"team-lam",companyId,name:"Lamination Team A",lead:"Rafael G.",vehicle:"Work Center L1",status:"Active",members:["Rafael G.","Maya T.","Jose P.","Derrick L."],equipment:["Vacuum Infusion","Mold Set","Core Kit"]},
        {id:"team-mech",companyId,name:"Mechanical Team 1",lead:"Andre P.",vehicle:"Bay M1",status:"Active",members:["Andre P.","Sam K.","Victor D.","Nate B."],equipment:["Engine Lift","Torque Tools","Alignment Kit"]},
        {id:"team-elec",companyId,name:"Electrical Team 2",lead:"Chris M.",vehicle:"Bay E2",status:"Active",members:["Chris M.","Devon S.","Isaac T."],equipment:["Harness Test Set","Multimeter","Network Analyzer"]},
        {id:"team-finish",companyId,name:"Finish Team",lead:"Luis R.",vehicle:"Finish Cell",status:"Active",members:["Luis R.","Ana V.","Miguel C.","Troy H."],equipment:["Finish Kit","Trim Tools","Inspection Lighting"]},
        {id:"team-qa",companyId,name:"Quality Assurance",lead:"Morgan K.",vehicle:"QA",status:"Active",members:["Morgan K.","Jamie W."],equipment:["Inspection Tablet","Torque Audit Kit","Commissioning Tools"]}
      ];

      const schedule = [
        {id:"ms1",companyId,date:datePlus(0),start:"07:00",end:"11:30",projectId:"h39-026",project:"B39-026 · Helm Electrical Harness",crewId:"team-elec",crewName:"Electrical Team 2",status:"In Progress",color:"blue",additional:false},
        {id:"ms2",companyId,date:datePlus(0),start:"07:00",end:"15:30",projectId:"h50-008",project:"B50-008 · Generator Installation",crewId:"team-mech",crewName:"Mechanical Team 1",status:"Blocked",color:"red",additional:false},
        {id:"ms3",companyId,date:datePlus(0),start:"08:00",end:"13:00",projectId:"h28-063",project:"B28-063 · Final Systems QA",crewId:"team-qa",crewName:"Quality Assurance",status:"QA Hold",color:"red",additional:false},
        {id:"ms4",companyId,date:datePlus(1),start:"07:00",end:"15:30",projectId:"h39-027",project:"B39-027 · Hull Lamination",crewId:"team-lam",crewName:"Lamination Team A",status:"Scheduled",color:"green",additional:false},
        {id:"ms5",companyId,date:datePlus(1),start:"07:00",end:"15:30",projectId:"h35-019",project:"B35-019 · Interior Final Finish",crewId:"team-finish",crewName:"Finish Team",status:"Scheduled",color:"green",additional:false},
        {id:"ms6",companyId,date:datePlus(2),start:"07:00",end:"12:00",projectId:"h39-026",project:"B39-026 · Electrical Commissioning",crewId:"team-elec",crewName:"Electrical Team 2",status:"Scheduled",color:"blue",additional:false}
      ];

      const materials = [
        {id:"mat-gen",companyId,project:"B50-008",partNumber:"GEN-9KW-01",items:"9 kW marine generator",supplier:"Demo Generator Supplier",urgency:"Critical",status:"Delayed",requiredDate:datePlus(9),eta:datePlus(15),impact:"Blocks generator installation, electrical commissioning, and final mechanical QA."},
        {id:"mat-radar",companyId,project:"B39-026",partNumber:"NAV-RAD-04",items:"Radar unit + pedestal",supplier:"Demo Electronics Supplier",urgency:"High",status:"In Transit",requiredDate:datePlus(12),eta:datePlus(10),impact:"No current schedule impact."},
        {id:"mat-trim",companyId,project:"B34-041",partNumber:"TRM-ACT-02",items:"Trim actuator assemblies (2)",supplier:"Demo Motion Systems",urgency:"High",status:"Awaiting Confirmation",requiredDate:datePlus(14),eta:"TBD",impact:"Potential final assembly delay."},
        {id:"mat-harness",companyId,project:"B39-027",partNumber:"EL-HRN-39C",items:"39CC electrical harness kit",supplier:"Demo Harness Supplier",urgency:"Normal",status:"Staged",requiredDate:datePlus(18),eta:datePlus(7),impact:"Ready before required-on-line date."},
        {id:"mat-uph",companyId,project:"B35-019",partNumber:"INT-UPH-35A",items:"Atlantic interior upholstery package",supplier:"Demo Interior Supplier",urgency:"Normal",status:"Delivered",requiredDate:datePlus(-2),eta:datePlus(-4),impact:"Complete."}
      ];

      const fieldReports = [
        {id:"wp1",companyId,date:datePlus(0),crewId:"team-elec",crewName:"Electrical Team 2",projectId:"h39-026",project:"B39-026",production:"WP-39-026-EL-018 · Helm electrical harness — 75% complete",hours:9.5,weather:"Indoor production",safety:"Work center checklist complete",equipmentReady:true,suppliesReady:true,issues:"Drawing Rev E acknowledgement required before final termination",photos:4,submittedBy:"Chris M."},
        {id:"wp2",companyId,date:datePlus(0),crewId:"team-mech",crewName:"Mechanical Team 1",projectId:"h50-008",project:"B50-008",production:"WP-50-008-ME-011 · Generator installation — blocked",hours:2.0,weather:"Indoor production",safety:"Work center checklist complete",equipmentReady:true,suppliesReady:false,issues:"Generator PO ETA is 6 days after required-on-line date",photos:2,submittedBy:"Andre P."},
        {id:"wp3",companyId,date:datePlus(-1),crewId:"team-finish",crewName:"Finish Team",projectId:"h35-019",project:"B35-019",production:"WP-35-019-FN-031 · Interior finish — 92% complete",hours:18,weather:"Indoor production",safety:"No issues",equipmentReady:true,suppliesReady:true,issues:"None",photos:7,submittedBy:"Luis R."}
      ];

      const drawings = [
        {id:"dw1",companyId,hull:"B39-026",number:"EL-39-212",system:"Electrical",title:"Helm Electrical Harness",revision:"E",released:datePlus(-1),status:"Released",acknowledged:"1 of 2 teams",impact:"Work package EL-018 affected"},
        {id:"dw2",companyId,hull:"B39-026",number:"PL-39-044",system:"Plumbing",title:"Freshwater System",revision:"C",released:datePlus(-8),status:"Released",acknowledged:"Complete",impact:"No open impact"},
        {id:"dw3",companyId,hull:"B50-008",number:"ME-50-108",system:"Mechanical",title:"Generator Installation",revision:"B",released:datePlus(-12),status:"Released",acknowledged:"Complete",impact:"Material delay"},
        {id:"dw4",companyId,hull:"B61-004",number:"EL-61-301",system:"Electrical",title:"Navigation Electronics",revision:"D",released:datePlus(-3),status:"Review",acknowledged:"Pending",impact:"Engineering review"},
        {id:"dw5",companyId,hull:"MODEL 39CC",number:"ECO-2026-018",system:"Engineering Change",title:"Freshwater Pump Bracket Relocation",revision:"A",released:datePlus(-2),status:"Implementation",acknowledged:"3 of 4 hulls dispositioned",impact:"B39-026 rework required"}
      ];

      const inspections = [
        {id:"qa1",companyId,hull:"B39-026",area:"Electrical",inspection:"Electrical Final",status:"Open",severity:"Moderate",finding:"Bilge pump connection requires correction",owner:"Electrical Team 2"},
        {id:"qa2",companyId,hull:"B39-026",area:"Electrical",inspection:"Harness Routing",status:"Open",severity:"Low",finding:"Secure loom at frame 7",owner:"Electrical Team 2"},
        {id:"qa3",companyId,hull:"B50-008",area:"Mechanical",inspection:"Generator Pre-Install",status:"Hold",severity:"Critical",finding:"Generator not available on required date",owner:"Purchasing"},
        {id:"qa4",companyId,hull:"B28-063",area:"Final QA",inspection:"Commissioning",status:"Hold",severity:"Moderate",finding:"Re-test port trim indication",owner:"QA / Electrical"},
        {id:"qa5",companyId,hull:"B61-004",area:"Interior",inspection:"Interior Fit & Finish",status:"Open",severity:"Low",finding:"Three punch-list items",owner:"Finish Team"},
        {id:"qa6",companyId,hull:"B35-019",area:"Final Finish",inspection:"Finish Acceptance",status:"Closed",severity:"Low",finding:"Accepted",owner:"QA"}
      ];

      const configurations = [
        {id:"cfg1",companyId,hull:"B39-026",model:"39CC",revision:"C",engines:"Triple Mercury V10",exterior:"Ice Blue",interior:"Atlantic",options:["Generator","Seakeeper","Joystick","Garmin Radar","Upgraded Tackle Center"]},
        {id:"cfg2",companyId,hull:"B50-008",model:"50 Sport",revision:"D",engines:"Demo Inboard Package",exterior:"Classic White",interior:"Coastal",options:["Generator","Stabilizer","Premium Electronics","Watermaker"]},
        {id:"cfg3",companyId,hull:"B61-004",model:"61 Convertible",revision:"E",engines:"Demo Inboard Package",exterior:"Flag Blue",interior:"Custom",options:["Custom Electronics","Generator","Stabilizer","Watermaker","Teak Package"]}
      ];

      const seaTrials = [
        {id:"st1",companyId,hull:"B28-063",target:datePlus(7),status:"Pending QA Release",punch:2,readiness:92},
        {id:"st2",companyId,hull:"B35-019",target:datePlus(16),status:"Scheduled",punch:0,readiness:97}
      ];

      const warrantyCases = [
        {id:"w1",companyId,hull:"B39-020",component:"Trim Pump Assembly",status:"Closed",dealer:"Dealer Demo A",summary:"Intermittent pressure fault",resolution:"Component replaced; supplier review opened"},
        {id:"w2",companyId,hull:"B39-022",component:"Trim Pump Assembly",status:"Closed",dealer:"Dealer Demo B",summary:"Pressure decay",resolution:"Component replaced"},
        {id:"w3",companyId,hull:"B39-024",component:"Trim Pump Assembly",status:"Open",dealer:"Dealer Demo C",summary:"Repeat trim pressure fault",resolution:"Engineering pattern review"}
      ];

      const models = [
        {id:"m28",companyId,name:"28CC",family:"Center Console",routing:"14 standard stages",drawings:86,qa:34,bom:"Current"},
        {id:"m34",companyId,name:"34CC",family:"Center Console",routing:"16 standard stages",drawings:112,qa:41,bom:"Current"},
        {id:"m39",companyId,name:"39CC",family:"Center Console",routing:"18 standard stages",drawings:148,qa:49,bom:"Rev 2026.09"},
        {id:"m35",companyId,name:"35 Flybridge",family:"Flybridge",routing:"20 standard stages",drawings:174,qa:57,bom:"Current"},
        {id:"m50",companyId,name:"50 Sport",family:"Sport",routing:"23 standard stages",drawings:238,qa:66,bom:"Current"},
        {id:"m61",companyId,name:"61 Convertible",family:"Convertible",routing:"27 standard stages",drawings:311,qa:78,bom:"Rev 2026.08"}
      ];

      const activity = [
        {id:"a1",companyId,text:"EL-39-212 Rev E released for B39-026.",time:"18 min ago"},
        {id:"a2",companyId,text:"Generator PO for B50-008 moved to critical schedule risk.",time:"36 min ago"},
        {id:"a3",companyId,text:"QA hold opened on B28-063 commissioning.",time:"1 hr ago"},
        {id:"a4",companyId,text:"B35-019 advanced to final finish.",time:"2 hrs ago"},
        {id:"a5",companyId,text:"39CC warranty trend flagged for Trim Pump Assembly.",time:"3 hrs ago"}
      ];

      return {
        companies, users, projects, crews, schedule, materials, activity,
        estimates: [], fieldReports, weatherByLocation: {},
        drawings, inspections, configurations, seaTrials, warrantyCases, models
      };
    },

    applyUi(vertical) {
      document.title = "Atlas Marine — Bertram Demonstration";
      document.documentElement.dataset.atlasVertical = "marine";

      const authBrand = document.querySelector("#authScreen .brand-row strong");
      const authSub = document.querySelector("#authScreen .brand-row small");
      if (authBrand) authBrand.textContent = "Atlas Marine";
      if (authSub) authSub.textContent = "Yacht Manufacturing Operating System";

      const sideBrand = document.querySelector(".sidebar .brand-row strong");
      const sideSub = document.querySelector(".sidebar .brand-row small");
      if (sideBrand) sideBrand.textContent = "Atlas Marine";
      if (sideSub) sideSub.textContent = "Bertram Demonstration";

      const badge = document.getElementById("environmentBadge");
      if (badge) badge.textContent = vertical.environmentLabel || "MARINE DEMO";

      document.querySelectorAll(".nav[data-view]").forEach(button => {
        const label = vertical.navigation?.[button.dataset.view];
        if (label) button.textContent = label;
      });

      const nav = document.getElementById("mainNav");
      if (nav && !nav.querySelector('[data-view="engineering"]')) {
        const anchor = nav.querySelector('[data-view="users"]');
        [
          ["engineering","Engineering & Drawings"],
          ["quality","Quality"],
          ["delivery","Sea Trial & Delivery"],
          ["warranty","Warranty & Service"],
          ["models","Model Library"]
        ].forEach(([view,label]) => {
          const b = document.createElement("button");
          b.className = "nav";
          b.dataset.view = view;
          b.textContent = label;
          nav.insertBefore(b, anchor);
        });
      }

      const mapText = [
        ["#dashboard .hero-card .eyebrow","PRODUCTION OPERATING BRIEF"],
        ["#dashboard .hero-actions [data-view-target='schedule']","Open Production Schedule"],
        ["#dashboard .hero-actions [data-view-target='projects']","View Hulls"],
        ["#mission h2","Production Control"],
        ["#mission .section-head p:last-child","Hull health, work centers, materials, quality holds, and schedule risk."],
        ["#projects h2","Hull Registry"],
        ["#projects .section-head p","Every active build, configuration, stage, risk, and delivery target."],
        ["#projects #addProject","+ Hull"],
        ["#schedule h2","Production Schedule"],
        ["#crews h2","Production Teams"],
        ["#field h2","Work Packages"],
        ["#materials h2","Materials & Purchasing"],
        ["#finance h2","Build Cost"],
        ["#athena h2","Athena"]
      ];
      mapText.forEach(([selector,text]) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
      });
    },

    renderDashboard(ctx) {
      const {$, companyRows, esc, firstName, timeGreeting} = ctx;
      const hulls = companyRows("projects");
      const active = hulls.filter(h => h.status !== "Delivered");
      const risk = active.filter(h => h.risk && h.risk !== "On Schedule");
      const critical = active.filter(h => h.risk === "Critical" || h.risk === "QA Hold");
      const materials = companyRows("materials");
      const avgReady = active.length ? Math.round(active.reduce((s,h)=>s+(h.materialReadiness||0),0)/active.length) : 0;
      const qaOpen = (ctx.state.inspections||[]).filter(i=>i.companyId===ctx.currentCompanyId && i.status!=="Closed").length;

      $("smartGreeting").textContent = `${timeGreeting()}, ${firstName()}`;
      $("dailyBrief").textContent = `${active.length} active hulls, ${risk.length} need attention, material readiness is ${avgReady}%, and ${qaOpen} quality items remain open.`;

      const metrics = document.querySelectorAll("#dashboard .metric");
      if(metrics[0]) metrics[0].querySelector("span").textContent="Active Hulls";
      if(metrics[1]) metrics[1].querySelector("span").textContent="Schedule Risk";
      if(metrics[2]) metrics[2].querySelector("span").textContent="Material Readiness";
      if(metrics[3]) metrics[3].querySelector("span").textContent="Open QA Items";

      $("mProjects").textContent=active.length;
      $("mProjectsSub").textContent=`${active.filter(h=>h.risk==="On Schedule").length} on schedule`;
      $("mBids").textContent=risk.length;
      $("mBidValue").textContent=`${critical.length} critical / hold`;
      $("mCrews").textContent=`${avgReady}%`;
      $("mCrewSub").textContent=`${materials.filter(m=>m.status==="Delayed"||m.status==="Awaiting Confirmation").length} material exceptions`;
      $("mOutstanding").textContent=qaOpen;

      const todays=companyRows("schedule").filter(x=>x.date===ctx.iso(new Date()));
      $("dashboardSchedule").innerHTML=todays.length?todays.map(item=>`<div class="list-row"><div><strong>${esc(item.project)}</strong><small>${esc(item.start)}–${esc(item.end)} · ${esc(item.crewName)}</small></div><span class="badge">${esc(item.status)}</span></div>`).join(""):'<div class="empty">No work packages scheduled today.</div>';

      $("dashboardCrews").innerHTML=companyRows("crews").map(c=>{const job=todays.find(x=>x.crewId===c.id);return `<div class="list-row"><div><strong>${esc(c.name)}</strong><small>${esc(c.lead)} · ${c.members.length} team members · ${esc(c.vehicle)}</small></div><span class="badge">${job?"Working":"Available"}</span></div>`}).join("");

      const pms=ctx.state.users.filter(u=>u.companyId===ctx.currentCompanyId&&u.role==="project_manager");
      $("pmWorkload").innerHTML=pms.map(pm=>{const hh=hulls.filter(h=>h.pmId===pm.id);const rr=hh.filter(h=>h.risk!=="On Schedule");return `<article class="pm-card"><strong>${esc(pm.name)}</strong><small>Production Manager</small><div class="pm-metrics"><div><b>${hh.length}</b><small>Hulls</small></div><div><b>${rr.length}</b><small>Risk</small></div><div><b>${Math.round(hh.reduce((s,h)=>s+h.progress,0)/Math.max(1,hh.length))}%</b><small>Avg Complete</small></div></div><small>${hh.map(h=>h.name).join(", ")}</small></article>`}).join("");

      const alerts=[];
      materials.filter(m=>m.urgency==="Critical"&&m.status!=="Delivered").forEach(m=>alerts.push({title:`Critical material — ${m.project}`,detail:`${m.items} · ${m.impact}`}));
      active.filter(h=>h.risk!=="On Schedule").forEach(h=>alerts.push({title:`${h.name} — ${h.risk}`,detail:`${h.model} · ${h.stage} · ${h.materialReadiness}% material ready`}));
      $("dashboardAlerts").innerHTML=alerts.length?alerts.slice(0,8).map(a=>`<div class="list-row"><div><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></div></div>`).join(""):'<div class="empty">No immediate production alerts.</div>';
      $("activityFeed").innerHTML=companyRows("activity").map(a=>`<div class="list-row"><div><strong>${esc(a.text)}</strong><small>${esc(a.time)}</small></div></div>`).join("");

      const weatherPanel=document.querySelector("#dashboard .two-col:nth-of-type(2) .panel:first-child");
      if(weatherPanel) weatherPanel.classList.add("hidden");
      const field=companyRows("fieldReports").slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
      $("dashboardFieldReports").innerHTML=field.map(r=>`<div class="list-row"><div><strong>${esc(r.project)} — ${esc(r.crewName)}</strong><small>${esc(r.production)} · ${esc(r.issues||"No issues")}</small></div><span class="badge">${r.hours} hrs</span></div>`).join("");
    },

    renderExecutive(ctx) {
      const {$, companyRows, esc, money} = ctx;
      const hulls=companyRows("projects"), active=hulls.filter(h=>h.status!=="Delivered");
      const budget=active.reduce((s,h)=>s+(h.contractValue||0),0), actual=active.reduce((s,h)=>s+(h.paidAmount||0),0);
      const atRisk=active.filter(h=>h.risk!=="On Schedule");
      const qaOpen=(ctx.state.inspections||[]).filter(i=>i.companyId===ctx.currentCompanyId&&i.status!=="Closed");
      const matCritical=companyRows("materials").filter(m=>m.urgency==="Critical"&&m.status!=="Delivered");

      const labels=["Active Build Budget","Actual Build Cost","Remaining Budget","Avg Material Readiness","Production Teams","Hulls at Risk","Open QA Items","Critical Supply Items"];
      document.querySelectorAll("#executive .metric span").forEach((el,i)=>{if(labels[i])el.textContent=labels[i]});
      $("xActiveValue").textContent=money(budget); $("xActiveProjects").textContent=`${active.length} active hulls`;
      $("xPaid").textContent=money(actual); $("xPaidPercent").textContent=`${budget?Math.round(actual/budget*100):0}% of current build budget`;
      $("xOwed").textContent=money(Math.max(0,budget-actual));
      $("xPipeline").textContent=`${Math.round(active.reduce((s,h)=>s+(h.materialReadiness||0),0)/Math.max(1,active.length))}%`; $("xBidCount").textContent="material readiness";
      $("xCrews").textContent=companyRows("crews").length; $("xCrewAvailable").textContent="active work centers";
      $("xRisk").textContent=atRisk.length; $("xCriticalMaterials").textContent=qaOpen.length; $("xConflicts").textContent=matCritical.length;

      const pms=ctx.state.users.filter(u=>u.companyId===ctx.currentCompanyId&&u.role==="project_manager");
      $("executivePmTable").innerHTML=`<table><thead><tr><th>Production Manager</th><th>Hulls</th><th>Risk</th><th>Avg Complete</th><th>Build Budget</th><th>Actual Cost</th></tr></thead><tbody>${pms.map(pm=>{const hh=active.filter(h=>h.pmId===pm.id);return `<tr><td>${esc(pm.name)}</td><td>${hh.length}</td><td>${hh.filter(h=>h.risk!=="On Schedule").length}</td><td>${Math.round(hh.reduce((s,h)=>s+h.progress,0)/Math.max(1,hh.length))}%</td><td>${money(hh.reduce((s,h)=>s+h.contractValue,0))}</td><td>${money(hh.reduce((s,h)=>s+h.paidAmount,0))}</td></tr>`}).join("")}</tbody></table>`;

      const attention=[
        ...atRisk.map(h=>({title:`${h.name} — ${h.risk}`,detail:`${h.stage} · delivery ${h.targetDelivery}`})),
        ...matCritical.map(m=>({title:`Supply risk — ${m.project}`,detail:`${m.items} · ${m.impact}`})),
        ...qaOpen.filter(q=>q.status==="Hold").map(q=>({title:`QA hold — ${q.hull}`,detail:q.finding}))
      ];
      $("executiveAttention").innerHTML=attention.map(a=>`<div class="list-row"><div><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></div></div>`).join("")||'<div class="empty">No executive attention items.</div>';

      $("executiveCashByPm").innerHTML=active.map(h=>`<div class="exec-bar-row"><div><strong>${esc(h.name)} · ${esc(h.model)}</strong><small>${h.progress}% complete · ${h.materialReadiness}% materials ready</small></div><div class="exec-bar"><span style="width:${h.progress}%"></span><i style="width:${h.materialReadiness}%"></i></div></div>`).join("");
      $("executiveCrewStatus").innerHTML=companyRows("crews").map(c=>`<div class="list-row"><div><strong>${esc(c.name)}</strong><small>${esc(c.lead)} · ${esc(c.vehicle)}</small></div><span class="badge">${esc(c.status)}</span></div>`).join("");
      $("executiveProjectRows").innerHTML=active.map(h=>`<tr><td>${esc(h.pmName)}</td><td>${esc(h.name)} · ${esc(h.model)}</td><td>${esc(h.location)}</td><td>${esc(h.risk)}</td><td>${h.progress}%</td><td>${money(h.contractValue)}</td><td>${money(h.paidAmount)}</td><td>${money(Math.max(0,h.contractValue-h.paidAmount))}</td></tr>`).join("");
    },

    renderMission(ctx) {
      const {$, companyRows, esc} = ctx;
      const hulls=companyRows("projects"), materials=companyRows("materials");
      const risk=hulls.filter(h=>h.risk!=="On Schedule"), critical=materials.filter(m=>m.urgency==="Critical"&&m.status!=="Delivered");
      const holds=(ctx.state.inspections||[]).filter(i=>i.companyId===ctx.currentCompanyId&&i.status==="Hold");
      $("missionRisk").textContent=risk.length;
      $("missionUnassigned").textContent=holds.length;
      $("missionMaterials").textContent=critical.length;
      $("missionConflicts").textContent=(ctx.state.drawings||[]).filter(d=>d.companyId===ctx.currentCompanyId&&/Pending|of/.test(d.acknowledged||"")).length;
      const metricLabels=["Hulls at Risk","QA Holds","Critical Materials","Revision Actions"];
      document.querySelectorAll("#mission .metric span").forEach((el,i)=>{if(metricLabels[i])el.textContent=metricLabels[i]});
      $("missionProjects").innerHTML=hulls.map(h=>`<div class="list-row"><div><strong>${esc(h.name)} · ${esc(h.model)}</strong><small>${esc(h.stage)} · ${esc(h.pmName)} · ${esc(h.risk)}</small><div class="progress"><span style="width:${h.progress}%"></span></div></div><span>${h.progress}%</span></div>`).join("");
      const attention=[
        ...critical.map(m=>({title:`${m.project} — ${m.items}`,detail:m.impact})),
        ...holds.map(q=>({title:`${q.hull} — QA HOLD`,detail:q.finding})),
        ...(ctx.state.drawings||[]).filter(d=>d.status==="Review"||/Pending|of/.test(d.acknowledged||"")).map(d=>({title:`${d.number} Rev ${d.revision}`,detail:`${d.hull} · ${d.acknowledged}`}))
      ];
      $("missionAttention").innerHTML=attention.map(a=>`<div class="list-row"><div><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></div></div>`).join("")||'<div class="empty">Production control is clear.</div>';
    },

    renderProjects(ctx) {
      const {$, companyRows, esc, money} = ctx;
      const hulls=companyRows("projects");
      const managers=[...new Set(hulls.map(h=>h.pmName))].sort(),statuses=[...new Set(hulls.map(h=>h.status))].sort();
      const managerValue=$("projectPmFilter").value,statusValue=$("projectStatusFilter").value;
      $("projectPmFilter").innerHTML='<option value="">All Production Managers</option>'+managers.map(x=>`<option>${esc(x)}</option>`).join("");
      $("projectStatusFilter").innerHTML='<option value="">All Production Stages</option>'+statuses.map(x=>`<option>${esc(x)}</option>`).join("");
      $("projectPmFilter").value=managerValue;$("projectStatusFilter").value=statusValue;
      $("projectSearch").placeholder="Search hull, model, dealer, stage, or manager";
      const query=$("projectSearch").value.toLowerCase();
      const filtered=hulls.filter(h=>(!query||[h.name,h.model,h.pmName,h.customer,h.location,h.scope,h.status].join(" ").toLowerCase().includes(query))&&(!$("projectPmFilter").value||h.pmName===$("projectPmFilter").value)&&(!$("projectStatusFilter").value||h.status===$("projectStatusFilter").value));
      $("projectList").innerHTML=filtered.map(h=>`<article class="project-card marine-hull-card"><div class="project-meta"><span class="badge">${esc(h.risk)}</span><span>${esc(h.targetDelivery)}</span></div><h3>${esc(h.name)} · ${esc(h.model)}</h3><small>${esc(h.customer)} · ${esc(h.location)}</small><small>${esc(h.scope)}</small><div class="marine-stat-row"><span>Stage <b>${esc(h.stage)}</b></span><span>Config <b>Rev ${esc(h.configRev)}</b></span><span>Materials <b>${h.materialReadiness}%</b></span><span>QA <b>${h.qaOpen} open</b></span></div><div class="progress"><span style="width:${h.progress}%"></span></div><div class="project-meta"><span>${esc(h.pmName)}</span><span>${h.progress}% complete · ${money(h.paidAmount)} actual</span></div></article>`).join("")||'<div class="empty">No hulls match the filters.</div>';
    },

    renderCrews(ctx) {
      const {$, companyRows, esc} = ctx;
      const today=ctx.iso(new Date()), schedule=companyRows("schedule");
      $("crewList").innerHTML=companyRows("crews").map(c=>{const jobs=schedule.filter(x=>x.date===today&&x.crewId===c.id);return `<article class="crew-card"><div class="project-meta"><span class="badge">${jobs.length?"Working":"Available"}</span><span>${esc(c.vehicle)}</span></div><h3>${esc(c.name)}</h3><small>Lead: ${esc(c.lead)}</small><div class="crew-members">${c.members.map(m=>`<span>${esc(m)}</span>`).join("")}</div><small><b>Work-center tools:</b> ${esc(c.equipment.join(", "))}</small>${jobs.map(j=>`<small><b>Today:</b> ${esc(j.project)}</small>`).join("")}</article>`}).join("");
    },

    renderFieldOperations(ctx) {
      const {$, companyRows, esc} = ctx;
      const reports=companyRows("fieldReports"),today=ctx.iso(new Date()),todayReports=reports.filter(r=>r.date===today);
      const openIssues=reports.filter(r=>r.issues&&r.issues!=="None");
      $("fieldReportsToday").textContent=todayReports.length;
      $("fieldOpenIssues").textContent=openIssues.length;
      $("fieldCrewsReporting").textContent=new Set(todayReports.map(r=>r.crewId)).size;
      $("fieldPhotos").textContent=reports.reduce((s,r)=>s+(r.photos||0),0);
      const labels=["Work Packages Today","Open Blockers","Teams Reporting","Production Photos"];
      document.querySelectorAll("#field .metric span").forEach((el,i)=>{if(labels[i])el.textContent=labels[i]});
      $("fieldReportList").innerHTML=reports.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<div class="field-report-card"><div class="project-meta"><span>${esc(r.date)}</span><span>${r.hours} labor hrs</span></div><h3>${esc(r.project)}</h3><small>${esc(r.crewName)} · Updated by ${esc(r.submittedBy)}</small><p><strong>Work package:</strong> ${esc(r.production)}</p><p><strong>Readiness:</strong> ${r.equipmentReady?"Tools ready":"Tool issue"} · ${r.suppliesReady?"Materials ready":"Material issue"}</p><p><strong>Blockers:</strong> ${esc(r.issues||"None")}</p><div class="project-meta"><span>${r.photos||0} photos</span><span>${esc(r.safety)}</span></div></div>`).join("");
      $("fieldReadinessList").innerHTML=reports.map(r=>`<div class="list-row"><div><strong>${esc(r.crewName)}</strong><small>${esc(r.project)} · ${esc(r.production)}</small></div><span class="badge">${r.suppliesReady?"Ready":"Blocked"}</span></div>`).join("");
    },

    renderMaterials(ctx) {
      const {$, companyRows, esc} = ctx;
      $("materialList").innerHTML=companyRows("materials").map(m=>`<div class="marine-material-row"><div><strong>${esc(m.project)} · ${esc(m.partNumber||"")}</strong><small>${esc(m.items)} · ${esc(m.supplier||"")}</small><small>${esc(m.impact||"")}</small></div><div><span class="badge">${esc(m.urgency)}</span><small>${esc(m.status)}</small><small>Need: ${esc(m.requiredDate||"—")} · ETA: ${esc(m.eta||"—")}</small></div></div>`).join("");
    },

    renderFinance(ctx) {
      const {$, companyRows, money, esc} = ctx;
      const hulls=companyRows("projects"), budget=hulls.reduce((s,h)=>s+h.contractValue,0), actual=hulls.reduce((s,h)=>s+h.paidAmount,0);
      const projected=hulls.reduce((s,h)=>s+h.contractValue*Math.max(h.progress/100,.15),0);
      const labels=["Active Build Budget","Actual Cost to Date","Remaining Budget","Projected Cost at Current Progress"];
      document.querySelectorAll("#finance .metric span").forEach((el,i)=>{if(labels[i])el.textContent=labels[i]});
      $("fContract").textContent=money(budget);$("fPaid").textContent=money(actual);$("fOutstanding").textContent=money(Math.max(0,budget-actual));$("fPipeline").textContent=money(projected);
      const managers=[...new Set(hulls.map(h=>h.pmName))].sort(),selected=$("financePmFilter").value;
      $("financePmFilter").innerHTML='<option value="">All Production Managers</option>'+managers.map(pm=>`<option>${esc(pm)}</option>`).join("");
      $("financePmFilter").value=managers.includes(selected)?selected:"";
      $("financePmSummary").innerHTML=managers.map(pm=>{const hh=hulls.filter(h=>h.pmName===pm),b=hh.reduce((s,h)=>s+h.contractValue,0),a=hh.reduce((s,h)=>s+h.paidAmount,0);return `<article class="finance-pm-card"><strong>${esc(pm)}</strong><small>${hh.length} active hulls</small><div><span>Budget</span><b>${money(b)}</b></div><div><span>Actual</span><b>${money(a)}</b></div><div><span>Remaining</span><b>${money(Math.max(0,b-a))}</b></div></article>`}).join("");
      const filtered=$("financePmFilter").value?hulls.filter(h=>h.pmName===$("financePmFilter").value):hulls;
      $("financeRows").innerHTML=filtered.map(h=>`<tr><td>${esc(h.pmName)}</td><td>${esc(h.name)} · ${esc(h.model)}</td><td>${money(h.contractValue)}</td><td>${money(h.paidAmount)}</td><td>${money(Math.max(0,h.contractValue-h.paidAmount))}</td><td>${h.progress}%</td><td>${h.materialReadiness}%</td><td>${h.qaOpen}</td><td>${esc(h.risk)}</td></tr>`).join("");
    },

    renderExtraViews(ctx) {
      const {$, esc} = ctx;
      const data = ctx.state;
      const companyId=ctx.currentCompanyId;

      const engineering=$("engineering");
      if(engineering) engineering.innerHTML=`
        <div class="section-head"><div><p class="eyebrow">ENGINEERING CONTROL</p><h2>Engineering & Drawings</h2><p>Released revisions, acknowledgements, engineering changes, and affected hulls.</p></div><span class="badge">${(data.drawings||[]).filter(d=>d.companyId===companyId&&d.status!=="Released").length} need review</span></div>
        <article class="panel"><div class="table-wrap"><table><thead><tr><th>Hull / Model</th><th>Drawing / ECO</th><th>System</th><th>Revision</th><th>Status</th><th>Acknowledgement</th><th>Impact</th></tr></thead><tbody>${(data.drawings||[]).filter(d=>d.companyId===companyId).map(d=>`<tr><td>${esc(d.hull)}</td><td><strong>${esc(d.number)}</strong><br><small>${esc(d.title)}</small></td><td>${esc(d.system)}</td><td>Rev ${esc(d.revision)}</td><td><span class="badge">${esc(d.status)}</span></td><td>${esc(d.acknowledged)}</td><td>${esc(d.impact)}</td></tr>`).join("")}</tbody></table></div></article>`;

      const quality=$("quality");
      const inspections=(data.inspections||[]).filter(i=>i.companyId===companyId);
      if(quality) quality.innerHTML=`
        <div class="section-head"><div><p class="eyebrow">QUALITY ASSURANCE</p><h2>Quality</h2><p>Inspection hold points, NCRs, rework, and release status by hull.</p></div></div>
        <div class="metric-grid"><article class="metric"><span>Open</span><strong>${inspections.filter(i=>i.status==="Open").length}</strong><small>inspection items</small></article><article class="metric"><span>QA Holds</span><strong>${inspections.filter(i=>i.status==="Hold").length}</strong><small>blocking progression</small></article><article class="metric"><span>Closed</span><strong>${inspections.filter(i=>i.status==="Closed").length}</strong><small>accepted items</small></article><article class="metric"><span>Critical</span><strong>${inspections.filter(i=>i.severity==="Critical").length}</strong><small>priority issues</small></article></div>
        <article class="panel"><div class="table-wrap"><table><thead><tr><th>Hull</th><th>Area</th><th>Inspection</th><th>Status</th><th>Severity</th><th>Finding / NCR</th><th>Owner</th></tr></thead><tbody>${inspections.map(i=>`<tr><td><strong>${esc(i.hull)}</strong></td><td>${esc(i.area)}</td><td>${esc(i.inspection)}</td><td><span class="badge">${esc(i.status)}</span></td><td>${esc(i.severity)}</td><td>${esc(i.finding)}</td><td>${esc(i.owner)}</td></tr>`).join("")}</tbody></table></div></article>`;

      const delivery=$("delivery");
      const trials=(data.seaTrials||[]).filter(s=>s.companyId===companyId);
      if(delivery) delivery.innerHTML=`
        <div class="section-head"><div><p class="eyebrow">COMMISSIONING</p><h2>Sea Trial & Delivery</h2><p>Delivery readiness, commissioning gates, sea trials, punch lists, and handoff.</p></div></div>
        <div class="card-grid">${trials.map(s=>`<article class="project-card"><div class="project-meta"><span class="badge">${esc(s.status)}</span><span>${esc(s.target)}</span></div><h3>${esc(s.hull)}</h3><small>Delivery readiness</small><div class="progress"><span style="width:${s.readiness}%"></span></div><div class="marine-stat-row"><span>Ready <b>${s.readiness}%</b></span><span>Punch <b>${s.punch}</b></span></div></article>`).join("")}</div>`;

      const warranty=$("warranty");
      const cases=(data.warrantyCases||[]).filter(w=>w.companyId===companyId);
      if(warranty) warranty.innerHTML=`
        <div class="section-head"><div><p class="eyebrow">CLOSED-LOOP QUALITY</p><h2>Warranty & Service</h2><p>Connect delivered hull issues back to components, suppliers, QA, engineering, and corrective action.</p></div></div>
        <article class="panel"><div class="pattern-alert"><strong>Recurring Pattern Detected</strong><span>Trim Pump Assembly · 3 demo cases across 39CC hulls</span><small>Suggested action: engineering and supplier review.</small></div></article>
        <article class="panel"><div class="table-wrap"><table><thead><tr><th>Hull</th><th>Component</th><th>Status</th><th>Dealer</th><th>Issue</th><th>Resolution</th></tr></thead><tbody>${cases.map(w=>`<tr><td>${esc(w.hull)}</td><td><strong>${esc(w.component)}</strong></td><td><span class="badge">${esc(w.status)}</span></td><td>${esc(w.dealer)}</td><td>${esc(w.summary)}</td><td>${esc(w.resolution)}</td></tr>`).join("")}</tbody></table></div></article>`;

      const models=$("models");
      if(models) models.innerHTML=`
        <div class="section-head"><div><p class="eyebrow">REUSABLE MANUFACTURING TEMPLATES</p><h2>Model Library</h2><p>Standard BOM, routing, drawings, work packages, labor standards, and QA plans used to create each new hull record.</p></div></div>
        <div class="card-grid">${(data.models||[]).filter(m=>m.companyId===companyId).map(m=>`<article class="project-card"><div class="project-meta"><span class="badge">${esc(m.family)}</span><span>${esc(m.bom)}</span></div><h3>Bertram ${esc(m.name)}</h3><small>${esc(m.routing)}</small><div class="marine-stat-row"><span>Drawings <b>${m.drawings}</b></span><span>QA Points <b>${m.qa}</b></span></div></article>`).join("")}</div>`;
    },

    athenaAnswer(question, ctx) {
      const q=String(question||"").toLowerCase();
      const hulls=ctx.companyRows("projects");
      if(q.includes("b50")||q.includes("late")||q.includes("delay")){
        return "B50-008 is the highest schedule risk. The demo generator is required before the current supplier ETA, which blocks generator installation, electrical commissioning, and final mechanical QA.";
      }
      if(q.includes("material")){
        const issues=ctx.companyRows("materials").filter(m=>m.status==="Delayed"||m.status==="Awaiting Confirmation");
        return `${issues.length} material exceptions need attention: ${issues.map(m=>m.project+" — "+m.items).join("; ")}.`;
      }
      if(q.includes("quality")||q.includes("qa")||q.includes("hold")){
        const issues=(ctx.state.inspections||[]).filter(i=>i.companyId===ctx.currentCompanyId&&i.status!=="Closed");
        return `${issues.length} QA items are open. Holds are currently affecting ${[...new Set(issues.filter(i=>i.status==="Hold").map(i=>i.hull))].join(", ")||"no hulls"}.`;
      }
      if(q.includes("drawing")||q.includes("revision")){
        return "EL-39-212 Rev E is the newest demo revision affecting B39-026. Electrical Team 2 still needs final acknowledgement before the work package closes.";
      }
      if(q.includes("warranty")||q.includes("trend")){
        return "The demo warranty data shows a recurring Trim Pump Assembly pattern across three 39CC hulls, which Atlas links back to engineering and supplier review.";
      }
      const risk=hulls.filter(h=>h.risk!=="On Schedule");
      return `Atlas Marine currently shows ${hulls.length} active demo hulls and ${risk.length} needing attention. Ask about B50-008, materials, QA holds, drawing revisions, or warranty trends.`;
    }
  };

  window.AtlasMarine = marine;
})();