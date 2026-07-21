import{initializeApp}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";import{getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";import{getFirestore,doc,getDoc,setDoc,addDoc,collection,query,where,orderBy,limit,onSnapshot,serverTimestamp,writeBatch}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const K="atlasFirebaseConfig",$=x=>document.getElementById(x),V=x=>$(x)?.value||'',N=x=>Number(V(x)||0),M=x=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(x||0),E=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));let auth,db,user,profile,company="delamere",subs=[],projects=[],customers=[];const prices=[["460-490","Rectangular Rail Retrofit","Aluminum","Rectangular rail retrofit",10,73,500,1000,0,25,0,18,"May Sheet base"],["822-S","822 Single Rail","Aluminum","Single rail",7,15,300,600,0,15,0,5,"May Sheet base"],["822-D","822 16 in Post Double Rail","Aluminum","16 in post double rail",7,26,300,850,0,20,0,8,"May Sheet base"],["822-T","822 Triple Rail","Aluminum","Triple rail",7,36,300,1000,0,24,0,10,"May Sheet base"],["870-2","870 Aluminum 2-Rail Guide Rail","Aluminum","2-rail guide rail",5,35,400,70,10,19,0,10,"May Sheet base"],["870-3","870 Aluminum Triple Rail","Aluminum","Triple rail",8,45,300,110,10,20,0,15,"May Sheet base"],["880-2","880 Steel 2-Rail Guide Rail","Steel","2-rail guide rail",8,50,400,90,15,20,0,10,"May Sheet base"],["880-3","880 Steel Triple Rail","Steel","Triple rail",8,65,300,95,15,21,0,17,"May Sheet base"],["862-42","862 42 in Pipe/Picket Rail","Aluminum","42 in pipe/picket rail",8,72,400,100,15,25,0,10,"May Sheet base"],["862-42S","862 42 in Sunshine Infill","Aluminum","42 in sunshine infill",14,228,400,100,15,30,0,20,"May Sheet base"],["862-48S","862 48 in Sunshine Infill","Aluminum","48 in sunshine infill",14,245,400,100,15,30,0,22,"May Sheet base"],["862-54","862 54 in Rail","Aluminum","54 in rail",8,85,400,100,15,28,0,20,"May Sheet base"],["862-48","862 48 in Rail","Aluminum","48 in rail",8,82,400,100,15,27,0,15,"May Sheet base"],["852-42","852 42 in Rail","Steel","42 in rail",9,73,400,100,15,20,0,15,"May Sheet base"],["852-54","852 54 in Rail","Steel","54 in rail",9,80,400,100,15,20,0,20,"May Sheet base"],["852-48","852 48 in Rail","Steel","48 in rail",9,79,400,100,15,20,0,20,"May Sheet base"],["852-42S","852 42 in Sunshine Infill","Steel","42 in sunshine infill",14,150,400,100,15,25,0,25,"May Sheet base"],["860-42","860 42 in Rail","Steel","42 in rail",6,200,400,100,15,25,0,30,"May Sheet base"],["850-42","850 42 in Rail","Steel","42 in rail",6,175,400,100,15,30,0,30,"May Sheet base"],["TR-RR","Type R Partial Curve Over Railroad","Steel","Partial curve over railroad",8,85,300,0,0,15,200,15,"May Sheet base"],["TR-PM","Type R Partial Curve Plate Mounted","Steel","Partial curve plate mounted",8,114,300,0,0,25,300,20,"May Sheet base"],["TR-S4","Type R Side Mount Vertical 4 ft","Steel","Side mount vertical 4 ft",8,41,300,0,0,25,0,20,"May Sheet base"],["TR-P4","Type R Plate Mounted Vertical 4 ft","Steel","Plate mounted vertical 4 ft",8,46,300,0,0,25,0,20,"May Sheet base"],["TR-S6","Type R Side Mount Vertical 6 ft","Steel","Side mount vertical 6 ft",8,52,300,0,0,25,0,20,"May Sheet base"],["TR-P6","Type R Plate Mounted Vertical 6 ft","Steel","Plate mounted vertical 6 ft",8,55,300,0,0,25,0,20,"May Sheet base"],["TR-S10","Type R Side Mount Vertical 10 ft","Steel","Side mount vertical 10 ft",8,70,300,0,0,25,0,20,"May Sheet base"],["TR-P10","Type R Plate Mounted Vertical 10 ft","Steel","Plate mounted vertical 10 ft",8,63,300,0,0,25,0,20,"May Sheet base"],["550-002-G6","Type B Fence 6 ft Galvanized","Galvanized Steel","6 ft Type B fence",0,15.3733135259,200,0,0,0,0,0,"May material calculator; margin embedded"],["550-002-B6","Type B Fence 6 ft Black","Black Steel","6 ft Type B fence",0,17.2314586004,200,0,0,0,0,0,"May material calculator; margin embedded"],["550-002-G4","Type B Fence 4 ft Galvanized","Galvanized Steel","4 ft Type B fence",0,13.2730778571,200,0,0,0,0,0,"May material calculator; margin embedded"],["550-002-B4","Type B Fence 4 ft Black","Black Steel","4 ft Type B fence",0,14.2932899129,200,0,0,0,0,0,"May material calculator; margin embedded"],["870-GRAB","870 Aluminum 2-Rail with Grab Rail","Aluminum","Two-rail guide rail with grab rail",6,52,300,70,0,19,0,15,"Atlas operational library"],["880-GRAB","880 Steel 2-Rail with Grab Rail","Steel","Steel two-rail guide rail with grab rail",9,68,300,90,0,20,0,18,"Atlas operational library"],["822-BULLET","822 Bullet Rail \u2014 Single Rail","Aluminum","FDOT bullet rail",7,15,300,600,0,15,0,25,"Atlas locked production 300 LF/day"],["862-T1-54","862 Type 1 Picket Infill \u2014 54 in","Aluminum","Pedestrian/bicycle rail Type 1",8,85,400,100,15,28,0,20,"FDOT Type 1 mapping"],["852-T3-42","852 Type 3 Sunshine Infill \u2014 42 in","Steel","Pedestrian/bicycle rail Type 3",14,150,400,100,15,25,0,25,"FDOT Type 3 mapping"],["852-T3-48","852 Type 3 Sunshine Infill \u2014 48 in","Steel","Pedestrian/bicycle rail Type 3",14,165,400,100,15,25,0,25,"FDOT Type 3 mapping"],["852-T3-54","852 Type 3 Sunshine Infill \u2014 54 in","Steel","Pedestrian/bicycle rail Type 3",14,180,400,100,15,25,0,25,"FDOT Type 3 mapping"],["H70","H70 Aluminum Rail","Aluminum","H70 aluminum rail system",8,72,400,100,15,25,0,15,"Operational library \u2014 verify project detail"],["H62","H62 Picket Rail","Aluminum","H62 picket rail system",8,72,400,100,15,25,0,15,"Operational library \u2014 verify project detail"],["550-001-A","Type A Fence","Galvanized Steel","FDOT Type A fence",0,10,200,0,0,0,0,0,"Profit embedded; locked operational reference"],["550-002-B6-LOCK","Type B Fence 6 ft Black \u2014 Atlantis Reference","Black Steel","6 ft black vinyl chain link Type B",0,16.78,200,0,0,0,0,0,"Locked Atlantis MCO sales price"],["550-003-GATE4","Type B Chain-Link Gate \u2014 4 ft","Steel","4 ft gate allowance",0,1100,1,0,0,0,0,0,"Gate unit allowance"],["550-003-GATE6","Type B Chain-Link Gate \u2014 6 ft","Steel","6 ft gate allowance",0,1400,1,0,0,0,0,0,"Gate unit allowance"],["550-003-GATE8","Type B Chain-Link Gate \u2014 8 ft","Steel","8 ft gate allowance",0,2000,1,0,0,0,0,0,"Gate unit allowance"],["550-003-GATE20","Type B Double-Swing Gate \u2014 20 ft","Steel","20 ft double-swing gate allowance",0,3500,1,0,0,0,0,0,"Gate unit allowance"]];
document.addEventListener('DOMContentLoaded',async()=>{
try{
  bind();
  online();
  if('serviceWorker' in navigator){
    const regs=await navigator.serviceWorker.getRegistrations();
    for(const r of regs) await r.update();
    navigator.serviceWorker.register('service-worker.js?v=2.1.1');
  }
  const c=localStorage.getItem(K);
  c?boot(JSON.parse(c)):show('configScreen');
}catch(err){
  console.error(err);
  showStartupError(err);
}
});
function bind(){
const on=(id,event,fn)=>{const el=$(id);if(el)el[event]=fn};
on('saveConfig','onclick',()=>{try{
let raw=V('config').trim(),c={};
for(const k of ['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','measurementId']){
  const m=raw.match(new RegExp(k+'\\s*:\\s*["\\\']([^"\\\']+)["\\\']'));
  if(m)c[k]=m[1].trim();
}
if(!c.apiKey){try{c=JSON.parse(raw)}catch{}}
['apiKey','authDomain','projectId','appId'].forEach(k=>{if(!c[k])throw Error('Could not find '+k+' in the copied Firebase Config')});
localStorage.setItem(K,JSON.stringify(c));
location.href=location.origin+location.pathname+'?v=2.1.1';
}catch(e){if($('configError'))$('configError').textContent=e.message}});
on('changeConfig','onclick',()=>{localStorage.removeItem(K);location.reload()});
on('signInTab','onclick',()=>tabs(0));on('ownerTab','onclick',()=>tabs(1));
on('signIn','onsubmit',login);on('ownerSetup','onsubmit',owner);on('logout','onclick',()=>signOut(auth));
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>view(b.dataset.view));
document.querySelectorAll('.newEstimate').forEach(b=>b.onclick=()=>view('estimate'));
document.querySelectorAll('.newProject').forEach(b=>b.onclick=()=>view('projects'));
on('workspace','onchange',()=>{company=V('workspace');watchData()});
on('estType','onchange',type);on('estCustomer','onchange',existingCustomerSelected);
on('estProject','onchange',projectSelected);on('quoteMode','onchange',calc);on('fieldVerify','onchange',calc);
const form=$('estimateForm');if(form){form.addEventListener('input',calc);form.onsubmit=saveEstimate}
on('customerForm','onsubmit',saveCustomer);on('projectForm','onsubmit',saveProject);
on('companyForm','onsubmit',saveCompany);on('print','onclick',()=>print());
document.querySelectorAll('input[name="customerMode"]').forEach(r=>r.addEventListener('change',()=>{
  const hidden=$('customerMode');if(hidden)hidden.value=r.value;customerModeChanged()
}));
customerModeChanged();
}
function showStartupError(err){
  document.body.innerHTML=`<main class="startup-error"><h1>ATLAS could not start</h1><p>${E(err?.message||String(err))}</p><button onclick="location.reload()">Reload ATLAS</button></main>`;
}
function boot(c){const app=initializeApp(c);auth=getAuth(app);db=getFirestore(app,"default");onAuthStateChanged(auth,async u=>{subs.forEach(x=>x());subs=[];if(!u)return show('authScreen');user=u;let s=await getDoc(doc(db,'users',u.uid));if(!s.exists()){await signOut(auth);return $('authError').textContent='No Atlas profile found'}profile=s.data();company=profile.role==='owner'?(profile.lastCompany||'delamere'):(profile.companyIds?.[0]||'delamere');launch()})}
function show(id){['configScreen','authScreen','app'].forEach(x=>{if($(x))$(x).classList.add('hidden')});if($(id))$(id).classList.remove('hidden')}function tabs(o){$('signIn').classList.toggle('hidden',o);$('ownerSetup').classList.toggle('hidden',!o);$('signInTab').classList.toggle('active',!o);$('ownerTab').classList.toggle('active',o)}async function login(e){e.preventDefault();try{await signInWithEmailAndPassword(auth,V('email'),V('password'))}catch(x){$('authError').textContent=x.message}}async function owner(e){e.preventDefault();try{if((await getDoc(doc(db,'system','bootstrap'))).exists())throw Error('Owner already exists');let c=await createUserWithEmailAndPassword(auth,V('ownerEmail'),V('ownerPassword')),b=writeBatch(db);b.set(doc(db,'users',c.user.uid),{name:V('ownerName'),email:V('ownerEmail'),role:'owner',companyIds:['delamere'],active:true,createdAt:serverTimestamp()});b.set(doc(db,'companies','delamere'),{name:'Delamere Industries',active:true,createdAt:serverTimestamp()});b.set(doc(db,'system','bootstrap'),{ownerUid:c.user.uid,createdAt:serverTimestamp()});await b.commit()}catch(x){$('authError').textContent=x.message}}
function launch(){show('app');$('profileName').textContent=profile.name;$('profileRole').textContent=profile.role==='owner'?'Owner / Super Admin':profile.role;document.querySelectorAll('.owner').forEach(x=>x.classList.toggle('hidden',profile.role!=='owner'));watchCompanies();pricing()}
function view(x){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$(x).classList.remove('hidden');document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===x));if(x==='estimate')calc()}
function watchCompanies(){subs.push(onSnapshot(collection(db,'companies'),s=>{let a=[];s.forEach(d=>{if(profile.role==='owner'||profile.companyIds?.includes(d.id))a.push({id:d.id,...d.data()})});$('workspace').innerHTML=a.map(c=>`<option value="${c.id}">${E(c.name)}</option>`).join('');if(!a.some(c=>c.id===company))company=a[0]?.id;$('workspace').value=company;$('companyName').textContent=a.find(c=>c.id===company)?.name||'—';$('companyList').innerHTML=a.map(c=>`<div class="row"><b>${E(c.name)}</b><span>${c.id}</span><span>Active</span></div>`).join('');watchData()}))}

function watchData(){
if(!company)return;
$('welcome').textContent='Welcome '+profile.name;
$('companyName').textContent=companyName();
subs.forEach(x=>x());subs=[];
let qe=query(collection(db,'estimates'),where('companyId','==',company),orderBy('createdAt','desc'),limit(100));
subs.push(onSnapshot(qe,s=>{
let a=s.docs.map(d=>({id:d.id,...d.data()}));
$('estimateCount').textContent=a.length;
$('openCount').textContent=a.filter(x=>x.status!=='won'&&x.status!=='lost').length;
$('recent').innerHTML=a.slice(0,8).map(x=>estimateCard(x)).join('')||'<p>No estimates yet.</p>';
$('estimateList').innerHTML=a.map(x=>estimateCard(x,true)).join('')||'<p>No estimates yet.</p>'
}));
let qc=query(collection(db,'customers'),where('companyId','==',company));
subs.push(onSnapshot(qc,s=>{
let a=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.name||'').localeCompare(b.name||''));customers=a;
$('customerCount').textContent=a.length;
$('customerList').innerHTML=a.map(x=>`<div class="row"><div><b>${x.name}</b><span>${x.contact||''} ${x.email||''}</span></div></div>`).join('')||'<p>No customers yet.</p>';
$('estCustomer').innerHTML='<option value="">Select customer</option>'+a.map(x=>`<option value="${E(x.name)}">${E(x.name)}</option>`).join('')
}));
let qp=query(collection(db,'projects'),where('companyId','==',company));
subs.push(onSnapshot(qp,s=>{
projects=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>((b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
$('projectCount').textContent=projects.length;
$('projectList').innerHTML=projects.map(x=>`<div class="row"><div><b>${x.name}</b><span>${x.customer||''} · ${x.location||''}</span></div><span class="badge">${x.status||'Active'}</span></div>`).join('')||'<p>No projects yet.</p>';
$('estProject').innerHTML='<option value="">Select project</option>'+projects.map(x=>`<option value="${E(x.name)}">${E(x.name)}</option>`).join('')
}));
}

function companyName(){
let o=$('workspace').options[$('workspace').selectedIndex];
return o?o.textContent:'—'
}
function estimateCard(x,full=false){
let q=x.quoteNumber||'Draft';
let total=M(x.total||0);
let meta=[x.customer,x.project,x.description].filter(Boolean).join(' · ');
return `<div class="row estimate-row"><div><b>${q} — ${total}</b><span>${meta}</span></div><span class="badge">${x.status||'draft'}</span></div>`
}
async function nextQuoteNumber(){
let year=new Date().getFullYear();
let ref=doc(db,'counters',company+'-'+year);
let snap=await getDoc(ref);
let n=snap.exists()?(snap.data().last||0)+1:1;
await setDoc(ref,{companyId:company,year,last:n,updatedAt:serverTimestamp()},{merge:true});
return `${company.toUpperCase()}-${year}-${String(n).padStart(4,'0')}`
}
async function saveProject(e){
e.preventDefault();
try{
await addDoc(collection(db,'projects'),{
companyId:company,
name:V('projectName'),
customer:V('projectCustomer'),
location:V('projectLocation'),
projectNumber:V('projectNumber'),
status:V('projectStatus')||'Active',
notes:V('projectNotes'),
createdBy:user.uid,
createdAt:serverTimestamp()
});
e.target.reset();toast('Project saved')
}catch(x){toast(x.message)}
}


function customerModeChanged(){
  const mode=V('customerMode')||'existing';
  if($('existingCustomerBlock'))$('existingCustomerBlock').classList.toggle('hidden',mode!=='existing');
  if($('newCustomerBlock'))$('newCustomerBlock').classList.toggle('hidden',mode!=='new');
  if($('estCustomer'))$('estCustomer').required=mode==='existing';
  if($('newCustomerName'))$('newCustomerName').required=mode==='new';
}
window.customerModeChanged=customerModeChanged;
function existingCustomerSelected(){
  const c=customers.find(x=>x.name===V('estCustomer'));
  if(!c)return;
  if(c.email)$('newCustomerEmail').value=c.email;
  if(c.phone)$('newCustomerPhone').value=c.phone;
  if(c.contact)$('newCustomerContact').value=c.contact;
  if(c.billingAddress)$('newCustomerBilling').value=c.billingAddress;
}
async function resolveEstimateCustomer(){
  if(V('customerMode')!=='new') return V('estCustomer');
  const name=V('newCustomerName').trim();
  if(!name) throw new Error('Customer name is required.');
  const data={
    companyId:company,
    name,
    contact:V('newCustomerContact'),
    email:V('newCustomerEmail'),
    phone:V('newCustomerPhone'),
    billingAddress:V('newCustomerBilling'),
    jobAddress:V('newCustomerJob'),
    taxExempt:$('newCustomerTaxExempt').checked,
    notes:V('newCustomerNotes'),
    createdBy:user.uid,
    createdAt:serverTimestamp()
  };
  if($('saveNewCustomer').checked){
    await addDoc(collection(db,'customers'),data);
  }
  return name;
}
function projectSelected(){
  let p=projects.find(x=>x.name===V('estProject'));
  if(!p)return;
  if(p.customer)$('estCustomer').value=p.customer;
  if(p.location)$('estLocation').value=p.location;
}
function pricing(){
$('pricingRows').innerHTML=prices.map(p=>`<tr><td>${p[0]}</td><td>${p[1]}</td><td>${p[2]}</td><td>${M(p[5])}</td><td>${p[6]}</td><td>${M(p[7])}</td><td>${p[12]}</td></tr>`).join('');
$('estType').innerHTML=prices.map(p=>`<option value="${p[0]}">${p[1]}</option>`).join('');
type()
}
function type(){
let p=prices.find(x=>x[0]===V('estType'));if(!p)return;
$('base').value=p[5];$('production').value=p[6];$('hoopRate').value=p[7];$('profit').value=p[11];
$('grabRate').value=p[8];$('powderRate').value=p[9];$('postRate').value=p[10];
$('leadTime').textContent=p[4]?p[4]+' weeks':'Verify';
$('pricingNote').textContent=p[12];
calc()
}
function fieldFee(){
let mode=V('fieldVerify');
if(mode==='local')return 350;
if(mode==='regional')return 650;
if(mode==='long')return 950;
if(mode==='custom')return N('fieldCustom');
return 0
}
function calc(){
let q=Math.max(1,N('qty')),mode=V('quoteMode'),p=prices.find(x=>x[0]===V('estType'));
let materialBase=N('base')*q;
let grab=N('grabRate')*($('addGrab').checked?1:0)*q;
let powder=N('powderRate')*($('addPowder').checked?1:0)*q;
let posts=N('posts')*N('postRate');
let hoops=N('hoops')*N('hoopRate');
let equipment=N('equipment');
let equipmentContingency=$('equipmentContingency')?.checked?equipment*.30:0;
let field=fieldFee();
let shop=$('shopDrawings').checked?300:0;
let production=Math.max(1,N('production'));
let days=mode==='install'?Math.ceil(q/production):0;
let labor=mode==='install'?days*N('laborDay'):0;
let mileage=mode==='install'?N('miles')*N('mileRate'):0;
let hotels=mode==='install'?N('nights')*N('hotel'):0;
let travelLabor=mode==='install'?N('travelHalfDays')*750:0;
let travel=mileage+hotels+travelLabor;
let other=grab+powder+posts+hoops+equipment+equipmentContingency+field+shop;
let preProfit=materialBase+labor+travel+other;
let profit=N('profit')*q;
let subtotal=preProfit+profit;
let tax=0,taxFee=0,taxRate=($('salesTaxRate')?N('salesTaxRate'):7)/100;
if(mode==='material'){
  let taxable=Math.max(0,subtotal-shop);
  tax=taxable*taxRate;
}
let raw=subtotal+tax+taxFee;
let exactLF=raw/q;
let perLF=Math.round(exactLF);
let total=perLF*q;
[
['sBase',materialBase],['sLabor',labor],['sMileage',mileage],['sHotels',hotels],
['sTravelLabor',travelLabor],['sTravel',travel],['sGrab',grab],['sPowder',powder],
['sPosts',posts],['sHoops',hoops],['sEquipment',equipment+equipmentContingency],
['sField',field],['sShop',shop],['sOther',other],['sPreProfit',preProfit],
['sProfit',profit],['sSubtotal',subtotal],['sTax',tax],['sTotal',total],
['sLF',perLF],['sExactLF',exactLF]
].forEach(x=>{if($(x[0]))$(x[0]).textContent=M(x[1])});
$('sDays').textContent=days;
if($('taxLine'))$('taxLine').classList.toggle('hidden',mode!=='material');
if($('installFields'))$('installFields').classList.toggle('hidden',mode!=='install');
return{quoteMode:mode,qty:q,materialBase,grab,powder,postsTotal:posts,hoopsTotal:hoops,
equipment,equipmentContingency,fieldVerification:field,shopDrawings:shop,production,days,labor,
mileage,hotels,travelLabor,travel,other,preProfit,profit,subtotal,taxRate,tax,taxFee,raw,exactLF,perLF,total}
}
async function saveEstimate(e){
e.preventDefault();
try{
let c=calc(),p=prices.find(x=>x[0]===V('estType'));
let customerName=await resolveEstimateCustomer();
let quoteNumber=await nextQuoteNumber();
await addDoc(collection(db,'estimates'),{
quoteNumber,
companyId:company,companyName:companyName(),customer:customerName,project:V('estProject'),location:V('estLocation'),
type:p[0],description:p[1],material:p[2],leadWeeks:p[4],status:'draft',
createdBy:user.uid,createdAt:serverTimestamp(),notes:V('estimateNotes'),
inputs:{base:N('base'),profit:N('profit'),laborDay:N('laborDay'),mileRate:N('mileRate'),hotel:N('hotel'),miles:N('miles'),nights:N('nights'),travelHalfDays:N('travelHalfDays'),hoops:N('hoops'),posts:N('posts')},...c
});
$('lastQuoteNumber').textContent=quoteNumber;
toast('Estimate '+quoteNumber+' saved');view('estimates')
}catch(x){toast(x.message)}
}
async function saveCustomer(e){e.preventDefault();try{await addDoc(collection(db,'customers'),{companyId:company,name:V('custName'),contact:V('custContact'),email:V('custEmail'),createdBy:user.uid,createdAt:serverTimestamp()});e.target.reset();toast('Customer saved')}catch(x){toast(x.message)}}async function saveCompany(e){e.preventDefault();let name=V('newCompany'),id=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');try{await setDoc(doc(db,'companies',id),{name,active:true,createdAt:serverTimestamp()});e.target.reset();toast('Company created')}catch(x){toast(x.message)}}function row(x){let d=x.createdAt?.toDate?x.createdAt.toDate().toLocaleDateString():'Syncing…';return`<div class="row"><div><b>${E(x.project)}</b><br><small>${E(x.customer)} · ${E(x.type)}</small></div><div>${Number(x.qty||0).toLocaleString()} LF<br><small>${x.days} days</small></div><div><b>${M(x.total)}</b><br><small>${M(x.perLF)}/LF</small></div><small>${d}</small></div>`}function toast(t){$('toast').textContent=t;$('toast').classList.remove('hidden');setTimeout(()=>$('toast').classList.add('hidden'),2500)}function online(){let f=()=>{$('offline').classList.toggle('hidden',navigator.onLine);if($('sync'))$('sync').textContent=navigator.onLine?'Online':'Offline'};addEventListener('online',f);addEventListener('offline',f);f()}
