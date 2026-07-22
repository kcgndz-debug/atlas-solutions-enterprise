const RAILS=[
{name:"460-490 | Rectangular Rail Retrofit",base:73,hoop:1000,grab:0,powder:25,profit:18,production:500,weeks:10},
{name:"822 | Single Rail",base:15,hoop:600,grab:0,powder:15,profit:5,production:300,weeks:7},
{name:"822 | Double Rail",base:26,hoop:850,grab:0,powder:20,profit:8,production:300,weeks:7},
{name:"870 | Aluminum 2-Rail Guide Rail",base:35,hoop:70,grab:10,powder:19,profit:10,production:400,weeks:5},
{name:"870 | Aluminum Triple Rail",base:45,hoop:110,grab:10,powder:20,profit:15,production:300,weeks:8},
{name:"880 | Steel 2-Rail Guide Rail",base:50,hoop:90,grab:15,powder:20,profit:10,production:400,weeks:8},
{name:"880 | Steel Triple Rail",base:65,hoop:95,grab:15,powder:21,profit:17,production:300,weeks:8},
{name:"862 | 42 in Picket",base:72,hoop:100,grab:15,powder:25,profit:10,production:400,weeks:8},
{name:"862 | 54 in Picket",base:85,hoop:100,grab:15,powder:28,profit:20,production:400,weeks:8},
{name:"852 | 42 in Sunshine",base:150,hoop:100,grab:15,powder:25,profit:25,production:400,weeks:14},
{name:"Type R | Partial Curve",base:85,hoop:0,grab:0,powder:15,profit:15,production:300,weeks:8},
{name:"550-002 | Type B Fence 6 ft Galvanized",base:0,hoop:0,grab:0,powder:0,profit:0,production:200,weeks:0,formula:true},
{name:"550-002 | Type B Fence 6 ft Black",base:16.78,hoop:0,grab:0,powder:0,profit:0,production:200,weeks:0,note:"Atlas formula reference"}
];
const $=id=>document.getElementById(id), money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(Number(n)||0);
const DBKEY="atlas_command_center_v3";
const seed={company:"Delamere Industries",estimates:[],projects:[{name:"Atlantis MCO",customer:"Prime Contractor",location:"Orlando, FL",status:"Estimating",value:0,next:"Finalize Type B quote"},{name:"Reams Road South",customer:"Orange County",location:"Orlando, FL",status:"Active",value:0,next:"Review material schedule"}],customers:[{name:"Orange County",contact:"Public Works",email:"",company:"Delamere Industries"},{name:"Prime Contractor",contact:"Estimating Department",email:"",company:"Delamere Industries"}],documents:[{type:"Submittal",project:"Reams Road South",title:"Rail Product Data",status:"Pending"},{type:"RFI",project:"Atlantis MCO",title:"Fence limits clarification",status:"Draft"}],fieldReports:[]};
let state=JSON.parse(localStorage.getItem(DBKEY)||"null")||seed;
let deferredPrompt=null;
function persist(){localStorage.setItem(DBKEY,JSON.stringify(state));$("syncText").textContent=navigator.onLine?"Saved locally":"Offline — saved locally";renderAll()}
function companyData(items){return items.filter(x=>!x.company||x.company===state.company)}
function switchView(id){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.view===id));const labels={dashboard:"Executive Dashboard",estimator:"Atlas Estimator",projects:"Projects",customers:"Customers",documents:"Documents",field:"Field Operations",settings:"Settings"};$("pageTitle").textContent=labels[id];window.scrollTo(0,0)}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
document.querySelectorAll("[data-open-estimator]").forEach(b=>b.onclick=()=>switchView("estimator"));
document.querySelectorAll("[data-view-target]").forEach(b=>b.onclick=()=>switchView(b.dataset.viewTarget));
$("companySelect").value=state.company;$("companySelect").onchange=e=>{state.company=e.target.value;$("companyLabel").textContent=state.company+" workspace";persist()};
function estimatorInit(){$("rail").innerHTML=RAILS.map((r,i)=>`<option value="${i}">${r.name}</option>`).join("");document.querySelectorAll("#estimator input,#estimator select").forEach(el=>el.addEventListener("input",calculate));calculate()}
function n(id){return Number($(id).value)||0}
function calculate(){
 const r=RAILS[n("rail")],lf=n("lf"),materialOnly=$("quoteType").value==="Material Only";const days=$("laborMode").value==="Auto"?(lf&&r.production?Math.ceil(lf/r.production):0):n("manualDays");
 const items=[];const add=(name,qty,rate)=>items.push({name,qty,rate,amount:qty*rate});
 add("Base Rail / Material",lf,r.base);if(n("hoops"))add("Hoops / Ends",n("hoops"),r.hoop);if($("grab").value==="Yes")add("Grab Rail",lf,r.grab);if($("finish").value==="Powder Coat")add("Powder Coat",lf,r.powder);
 if(!materialOnly){add("Installation Labor",days,1500);add("Mileage",n("miles"),n("mileageRate"));add("Hotel / Per Diem",n("hotelNights"),n("hotelRate"));add("Field Verification",1,n("fieldTier"));add("Equipment / Misc.",1,n("equipment"))}
 const subtotal=items.reduce((a,b)=>a+b.amount,0),profit=lf*r.profit,tax=materialOnly?Math.max(0,(subtotal*0.06)+(subtotal>=5000?25:subtotal*0.005)):0,trueTotal=subtotal+profit+tax,per=lf?trueTotal/lf:0,rounded=Math.round(per),final=rounded*lf;
 $("breakdown").innerHTML=items.map(x=>`<tr><td>${x.name}</td><td>${x.qty}</td><td>${money(x.rate)}</td><td>${money(x.amount)}</td><td>${money(lf?x.amount/lf:0)}</td></tr>`).join("")+(tax?`<tr><td>Sales Tax / Fee</td><td>1</td><td>${money(tax)}</td><td>${money(tax)}</td><td>${money(lf?tax/lf:0)}</td></tr>`:"");
 $("railSummary").innerHTML=[["Base / LF",money(r.base)],["Profit / LF",money(r.profit)],["Production",r.production+" LF/day"],["Crew Days",days],["Mfg Lead",r.weeks?r.weeks+" weeks":"Formula-driven"]].map(x=>`<div><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("");
 $("subtotal").textContent=money(subtotal+tax);$("profit").textContent=money(profit);$("truePerLf").textContent=money(per);$("roundedPerLf").textContent=money(rounded);$("finalTotal").textContent=money(final);
 return {rail:r.name,lf,subtotal:subtotal+tax,profit,total:final,perLf:rounded,days};
}
$("saveEstimate").onclick=()=>{const c=calculate();state.estimates.unshift({id:Date.now(),name:$("projectName").value||"Untitled Estimate",customer:$("customer").value||"Unassigned",location:$("location").value,company:state.company,date:new Date().toLocaleDateString(),...c});persist();alert("Estimate saved on this device.")};
$("printEstimate").onclick=()=>window.print();
function renderAll(){
 const est=companyData(state.estimates),projects=companyData(state.projects),docs=companyData(state.documents),fields=companyData(state.fieldReports);
 $("mPipeline").textContent=money(est.reduce((a,b)=>a+b.total,0));$("mBidCount").textContent=`${est.length} estimate${est.length===1?"":"s"}`;$("mProjects").textContent=projects.length;$("mDocs").textContent=docs.filter(d=>d.status!=="Approved"&&d.status!=="Closed").length;$("mInstalled").textContent=fields.reduce((a,b)=>a+(Number(b.installed)||0),0)+" LF";
 $("recentEstimates").innerHTML=est.length?est.slice(0,5).map(e=>`<div class="list-row"><div><strong>${e.name}</strong><small>${e.customer} · ${e.rail}</small></div><div><strong>${money(e.total)}</strong><small>${money(e.perLf)}/LF</small></div></div>`).join(""):'<div class="empty">No estimates saved yet.</div>';
 const alerts=[];if(RAILS.some(r=>r.formula&&r.base===0))alerts.push(["Pricing verification","Type B galvanized remains formula-driven and requires the May Sheet result.","amber"]);if(!fields.length)alerts.push(["No field reports","No installed quantities have been recorded yet.",""]);if(docs.some(d=>d.status==="Draft"))alerts.push(["Draft documents",`${docs.filter(d=>d.status==="Draft").length} document(s) still in draft.`,"red"]);$("alerts").innerHTML=alerts.map(a=>`<div class="list-row"><div><strong>${a[0]}</strong><small>${a[1]}</small></div><span class="badge ${a[2]}">${a[2]==="red"?"Action":"Review"}</span></div>`).join("");
 $("dashboardProjects").innerHTML=projects.slice(0,4).map(p=>`<div class="list-row"><div><strong>${p.name}</strong><small>${p.location} · ${p.next}</small></div><span class="badge">${p.status}</span></div>`).join("");
 $("milestones").innerHTML=projects.length?projects.slice(0,4).map(p=>`<div class="list-row"><div><strong>${p.next||"Next action"}</strong><small>${p.name}</small></div><span class="badge amber">Open</span></div>`).join(""):'<div class="empty">No project milestones.</div>';
 $("projectList").innerHTML=projects.map(p=>`<article class="entity-card"><h3>${p.name}</h3><p>${p.customer}<br>${p.location}</p><div class="entity-meta"><span class="badge">${p.status}</span><small>${p.next||""}</small></div></article>`).join("");
 $("customerList").innerHTML=companyData(state.customers).map(c=>`<article class="entity-card"><h3>${c.name}</h3><p>${c.contact||"No contact"}<br>${c.email||"No email entered"}</p><div class="entity-meta"><span class="badge">Customer</span></div></article>`).join("");
 $("documentList").innerHTML=docs.length?`<div class="table-wrap"><table><thead><tr><th>Type</th><th>Project</th><th>Title</th><th>Status</th></tr></thead><tbody>${docs.map(d=>`<tr><td>${d.type}</td><td>${d.project}</td><td>${d.title}</td><td><span class="badge ${d.status==="Draft"?"amber":""}">${d.status}</span></td></tr>`).join("")}</tbody></table></div>`:'<div class="empty">No documents yet.</div>';
 $("fieldList").innerHTML=fields.length?fields.map(f=>`<article class="entity-card"><h3>${f.project}</h3><p>${f.date}<br>${f.notes}</p><div class="entity-meta"><span class="badge">${f.installed} LF installed</span></div></article>`).join(""):'<div class="empty">No daily reports yet.</div>';
}
$("addProject").onclick=()=>{const name=prompt("Project name");if(!name)return;state.projects.unshift({name,customer:prompt("Customer")||"",location:prompt("Location")||"",status:"Active",next:prompt("Next action")||"",company:state.company});persist()};
$("addCustomer").onclick=()=>{const name=prompt("Customer / company name");if(!name)return;state.customers.unshift({name,contact:prompt("Contact name")||"",email:prompt("Email")||"",company:state.company});persist()};
$("addDocument").onclick=()=>{const title=prompt("Document title");if(!title)return;state.documents.unshift({title,type:prompt("Type: RFI, Submittal, PO, Change Order")||"Document",project:prompt("Project")||"",status:"Draft",company:state.company});persist()};
$("addFieldReport").onclick=()=>{const project=prompt("Project name");if(!project)return;state.fieldReports.unshift({project,date:new Date().toLocaleDateString(),installed:Number(prompt("Installed quantity (LF)")||0),notes:prompt("Field notes")||"",company:state.company});persist()};
$("athenaBtn").onclick=()=>$("athenaPanel").classList.add("open");$("closeAthena").onclick=()=>$("athenaPanel").classList.remove("open");
$("athenaForm").onsubmit=e=>{e.preventDefault();const q=$("athenaInput").value.trim();if(!q)return;$("athenaMessages").innerHTML+=`<div class="user-msg">${q}</div>`;let a="I can help with the Atlas workspace.";const low=q.toLowerCase();if(low.includes("estimate")){a=`There are ${companyData(state.estimates).length} saved estimates totaling ${money(companyData(state.estimates).reduce((s,x)=>s+x.total,0))}.`;if(low.includes("new")||low.includes("open"))switchView("estimator")}else if(low.includes("project"))a=`There are ${companyData(state.projects).length} active project records in ${state.company}.`;else if(low.includes("alert")||low.includes("need"))a="Review formula-driven pricing, draft documents, and missing field reports on the dashboard."; $("athenaMessages").innerHTML+=`<div class="bot">${a}</div>`;$("athenaInput").value="";$("athenaMessages").scrollTop=$("athenaMessages").scrollHeight};
window.addEventListener("online",()=>{$("offlineBar").classList.add("hidden");$("syncDot").style.background="#39c986";$("syncText").textContent="Online — local data ready"});
window.addEventListener("offline",()=>{$("offlineBar").classList.remove("hidden");$("syncDot").style.background="#e4a62e";$("syncText").textContent="Offline — saved locally"});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden")});$("installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden")}};
if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js");
estimatorInit();renderAll();if(!navigator.onLine)window.dispatchEvent(new Event("offline"));
