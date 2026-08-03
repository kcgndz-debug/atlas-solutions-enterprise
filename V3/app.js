(() => {
"use strict";

const $ = id => document.getElementById(id);
const cfg = window.ATLAS_CONFIG || {};
const cloudConfigured = Boolean(window.supabase && cfg.supabaseUrl && cfg.supabaseAnonKey);
const supabase = cloudConfigured ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
}) : null;

const roleDefinitions = {
  owner:{label:"Owner / Superuser",caps:["dashboard","executive","mission","projects","estimates","schedule","crews","field","materials","finance","users","athena","settings"]},
  company_admin:{label:"Company Admin",caps:["dashboard","executive","mission","projects","estimates","schedule","crews","field","materials","finance","users","athena","settings"]},
  project_manager:{label:"Project Manager",caps:["dashboard","mission","projects","estimates","schedule","crews","field","materials","settings","athena"]},
  estimator:{label:"Estimator",caps:["dashboard","projects","estimates","materials","settings","athena"]},
  finance:{label:"Finance",caps:["dashboard","mission","projects","finance","settings","athena"]},
  crew_leader:{label:"Crew Lead",caps:["dashboard","projects","schedule","crews","field","materials","settings","athena"]},
  crew_member:{label:"Crew Member",caps:["dashboard","projects","schedule","crews","field","materials","settings","athena"]},
  purchasing:{label:"Purchasing",caps:["dashboard","mission","projects","schedule","materials","settings","athena"]},
  read_only:{label:"Read Only",caps:["dashboard","projects","schedule","settings","athena"]}
};

let account = null;
let state = null;
let currentCompanyId = "delamere";
let schedulerAnchor = startOfWeek(new Date());
let pendingSchedulePayload = null;
let deferredPrompt = null;

const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
const money = value => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Number(value)||0);
const esc = value => String(value ?? "").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const iso = date => {
  const d = new Date(date);
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
};
function startOfWeek(value){
  const d = new Date(value); d.setHours(12,0,0,0);
  const day = (d.getDay()+6)%7; d.setDate(d.getDate()-day);
  return d;
}
function datesBetween(start,end,weekdays){
  const list=[], cursor=new Date(`${start}T12:00:00`), last=new Date(`${end}T12:00:00`);
  while(cursor<=last){
    const weekday=(cursor.getDay()+6)%7;
    if(!weekdays.length || weekdays.includes(weekday)) list.push(iso(cursor));
    cursor.setDate(cursor.getDate()+1);
  }
  return list;
}
function titleCase(value){return String(value||"").trim().split(/\s+/).filter(Boolean).map(x=>x[0].toUpperCase()+x.slice(1).toLowerCase()).join(" ");}
function firstName(){
  const profile=account?.profile||{}, meta=account?.user?.user_metadata||{};
  const direct=profile.first_name||meta.first_name||profile.display_name||meta.full_name||account?.user?.email?.split("@")[0]||"there";
  return titleCase(String(direct).split(/[ ._-]/)[0]);
}
function displayName(){
  const p=account?.profile||{},m=account?.user?.user_metadata||{};
  return p.display_name||[p.first_name,p.last_name].filter(Boolean).join(" ")||m.full_name||m.name||account?.user?.email||"Atlas User";
}
function roleCode(){
  const raw=String(account?.membership?.role?.code||account?.profile?.role||"read_only").toLowerCase().replace(/[\s/-]+/g,"_");
  if(account?.profile?.is_platform_owner)return "owner";
  const aliases={superuser:"owner",owner_superuser:"owner",admin:"company_admin",pm:"project_manager",crewlead:"crew_leader"};
  return aliases[raw]||raw;
}
function currentCompany(){return state.companies.find(c=>c.id===currentCompanyId)||state.companies[0];}
function companyRows(key){return (state[key]||[]).filter(row=>row.companyId===currentCompanyId);}
function saveState(){
  localStorage.setItem("atlas_v4_demo_state",JSON.stringify(state));
  $("syncText").textContent="Saved locally";
  setTimeout(()=>$("syncText").textContent="Ready",700);
}
function timeGreeting(){
  const h=new Date().getHours();
  return h<12?"Good morning":h<18?"Good afternoon":"Good evening";
}
function showAuthMessage(text,type="error"){
  const el=$("authMessage"); el.textContent=text; el.classList.remove("hidden"); el.dataset.type=type;
}
function showStatus(text,type="info"){
  const el=$("userAdminStatus"); el.textContent=text; el.className=`status-banner ${type}`;
}
function hideStatus(){$("userAdminStatus").classList.add("hidden");}
function switchView(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  const labels={dashboard:["OPERATIONS","Dashboard"],mission:["COMPANY OPERATIONS","Mission Control"],projects:["PROJECT PORTFOLIO","Projects"],executive:["OWNER / EXECUTIVE COMMAND","Executive Overview"],estimates:["BID DEVELOPMENT","Estimating"],schedule:["OPERATIONS INTELLIGENCE","Operations Scheduler"],crews:["FIELD OPERATIONS","Crew Operations"],field:["CREW FIELD OPERATIONS","Field Operations"],materials:["PROCUREMENT","Material Requests"],finance:["COMPANY FINANCE","Finance"],users:["ACCESS & ACCOUNTABILITY","User Management"],athena:["ATLAS INTELLIGENCE","Athena"],settings:["SYSTEM","Settings"]};
  $("pageEyebrow").textContent=labels[id]?.[0]||"ATLAS";
  $("pageTitle").textContent=labels[id]?.[1]||"Atlas";
  window.scrollTo(0,0);
}

function demoSeed(){
  const companies=[
    {id:"delamere",name:"Delamere Industries"},
    {id:"day-metal",name:"Day Metal"}
  ];
  const pms=[
    {id:"pm-kendall",firstName:"Kendall",lastName:"G.",name:"Kendall G.",email:"kendall@delamere.demo",role:"project_manager",companyId:"delamere",status:"Active"},
    {id:"pm-john",firstName:"John",lastName:"R.",name:"John R.",email:"john@delamere.demo",role:"project_manager",companyId:"delamere",status:"Active"},
    {id:"pm-javier",firstName:"Javier",lastName:"M.",name:"Javier M.",email:"javier@delamere.demo",role:"project_manager",companyId:"delamere",status:"Active"},
    {id:"pm-mike",firstName:"Mike",lastName:"S.",name:"Mike S.",email:"mike@delamere.demo",role:"project_manager",companyId:"delamere",status:"Active"},
    {id:"pm-peter",firstName:"Peter",lastName:"L.",name:"Peter L.",email:"peter@delamere.demo",role:"project_manager",companyId:"delamere",status:"Active"}
  ];
  const users=[
    {id:"owner-demo",firstName:"Kendall",lastName:"G.",name:"Kendall G.",email:"owner@atlas.demo",role:"owner",companyId:"delamere",status:"Active"},
    {id:"admin-demo",firstName:"Ashley",lastName:"W.",name:"Ashley W.",email:"admin@delamere.demo",role:"company_admin",companyId:"delamere",status:"Active"},
    ...pms,
    {id:"finance-demo",firstName:"Nicole",lastName:"B.",name:"Nicole B.",email:"finance@delamere.demo",role:"finance",companyId:"delamere",status:"Active"},
    {id:"lead-a",firstName:"Marcus",lastName:"T.",name:"Marcus T.",email:"marcus@delamere.demo",role:"crew_leader",companyId:"delamere",status:"Active"},
    {id:"lead-b",firstName:"David",lastName:"C.",name:"David C.",email:"david@delamere.demo",role:"crew_leader",companyId:"delamere",status:"Active"},
    {id:"lead-c",firstName:"Luis",lastName:"P.",name:"Luis P.",email:"luis@delamere.demo",role:"crew_leader",companyId:"delamere",status:"Active"},
    {id:"lead-d",firstName:"Andre",lastName:"H.",name:"Andre H.",email:"andre@delamere.demo",role:"crew_leader",companyId:"delamere",status:"Active"},
    {id:"dm-owner",firstName:"Dana",lastName:"Y.",name:"Dana Y.",email:"owner@daymetal.demo",role:"owner",companyId:"day-metal",status:"Active"}
  ];

  const projectNames=[
    ["Orlando Airport Perimeter Rail","Orlando","FDOT","870 Aluminum Guiderail"],
    ["Miami Security Fence Program","Miami","Miami-Dade County","High Security Mesh"],
    ["Fort Myers Raising Cane's","Fort Myers","Raising Cane's","880 Steel Rail"],
    ["Lakeland Bullet Rail","Lakeland","City of Lakeland","822 Bullet Rail"],
    ["Wauchula Water Tower","Wauchula","Hardee County","Type B Chain Link"],
    ["Veterans Park Improvements","Tampa","Hillsborough County","Type R Railing"],
    ["Disney Service Corridor","Orlando","Disney","822 Bullet Rail"],
    ["Parrish Roadway Rail","Parrish","Manatee County","870 Aluminum Guiderail"],
    ["MCO Black Vinyl Fence","Orlando","Greater Orlando Aviation","Type B Fence"],
    ["Davie ADA Rail","Davie","Town of Davie","852 Sunshine Infill"],
    ["Reams Road South","Windermere","Orange County","822 Bullet Rail"],
    ["Seminole Retrofit Program","Sanford","Seminole County","Retrofit Rail"],
    ["Broward Materials Package","Fort Lauderdale","Broward County","822 Materials"],
    ["Polk Wildlife Fence","Lakeland","Polk County","Wildlife Mesh"],
    ["Downtown Streetscape","Brooksville","City of Brooksville","862 Picket Rail"],
    ["Suncoast Trail Rail","Spring Hill","FDOT","870 Aluminum Guiderail"],
    ["Sarasota Parking Garage","Sarasota","Sarasota County","862 Picket Rail"],
    ["Naples Pedestrian Rail","Naples","Collier County","852 ADA Rail"],
    ["Tampa Port Fence","Tampa","Port Tampa Bay","Type B Fence"],
    ["Ocala Distribution Center","Ocala","Private Developer","Chain Link & Gates"],
    ["Cape Coral Canal Rail","Cape Coral","City of Cape Coral","870 Aluminum Guiderail"],
    ["Kissimmee Resort Rail","Kissimmee","Private Developer","862 Picket Rail"],
    ["Clearwater Beach Rail","Clearwater","City of Clearwater","822 Bullet Rail"],
    ["Pasco Operations Yard","Dade City","Pasco County","Type B Fence"],
    ["Gainesville Transit Rail","Gainesville","City of Gainesville","880 Steel Rail"]
  ];
  const statuses=["Active","Active","Active","Shop Drawings","Materials","Scheduled","At Risk","Bid"];
  const projects=[];
  projectNames.forEach((row,i)=>{
    const pm=pms[i%pms.length];
    const bid=i%7===0;
    const value=85000+(i*47350)%620000;
    const paid=bid?0:Math.round(value*((i%5+2)/8));
    projects.push({
      id:`proj-${i+1}`,companyId:"delamere",name:row[0],location:row[1],customer:row[2],scope:row[3],
      pmId:pm.id,pmName:pm.name,status:bid?"Bid":statuses[i%statuses.length],
      progress:bid?0:10+(i*13)%86,contractValue:value,paidAmount:paid,
      startDate:iso(new Date(Date.now()+(i-8)*86400000)),color:["","red","blue","green"][i%4]
    });
  });
  for(let i=0;i<6;i++){
    projects.push({id:`dm-${i}`,companyId:"day-metal",name:`Day Metal Fabrication ${i+1}`,location:["Tampa","Orlando","Brooksville"][i%3],customer:"Commercial Client",scope:"Custom Aluminum Fabrication",pmId:"dm-owner",pmName:"Dana Y.",status:i<4?"Active":"Bid",progress:i<4?20+i*15:0,contractValue:65000+i*28000,paidAmount:i<4?20000+i*9000:0,startDate:iso(new Date()),color:["blue","green",""][i%3]});
  }

  const crews=[
    {id:"crew-a",companyId:"delamere",name:"Crew Alpha",lead:"Marcus T.",vehicle:"Truck 21",status:"Active",members:["Marcus T.","Eli J.","Carlos R.","Noah B."],equipment:["Core Drill","Generator","Impact Tools"]},
    {id:"crew-b",companyId:"delamere",name:"Crew Bravo",lead:"David C.",vehicle:"Truck 18",status:"Active",members:["David C.","Ramon S.","Tyler K.","Jose A."],equipment:["Skid Steer","Auger","Welding Rig"]},
    {id:"crew-c",companyId:"delamere",name:"Crew Charlie",lead:"Luis P.",vehicle:"Truck 14",status:"Active",members:["Luis P.","Marco D.","Chris E.","Jorge N."],equipment:["Concrete Mixer","Core Drill","Traffic Control"]},
    {id:"crew-d",companyId:"delamere",name:"Crew Delta",lead:"Andre H.",vehicle:"Truck 27",status:"Active",members:["Andre H.","Sean W.","Miguel C.","Derek F."],equipment:["Welding Rig","Lift","Generator"]},
    {id:"crew-e",companyId:"delamere",name:"Crew Echo",lead:"Isaac B.",vehicle:"Truck 11",status:"Available",members:["Isaac B.","Ben L.","Oscar M.","Trey P."],equipment:["Auger","Impact Tools","Trailer"]},
    {id:"dm-crew",companyId:"day-metal",name:"Day Metal Shop Crew",lead:"Dana Y.",vehicle:"Shop",status:"Active",members:["Dana Y.","Alex J.","Sam R.","Taylor K."],equipment:["Brake","Saw","Welder"]}
  ];

  const today=startOfWeek(new Date());
  const schedule=[];
  for(let d=0;d<14;d++){
    const date=new Date(today);date.setDate(date.getDate()+d);
    const crew=crews[d%5],project=projects[(d*2)%projectNames.length];
    schedule.push({id:`sch-${d}`,companyId:"delamere",date:iso(date),start:"07:00",end:"15:30",projectId:project.id,project:project.name,crewId:crew.id,crewName:crew.name,status:"Scheduled",color:project.color||["blue","green",""][d%3],additional:false});
  }
  // Intentional extra assignment for demonstrating conflict visibility.
  schedule.push({id:"sch-conflict",companyId:"delamere",date:schedule[3].date,start:"10:00",end:"14:00",projectId:projects[9].id,project:projects[9].name,crewId:schedule[3].crewId,crewName:schedule[3].crewName,status:"Scheduled",color:"red",additional:true});

  const materials=[
    {id:"mat-1",companyId:"delamere",project:projects[1].name,items:"Security mesh panels and tamper-resistant hardware",urgency:"Critical",status:"Open"},
    {id:"mat-2",companyId:"delamere",project:projects[2].name,items:"Powder coat confirmation and steel tube release",urgency:"High",status:"Ordered"},
    {id:"mat-3",companyId:"delamere",project:projects[7].name,items:"870 rail package — Phase 2",urgency:"Normal",status:"Approved"},
    {id:"mat-4",companyId:"delamere",project:projects[8].name,items:"Black vinyl fabric, posts, fittings, and gates",urgency:"High",status:"Open"},
    {id:"mat-5",companyId:"delamere",project:projects[10].name,items:"822 bullet rail components",urgency:"Normal",status:"Delivered"}
  ];
  const activity=[
    {id:"act-1",companyId:"delamere",text:"John assigned Crew Alpha to Orlando Airport Perimeter Rail.",time:"18 min ago"},
    {id:"act-2",companyId:"delamere",text:"Javier submitted a material shortage for MCO Black Vinyl Fence.",time:"42 min ago"},
    {id:"act-3",companyId:"delamere",text:"Finance recorded payment on Fort Myers Raising Cane's.",time:"1 hr ago"},
    {id:"act-4",companyId:"delamere",text:"Mike scheduled an inspection for Veterans Park Improvements.",time:"2 hrs ago"},
    {id:"act-5",companyId:"delamere",text:"Peter updated progress on Tampa Port Fence.",time:"3 hrs ago"}
  ];

  const estimates=[
    {id:"est-1",companyId:"delamere",name:"Orlando Airport Rail Package",customer:"Greater Orlando Aviation",location:"Orlando",pmId:"pm-kendall",pmName:"Kendall G.",scope:"870 Aluminum Guiderail",quantity:2862,unitPrice:52,total:148824,status:"Submitted",createdDate:iso(new Date(Date.now()-2*86400000))},
    {id:"est-2",companyId:"delamere",name:"Miami Security Fence Removal",customer:"Miami-Dade County",location:"Miami",pmId:"pm-john",pmName:"John R.",scope:"Fence Removal & Security Mesh",quantity:4811,unitPrice:28,total:134708,status:"Open",createdDate:iso(new Date(Date.now()-86400000))},
    {id:"est-3",companyId:"delamere",name:"Fort Myers Steel Rail",customer:"Raising Cane's",location:"Fort Myers",pmId:"pm-javier",pmName:"Javier M.",scope:"880 Steel Two-Rail",quantity:376,unitPrice:79,total:29704,status:"Won",createdDate:iso(new Date(Date.now()-8*86400000))},
    {id:"est-4",companyId:"delamere",name:"Lakeland Bullet Rail",customer:"City of Lakeland",location:"Lakeland",pmId:"pm-mike",pmName:"Mike S.",scope:"822 Bullet Rail",quantity:970,unitPrice:61,total:59170,status:"Submitted",createdDate:iso(new Date(Date.now()-4*86400000))},
    {id:"est-5",companyId:"delamere",name:"Wauchula Type B Fence",customer:"Hardee County",location:"Wauchula",pmId:"pm-peter",pmName:"Peter L.",scope:"Type B Chain Link & Gate",quantity:240,unitPrice:44,total:10560,status:"Lost",createdDate:iso(new Date(Date.now()-14*86400000))},
    {id:"est-6",companyId:"delamere",name:"Parrish Guiderail Phase 2",customer:"Manatee County",location:"Parrish",pmId:"pm-kendall",pmName:"Kendall G.",scope:"870 Aluminum Guiderail",quantity:8520,unitPrice:47,total:400440,status:"Open",createdDate:iso(new Date())}
  ];
  const fieldReports=[
    {id:"fr-1",companyId:"delamere",date:iso(new Date()),crewId:"crew-a",crewName:"Crew Alpha",projectId:"proj-1",project:"Orlando Airport Perimeter Rail",production:"Installed 312 LF of 870 guiderail",hours:9,weather:"Partly cloudy, 91°F",safety:"PPE and traffic control verified",equipmentReady:true,suppliesReady:true,issues:"None",photos:6,submittedBy:"Marcus T."},
    {id:"fr-2",companyId:"delamere",date:iso(new Date()),crewId:"crew-b",crewName:"Crew Bravo",projectId:"proj-9",project:"MCO Black Vinyl Fence",production:"Set 42 terminal and line posts",hours:8.5,weather:"Scattered storms, 89°F",safety:"Lightning stand-down completed",equipmentReady:true,suppliesReady:false,issues:"Black fittings short by 18 pieces",photos:4,submittedBy:"David C."},
    {id:"fr-3",companyId:"delamere",date:iso(new Date(Date.now()-86400000)),crewId:"crew-c",crewName:"Crew Charlie",projectId:"proj-4",project:"Lakeland Bullet Rail",production:"Completed core drilling and installed 146 LF",hours:10,weather:"Hot and humid, 94°F",safety:"Heat breaks documented",equipmentReady:true,suppliesReady:true,issues:"Two anchors require replacement",photos:8,submittedBy:"Luis P."},
    {id:"fr-4",companyId:"delamere",date:iso(new Date(Date.now()-86400000)),crewId:"crew-d",crewName:"Crew Delta",projectId:"proj-7",project:"Disney Service Corridor",production:"Installed 285 LF of 822 bullet rail",hours:9,weather:"Cloudy, 88°F",safety:"No incidents",equipmentReady:false,suppliesReady:true,issues:"Generator requires service",photos:5,submittedBy:"Andre H."}
  ];
  const weatherByLocation={
    Orlando:{condition:"Partly Cloudy",temp:91,high:94,low:77,precip:35,wind:"E 9 mph",impact:"Afternoon storms possible after 3 PM."},
    Miami:{condition:"Scattered Thunderstorms",temp:89,high:91,low:80,precip:65,wind:"SE 12 mph",impact:"Plan around lightning and wet-site access."},
    "Fort Myers":{condition:"Mostly Sunny",temp:92,high:95,low:78,precip:25,wind:"SW 8 mph",impact:"Heat precautions recommended."},
    Lakeland:{condition:"Hot & Humid",temp:94,high:96,low:76,precip:40,wind:"S 7 mph",impact:"Heat index may affect production."},
    Wauchula:{condition:"Partly Cloudy",temp:93,high:96,low:75,precip:30,wind:"S 6 mph",impact:"Monitor afternoon storm development."},
    Tampa:{condition:"Scattered Storms",temp:90,high:92,low:79,precip:55,wind:"SW 11 mph",impact:"Short weather delays possible."},
    Brooksville:{condition:"Mostly Sunny",temp:92,high:95,low:74,precip:20,wind:"E 6 mph",impact:"Good installation conditions; hydrate crews."}
  };

  return {companies,users,projects,crews,schedule,materials,activity,estimates,fieldReports,weatherByLocation};
}

function loadDemoState(reset=false){
  const saved=!reset && localStorage.getItem("atlas_v4_demo_state");
  state=saved?JSON.parse(saved):demoSeed();
  saveState();
}

async function loadCloudAccount(user){
  const {data:profile,error:profileError}=await supabase.from("profiles").select("*").eq("user_id",user.id).maybeSingle();
  if(profileError)throw profileError;
  if(!profile)throw new Error("Your authentication account exists, but the Atlas profile is missing.");
  const {data:memberships,error:memberError}=await supabase.from("company_memberships").select("id,user_id,company_id,role_id,is_active").eq("user_id",user.id).eq("is_active",true);
  if(memberError)throw memberError;
  if(!profile.is_platform_owner && !(memberships||[]).length)throw new Error("Your account does not have an active company membership.");
  const companyIds=[...new Set((memberships||[]).map(x=>x.company_id))];
  const roleIds=[...new Set((memberships||[]).map(x=>x.role_id))];
  const companies=companyIds.length?(await supabase.from("companies").select("*").in("id",companyIds)).data||[]:[];
  const roles=roleIds.length?(await supabase.from("roles").select("*").in("id",roleIds)).data||[]:[];
  const enriched=(memberships||[]).map(m=>({...m,company:companies.find(c=>c.id===m.company_id),role:roles.find(r=>r.id===m.role_id)}));
  account={mode:"cloud",user,profile,memberships:enriched,membership:enriched[0]};
  // V4 keeps presentation data available locally until real operational tables are connected.
  loadDemoState();
  if(companies.length){
    state.companies=companies.map(c=>({id:c.id,name:c.name}));
    currentCompanyId=companies[0].id;
  }
  enterApp();
}

function openDemo(){
  loadDemoState();
  account={mode:"demo",user:{id:"owner-demo",email:"owner@atlas.demo"},profile:{first_name:"Kendall",last_name:"G.",display_name:"Kendall G.",is_platform_owner:true},memberships:[{company_id:"delamere",role:{code:"owner",display_name:"Owner / Superuser"}}],membership:{company_id:"delamere",role:{code:"owner",display_name:"Owner / Superuser"}}};
  currentCompanyId="delamere";
  enterApp();
}

function enterApp(){
  $("authScreen").classList.add("hidden");$("appShell").classList.remove("hidden");
  const initials=displayName().split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();
  $("signedName").textContent=displayName();$("signedEmail").textContent=account.user.email||"";$("signedInitials").textContent=initials;
  $("sideUser").textContent=displayName();$("sideRole").textContent=roleDefinitions[roleCode()]?.label||roleCode();
  $("roleBadge").textContent=roleDefinitions[roleCode()]?.label||roleCode();
  applyPermissions();renderWorkspace();renderAll();switchView("dashboard");
}

function applyPermissions(){
  const allowed=new Set(roleDefinitions[roleCode()]?.caps||roleDefinitions.read_only.caps);
  document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("hidden",!allowed.has(b.dataset.view)));
}
function renderWorkspace(){
  $("workspaceSelect").innerHTML=state.companies.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join("");
  $("workspaceSelect").value=currentCompanyId;
}

function renderAll(){
  renderDashboard();renderExecutive();renderMission();renderProjects();renderEstimates();renderEstimateCalculator();renderScheduler();renderCrews();renderFieldOperations();renderMaterials();renderFinance();renderUsers();renderRoles();renderAthena();renderSettings();
}
function renderDashboard(){
  const projects=companyRows("projects"),crews=companyRows("crews"),materials=companyRows("materials");
  const active=projects.filter(p=>p.status!=="Bid"&&p.status!=="Completed");
  const bids=projects.filter(p=>p.status==="Bid");
  const today=iso(new Date());
  const todays=companyRows("schedule").filter(x=>x.date===today);
  const outstanding=projects.reduce((s,p)=>s+Math.max(0,(p.contractValue||0)-(p.paidAmount||0)),0);
  $("smartGreeting").textContent=`${timeGreeting()}, ${firstName()}`;
  $("dailyBrief").textContent=`${active.length} active projects, ${todays.length} assignments today, and ${materials.filter(m=>m.urgency==="Critical"&&m.status!=="Delivered").length} critical material item${materials.filter(m=>m.urgency==="Critical"&&m.status!=="Delivered").length===1?"":"s"} need review.`;
  $("mProjects").textContent=active.length;$("mBids").textContent=bids.length;$("mBidValue").textContent=`${money(bids.reduce((s,p)=>s+p.contractValue,0))} pipeline`;
  const working=new Set(todays.map(x=>x.crewId));$("mCrews").textContent=working.size;$("mCrewSub").textContent=`${Math.max(0,crews.length-working.size)} available`;
  $("mOutstanding").textContent=money(outstanding);
  $("dashboardSchedule").innerHTML=todays.length?todays.map(item=>`<div class="list-row"><div><strong>${esc(item.project)}</strong><small>${esc(item.start)}–${esc(item.end)} · ${esc(item.crewName)}</small></div><span class="badge">${esc(item.status)}</span></div>`).join(""):'<div class="empty">No work scheduled today.</div>';
  $("dashboardCrews").innerHTML=crews.map(c=>{const job=todays.find(x=>x.crewId===c.id);return `<div class="list-row"><div><strong>${esc(c.name)}</strong><small>${esc(c.lead)} · ${c.members.length} people · ${esc(c.vehicle)}</small></div><span class="badge">${job?"Working":"Available"}</span></div>`}).join("");
  const pms=state.users.filter(u=>u.companyId===currentCompanyId&&u.role==="project_manager");
  $("pmWorkload").innerHTML=pms.map(pm=>{const pp=projects.filter(p=>p.pmId===pm.id),pb=pp.filter(p=>p.status==="Bid"),risk=pp.filter(p=>["At Risk","Shop Drawings"].includes(p.status));return `<article class="pm-card"><strong>${esc(pm.name)}</strong><small>${esc(pm.email)}</small><div class="pm-metrics"><div><b>${pp.filter(p=>p.status!=="Bid").length}</b><small>Active</small></div><div><b>${pb.length}</b><small>Bids</small></div><div><b>${risk.length}</b><small>Risk</small></div></div><small>${money(pp.reduce((s,p)=>s+p.contractValue,0))} total workload</small></article>`}).join("");
  const alerts=[];
  materials.filter(m=>m.urgency==="Critical"&&m.status!=="Delivered").forEach(m=>alerts.push({title:`Critical materials — ${m.project}`,detail:m.items}));
  projects.filter(p=>p.status==="At Risk").forEach(p=>alerts.push({title:`Project at risk — ${p.name}`,detail:`${p.pmName} · ${p.progress}% complete`}));
  findConflicts().forEach(c=>alerts.push({title:`Crew conflict — ${c.crewName}`,detail:c.date}));
  $("dashboardAlerts").innerHTML=alerts.length?alerts.slice(0,7).map(a=>`<div class="list-row"><div><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></div></div>`).join(""):'<div class="empty">No immediate alerts.</div>';
  $("activityFeed").innerHTML=companyRows("activity").map(a=>`<div class="list-row"><div><strong>${esc(a.text)}</strong><small>${esc(a.time)}</small></div></div>`).join("");
  renderDashboardWeather();
  const fieldReports=companyRows("fieldReports").slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  $("dashboardFieldReports").innerHTML=fieldReports.length?fieldReports.map(r=>`<div class="list-row"><div><strong>${esc(r.crewName)} — ${esc(r.project)}</strong><small>${esc(r.production)} · ${esc(r.issues||"No issues")}</small></div><span class="badge">${r.photos||0} photos</span></div>`).join(""):'<div class="empty">No field reports yet.</div>';
}
function findConflicts(){
  const map=new Map(),conflicts=[];
  companyRows("schedule").forEach(item=>{
    const key=`${item.crewId}|${item.date}`;
    if(map.has(key))conflicts.push({crewName:item.crewName,date:item.date,items:[map.get(key),item]});
    else map.set(key,item);
  });
  return conflicts;
}

function weatherForLocation(location){
  return state.weatherByLocation?.[location]||{condition:"Conditions Available",temp:90,high:93,low:76,precip:35,wind:"Variable 8 mph",impact:"Check local conditions before mobilizing."};
}
function renderDashboardWeather(){
  const projects=companyRows("projects").filter(p=>p.status!=="Bid");
  const select=$("dashboardWeatherProject"),prior=select.value;
  select.innerHTML=projects.map(p=>`<option value="${esc(p.id)}">${esc(p.name)} — ${esc(p.location)}</option>`).join("");
  select.value=projects.some(p=>p.id===prior)?prior:(projects[0]?.id||"");
  const project=projects.find(p=>p.id===select.value)||projects[0];
  if(!project){$("dashboardWeatherCard").innerHTML='<div class="empty">No project selected.</div>';return;}
  const w=weatherForLocation(project.location);
  $("dashboardWeatherCard").innerHTML=`<div class="weather-main"><div><strong>${esc(project.location)}</strong><small>${esc(project.name)}</small></div><b>${w.temp}°F</b></div><div class="weather-stats"><div><span>Condition</span><strong>${esc(w.condition)}</strong></div><div><span>High / Low</span><strong>${w.high}° / ${w.low}°</strong></div><div><span>Rain</span><strong>${w.precip}%</strong></div><div><span>Wind</span><strong>${esc(w.wind)}</strong></div></div><div class="weather-impact"><strong>Operational impact</strong><small>${esc(w.impact)}</small></div>`;
}
function renderExecutive(){
  const projects=companyRows("projects"),active=projects.filter(p=>p.status!=="Bid"&&p.status!=="Completed"),bids=projects.filter(p=>p.status==="Bid"),crews=companyRows("crews"),schedule=companyRows("schedule"),materials=companyRows("materials");
  const contract=active.reduce((s,p)=>s+p.contractValue,0),paid=active.reduce((s,p)=>s+p.paidAmount,0),owed=contract-paid;
  const today=iso(new Date()),deployed=new Set(schedule.filter(x=>x.date===today).map(x=>x.crewId));
  const risks=active.filter(p=>["At Risk","Shop Drawings"].includes(p.status)),critical=materials.filter(m=>m.urgency==="Critical"&&m.status!=="Delivered"),conflicts=findConflicts();
  $("xActiveValue").textContent=money(contract);$("xActiveProjects").textContent=`${active.length} active projects`;
  $("xPaid").textContent=money(paid);$("xPaidPercent").textContent=`${contract?Math.round(paid/contract*100):0}% collected`;
  $("xOwed").textContent=money(owed);$("xPipeline").textContent=money(bids.reduce((s,p)=>s+p.contractValue,0));$("xBidCount").textContent=`${bids.length} current bids`;
  $("xCrews").textContent=deployed.size;$("xCrewAvailable").textContent=`${Math.max(0,crews.length-deployed.size)} available`;
  $("xRisk").textContent=risks.length;$("xCriticalMaterials").textContent=critical.length;$("xConflicts").textContent=conflicts.length;
  const pms=state.users.filter(u=>u.companyId===currentCompanyId&&u.role==="project_manager");
  const pmRows=pms.map(pm=>{const pp=projects.filter(p=>p.pmId===pm.id),pa=pp.filter(p=>p.status!=="Bid"),pb=pp.filter(p=>p.status==="Bid"),pc=pa.reduce((s,p)=>s+p.contractValue,0),pd=pa.reduce((s,p)=>s+p.paidAmount,0);return {pm,active:pa.length,bids:pb.length,contract:pc,paid:pd,owed:pc-pd,risk:pa.filter(p=>["At Risk","Shop Drawings"].includes(p.status)).length};});
  $("executivePmTable").innerHTML=`<table><thead><tr><th>PM</th><th>Active</th><th>Bids</th><th>Contract</th><th>Paid</th><th>Owed</th><th>Risk</th></tr></thead><tbody>${pmRows.map(r=>`<tr><td>${esc(r.pm.name)}</td><td>${r.active}</td><td>${r.bids}</td><td>${money(r.contract)}</td><td>${money(r.paid)}</td><td>${money(r.owed)}</td><td>${r.risk}</td></tr>`).join("")}</tbody></table>`;
  const attention=[...risks.map(p=>({title:p.name,detail:`${p.status} · ${p.pmName} · ${money(p.contractValue-p.paidAmount)} owed`})),...critical.map(m=>({title:`Critical material — ${m.project}`,detail:m.items})),...conflicts.map(c=>({title:`Crew conflict — ${c.crewName}`,detail:c.date}))];
  $("executiveAttention").innerHTML=attention.length?attention.slice(0,10).map(a=>`<div class="list-row"><div><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></div></div>`).join(""):'<div class="empty">No executive attention items.</div>';
  const maxContract=Math.max(1,...pmRows.map(r=>r.contract));
  $("executiveCashByPm").innerHTML=pmRows.map(r=>`<div class="exec-bar-row"><div><strong>${esc(r.pm.name)}</strong><small>${money(r.paid)} paid · ${money(r.owed)} owed</small></div><div class="exec-bar"><span style="width:${Math.round(r.contract/maxContract*100)}%"></span><i style="width:${r.contract?Math.round(r.paid/r.contract*100):0}%"></i></div></div>`).join("");
  $("executiveCrewStatus").innerHTML=crews.map(c=>{const job=schedule.find(x=>x.date===today&&x.crewId===c.id);return `<div class="list-row"><div><strong>${esc(c.name)}</strong><small>${esc(c.lead)} · ${esc(c.vehicle)}</small></div><span class="badge">${job?esc(job.project):"Available"}</span></div>`}).join("");
  $("executiveProjectRows").innerHTML=active.slice().sort((a,b)=>a.pmName.localeCompare(b.pmName)).map(p=>`<tr><td>${esc(p.pmName)}</td><td>${esc(p.name)}</td><td>${esc(p.location)}</td><td>${esc(p.status)}</td><td>${p.progress}%</td><td>${money(p.contractValue)}</td><td>${money(p.paidAmount)}</td><td>${money(p.contractValue-p.paidAmount)}</td></tr>`).join("");
}

const estimatePresets={
  "870":{base:35,production:400,profitMethod:"perunit",profitValue:10,hoops:2,hoopPrice:100,miterPrice:600,scope:"870 Aluminum Two-Rail Guiderail"},
  "880":{base:45,production:400,profitMethod:"perunit",profitValue:15,hoops:2,hoopPrice:100,miterPrice:600,scope:"880 Steel Two-Rail Guiderail"},
  "822":{base:40,production:300,profitMethod:"perunit",profitValue:20,hoops:2,hoopPrice:100,miterPrice:600,scope:"822 Bullet Rail"},
  "862":{base:72,production:400,profitMethod:"perunit",profitValue:25,hoops:2,hoopPrice:100,miterPrice:600,scope:"862 Type 1 Picket Rail"},
  "852":{base:55,production:400,profitMethod:"perunit",profitValue:18,hoops:2,hoopPrice:100,miterPrice:600,scope:"852 Sunshine Infill Rail"},
  "retrofit":{base:55,production:500,profitMethod:"perunit",profitValue:15,hoops:0,hoopPrice:100,miterPrice:600,scope:"Retrofit Rail"},
  "typeb":{base:16.78,production:200,profitMethod:"perunit",profitValue:0,hoops:0,hoopPrice:0,miterPrice:0,scope:"Type B Chain Link Fence"},
  "custom":{base:0,production:400,profitMethod:"perunit",profitValue:0,hoops:0,hoopPrice:100,miterPrice:600,scope:"Custom Scope"}
};
function num(id){return Number($(id)?.value||0);}
function roundUnit(value,mode){
  if(mode==="none")return value;
  if(mode==="up")return Math.ceil(value);
  if(mode==="down")return Math.floor(value);
  return Math.round(value);
}
function calculateEstimate(){
  const qty=Math.max(0,num("calcQty")),base=num("calcBase"),production=Math.max(1,num("calcProduction"));
  const laborDays=qty/production,labor=laborDays*num("calcLaborRate");
  const travelLabor=num("calcTravelDays")*num("calcTravelRate");
  const mileage=num("calcMiles")*num("calcMileageRate");
  const hotel=num("calcHotelNights")*num("calcHotelRate");
  const hoops=num("calcHoopQty")*num("calcHoopPrice");
  const miters=num("calcMiterQty")*num("calcMiterPrice");
  const baseTotal=qty*base,finish=num("calcFinishAdder"),direct=num("calcDirectAdder"),equipment=num("calcEquipment"),permit=num("calcPermit");
  const subtotal=baseTotal+labor+travelLabor+mileage+hotel+equipment+permit+hoops+miters+finish+direct;
  const method=$("calcProfitMethod")?.value||"perunit",pv=num("calcProfitValue");
  const profit=method==="percent"?subtotal*(pv/100):method==="lump"?pv:qty*pv;
  const beforeTax=subtotal+profit;
  const taxMode=$("calcTaxMode")?.value||"none",taxRate=num("calcTaxRate")/100;
  const taxable=taxMode==="materials"?baseTotal+hoops+miters+finish+direct:taxMode==="all"?beforeTax:0;
  const tax=taxable*taxRate;
  const rawTotal=beforeTax+tax;
  const rawUnit=qty?rawTotal/qty:0;
  const finalUnit=roundUnit(rawUnit,$("calcRounding")?.value||"whole");
  const finalTotal=qty?finalUnit*qty:rawTotal;
  return {qty,baseTotal,laborDays,labor,travelLabor,mileage,hotel,equipment,permit,hoops,miters,finish,direct,subtotal,profit,tax,rawTotal,rawUnit,finalUnit,finalTotal};
}
function renderEstimateCalculator(){
  const pms=state.users.filter(u=>u.companyId===currentCompanyId&&u.role==="project_manager");
  const prior=$("calcPm")?.value;
  if($("calcPm")){
    $("calcPm").innerHTML=pms.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("");
    if(pms.some(p=>p.id===prior))$("calcPm").value=prior;
  }
  if(!$("calcQty"))return;
  const r=calculateEstimate();
  $("calcFinalTotal").textContent=money(r.finalTotal);$("calcFinalUnit").textContent=money(r.finalUnit);
  const rows=[
    ["Base materials / system",r.baseTotal],["Installation labor",r.labor],["Travel labor",r.travelLabor],
    ["Mileage",r.mileage],["Hotel",r.hotel],["Equipment / mobilization",r.equipment],["Permit / other",r.permit],
    ["Hoops",r.hoops],["Mitered ends",r.miters],["Finish / coating",r.finish],["Additional direct costs",r.direct],
    ["Subtotal before profit",r.subtotal],["Profit",r.profit],["Applicable tax",r.tax],["Raw calculated total",r.rawTotal]
  ];
  $("calcBreakdown").innerHTML=rows.map(([label,value])=>`<div><span>${esc(label)}</span><strong>${money(value)}</strong></div>`).join("");
  $("calcFormulaText").textContent=`${r.qty.toLocaleString()} units × base + ${r.laborDays.toFixed(2)} crew-days + travel + adders + profit + tax = ${money(r.rawTotal)} raw; ${money(r.finalUnit)}/unit after rounding.`;
}
function applyEstimatePreset(){
  const p=estimatePresets[$("calcProduct").value]||estimatePresets.custom;
  $("calcBase").value=p.base;$("calcProduction").value=p.production;$("calcProfitMethod").value=p.profitMethod;$("calcProfitValue").value=p.profitValue;
  $("calcHoopQty").value=p.hoops;$("calcHoopPrice").value=p.hoopPrice;$("calcMiterPrice").value=p.miterPrice;$("calcScope").value=p.scope;
  renderEstimateCalculator();
}
function clearEstimateCalculator(){
  $("calcName").value="";$("calcCustomer").value="";$("calcLocation").value="";$("calcQty").value=1000;$("calcMiles").value=0;$("calcHotelNights").value=0;
  $("calcTravelDays").value=0;$("calcEquipment").value=0;$("calcPermit").value=0;$("calcMiterQty").value=0;$("calcFinishAdder").value=0;$("calcDirectAdder").value=0;
  $("calcProduct").value="870";applyEstimatePreset();
}
function saveCalculatedEstimate(){
  const r=calculateEstimate(),pm=state.users.find(u=>u.id===$("calcPm").value);
  if(!$("calcName").value.trim())return alert("Enter an estimate name.");
  state.estimates.push({id:uid(),companyId:currentCompanyId,name:$("calcName").value.trim(),customer:$("calcCustomer").value.trim(),location:$("calcLocation").value.trim(),pmId:pm?.id||"",pmName:pm?.name||"",scope:$("calcScope").value.trim(),quantity:r.qty,unitPrice:r.finalUnit,total:r.finalTotal,status:$("calcStatus").value,createdDate:iso(new Date()),formula:{...r,product:$("calcProduct").value}});
  saveState();renderAll();alert("Estimate saved to the Atlas pipeline.");
}
function copyEstimateSummary(){
  const r=calculateEstimate(),text=`${$("calcName").value||"Atlas Estimate"}\nScope: ${$("calcScope").value}\nQuantity: ${r.qty.toLocaleString()}\nSell Price: ${money(r.finalUnit)} per unit\nTotal: ${money(r.finalTotal)}\nFormula: ${$("calcFormulaText").textContent}`;
  navigator.clipboard?.writeText(text).then(()=>alert("Estimate summary copied.")).catch(()=>alert(text));
}

const athenaTourSteps=[
  {view:"dashboard",title:"Welcome to Atlas",text:"The Dashboard gives each user a time-aware greeting, today’s schedule, crew readiness, project weather, PM workload, alerts, and field activity."},
  {view:"executive",title:"Owner / Executive Command",text:"Owners see company-wide contract value, paid and outstanding balances, bids, crews, risk, materials, conflicts, and every project manager’s portfolio."},
  {view:"projects",title:"Project Portfolio",text:"Search all projects by customer, location, status, or project manager. Each card shows scope, value, progress, and ownership."},
  {view:"estimates",title:"Formula-Driven Estimating",text:"Choose a product preset, enter quantity, production, labor, travel, hoops, ends, profit, tax, and rounding. Atlas shows the complete calculation and final unit price."},
  {view:"schedule",title:"Operations Scheduler",text:"Schedule one or multiple days, assign crews, color-code work, jump to a week, and receive a warning before double-booking a crew."},
  {view:"field",title:"Field Operations",text:"Crew leads submit production, hours, safety, weather, equipment, supply, issue, and photo information from the field."},
  {view:"finance",title:"Financial Control",text:"Finance and Owners can inspect contract, paid, owed, and running totals for each project manager and project."},
  {view:"users",title:"Users & Privileges",text:"Owners and Company Admins add users, assign companies and roles, and control privileges without giving everyone full access."},
  {view:"athena",title:"Athena Is Always Available",text:"Return here for a daily operating brief, recommended actions, quick guides, and help understanding Atlas."}
];
let athenaTourIndex=0;
function renderAthena(){
  if(!$("athenaGreeting"))return;
  const projects=companyRows("projects"),materials=companyRows("materials"),reports=companyRows("fieldReports");
  const risks=projects.filter(p=>["At Risk","Shop Drawings"].includes(p.status)),conflicts=findConflicts(),critical=materials.filter(m=>m.urgency==="Critical"&&m.status!=="Delivered"),today=iso(new Date()),todayReports=reports.filter(r=>r.date===today);
  $("athenaGreeting").textContent=`${timeGreeting()}, ${firstName()}`;
  $("athenaBriefText").textContent=`You have ${projects.filter(p=>p.status!=="Bid").length} active projects, ${conflicts.length} schedule conflict${conflicts.length===1?"":"s"}, ${critical.length} critical material item${critical.length===1?"":"s"}, and ${todayReports.length} field report${todayReports.length===1?"":"s"} today.`;
  const recs=[
    ...conflicts.map(c=>({title:`Resolve ${c.crewName} double-booking`,detail:`Two assignments appear on ${c.date}.`})),
    ...critical.map(m=>({title:`Release critical materials`,detail:`${m.project}: ${m.items}`})),
    ...risks.map(p=>({title:`Review ${p.name}`,detail:`${p.status} · ${p.pmName} · ${p.progress}% complete`})),
    ...reports.filter(r=>!r.equipmentReady||!r.suppliesReady).map(r=>({title:`Field readiness issue — ${r.crewName}`,detail:`${r.equipmentReady?"":"Equipment issue. "}${r.suppliesReady?"":"Supply issue."}`}))
  ];
  $("athenaRecommendations").innerHTML=recs.length?recs.slice(0,10).map(r=>`<div class="list-row"><div><strong>${esc(r.title)}</strong><small>${esc(r.detail)}</small></div></div>`).join(""):'<div class="empty">Athena found no urgent issues.</div>';
}
function startAthenaTour(startView="dashboard"){
  const index=athenaTourSteps.findIndex(s=>s.view===startView);athenaTourIndex=index>=0?index:0;
  $("athenaTourOverlay").classList.remove("hidden");showAthenaTourStep();
}
function showAthenaTourStep(){
  const step=athenaTourSteps[athenaTourIndex];switchView(step.view);
  $("athenaTourTitle").textContent=step.title;$("athenaTourText").textContent=step.text;
  $("athenaTourProgress").style.width=`${((athenaTourIndex+1)/athenaTourSteps.length)*100}%`;
  $("athenaTourBack").disabled=athenaTourIndex===0;$("athenaTourNext").textContent=athenaTourIndex===athenaTourSteps.length-1?"Finish":"Next";
}
function athenaAnswer(question){
  const q=question.toLowerCase();
  if(q.includes("estimate")||q.includes("price")||q.includes("formula"))return "Open Estimating. Select the rail or fence system, enter quantity and base cost, then add production, labor, travel, hoops, mitered ends, equipment, profit, tax, and rounding. Atlas shows every line of the formula before you save.";
  if(q.includes("schedule")||q.includes("crew"))return "Use Operations Scheduler to select a project, crew, date range, weekdays, times, and slot color. Atlas warns when that crew is already assigned on a selected date.";
  if(q.includes("finance")||q.includes("paid")||q.includes("owed"))return "Finance shows contract, paid, owed, and running totals by project manager. Owners also see the company-wide position in Executive Overview.";
  if(q.includes("user")||q.includes("login")||q.includes("role"))return "User Management lets an Owner or Company Admin add a user, choose the company, and assign a role such as Project Manager, Finance, Crew Lead, or Read Only.";
  if(q.includes("weather"))return "Project weather appears on the Dashboard. Select a project to see location conditions and operational impact.";
  return "I can guide you through Dashboard, Executive, Projects, Estimating, Scheduling, Field Operations, Finance, and User Management. Ask about any one of those areas.";
}

function renderEstimates(){
  const estimates=companyRows("estimates"),statuses=[...new Set(estimates.map(e=>e.status))].sort(),pms=[...new Set(estimates.map(e=>e.pmName))].sort();
  const oldStatus=$("estimateStatusFilter").value,oldPm=$("estimatePmFilter").value;
  $("estimateStatusFilter").innerHTML='<option value="">All Statuses</option>'+statuses.map(x=>`<option>${esc(x)}</option>`).join("");
  $("estimatePmFilter").innerHTML='<option value="">All Project Managers</option>'+pms.map(x=>`<option>${esc(x)}</option>`).join("");
  $("estimateStatusFilter").value=oldStatus;$("estimatePmFilter").value=oldPm;
  const open=estimates.filter(e=>["Open","Submitted"].includes(e.status)),submitted=estimates.filter(e=>e.status==="Submitted"),won=estimates.filter(e=>e.status==="Won"),decided=estimates.filter(e=>["Won","Lost"].includes(e.status));
  $("eOpen").textContent=open.length;$("eSubmitted").textContent=money(submitted.reduce((s,e)=>s+e.total,0));$("eWon").textContent=money(won.reduce((s,e)=>s+e.total,0));$("eWinRate").textContent=`${decided.length?Math.round(won.length/decided.length*100):0}%`;
  const q=$("estimateSearch").value.toLowerCase(),status=$("estimateStatusFilter").value,pm=$("estimatePmFilter").value;
  const filtered=estimates.filter(e=>(!q||[e.name,e.customer,e.location,e.pmName,e.scope].join(" ").toLowerCase().includes(q))&&(!status||e.status===status)&&(!pm||e.pmName===pm));
  $("estimateList").innerHTML=filtered.map(e=>`<article class="project-card"><div class="project-meta"><span class="badge">${esc(e.status)}</span><span>${money(e.total)}</span></div><h3>${esc(e.name)}</h3><small>${esc(e.customer)} · ${esc(e.location)}</small><small>${esc(e.scope)}</small><div class="project-meta"><span>${esc(e.pmName)}</span><span>${Number(e.quantity).toLocaleString()} × ${money(e.unitPrice)}</span></div></article>`).join("")||'<div class="empty">No estimates match the filters.</div>';
}
function renderFieldOperations(){
  const reports=companyRows("fieldReports"),today=iso(new Date()),todayReports=reports.filter(r=>r.date===today);
  $("fieldReportsToday").textContent=todayReports.length;$("fieldOpenIssues").textContent=reports.filter(r=>r.issues&&r.issues!=="None").length;$("fieldCrewsReporting").textContent=new Set(todayReports.map(r=>r.crewId)).size;$("fieldPhotos").textContent=reports.reduce((s,r)=>s+(r.photos||0),0);
  $("fieldReportList").innerHTML=reports.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<div class="field-report-card"><div class="project-meta"><span>${esc(r.date)}</span><span>${r.hours} hrs</span></div><h3>${esc(r.project)}</h3><small>${esc(r.crewName)} · Submitted by ${esc(r.submittedBy)}</small><p><strong>Production:</strong> ${esc(r.production)}</p><p><strong>Weather:</strong> ${esc(r.weather)}</p><p><strong>Safety:</strong> ${esc(r.safety)}</p><p><strong>Issues:</strong> ${esc(r.issues||"None")}</p><div class="project-meta"><span>${r.photos||0} photos</span><span>${r.equipmentReady?"Equipment ready":"Equipment issue"} · ${r.suppliesReady?"Supplies ready":"Supply issue"}</span></div></div>`).join("");
  $("fieldReadinessList").innerHTML=reports.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<div class="list-row"><div><strong>${esc(r.crewName)}</strong><small>${esc(r.project)} · ${esc(r.date)}</small></div><div><span class="badge">${r.equipmentReady?"Equipment Ready":"Equipment Issue"}</span><small>${r.suppliesReady?"Supplies Ready":"Supply Issue"}</small></div></div>`).join("");
}

function renderMission(){
  const projects=companyRows("projects"),schedule=companyRows("schedule"),materials=companyRows("materials");
  const risk=projects.filter(p=>["At Risk","Shop Drawings"].includes(p.status));
  const unassigned=schedule.filter(x=>!x.crewId),critical=materials.filter(m=>m.urgency==="Critical"&&m.status!=="Delivered"),conflicts=findConflicts();
  $("missionRisk").textContent=risk.length;$("missionUnassigned").textContent=unassigned.length;$("missionMaterials").textContent=critical.length;$("missionConflicts").textContent=conflicts.length;
  $("missionProjects").innerHTML=projects.filter(p=>p.status!=="Bid").slice(0,12).map(p=>`<div class="list-row"><div><strong>${esc(p.name)}</strong><small>${esc(p.pmName)} · ${esc(p.location)} · ${esc(p.status)}</small><div class="progress"><span style="width:${p.progress}%"></span></div></div><span>${p.progress}%</span></div>`).join("");
  const attention=[
    ...critical.map(x=>({title:x.project,detail:x.items})),
    ...risk.map(x=>({title:x.name,detail:`${x.status} · ${x.pmName}`})),
    ...conflicts.map(x=>({title:`${x.crewName} double-booked`,detail:x.date}))
  ];
  $("missionAttention").innerHTML=attention.length?attention.map(x=>`<div class="list-row"><div><strong>${esc(x.title)}</strong><small>${esc(x.detail)}</small></div></div>`).join(""):'<div class="empty">Operations are clear.</div>';
}
function renderProjects(){
  const projects=companyRows("projects");
  const pms=[...new Set(projects.map(p=>p.pmName))].sort(),statuses=[...new Set(projects.map(p=>p.status))].sort();
  const pmValue=$("projectPmFilter").value,statusValue=$("projectStatusFilter").value;
  $("projectPmFilter").innerHTML='<option value="">All Project Managers</option>'+pms.map(x=>`<option>${esc(x)}</option>`).join("");
  $("projectStatusFilter").innerHTML='<option value="">All Statuses</option>'+statuses.map(x=>`<option>${esc(x)}</option>`).join("");
  $("projectPmFilter").value=pmValue;$("projectStatusFilter").value=statusValue;
  const query=$("projectSearch").value.toLowerCase();
  const filtered=projects.filter(p=>(!query||[p.name,p.pmName,p.customer,p.location,p.scope].join(" ").toLowerCase().includes(query))&&(!$("projectPmFilter").value||p.pmName===$("projectPmFilter").value)&&(!$("projectStatusFilter").value||p.status===$("projectStatusFilter").value));
  $("projectList").innerHTML=filtered.map(p=>`<article class="project-card"><div class="project-meta"><span>${esc(p.status)}</span><span>${money(p.contractValue)}</span></div><h3>${esc(p.name)}</h3><small>${esc(p.customer)} · ${esc(p.location)}</small><small>${esc(p.scope)}</small><div class="progress"><span style="width:${p.progress}%"></span></div><div class="project-meta"><span>${esc(p.pmName)}</span><span>${p.progress}%</span></div></article>`).join("")||'<div class="empty">No projects match the filters.</div>';
}
function renderScheduler(){
  const days=Array.from({length:7},(_,i)=>{const d=new Date(schedulerAnchor);d.setDate(d.getDate()+i);return d});
  $("schedulerLabel").textContent=`${days[0].toLocaleDateString(undefined,{month:"short",day:"numeric"})} – ${days[6].toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}`;
  $("schedulerDate").value=iso(schedulerAnchor);
  const schedule=companyRows("schedule");
  $("schedulerGrid").innerHTML=days.map(day=>{
    const date=iso(day),items=schedule.filter(x=>x.date===date);
    return `<article class="schedule-day"><h4>${day.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}</h4>${items.map(x=>`<div class="schedule-item ${esc(x.color||"")} ${x.additional?"additional":""}"><strong>${esc(x.project)}</strong><span>${esc(x.crewName)}</span><small>${esc(x.start)}–${esc(x.end)}</small></div>`).join("")||'<div class="empty">Open</div>'}</article>`;
  }).join("");
}
function renderCrews(){
  const schedule=companyRows("schedule"),today=iso(new Date());
  $("crewList").innerHTML=companyRows("crews").map(c=>{const job=schedule.find(x=>x.date===today&&x.crewId===c.id);return `<article class="crew-card"><div class="project-meta"><span class="badge">${job?"Working":"Available"}</span><span>${esc(c.vehicle)}</span></div><h3>${esc(c.name)}</h3><small>Lead: ${esc(c.lead)}</small><div class="crew-members">${c.members.map(m=>`<span>${esc(m)}</span>`).join("")}</div><small><b>Equipment:</b> ${esc(c.equipment.join(", "))}</small>${job?`<small><b>Today:</b> ${esc(job.project)}</small>`:""}</article>`}).join("");
}
function renderMaterials(){
  $("materialList").innerHTML=companyRows("materials").map(m=>`<div class="list-row"><div><strong>${esc(m.project)}</strong><small>${esc(m.items)}</small></div><div><span class="badge">${esc(m.urgency)}</span><small>${esc(m.status)}</small></div></div>`).join("");
}
function renderFinance(){
  const projects=companyRows("projects"),bids=projects.filter(p=>p.status==="Bid"),contracts=projects.filter(p=>p.status!=="Bid");
  const contract=contracts.reduce((s,p)=>s+p.contractValue,0),paid=contracts.reduce((s,p)=>s+p.paidAmount,0),owed=contract-paid;
  $("fContract").textContent=money(contract);$("fPaid").textContent=money(paid);$("fOutstanding").textContent=money(owed);$("fPipeline").textContent=money(bids.reduce((s,p)=>s+p.contractValue,0));
  const pms=[...new Set(contracts.map(p=>p.pmName))].sort(),selected=$("financePmFilter").value;
  $("financePmFilter").innerHTML='<option value="">All Project Managers</option>'+pms.map(pm=>`<option>${esc(pm)}</option>`).join("");
  $("financePmFilter").value=pms.includes(selected)?selected:"";
  const pmTotals=pms.map(pm=>{const pp=contracts.filter(p=>p.pmName===pm),pc=pp.reduce((s,p)=>s+p.contractValue,0),pd=pp.reduce((s,p)=>s+p.paidAmount,0);return {pm,count:pp.length,contract:pc,paid:pd,owed:pc-pd};});
  $("financePmSummary").innerHTML=pmTotals.map(r=>`<article class="finance-pm-card"><strong>${esc(r.pm)}</strong><small>${r.count} active project${r.count===1?"":"s"}</small><div><span>Contract</span><b>${money(r.contract)}</b></div><div><span>Paid</span><b>${money(r.paid)}</b></div><div><span>Owed</span><b>${money(r.owed)}</b></div></article>`).join("");
  const filtered=$("financePmFilter").value?contracts.filter(p=>p.pmName===$("financePmFilter").value):contracts.slice().sort((a,b)=>a.pmName.localeCompare(b.pmName)||a.name.localeCompare(b.name));
  const running={};
  $("financeRows").innerHTML=filtered.map(p=>{if(!running[p.pmName])running[p.pmName]={contract:0,paid:0,owed:0};running[p.pmName].contract+=p.contractValue;running[p.pmName].paid+=p.paidAmount;running[p.pmName].owed+=p.contractValue-p.paidAmount;return `<tr><td>${esc(p.pmName)}</td><td>${esc(p.name)}</td><td>${money(p.contractValue)}</td><td>${money(p.paidAmount)}</td><td>${money(p.contractValue-p.paidAmount)}</td><td>${money(running[p.pmName].contract)}</td><td>${money(running[p.pmName].paid)}</td><td>${money(running[p.pmName].owed)}</td><td>${esc(p.status)}</td></tr>`;}).join("");
}
async function refreshCloudUsers(){
  if(account?.mode!=="cloud"){renderUsers();return;}
  hideStatus();
  try{
    const companyId=currentCompanyId;
    const {data:memberships,error:me}=await supabase.from("company_memberships").select("user_id,company_id,role_id,is_active").eq("company_id",companyId);
    if(me)throw me;
    const userIds=[...new Set((memberships||[]).map(x=>x.user_id))],roleIds=[...new Set((memberships||[]).map(x=>x.role_id))];
    const profiles=userIds.length?(await supabase.from("profiles").select("user_id,email,first_name,last_name,display_name,is_active,invite_status").in("user_id",userIds)).data||[]:[];
    const roles=roleIds.length?(await supabase.from("roles").select("id,code,display_name").in("id",roleIds)).data||[]:[];
    state.users=(memberships||[]).map(m=>{const p=profiles.find(x=>x.user_id===m.user_id)||{},r=roles.find(x=>x.id===m.role_id)||{};return {id:m.user_id,name:p.display_name||[p.first_name,p.last_name].filter(Boolean).join(" ")||p.email,email:p.email,companyId:m.company_id,role:r.code||"read_only",status:m.is_active===false||p.is_active===false?"Inactive":p.invite_status==="invited"?"Invited":"Active"}});
    renderUsers();showStatus("User directory loaded directly from Supabase.","success");
  }catch(error){showStatus(`User directory could not load: ${error.message}`,"error");}
}
function renderUsers(){
  const users=state.users.filter(u=>u.companyId===currentCompanyId);
  $("uActive").textContent=users.filter(u=>u.status==="Active").length;$("uPending").textContent=users.filter(u=>u.status==="Invited").length;
  $("uAdmins").textContent=users.filter(u=>["owner","company_admin"].includes(u.role)).length;$("uPMs").textContent=users.filter(u=>u.role==="project_manager").length;
  $("userRows").innerHTML=users.map(u=>`<tr><td>${esc(u.name||u.email)}</td><td>${esc(u.email||"")}</td><td>${esc(currentCompany().name)}</td><td>${esc(roleDefinitions[u.role]?.label||u.role)}</td><td>${esc(u.status)}</td><td><div class="button-row">${u.status==="Inactive"?`<button class="small secondary" data-user-action="enable" data-user="${esc(u.id)}">Enable</button>`:`<button class="small secondary" data-user-action="disable" data-user="${esc(u.id)}">Disable</button>`}<button class="small secondary" data-user-action="resend" data-user="${esc(u.id)}">Resend</button></div></td></tr>`).join("")||'<tr><td colspan="6" class="empty">No users found.</td></tr>';
}
function renderRoles(){
  $("roleCards").innerHTML=Object.entries(roleDefinitions).map(([code,r])=>`<article class="role-card"><strong>${esc(r.label)}</strong><small>${esc(code)}</small><ul>${r.caps.map(c=>`<li>${esc(c)}</li>`).join("")}</ul></article>`).join("");
}
function renderSettings(){
  $("environmentStatus").textContent=account?.mode==="cloud"?"Connected to Supabase production authentication. Operational presentation data remains local until the operational tables are connected.":"Local Owner Demo. All records are stored in this browser.";
  $("profileFirstName").value=account?.profile?.first_name||firstName();$("profileLastName").value=account?.profile?.last_name||"";$("profileDisplayName").value=account?.profile?.display_name||displayName();
}

function openDialog({mode,title,eyebrow="ATLAS",save="Save",html}){
  $("recordForm").dataset.mode=mode;$("dialogTitle").textContent=title;$("dialogEyebrow").textContent=eyebrow;$("dialogSave").textContent=save;$("dialogFields").innerHTML=html;$("dialogMessage").classList.add("hidden");$("recordDialog").showModal();
}
function inviteUserDialog(){
  if(currentCompanyId==="all")return alert("Choose a company first.");
  openDialog({mode:"user",title:"Add Atlas User",eyebrow:"USER MANAGEMENT",save:account?.mode==="cloud"?"Send Invitation":"Create Demo User",html:`
    <label>First Name<input name="firstName" required></label>
    <label>Last Name<input name="lastName" required></label>
    <label class="wide">Email<input name="email" type="email" required></label>
    <label>Company<input value="${esc(currentCompany().name)}" readonly></label>
    <label>Role<select name="role">${Object.entries(roleDefinitions).map(([code,r])=>`<option value="${code}">${esc(r.label)}</option>`).join("")}</select></label>
    <div class="wide status-banner info">Atlas will create the authentication login, profile, company membership, and assigned privileges in one step.</div>`});
}
function projectDialog(){
  const pms=state.users.filter(u=>u.companyId===currentCompanyId&&u.role==="project_manager");
  openDialog({mode:"project",title:"Add Project",eyebrow:"PROJECTS",html:`<label class="wide">Project Name<input name="name" required></label><label>Location<input name="location" required></label><label>Customer<input name="customer" required></label><label>Scope<input name="scope" required></label><label>Project Manager<select name="pmId">${pms.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></label><label>Status<select name="status"><option>Active</option><option>Bid</option><option>Shop Drawings</option><option>Materials</option><option>Scheduled</option><option>At Risk</option></select></label><label>Contract Value<input name="contractValue" type="number" min="0"></label>`});
}

function estimateDialog(){
  const pms=state.users.filter(u=>u.companyId===currentCompanyId&&u.role==="project_manager");
  openDialog({mode:"estimate",title:"New Estimate",eyebrow:"ESTIMATING",html:`<label class="wide">Estimate Name<input name="name" required></label><label>Customer<input name="customer" required></label><label>Location<input name="location" required></label><label class="wide">Scope<input name="scope" required></label><label>Project Manager<select name="pmId">${pms.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></label><label>Status<select name="status"><option>Open</option><option>Submitted</option><option>Won</option><option>Lost</option></select></label><label>Quantity<input name="quantity" type="number" min="0" step="0.01" required></label><label>Unit Price<input name="unitPrice" type="number" min="0" step="0.01" required></label>`});
}
function fieldReportDialog(){
  const crews=companyRows("crews"),projects=companyRows("projects").filter(p=>p.status!=="Bid");
  openDialog({mode:"fieldReport",title:"Daily Field Report",eyebrow:"FIELD OPERATIONS",html:`<label>Date<input name="date" type="date" value="${iso(new Date())}" required></label><label>Crew<select name="crewId">${crews.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label><label class="wide">Project<select name="projectId">${projects.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></label><label class="wide">Production Completed<textarea name="production" required></textarea></label><label>Hours<input name="hours" type="number" step="0.5" min="0"></label><label>Photos<input name="photos" type="number" min="0" value="0"></label><label class="wide">Weather<input name="weather"></label><label class="wide">Safety Notes<textarea name="safety"></textarea></label><label>Equipment<select name="equipmentReady"><option value="true">Ready</option><option value="false">Issue</option></select></label><label>Supplies<select name="suppliesReady"><option value="true">Ready</option><option value="false">Issue</option></select></label><label class="wide">Issues<textarea name="issues">None</textarea></label>`});
}
function scheduleDialog(){
  const projects=companyRows("projects").filter(p=>p.status!=="Bid"),crews=companyRows("crews");
  openDialog({mode:"schedule",title:"Schedule Work",eyebrow:"OPERATIONS SCHEDULER",html:`<label class="wide">Project<select name="projectId">${projects.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></label><label>Crew<select name="crewId">${crews.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label><label>Start Date<input name="startDate" type="date" value="${iso(new Date())}" required></label><label>End Date<input name="endDate" type="date" value="${iso(new Date())}" required></label><label>Start Time<input name="start" type="time" value="07:00"></label><label>End Time<input name="end" type="time" value="15:30"></label><label>Slot Color<select name="color"><option value="">No color</option><option value="red">Red</option><option value="blue">Blue</option><option value="green">Green</option></select></label><div class="wide"><strong>Days</strong><div class="button-row">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((x,i)=>`<label><input type="checkbox" name="weekday" value="${i}" ${i<5?"checked":""}> ${x}</label>`).join("")}</div></div>`});
}
function crewDialog(){openDialog({mode:"crew",title:"Create Crew",eyebrow:"CREW OPERATIONS",html:`<label>Crew Name<input name="name" required></label><label>Lead<input name="lead" required></label><label>Vehicle<input name="vehicle"></label><label class="wide">Members (comma-separated)<textarea name="members"></textarea></label><label class="wide">Equipment (comma-separated)<textarea name="equipment"></textarea></label>`});}
function materialDialog(){openDialog({mode:"material",title:"Material Request",eyebrow:"PROCUREMENT",html:`<label class="wide">Project<select name="project">${companyRows("projects").map(p=>`<option>${esc(p.name)}</option>`).join("")}</select></label><label class="wide">Items<textarea name="items" required></textarea></label><label>Urgency<select name="urgency"><option>Normal</option><option>High</option><option>Critical</option></select></label><label>Status<select name="status"><option>Open</option><option>Approved</option><option>Ordered</option><option>Delivered</option></select></label>`});}

async function createCloudUser(payload){
  const {data,error}=await supabase.functions.invoke("atlas-admin-users",{body:{action:"invite",company_id:currentCompanyId,...payload,redirect_to:`${location.origin}${location.pathname}?atlas_auth=invite`}});
  if(error)throw new Error(error.message||"Failed to send request to Edge Function.");
  if(data?.error)throw new Error(data.error);
  return data;
}
async function userAction(action,user){
  if(account.mode==="demo"){
    user.status=action==="enable"?"Active":action==="disable"?"Inactive":user.status;
    saveState();renderUsers();return;
  }
  try{
    const {data,error}=await supabase.functions.invoke("atlas-admin-users",{body:{action,company_id:currentCompanyId,user_id:user.id,email:user.email}});
    if(error)throw error;if(data?.error)throw new Error(data.error);
    showStatus(data.message||"User updated.","success");await refreshCloudUsers();
  }catch(error){showStatus(`User action failed: ${error.message}`,"error");}
}
async function saveRecord(event){
  event.preventDefault();
  const fd=new FormData(event.currentTarget),mode=event.currentTarget.dataset.mode;
  const message=$("dialogMessage");message.classList.add("hidden");
  try{
    if(mode==="user"){
      const payload={first_name:titleCase(fd.get("firstName")),last_name:titleCase(fd.get("lastName")),email:String(fd.get("email")).toLowerCase(),role_code:fd.get("role")};
      if(account.mode==="demo"){
        state.users.push({id:uid(),name:`${payload.first_name} ${payload.last_name}`,firstName:payload.first_name,lastName:payload.last_name,email:payload.email,companyId:currentCompanyId,role:payload.role_code,status:"Invited"});
        saveState();renderUsers();$("recordDialog").close();showStatus(`Demo login created for ${payload.email}.`,"success");
      }else{
        $("dialogSave").disabled=true;$("dialogSave").textContent="Sending…";
        const result=await createCloudUser(payload);$("recordDialog").close();showStatus(result.message||`Invitation sent to ${payload.email}.`,"success");await refreshCloudUsers();
      }
    }
    if(mode==="estimate"){
      const pm=state.users.find(u=>u.id===fd.get("pmId")),quantity=Number(fd.get("quantity")||0),unitPrice=Number(fd.get("unitPrice")||0);
      state.estimates.push({id:uid(),companyId:currentCompanyId,name:fd.get("name"),customer:fd.get("customer"),location:fd.get("location"),pmId:pm.id,pmName:pm.name,scope:fd.get("scope"),quantity,unitPrice,total:quantity*unitPrice,status:fd.get("status"),createdDate:iso(new Date())});
      saveState();$("recordDialog").close();renderAll();
    }
    if(mode==="fieldReport"){
      const crew=state.crews.find(c=>c.id===fd.get("crewId")),project=state.projects.find(p=>p.id===fd.get("projectId"));
      state.fieldReports.push({id:uid(),companyId:currentCompanyId,date:fd.get("date"),crewId:crew.id,crewName:crew.name,projectId:project.id,project:project.name,production:fd.get("production"),hours:Number(fd.get("hours")||0),weather:fd.get("weather"),safety:fd.get("safety"),equipmentReady:fd.get("equipmentReady")==="true",suppliesReady:fd.get("suppliesReady")==="true",issues:fd.get("issues")||"None",photos:Number(fd.get("photos")||0),submittedBy:crew.lead});
      saveState();$("recordDialog").close();renderAll();
    }
    if(mode==="project"){
      const pm=state.users.find(u=>u.id===fd.get("pmId"));
      state.projects.push({id:uid(),companyId:currentCompanyId,name:fd.get("name"),location:fd.get("location"),customer:fd.get("customer"),scope:fd.get("scope"),pmId:pm.id,pmName:pm.name,status:fd.get("status"),progress:0,contractValue:Number(fd.get("contractValue")||0),paidAmount:0,startDate:iso(new Date()),color:""});
      saveState();$("recordDialog").close();renderAll();
    }
    if(mode==="crew"){
      state.crews.push({id:uid(),companyId:currentCompanyId,name:fd.get("name"),lead:fd.get("lead"),vehicle:fd.get("vehicle"),status:"Available",members:String(fd.get("members")||"").split(",").map(x=>x.trim()).filter(Boolean),equipment:String(fd.get("equipment")||"").split(",").map(x=>x.trim()).filter(Boolean)});
      saveState();$("recordDialog").close();renderAll();
    }
    if(mode==="material"){
      state.materials.push({id:uid(),companyId:currentCompanyId,project:fd.get("project"),items:fd.get("items"),urgency:fd.get("urgency"),status:fd.get("status")});
      saveState();$("recordDialog").close();renderAll();
    }
    if(mode==="schedule"){
      const project=state.projects.find(p=>p.id===fd.get("projectId")),crew=state.crews.find(c=>c.id===fd.get("crewId"));
      const weekdays=fd.getAll("weekday").map(Number),dates=datesBetween(fd.get("startDate"),fd.get("endDate"),weekdays);
      const conflicts=state.schedule.filter(x=>x.companyId===currentCompanyId&&x.crewId===crew.id&&dates.includes(x.date));
      pendingSchedulePayload={dates,project,crew,start:fd.get("start"),end:fd.get("end"),color:fd.get("color")};
      if(conflicts.length){
        $("conflictDetails").innerHTML=conflicts.map(c=>`<div class="list-row"><div><strong>${esc(c.project)}</strong><small>${esc(c.date)} · ${esc(c.start)}–${esc(c.end)}</small></div></div>`).join("");
        $("conflictDialog").showModal();
      }else commitSchedule(false);
    }
  }catch(error){
    message.textContent=error.message||"Atlas could not save this record.";message.classList.remove("hidden");
  }finally{
    $("dialogSave").disabled=false;
    if(mode==="user")$("dialogSave").textContent=account?.mode==="cloud"?"Send Invitation":"Create Demo User";
  }
}
function commitSchedule(additional){
  const p=pendingSchedulePayload;
  p.dates.forEach(date=>state.schedule.push({id:uid(),companyId:currentCompanyId,date,start:p.start,end:p.end,projectId:p.project.id,project:p.project.name,crewId:p.crew.id,crewName:p.crew.name,status:"Scheduled",color:p.color,additional}));
  pendingSchedulePayload=null;saveState();$("conflictDialog").close();$("recordDialog").close();renderAll();
}

$("authForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!supabase)return showAuthMessage("Supabase is not configured. Open Owner Demo.");
  $("authSubmit").disabled=true;$("authSubmit").textContent="Signing in…";
  try{
    const {data,error}=await supabase.auth.signInWithPassword({email:$("authEmail").value.trim(),password:$("authPassword").value});
    if(error)throw error;await loadCloudAccount(data.user);
  }catch(error){showAuthMessage(error.message==="Invalid login credentials"?"The email or password is incorrect.":error.message);}
  finally{$("authSubmit").disabled=false;$("authSubmit").textContent="Sign In";}
});
$("demoLogin").addEventListener("click",openDemo);
$("togglePassword").addEventListener("click",e=>{const p=$("authPassword"),show=p.type==="password";p.type=show?"text":"password";e.currentTarget.textContent=show?"Hide":"Show";});
$("forgotPassword").addEventListener("click",async()=>{if(!supabase)return showAuthMessage("Supabase is not configured.");const email=$("authEmail").value.trim();if(!email)return showAuthMessage("Enter your email first.");const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}${location.pathname}?atlas_auth=recovery`});showAuthMessage(error?error.message:"Password reset email sent.",error?"error":"success");});
$("signOut").addEventListener("click",async()=>{if(account?.mode==="cloud")await supabase.auth.signOut();account=null;$("appShell").classList.add("hidden");$("authScreen").classList.remove("hidden");});
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
document.querySelectorAll("[data-view-target]").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.viewTarget)));
$("workspaceSelect").addEventListener("change",()=>{currentCompanyId=$("workspaceSelect").value;account.membership=account.memberships?.find(m=>m.company_id===currentCompanyId)||account.membership;applyPermissions();renderAll();});

document.querySelectorAll("#estimates input,#estimates select").forEach(el=>el.addEventListener("input",renderEstimateCalculator));
$("calcProduct").addEventListener("change",applyEstimatePreset);
$("newEstimateCalc").addEventListener("click",clearEstimateCalculator);
$("saveEstimateCalc").addEventListener("click",saveCalculatedEstimate);
$("copyEstimateSummary").addEventListener("click",copyEstimateSummary);
$("startAthenaTour").addEventListener("click",()=>startAthenaTour("dashboard"));
$("athenaFloatingButton").addEventListener("click",()=>switchView("athena"));
$("athenaDailyBriefBtn").addEventListener("click",renderAthena);
document.querySelectorAll("[data-athena-tour]").forEach(b=>b.addEventListener("click",()=>startAthenaTour(b.dataset.athenaTour)));
$("athenaTourClose").addEventListener("click",()=>$("athenaTourOverlay").classList.add("hidden"));
$("athenaTourBack").addEventListener("click",()=>{if(athenaTourIndex>0){athenaTourIndex--;showAthenaTourStep();}});
$("athenaTourNext").addEventListener("click",()=>{if(athenaTourIndex<athenaTourSteps.length-1){athenaTourIndex++;showAthenaTourStep();}else{$("athenaTourOverlay").classList.add("hidden");switchView("athena");}});
$("athenaChatForm").addEventListener("submit",e=>{e.preventDefault();const q=$("athenaQuestion").value.trim();if(!q)return;$("athenaChatLog").insertAdjacentHTML("beforeend",`<div class="athena-message user"><strong>You</strong><p>${esc(q)}</p></div><div class="athena-message"><strong>Athena</strong><p>${esc(athenaAnswer(q))}</p></div>`);$("athenaQuestion").value="";$("athenaChatLog").scrollTop=$("athenaChatLog").scrollHeight;});

$("projectSearch").addEventListener("input",renderProjects);$("projectPmFilter").addEventListener("change",renderProjects);$("projectStatusFilter").addEventListener("change",renderProjects);$("estimateSearch").addEventListener("input",renderEstimates);$("estimateStatusFilter").addEventListener("change",renderEstimates);$("estimatePmFilter").addEventListener("change",renderEstimates);$("financePmFilter").addEventListener("change",renderFinance);$("dashboardWeatherProject").addEventListener("change",renderDashboardWeather);$("refreshExecutive").addEventListener("click",renderExecutive);
$("schedulerPrev").addEventListener("click",()=>{schedulerAnchor.setDate(schedulerAnchor.getDate()-7);renderScheduler();});$("schedulerNext").addEventListener("click",()=>{schedulerAnchor.setDate(schedulerAnchor.getDate()+7);renderScheduler();});$("schedulerToday").addEventListener("click",()=>{schedulerAnchor=startOfWeek(new Date());renderScheduler();});$("schedulerGo").addEventListener("click",()=>{if($("schedulerDate").value)schedulerAnchor=startOfWeek(new Date(`${$("schedulerDate").value}T12:00:00`));renderScheduler();});
[
  ["addProject",projectDialog],
  ["addEstimate",estimateDialog],
  ["addFieldReport",fieldReportDialog],
  ["addScheduleItem",scheduleDialog],
  ["addCrew",crewDialog],
  ["addMaterial",materialDialog],
  ["inviteUser",inviteUserDialog]
].forEach(([id,handler])=>{
  const element=$(id);
  if(element)element.addEventListener("click",handler);
});
$("refreshUsers")?.addEventListener("click",refreshCloudUsers);$("refreshMission")?.addEventListener("click",renderAll);
$("recordForm")?.addEventListener("submit",saveRecord);$("dialogClose")?.addEventListener("click",()=>$("recordDialog").close());
$("conflictBack")?.addEventListener("click",()=>$("conflictDialog").close());$("conflictContinue")?.addEventListener("click",()=>commitSchedule(true));
$("userRows").addEventListener("click",e=>{const b=e.target.closest("[data-user-action]");if(!b)return;const user=state.users.find(u=>u.id===b.dataset.user);if(user)userAction(b.dataset.userAction,user);});
$("resetDemoData").addEventListener("click",()=>{if(confirm("Reset all local presentation data?")){loadDemoState(true);renderWorkspace();renderAll();}});
$("profileForm").addEventListener("submit",async e=>{e.preventDefault();const payload={first_name:titleCase($("profileFirstName").value),last_name:titleCase($("profileLastName").value),display_name:titleCase($("profileDisplayName").value)};if(account.mode==="cloud"){const {error}=await supabase.from("profiles").update(payload).eq("user_id",account.user.id);if(error)return alert(error.message);}account.profile={...account.profile,...payload};enterApp();});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden");});$("installBtn").addEventListener("click",async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden");}});
window.addEventListener("online",()=>{$("offlineBar").classList.add("hidden");});window.addEventListener("offline",()=>{$("offlineBar").classList.remove("hidden");});

window.addEventListener("error",event=>{
  console.error("Atlas startup error:",event.error||event.message);
});
if("serviceWorker" in navigator)navigator.serviceWorker.register("service-worker.js").catch(console.warn);

(async()=>{
  $("environmentBadge").textContent=cfg.environment==="production"?"PRODUCTION":"LOCAL / DEMO READY";
  if(cfg.environment==="production"&&!cfg.showDemoLogin)$("demoLogin").classList.add("hidden");
  if(!supabase)return;
  const {data:{user}}=await supabase.auth.getUser();
  if(user){try{await loadCloudAccount(user)}catch(error){showAuthMessage(error.message);}}
})();
})();