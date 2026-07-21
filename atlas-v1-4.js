import{initializeApp}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";import{getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";import{getFirestore,doc,getDoc,setDoc,addDoc,collection,query,where,orderBy,limit,onSnapshot,serverTimestamp,writeBatch}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const K="atlasFirebaseConfig",$=x=>document.getElementById(x),V=x=>$(x).value,N=x=>Number(V(x)||0),M=x=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(x||0),E=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));let auth,db,user,profile,company="delamere",subs=[];const prices=[["460-490","Rectangular Rail Retrofit","Aluminum","Rectangular rail retrofit",10,73,500,1000,0,25,0,18,"May Sheet base"],["822-S","822 Single Rail","Aluminum","Single rail",7,15,300,600,0,15,0,5,"May Sheet base"],["822-D","822 16 in Post Double Rail","Aluminum","16 in post double rail",7,26,300,850,0,20,0,8,"May Sheet base"],["822-T","822 Triple Rail","Aluminum","Triple rail",7,36,300,1000,0,24,0,10,"May Sheet base"],["870-2","870 Aluminum 2-Rail Guide Rail","Aluminum","2-rail guide rail",5,35,400,70,10,19,0,10,"May Sheet base"],["870-3","870 Aluminum Triple Rail","Aluminum","Triple rail",8,45,300,110,10,20,0,15,"May Sheet base"],["880-2","880 Steel 2-Rail Guide Rail","Steel","2-rail guide rail",8,50,400,90,15,20,0,10,"May Sheet base"],["880-3","880 Steel Triple Rail","Steel","Triple rail",8,65,300,95,15,21,0,17,"May Sheet base"],["862-42","862 42 in Pipe/Picket Rail","Aluminum","42 in pipe/picket rail",8,72,400,100,15,25,0,10,"May Sheet base"],["862-42S","862 42 in Sunshine Infill","Aluminum","42 in sunshine infill",14,228,400,100,15,30,0,20,"May Sheet base"],["862-48S","862 48 in Sunshine Infill","Aluminum","48 in sunshine infill",14,245,400,100,15,30,0,22,"May Sheet base"],["862-54","862 54 in Rail","Aluminum","54 in rail",8,85,400,100,15,28,0,20,"May Sheet base"],["862-48","862 48 in Rail","Aluminum","48 in rail",8,82,400,100,15,27,0,15,"May Sheet base"],["852-42","852 42 in Rail","Steel","42 in rail",9,73,400,100,15,20,0,15,"May Sheet base"],["852-54","852 54 in Rail","Steel","54 in rail",9,80,400,100,15,20,0,20,"May Sheet base"],["852-48","852 48 in Rail","Steel","48 in rail",9,79,400,100,15,20,0,20,"May Sheet base"],["852-42S","852 42 in Sunshine Infill","Steel","42 in sunshine infill",14,150,400,100,15,25,0,25,"May Sheet base"],["860-42","860 42 in Rail","Steel","42 in rail",6,200,400,100,15,25,0,30,"May Sheet base"],["850-42","850 42 in Rail","Steel","42 in rail",6,175,400,100,15,30,0,30,"May Sheet base"],["TR-RR","Type R Partial Curve Over Railroad","Steel","Partial curve over railroad",8,85,300,0,0,15,200,15,"May Sheet base"],["TR-PM","Type R Partial Curve Plate Mounted","Steel","Partial curve plate mounted",8,114,300,0,0,25,300,20,"May Sheet base"],["TR-S4","Type R Side Mount Vertical 4 ft","Steel","Side mount vertical 4 ft",8,41,300,0,0,25,0,20,"May Sheet base"],["TR-P4","Type R Plate Mounted Vertical 4 ft","Steel","Plate mounted vertical 4 ft",8,46,300,0,0,25,0,20,"May Sheet base"],["TR-S6","Type R Side Mount Vertical 6 ft","Steel","Side mount vertical 6 ft",8,52,300,0,0,25,0,20,"May Sheet base"],["TR-P6","Type R Plate Mounted Vertical 6 ft","Steel","Plate mounted vertical 6 ft",8,55,300,0,0,25,0,20,"May Sheet base"],["TR-S10","Type R Side Mount Vertical 10 ft","Steel","Side mount vertical 10 ft",8,70,300,0,0,25,0,20,"May Sheet base"],["TR-P10","Type R Plate Mounted Vertical 10 ft","Steel","Plate mounted vertical 10 ft",8,63,300,0,0,25,0,20,"May Sheet base"],["550-002-G6","Type B Fence 6 ft Galvanized","Galvanized Steel","6 ft Type B fence",0,15.3733135259,200,0,0,0,0,0,"May material calculator; margin embedded"],["550-002-B6","Type B Fence 6 ft Black","Black Steel","6 ft Type B fence",0,17.2314586004,200,0,0,0,0,0,"May material calculator; margin embedded"],["550-002-G4","Type B Fence 4 ft Galvanized","Galvanized Steel","4 ft Type B fence",0,13.2730778571,200,0,0,0,0,0,"May material calculator; margin embedded"],["550-002-B4","Type B Fence 4 ft Black","Black Steel","4 ft Type B fence",0,14.2932899129,200,0,0,0,0,0,"May material calculator; margin embedded"]];
document.addEventListener('DOMContentLoaded',()=>{bind();online();if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js');const c=localStorage.getItem(K);c?boot(JSON.parse(c)):show('configScreen')});
function bind(){$('saveConfig').onclick=()=>{try{
let raw=V('config').trim(),c={};
for(const k of ['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','measurementId']){
  const m=raw.match(new RegExp(k+'\\s*:\\s*["\\\']([^"\\\']+)["\\\']'));
  if(m)c[k]=m[1].trim();
}
if(!c.apiKey){try{c=JSON.parse(raw)}catch{}}
['apiKey','authDomain','projectId','appId'].forEach(k=>{if(!c[k])throw Error('Could not find '+k+' in the copied Firebase Config')});
localStorage.setItem(K,JSON.stringify(c));
location.href=location.origin+location.pathname+'?v=1.3.0';
}catch(e){$('configError').textContent=e.message}};$('changeConfig').onclick=()=>{localStorage.removeItem(K);location.reload()};$('signInTab').onclick=()=>tabs(0);$('ownerTab').onclick=()=>tabs(1);$('signIn').onsubmit=login;$('ownerSetup').onsubmit=owner;$('logout').onclick=()=>signOut(auth);document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>view(b.dataset.view));document.querySelectorAll('.newEstimate').forEach(b=>b.onclick=()=>view('estimate'));$('workspace').onchange=()=>{company=V('workspace');watchData()};$('estType').onchange=type;$('quoteMode').onchange=calc;$('fieldVerify').onchange=calc;$('estimateForm').addEventListener('input',calc);$('estimateForm').onsubmit=saveEstimate;$('customerForm').onsubmit=saveCustomer;$('companyForm').onsubmit=saveCompany;$('print').onclick=()=>print()}
function boot(c){const app=initializeApp(c);auth=getAuth(app);db=getFirestore(app,"default");onAuthStateChanged(auth,async u=>{subs.forEach(x=>x());subs=[];if(!u)return show('authScreen');user=u;let s=await getDoc(doc(db,'users',u.uid));if(!s.exists()){await signOut(auth);return $('authError').textContent='No Atlas profile found'}profile=s.data();company=profile.role==='owner'?(profile.lastCompany||'delamere'):(profile.companyIds?.[0]||'delamere');launch()})}
function show(id){['configScreen','authScreen','app'].forEach(x=>$(x).classList.add('hidden'));$(id).classList.remove('hidden')}function tabs(o){$('signIn').classList.toggle('hidden',o);$('ownerSetup').classList.toggle('hidden',!o);$('signInTab').classList.toggle('active',!o);$('ownerTab').classList.toggle('active',o)}async function login(e){e.preventDefault();try{await signInWithEmailAndPassword(auth,V('email'),V('password'))}catch(x){$('authError').textContent=x.message}}async function owner(e){e.preventDefault();try{if((await getDoc(doc(db,'system','bootstrap'))).exists())throw Error('Owner already exists');let c=await createUserWithEmailAndPassword(auth,V('ownerEmail'),V('ownerPassword')),b=writeBatch(db);b.set(doc(db,'users',c.user.uid),{name:V('ownerName'),email:V('ownerEmail'),role:'owner',companyIds:['delamere'],active:true,createdAt:serverTimestamp()});b.set(doc(db,'companies','delamere'),{name:'Delamere Industries',active:true,createdAt:serverTimestamp()});b.set(doc(db,'system','bootstrap'),{ownerUid:c.user.uid,createdAt:serverTimestamp()});await b.commit()}catch(x){$('authError').textContent=x.message}}
function launch(){show('app');$('profileName').textContent=profile.name;$('profileRole').textContent=profile.role==='owner'?'Owner / Super Admin':profile.role;document.querySelectorAll('.owner').forEach(x=>x.classList.toggle('hidden',profile.role!=='owner'));watchCompanies();pricing()}
function view(x){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$(x).classList.remove('hidden');document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===x));if(x==='estimate')calc()}
function watchCompanies(){subs.push(onSnapshot(collection(db,'companies'),s=>{let a=[];s.forEach(d=>{if(profile.role==='owner'||profile.companyIds?.includes(d.id))a.push({id:d.id,...d.data()})});$('workspace').innerHTML=a.map(c=>`<option value="${c.id}">${E(c.name)}</option>`).join('');if(!a.some(c=>c.id===company))company=a[0]?.id;$('workspace').value=company;$('companyName').textContent=a.find(c=>c.id===company)?.name||'—';$('companyList').innerHTML=a.map(c=>`<div class="row"><b>${E(c.name)}</b><span>${c.id}</span><span>Active</span></div>`).join('');watchData()}))}
function watchData(){if(!company)return;$('welcome').textContent='Welcome '+profile.name;let qe=query(collection(db,'estimates'),where('companyId','==',company),orderBy('createdAt','desc'),limit(100));subs.push(onSnapshot(qe,{includeMetadataChanges:true},s=>{let a=[];s.forEach(d=>a.push(d.data()));$('estimateCount').textContent=a.length;$('openCount').textContent=a.filter(x=>x.status!=='accepted').length;$('estimateList').innerHTML=a.map(row).join('')||'<p>No estimates yet.</p>';$('recent').innerHTML=a.slice(0,5).map(row).join('')||'<p>No estimates yet.</p>';$('sync').textContent=s.metadata.hasPendingWrites?'Syncing…':navigator.onLine?'Online':'Offline'}));let qc=query(collection(db,'customers'),where('companyId','==',company),orderBy('createdAt','desc'),limit(100));subs.push(onSnapshot(qc,s=>{let a=[];s.forEach(d=>a.push(d.data()));$('customerCount').textContent=a.length;$('customerList').innerHTML=a.map(x=>`<div class="row"><b>${E(x.name)}</b><span>${E(x.contact||'')}</span><span>${E(x.email||'')}</span></div>`).join('')||'<p>No customers yet.</p>'}))}
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
let featureLF=(N('grabRate')*( $('addGrab').checked?1:0)+N('powderRate')*($('addPowder').checked?1:0))*q;
let posts=N('posts')*N('postRate');
let hoops=N('hoops')*N('hoopRate');
let equipment=N('equipment');
let field=fieldFee();
let shop=$('shopDrawings').checked?300:0;
let days=mode==='install'?Math.ceil(q/Math.max(1,N('production'))):0;
let labor=mode==='install'?days*N('laborDay'):0;
let travel=mode==='install'?(N('miles')*N('mileRate')+N('nights')*N('hotel')+N('travelHalfDays')*750):0;
let preProfit=materialBase+featureLF+posts+hoops+equipment+field+shop+labor+travel;
let profit=N('profit')*q;
let beforeTax=preProfit+profit;
let tax=0,taxFee=0;
if(mode==='material'){
  let taxable=Math.max(0,beforeTax-shop);
  if(taxable<5000)tax=taxable*.065;
  else{tax=taxable*.06;taxFee=25}
}
let raw=beforeTax+tax+taxFee;
let lf=Math.round(raw/q),total=lf*q;
let exactLF=raw/q;
[['sBase',materialBase],['sLabor',labor],['sTravel',travel],['sOther',featureLF+posts+hoops+equipment+field+shop],['sProfit',profit],['sTax',tax+taxFee],['sTotal',total],['sLF',lf],['sExactLF',exactLF]].forEach(x=>$(x[0]).textContent=M(x[1]));
$('sDays').textContent=days;
$('taxLine').classList.toggle('hidden',mode!=='material');
$('installFields').classList.toggle('hidden',mode!=='install');
return{quoteMode:mode,qty:q,materialBase,featureLF,postsTotal:posts,hoopsTotal:hoops,equipment,fieldVerification:field,shopDrawings:shop,days,labor,travel,preProfit,profit,tax,taxFee,raw,exactLF,perLF:lf,total}
}
async function saveEstimate(e){
e.preventDefault();
try{
let c=calc(),p=prices.find(x=>x[0]===V('estType'));
await addDoc(collection(db,'estimates'),{
companyId:company,customer:V('estCustomer'),project:V('estProject'),location:V('estLocation'),
type:p[0],description:p[1],material:p[2],leadWeeks:p[4],status:'draft',
createdBy:user.uid,createdAt:serverTimestamp(),notes:V('estimateNotes'),...c
});
toast('Estimate saved');view('estimates')
}catch(x){toast(x.message)}
}
async function saveCustomer(e){e.preventDefault();try{await addDoc(collection(db,'customers'),{companyId:company,name:V('custName'),contact:V('custContact'),email:V('custEmail'),createdBy:user.uid,createdAt:serverTimestamp()});e.target.reset();toast('Customer saved')}catch(x){toast(x.message)}}async function saveCompany(e){e.preventDefault();let name=V('newCompany'),id=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');try{await setDoc(doc(db,'companies',id),{name,active:true,createdAt:serverTimestamp()});e.target.reset();toast('Company created')}catch(x){toast(x.message)}}function row(x){let d=x.createdAt?.toDate?x.createdAt.toDate().toLocaleDateString():'Syncing…';return`<div class="row"><div><b>${E(x.project)}</b><br><small>${E(x.customer)} · ${E(x.type)}</small></div><div>${Number(x.qty||0).toLocaleString()} LF<br><small>${x.days} days</small></div><div><b>${M(x.total)}</b><br><small>${M(x.perLF)}/LF</small></div><small>${d}</small></div>`}function toast(t){$('toast').textContent=t;$('toast').classList.remove('hidden');setTimeout(()=>$('toast').classList.add('hidden'),2500)}function online(){let f=()=>{$('offline').classList.toggle('hidden',navigator.onLine);if($('sync'))$('sync').textContent=navigator.onLine?'Online':'Offline'};addEventListener('online',f);addEventListener('offline',f);f()}
