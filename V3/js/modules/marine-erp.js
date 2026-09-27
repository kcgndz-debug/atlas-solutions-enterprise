(() => {
  "use strict";
  if (!window.AtlasMarine) return;

  const base = window.AtlasMarine;

  const extraSeed = ({ iso }) => {
    const companyId = "bertram-demo";
    const today = new Date();
    const plus = days => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return iso(d);
    };

    return {
      salesOrders: [
        {id:"so-26041",companyId,order:"SO-26041",dealer:"Gulf Coast Dealer Demo",hull:"B39-026",model:"39CC",status:"Released to Production",value:720000,deposit:180000,target:plus(48),config:"Rev C",changeOrders:2,credit:"Clear"},
        {id:"so-26052",companyId,order:"SO-26052",dealer:"Northeast Dealer Demo",hull:"B50-008",model:"50 Sport",status:"Production",value:1450000,deposit:362500,target:plus(69),config:"Rev D",changeOrders:3,credit:"Clear"},
        {id:"so-26063",companyId,order:"SO-26063",dealer:"International Dealer Demo",hull:"B61-004",model:"61 Convertible",status:"Production",value:2650000,deposit:795000,target:plus(88),config:"Rev E",changeOrders:5,credit:"Clear"},
        {id:"so-26077",companyId,order:"SO-26077",dealer:"Dealer Stock Demo",hull:"B34-042",model:"34CC",status:"Engineering Release",value:525000,deposit:105000,target:plus(128),config:"Rev A",changeOrders:0,credit:"Clear"},
        {id:"so-26081",companyId,order:"SO-26081",dealer:"Pending Dealer Demo",hull:"Unassigned",model:"39CC",status:"Configuration Review",value:748000,deposit:0,target:plus(152),config:"Draft 2",changeOrders:1,credit:"Deposit Pending"}
      ],

      plannedOrders: [
        {id:"mrp-1",companyId,item:"GEN-9KW-01",description:"9 kW marine generator",hull:"B50-008",type:"Purchase",qty:1,need:plus(9),suggested:plus(1),status:"Exception",message:"PO arrives 6 days after required-on-line date",action:"Expedite / alternate source"},
        {id:"mrp-2",companyId,item:"TRM-ACT-02",description:"Trim actuator assembly",hull:"B34-041",type:"Purchase",qty:2,need:plus(14),suggested:plus(3),status:"Firm",message:"Supplier acknowledgement missing",action:"Request confirmation"},
        {id:"mrp-3",companyId,item:"EL-HRN-39C",description:"39CC electrical harness kit",hull:"B39-027",type:"Purchase",qty:1,need:plus(18),suggested:plus(5),status:"Covered",message:"Supply on time",action:"None"},
        {id:"mrp-4",companyId,item:"BRK-FWP-39",description:"Freshwater pump bracket",hull:"B39-026",type:"Manufacture",qty:1,need:plus(4),suggested:plus(0),status:"Engineering Change",message:"ECO-2026-018 changed bracket location",action:"Release revised work package"},
        {id:"mrp-5",companyId,item:"NAV-61-301",description:"Navigation electronics package",hull:"B61-004",type:"Purchase",qty:1,need:plus(21),suggested:plus(7),status:"Review",message:"Drawing Rev D still under engineering review",action:"Hold release"}
      ],

      purchaseOrders: [
        {id:"po-10488",companyId,po:"PO-10488",supplier:"Demo Generator Supplier",buyer:"Taylor Brooks",hull:"B50-008",item:"GEN-9KW-01",qty:1,total:18450,status:"Delayed",ordered:plus(-18),promise:plus(15),need:plus(9),ack:"Confirmed",receipt:"0 / 1",approval:"Approved"},
        {id:"po-10502",companyId,po:"PO-10502",supplier:"Demo Electronics Supplier",buyer:"Taylor Brooks",hull:"B39-026",item:"NAV-RAD-04",qty:1,total:9230,status:"In Transit",ordered:plus(-11),promise:plus(10),need:plus(12),ack:"Confirmed",receipt:"0 / 1",approval:"Approved"},
        {id:"po-10511",companyId,po:"PO-10511",supplier:"Demo Motion Systems",buyer:"Taylor Brooks",hull:"B34-041",item:"TRM-ACT-02",qty:2,total:3760,status:"Awaiting Supplier",ordered:plus(-4),promise:"TBD",need:plus(14),ack:"Pending",receipt:"0 / 2",approval:"Approved"},
        {id:"po-10519",companyId,po:"PO-10519",supplier:"Demo Interior Supplier",buyer:"Taylor Brooks",hull:"B35-019",item:"INT-UPH-35A",qty:1,total:28800,status:"Received",ordered:plus(-31),promise:plus(-4),need:plus(-2),ack:"Confirmed",receipt:"1 / 1",approval:"Approved"},
        {id:"po-10526",companyId,po:"PO-10526",supplier:"Demo Harness Supplier",buyer:"Taylor Brooks",hull:"B39-027",item:"EL-HRN-39C",qty:1,total:14600,status:"Open",ordered:plus(-2),promise:plus(7),need:plus(18),ack:"Confirmed",receipt:"0 / 1",approval:"Needs Buyer Release"}
      ],

      receipts: [
        {id:"rcv-8812",companyId,po:"PO-10519",supplier:"Demo Interior Supplier",item:"INT-UPH-35A",qty:1,date:plus(-4),inspection:"Accepted",bin:"STAGE-FN-03",hull:"B35-019"},
        {id:"rcv-8807",companyId,po:"PO-10472",supplier:"Demo Engine Supplier",item:"ENG-V10-SET",qty:1,date:plus(-6),inspection:"Accepted",bin:"BAY-M1",hull:"B39-026"},
        {id:"rcv-8798",companyId,po:"PO-10458",supplier:"Demo Plumbing Supplier",item:"PL-KIT-39C",qty:1,date:plus(-9),inspection:"Accepted",bin:"KIT-39-026",hull:"B39-026"},
        {id:"rcv-8794",companyId,po:"PO-10449",supplier:"Demo Finish Supplier",item:"FIN-35-ATL",qty:1,date:plus(-11),inspection:"Hold",bin:"QA-HOLD-02",hull:"B35-019"}
      ],

      inventory: [
        {id:"inv-1",companyId,part:"GEN-9KW-01",description:"9 kW marine generator",onHand:0,allocated:1,onOrder:1,available:-1,location:"—",lot:"Serial controlled",status:"Short",nextDemand:"B50-008 · "+plus(9)},
        {id:"inv-2",companyId,part:"TRM-ACT-02",description:"Trim actuator assembly",onHand:1,allocated:3,onOrder:2,available:0,location:"A-14-02",lot:"Lot / serial",status:"Tight",nextDemand:"B34-041 · "+plus(14)},
        {id:"inv-3",companyId,part:"EL-HRN-39C",description:"39CC electrical harness kit",onHand:0,allocated:1,onOrder:1,available:0,location:"KIT-39",lot:"Serialized kit",status:"Covered",nextDemand:"B39-027 · "+plus(18)},
        {id:"inv-4",companyId,part:"PMP-FW-220",description:"Freshwater pump",onHand:7,allocated:3,onOrder:4,available:4,location:"B-07-03",lot:"Lot 26-09A",status:"Healthy",nextDemand:"B39-026 · "+plus(4)},
        {id:"inv-5",companyId,part:"NAV-DSP-16",description:"16 in navigation display",onHand:5,allocated:4,onOrder:6,available:1,location:"SEC-ELEC-01",lot:"Serial controlled",status:"Healthy",nextDemand:"B61-004 · "+plus(21)},
        {id:"inv-6",companyId,part:"SS-FAST-KIT",description:"Stainless fastener production kit",onHand:28,allocated:12,onOrder:20,available:16,location:"C-03",lot:"Bin controlled",status:"Healthy",nextDemand:"Multiple hulls"}
      ],

      suppliers: [
        {id:"sup-1",companyId,name:"Demo Generator Supplier",category:"Generators",onTime:72,quality:96,openPOs:1,latePOs:1,spend:18450,risk:"High",portal:"Connected",score:82},
        {id:"sup-2",companyId,name:"Demo Electronics Supplier",category:"Marine electronics",onTime:94,quality:99,openPOs:1,latePOs:0,spend:9230,risk:"Low",portal:"Connected",score:97},
        {id:"sup-3",companyId,name:"Demo Motion Systems",category:"Actuators",onTime:83,quality:93,openPOs:1,latePOs:0,spend:3760,risk:"Medium",portal:"Invite Pending",score:87},
        {id:"sup-4",companyId,name:"Demo Interior Supplier",category:"Interior packages",onTime:97,quality:98,openPOs:0,latePOs:0,spend:28800,risk:"Low",portal:"Connected",score:98},
        {id:"sup-5",companyId,name:"Demo Harness Supplier",category:"Electrical harnesses",onTime:91,quality:97,openPOs:1,latePOs:0,spend:14600,risk:"Low",portal:"Connected",score:95}
      ],

      laborEntries: [
        {id:"lab-1",companyId,date:plus(0),employee:"Chris M.",team:"Electrical Team 2",hull:"B39-026",workPackage:"EL-018",direct:7.5,setup:0.5,indirect:0,status:"Posted"},
        {id:"lab-2",companyId,date:plus(0),employee:"Andre P.",team:"Mechanical Team 1",hull:"B50-008",workPackage:"ME-011",direct:2,setup:0.5,indirect:5.5,status:"Posted"},
        {id:"lab-3",companyId,date:plus(0),employee:"Luis R.",team:"Finish Team",hull:"B35-019",workPackage:"FN-031",direct:8,setup:0,indirect:0,status:"Posted"},
        {id:"lab-4",companyId,date:plus(-1),employee:"Maya T.",team:"Lamination Team A",hull:"B39-027",workPackage:"LAM-006",direct:8,setup:0.5,indirect:0,status:"Posted"},
        {id:"lab-5",companyId,date:plus(-1),employee:"Morgan K.",team:"Quality Assurance",hull:"B28-063",workPackage:"QA-044",direct:4,setup:0,indirect:4,status:"Posted"}
      ],

      financialAccounts: [
        {id:"fin-1",companyId,type:"Accounts Payable",balance:487300,open:31,due7:142800,overdue:38100},
        {id:"fin-2",companyId,type:"Accounts Receivable",balance:1294000,open:18,due7:355000,overdue:64000},
        {id:"fin-3",companyId,type:"Cash",balance:3820000,open:0,due7:0,overdue:0},
        {id:"fin-4",companyId,type:"WIP Inventory",balance:2175000,open:8,due7:0,overdue:0}
      ],

      ledgerActivity: [
        {id:"gl-1",companyId,date:plus(0),reference:"RCV-8812",description:"Receipt INT-UPH-35A to B35-019",debit:"WIP / Inventory",credit:"Accrued AP",amount:28800,status:"Posted"},
        {id:"gl-2",companyId,date:plus(0),reference:"LAB-B39-026",description:"Electrical direct labor",debit:"WIP Labor",credit:"Payroll Clearing",amount:2140,status:"Posted"},
        {id:"gl-3",companyId,date:plus(-1),reference:"NCR-B28-063",description:"Commissioning rework reserve",debit:"Rework Expense",credit:"WIP Reserve",amount:860,status:"Posted"},
        {id:"gl-4",companyId,date:plus(-1),reference:"SO-26041",description:"Progress billing milestone",debit:"Accounts Receivable",credit:"Contract Revenue",amount:72000,status:"Posted"}
      ],

      approvals: [
        {id:"appr-1",companyId,priority:"Critical",type:"Supply Chain",title:"Expedite PO-10488",detail:"B50-008 generator misses required-on-line date by 6 days.",owner:"Purchasing",action:"Approve expedite",status:"Open"},
        {id:"appr-2",companyId,priority:"High",type:"Engineering",title:"Release ECO-2026-018 disposition",detail:"B39-026 bracket relocation affects one work package and one material.",owner:"Engineering",action:"Approve release",status:"Open"},
        {id:"appr-3",companyId,priority:"High",type:"Quality",title:"Clear B28-063 QA hold",detail:"Port trim indication requires re-test before sea trial.",owner:"Quality",action:"Review re-test",status:"Open"},
        {id:"appr-4",companyId,priority:"Normal",type:"Purchasing",title:"Release PO-10526",detail:"Harness supplier confirmed delivery before need date.",owner:"Purchasing",action:"Release PO",status:"Open"},
        {id:"appr-5",companyId,priority:"Normal",type:"Sales",title:"Approve SO-26081 configuration change",detail:"Draft 2 adds electronics option and shifts target cost.",owner:"Sales / Engineering",action:"Approve change",status:"Open"}
      ],

      digitalThread: [
        {id:"dt-1",companyId,hull:"B39-026",time:"08:04",type:"Sales",event:"SO-26041 configuration Rev C approved",impact:"BOM and cost baseline refreshed"},
        {id:"dt-2",companyId,hull:"B39-026",time:"08:22",type:"Engineering",event:"EL-39-212 Rev E released",impact:"EL-018 acknowledgement required"},
        {id:"dt-3",companyId,hull:"B39-026",time:"08:31",type:"Planning",event:"MRP recalculated electrical demand",impact:"No shortage detected"},
        {id:"dt-4",companyId,hull:"B39-026",time:"09:06",type:"Production",event:"EL-018 started by Electrical Team 2",impact:"7.5 direct hours posted"},
        {id:"dt-5",companyId,hull:"B39-026",time:"10:14",type:"Quality",event:"Electrical final inspection opened",impact:"2 findings remain"},
        {id:"dt-6",companyId,hull:"B39-026",time:"11:02",type:"Purchasing",event:"Radar shipment ETA confirmed",impact:"Arrival remains 2 days before need date"}
      ],

      whatIfScenarios: [
        {id:"sim-1",companyId,name:"Generator remains 6 days late",hull:"B50-008",result:"Sea trial moves +4 days unless electrical commissioning is resequenced.",recommendation:"Move non-generator commissioning ahead; authorize premium freight; protect QA slot.",deliveryDelta:4,costDelta:2800},
        {id:"sim-2",companyId,name:"Alternate generator sourced in 48 hours",hull:"B50-008",result:"Current sea-trial target can be preserved.",recommendation:"Approve alternate supplier after engineering equivalency check.",deliveryDelta:0,costDelta:6900},
        {id:"sim-3",companyId,name:"Add weekend mechanical shift",hull:"B50-008",result:"Recovers 2 production days after delayed receipt.",recommendation:"Use only if alternate sourcing is rejected.",deliveryDelta:2,costDelta:4200}
      ]
    };
  };

  const origSeed = base.demoSeed.bind(base);
  base.demoSeed = deps => Object.assign(origSeed(deps), extraSeed(deps));

  const origApplyUi = base.applyUi.bind(base);
  base.applyUi = vertical => {
    origApplyUi(vertical);

    const nav = document.getElementById("mainNav");
    if (nav) {
      const insertBefore = nav.querySelector('[data-view="schedule"]');
      [
        ["orders","Orders & Configuration"],
        ["planning","MRP & What-If"]
      ].forEach(([view,label]) => {
        if (!nav.querySelector(`[data-view="${view}"]`)) {
          const b=document.createElement("button");
          b.className="nav";
          b.dataset.view=view;
          b.textContent=label;
          nav.insertBefore(b,insertBefore);
        }
      });

      const materials = nav.querySelector('[data-view="materials"]');
      if (materials) materials.textContent="Supply Chain & POs";

      const quality = nav.querySelector('[data-view="quality"]');
      [
        ["inventory","Inventory & Warehouse"],
        ["suppliers","Suppliers"],
        ["digitalthread","Hull Digital Thread"]
      ].forEach(([view,label]) => {
        if (!nav.querySelector(`[data-view="${view}"]`)) {
          const b=document.createElement("button");
          b.className="nav";
          b.dataset.view=view;
          b.textContent=label;
          nav.insertBefore(b,quality);
        }
      });

      const finance = nav.querySelector('[data-view="finance"]');
      if (finance) finance.textContent="Financials & Build Cost";
    }

    const users = document.getElementById("users");
    [
      ["orders"],["planning"],["inventory"],["suppliers"],["digitalthread"]
    ].forEach(([id]) => {
      if (!document.getElementById(id) && users) {
        const s=document.createElement("section");
        s.id=id;
        s.className="view";
        users.parentNode.insertBefore(s,users);
      }
    });

    const materialsSection=document.getElementById("materials");
    const h2=materialsSection?.querySelector("h2");
    const p=materialsSection?.querySelector(".section-head p:last-child");
    if(h2) h2.textContent="Supply Chain & Purchase Orders";
    if(p) p.textContent="MRP demand, purchase orders, supplier commitments, receipts, shortages, and production impact.";

    const financeSection=document.getElementById("finance");
    const fh2=financeSection?.querySelector("h2");
    if(fh2) fh2.textContent="Financials & Build Cost";
  };

  const origDashboard = base.renderDashboard.bind(base);
  base.renderDashboard = ctx => {
    origDashboard(ctx);
    const section=document.getElementById("dashboard");
    if(!section) return;
    let panel=document.getElementById("marineActionCenter");
    if(!panel){
      panel=document.createElement("article");
      panel.id="marineActionCenter";
      panel.className="panel";
      section.appendChild(panel);
    }
    const approvals=(ctx.state.approvals||[]).filter(a=>a.companyId===ctx.currentCompanyId&&a.status==="Open");
    panel.innerHTML=`
      <div class="panel-head">
        <div><p class="eyebrow">ATLAS ACTION CENTER</p><h3>Decisions Waiting on You</h3></div>
        <span class="badge">${approvals.length} open</span>
      </div>
      <div class="action-center-grid">
        ${approvals.map(a=>`<div class="action-card"><div><span class="badge">${ctx.esc(a.priority)}</span><small>${ctx.esc(a.type)}</small></div><strong>${ctx.esc(a.title)}</strong><small>${ctx.esc(a.detail)}</small><button type="button" class="secondary small" data-action-id="${ctx.esc(a.id)}">${ctx.esc(a.action)}</button></div>`).join("")}
      </div>
    `;
    panel.querySelectorAll("[data-action-id]").forEach(btn=>{
      btn.onclick=()=>{
        const rec=ctx.state.approvals.find(a=>a.id===btn.dataset.actionId);
        if(rec){rec.status="Approved";ctx.saveState();btn.textContent="Approved";btn.disabled=true;}
      };
    });
  };

  const origMaterials = base.renderMaterials.bind(base);
  base.renderMaterials = ctx => {
    origMaterials(ctx);
    const section=document.getElementById("materials");
    if(!section) return;
    let ext=document.getElementById("marineSupplyChainExt");
    if(!ext){
      ext=document.createElement("div");
      ext.id="marineSupplyChainExt";
      section.appendChild(ext);
    }
    const pos=(ctx.state.purchaseOrders||[]).filter(x=>x.companyId===ctx.currentCompanyId);
    const receipts=(ctx.state.receipts||[]).filter(x=>x.companyId===ctx.currentCompanyId);
    const open=pos.filter(p=>!["Received","Closed"].includes(p.status));
    const late=open.filter(p=>p.status==="Delayed");
    const spend=pos.reduce((s,p)=>s+(p.total||0),0);
    ext.innerHTML=`
      <div class="metric-grid marine-erp-metrics">
        <article class="metric"><span>Open POs</span><strong>${open.length}</strong><small>${late.length} late</small></article>
        <article class="metric"><span>PO Commitments</span><strong>${ctx.money(spend)}</strong><small>demo purchasing spend</small></article>
        <article class="metric"><span>Receipts Logged</span><strong>${receipts.length}</strong><small>with receiving inspection</small></article>
        <article class="metric"><span>Supplier Acknowledgement</span><strong>${Math.round(pos.filter(p=>p.ack==="Confirmed").length/Math.max(1,pos.length)*100)}%</strong><small>POs confirmed</small></article>
      </div>
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">PURCHASE ORDER CONTROL</p><h3>PO Commitments & Delivery Risk</h3></div><button type="button" class="secondary small" id="createPoDemo">+ Create PO</button></div>
        <div class="table-wrap"><table><thead><tr><th>PO</th><th>Supplier</th><th>Hull</th><th>Item</th><th>Total</th><th>Status</th><th>Ack</th><th>Need</th><th>Promise</th><th>Receipt</th></tr></thead><tbody>
          ${pos.map(p=>`<tr><td><strong>${ctx.esc(p.po)}</strong></td><td>${ctx.esc(p.supplier)}</td><td>${ctx.esc(p.hull)}</td><td>${ctx.esc(p.item)}</td><td>${ctx.money(p.total)}</td><td><span class="badge">${ctx.esc(p.status)}</span></td><td>${ctx.esc(p.ack)}</td><td>${ctx.esc(p.need)}</td><td>${ctx.esc(p.promise)}</td><td>${ctx.esc(p.receipt)}</td></tr>`).join("")}
        </tbody></table></div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">RECEIVING</p><h3>Recent Receipts & Inspection</h3></div></div>
        <div class="table-wrap"><table><thead><tr><th>Receipt</th><th>PO</th><th>Supplier</th><th>Item</th><th>Hull</th><th>Inspection</th><th>Staged / Bin</th></tr></thead><tbody>
          ${receipts.map(r=>`<tr><td>${ctx.esc(r.id.toUpperCase())}</td><td>${ctx.esc(r.po)}</td><td>${ctx.esc(r.supplier)}</td><td>${ctx.esc(r.item)}</td><td>${ctx.esc(r.hull)}</td><td><span class="badge">${ctx.esc(r.inspection)}</span></td><td>${ctx.esc(r.bin)}</td></tr>`).join("")}
        </tbody></table></div>
      </article>
    `;
    const create=ext.querySelector("#createPoDemo");
    if(create) create.onclick=()=>{create.textContent="PO draft created";create.disabled=true;};
  };

  const origCrews = base.renderCrews.bind(base);
  base.renderCrews = ctx => {
    origCrews(ctx);
    const section=document.getElementById("crews");
    if(!section) return;
    let ext=document.getElementById("marineLaborExt");
    if(!ext){ext=document.createElement("article");ext.id="marineLaborExt";ext.className="panel";section.appendChild(ext);}
    const labor=(ctx.state.laborEntries||[]).filter(x=>x.companyId===ctx.currentCompanyId);
    const direct=labor.reduce((s,x)=>s+x.direct,0), indirect=labor.reduce((s,x)=>s+x.indirect,0), setup=labor.reduce((s,x)=>s+x.setup,0);
    ext.innerHTML=`
      <div class="panel-head"><div><p class="eyebrow">SHOP-FLOOR LABOR</p><h3>Live Labor & Time Capture</h3></div><span class="badge">${direct.toFixed(1)} direct hrs</span></div>
      <div class="marine-stat-row"><span>Direct <b>${direct.toFixed(1)} hrs</b></span><span>Setup <b>${setup.toFixed(1)} hrs</b></span><span>Indirect <b>${indirect.toFixed(1)} hrs</b></span><span>Posted <b>${labor.length} tickets</b></span></div>
      <div class="table-wrap"><table><thead><tr><th>Employee</th><th>Team</th><th>Hull</th><th>Work Package</th><th>Direct</th><th>Setup</th><th>Indirect</th><th>Status</th></tr></thead><tbody>
      ${labor.map(l=>`<tr><td>${ctx.esc(l.employee)}</td><td>${ctx.esc(l.team)}</td><td>${ctx.esc(l.hull)}</td><td>${ctx.esc(l.workPackage)}</td><td>${l.direct}</td><td>${l.setup}</td><td>${l.indirect}</td><td><span class="badge">${ctx.esc(l.status)}</span></td></tr>`).join("")}
      </tbody></table></div>
    `;
  };

  const origFinance = base.renderFinance.bind(base);
  base.renderFinance = ctx => {
    origFinance(ctx);
    const section=document.getElementById("finance");
    if(!section) return;
    let ext=document.getElementById("marineFinancialExt");
    if(!ext){ext=document.createElement("div");ext.id="marineFinancialExt";section.appendChild(ext);}
    const accounts=(ctx.state.financialAccounts||[]).filter(x=>x.companyId===ctx.currentCompanyId);
    const ledger=(ctx.state.ledgerActivity||[]).filter(x=>x.companyId===ctx.currentCompanyId);
    ext.innerHTML=`
      <div class="section-head"><div><p class="eyebrow">ERP FINANCIALS</p><h2>AP, AR, Cash & WIP</h2><p>Transactional finance tied directly to purchasing, receiving, labor, production, and customer orders.</p></div></div>
      <div class="metric-grid">${accounts.map(a=>`<article class="metric"><span>${ctx.esc(a.type)}</span><strong>${ctx.money(a.balance)}</strong><small>${a.overdue?ctx.money(a.overdue)+" overdue":a.open+" open records"}</small></article>`).join("")}</div>
      <article class="panel"><div class="panel-head"><div><p class="eyebrow">AUTO-POSTED TRANSACTIONS</p><h3>Recent Ledger Activity</h3></div></div>
      <div class="table-wrap"><table><thead><tr><th>Date</th><th>Reference</th><th>Description</th><th>Debit</th><th>Credit</th><th>Amount</th><th>Status</th></tr></thead><tbody>
      ${ledger.map(g=>`<tr><td>${ctx.esc(g.date)}</td><td><strong>${ctx.esc(g.reference)}</strong></td><td>${ctx.esc(g.description)}</td><td>${ctx.esc(g.debit)}</td><td>${ctx.esc(g.credit)}</td><td>${ctx.money(g.amount)}</td><td><span class="badge">${ctx.esc(g.status)}</span></td></tr>`).join("")}
      </tbody></table></div></article>
    `;
  };

  const origExtra = base.renderExtraViews.bind(base);
  base.renderExtraViews = ctx => {
    origExtra(ctx);
    const { $, esc, money } = ctx;
    const companyId=ctx.currentCompanyId;

    const orders=$("orders");
    const sales=(ctx.state.salesOrders||[]).filter(x=>x.companyId===companyId);
    if(orders) orders.innerHTML=`
      <div class="section-head"><div><p class="eyebrow">ORDER-TO-HULL</p><h2>Orders & Configuration</h2><p>Dealer/customer order, configuration, change orders, commercial status, and production release in one record.</p></div><button class="secondary" type="button" id="newOrderDemo">+ New Build Order</button></div>
      <div class="metric-grid">
        <article class="metric"><span>Open Build Orders</span><strong>${sales.length}</strong><small>${sales.filter(s=>s.status.includes("Production")||s.status.includes("Released")).length} released / producing</small></article>
        <article class="metric"><span>Order Value</span><strong>${money(sales.reduce((s,o)=>s+o.value,0))}</strong><small>demo backlog</small></article>
        <article class="metric"><span>Deposits</span><strong>${money(sales.reduce((s,o)=>s+o.deposit,0))}</strong><small>linked to each build</small></article>
        <article class="metric"><span>Open Config Changes</span><strong>${sales.reduce((s,o)=>s+o.changeOrders,0)}</strong><small>with impact tracing</small></article>
      </div>
      <article class="panel"><div class="table-wrap"><table><thead><tr><th>Order</th><th>Dealer / Customer</th><th>Hull</th><th>Model</th><th>Status</th><th>Config</th><th>Changes</th><th>Value</th><th>Deposit</th><th>Target</th></tr></thead><tbody>
      ${sales.map(o=>`<tr><td><strong>${esc(o.order)}</strong></td><td>${esc(o.dealer)}</td><td>${esc(o.hull)}</td><td>${esc(o.model)}</td><td><span class="badge">${esc(o.status)}</span></td><td>${esc(o.config)}</td><td>${o.changeOrders}</td><td>${money(o.value)}</td><td>${money(o.deposit)}</td><td>${esc(o.target)}</td></tr>`).join("")}
      </tbody></table></div></article>
      <div class="two-col">
        <article class="panel"><div class="panel-head"><div><p class="eyebrow">CONFIGURATION-TO-BOM</p><h3>Automatic Change Propagation</h3></div></div>
          <div class="list-row"><div><strong>Customer option changed</strong><small>Atlas identifies affected BOM lines, drawings, POs, work packages, cost, and delivery risk before release.</small></div><span class="badge">Impact preview</span></div>
          <div class="list-row"><div><strong>One approval releases downstream changes</strong><small>Accepted change becomes the controlled as-built configuration for the hull.</small></div><span class="badge">Digital thread</span></div>
        </article>
        <article class="panel"><div class="panel-head"><div><p class="eyebrow">VISUAL CONFIGURATOR CONCEPT</p><h3>Build Before You Release</h3></div></div>
          <small>Marine-specific configuration rules can validate engine, electronics, interior, finish, and option compatibility before the order becomes production demand.</small>
        </article>
      </div>
    `;
    const newOrder=orders?.querySelector("#newOrderDemo");
    if(newOrder) newOrder.onclick=()=>{newOrder.textContent="Draft build order created";newOrder.disabled=true;};

    const planning=$("planning");
    const mrp=(ctx.state.plannedOrders||[]).filter(x=>x.companyId===companyId);
    const scenarios=(ctx.state.whatIfScenarios||[]).filter(x=>x.companyId===companyId);
    if(planning) planning.innerHTML=`
      <div class="section-head"><div><p class="eyebrow">MATERIAL + CAPACITY INTELLIGENCE</p><h2>MRP & What-If Planning</h2><p>Net hull demand against inventory, open POs, WIP, engineering changes, and capacity—then test delivery scenarios before committing.</p></div><button id="runMrpDemo" type="button">Run MRP</button></div>
      <div class="metric-grid">
        <article class="metric"><span>Planned Actions</span><strong>${mrp.length}</strong><small>purchase + manufacture</small></article>
        <article class="metric"><span>Exceptions</span><strong>${mrp.filter(x=>x.status==="Exception").length}</strong><small>requires action</small></article>
        <article class="metric"><span>Engineering Holds</span><strong>${mrp.filter(x=>x.status==="Engineering Change"||x.status==="Review").length}</strong><small>planning protected</small></article>
        <article class="metric"><span>Covered Demand</span><strong>${Math.round(mrp.filter(x=>x.status==="Covered"||x.status==="Firm").length/Math.max(1,mrp.length)*100)}%</strong><small>current sample</small></article>
      </div>
      <article class="panel"><div class="panel-head"><div><p class="eyebrow">PLANNER WORKBENCH</p><h3>Demand, Supply & Exceptions</h3></div></div>
        <div class="table-wrap"><table><thead><tr><th>Item</th><th>Description</th><th>Hull</th><th>Type</th><th>Qty</th><th>Need</th><th>Status</th><th>Exception</th><th>Recommended Action</th></tr></thead><tbody>
        ${mrp.map(m=>`<tr><td><strong>${esc(m.item)}</strong></td><td>${esc(m.description)}</td><td>${esc(m.hull)}</td><td>${esc(m.type)}</td><td>${m.qty}</td><td>${esc(m.need)}</td><td><span class="badge">${esc(m.status)}</span></td><td>${esc(m.message)}</td><td>${esc(m.action)}</td></tr>`).join("")}
        </tbody></table></div>
      </article>
      <article class="panel"><div class="panel-head"><div><p class="eyebrow">WHAT-IF DELIVERY ENGINE</p><h3>B50-008 Recovery Scenarios</h3></div></div>
        <div class="scenario-grid">${scenarios.map(s=>`<button type="button" class="scenario-card" data-scenario="${esc(s.id)}"><strong>${esc(s.name)}</strong><small>${esc(s.result)}</small><span>Delivery: +${s.deliveryDelta} days · Cost: +${money(s.costDelta)}</span></button>`).join("")}</div>
        <div id="scenarioResult" class="pattern-alert hidden"></div>
      </article>
    `;
    const run=planning?.querySelector("#runMrpDemo");
    if(run) run.onclick=()=>{run.textContent="MRP refreshed";run.disabled=true;};
    planning?.querySelectorAll("[data-scenario]").forEach(btn=>{
      btn.onclick=()=>{
        const s=scenarios.find(x=>x.id===btn.dataset.scenario);
        const out=planning.querySelector("#scenarioResult");
        if(s&&out){out.classList.remove("hidden");out.innerHTML=`<strong>Atlas recommendation</strong><span>${esc(s.recommendation)}</span><small>${esc(s.result)} Estimated incremental cost: ${money(s.costDelta)}.</small>`;}
      };
    });

    const inventory=$("inventory");
    const inv=(ctx.state.inventory||[]).filter(x=>x.companyId===companyId);
    if(inventory) inventory.innerHTML=`
      <div class="section-head"><div><p class="eyebrow">WAREHOUSE CONTROL</p><h2>Inventory & Warehouse</h2><p>Real-time stock, allocation, serialized traceability, kitting, staging, receiving inspection, and issue-to-hull.</p></div><button type="button" class="secondary" id="scanDemo">Scan QR / Barcode</button></div>
      <div class="metric-grid">
        <article class="metric"><span>Tracked Parts</span><strong>${inv.length}</strong><small>demo sample</small></article>
        <article class="metric"><span>Short Items</span><strong>${inv.filter(i=>i.status==="Short").length}</strong><small>production impact</small></article>
        <article class="metric"><span>Tight Supply</span><strong>${inv.filter(i=>i.status==="Tight").length}</strong><small>watch list</small></article>
        <article class="metric"><span>Serialized / Lot Tracked</span><strong>${inv.filter(i=>/serial|lot/i.test(i.lot)).length}</strong><small>full traceability</small></article>
      </div>
      <article class="panel"><div class="table-wrap"><table><thead><tr><th>Part</th><th>Description</th><th>On Hand</th><th>Allocated</th><th>On Order</th><th>Available</th><th>Location</th><th>Trace</th><th>Status</th><th>Next Demand</th></tr></thead><tbody>
      ${inv.map(i=>`<tr><td><strong>${esc(i.part)}</strong></td><td>${esc(i.description)}</td><td>${i.onHand}</td><td>${i.allocated}</td><td>${i.onOrder}</td><td>${i.available}</td><td>${esc(i.location)}</td><td>${esc(i.lot)}</td><td><span class="badge">${esc(i.status)}</span></td><td>${esc(i.nextDemand)}</td></tr>`).join("")}
      </tbody></table></div></article>
      <div class="two-col">
        <article class="panel"><div class="panel-head"><div><p class="eyebrow">MOBILE MATERIAL FLOW</p><h3>Scan → Receive → Inspect → Bin → Kit → Stage → Issue</h3></div></div><small>Every material movement can be tied to a PO, serial/lot, hull, work package, employee, location, timestamp, and inspection record.</small></article>
        <article class="panel"><div class="panel-head"><div><p class="eyebrow">AS-BUILT TRACEABILITY</p><h3>Know Exactly What Went Into Every Hull</h3></div></div><small>Serial-controlled components remain connected to the hull through delivery and warranty, enabling instant service and supplier root-cause tracing.</small></article>
      </div>
    `;
    const scan=inventory?.querySelector("#scanDemo");
    if(scan) scan.onclick=()=>{scan.textContent="Scanner ready";scan.classList.remove("secondary");};

    const suppliers=$("suppliers");
    const supplierRows=(ctx.state.suppliers||[]).filter(x=>x.companyId===companyId);
    if(suppliers) suppliers.innerHTML=`
      <div class="section-head"><div><p class="eyebrow">SUPPLIER COLLABORATION</p><h2>Suppliers</h2><p>Performance, risk, open commitments, quality, acknowledgements, and a supplier-facing portal without giving vendors full ERP access.</p></div></div>
      <div class="supplier-grid">${supplierRows.map(s=>`<article class="project-card"><div class="project-meta"><span class="badge">${esc(s.risk)} risk</span><span>${esc(s.portal)}</span></div><h3>${esc(s.name)}</h3><small>${esc(s.category)}</small><div class="marine-stat-row"><span>Score <b>${s.score}</b></span><span>On-time <b>${s.onTime}%</b></span><span>Quality <b>${s.quality}%</b></span><span>Open POs <b>${s.openPOs}</b></span></div><small>Current PO spend: ${money(s.spend)}</small></article>`).join("")}</div>
      <article class="panel"><div class="panel-head"><div><p class="eyebrow">SUPPLIER PORTAL</p><h3>Self-Service Commitments</h3></div></div><div class="list-row"><div><strong>PO acknowledgement & promised date</strong><small>Supplier responds directly to the PO and exceptions reach the buyer immediately.</small></div><span class="badge">No re-keying</span></div><div class="list-row"><div><strong>ASN, packing lists, certifications & invoices</strong><small>Documents attach to the PO/receipt and follow the component into the hull record.</small></div><span class="badge">Connected</span></div></article>
    `;

    const thread=$("digitalthread");
    const events=(ctx.state.digitalThread||[]).filter(x=>x.companyId===companyId);
    if(thread) thread.innerHTML=`
      <div class="section-head"><div><p class="eyebrow">ATLAS DIFFERENTIATOR</p><h2>Hull Digital Thread</h2><p>One chronological record connecting sales, configuration, engineering, MRP, purchasing, receiving, labor, quality, delivery, and warranty.</p></div><select id="threadHull"><option>B39-026</option><option>B50-008</option><option>B61-004</option></select></div>
      <article class="panel">
        <div class="digital-thread">${events.map(e=>`<div class="thread-event"><span>${esc(e.time)}</span><div><strong>${esc(e.type)} · ${esc(e.event)}</strong><small>${esc(e.impact)}</small></div></div>`).join("")}</div>
      </article>
      <div class="two-col">
        <article class="panel"><div class="panel-head"><div><p class="eyebrow">CHANGE IMPACT GRAPH</p><h3>Know What a Change Touches Before Releasing It</h3></div></div><div class="impact-flow"><span>Configuration</span><b>→</b><span>BOM</span><b>→</b><span>POs</span><b>→</b><span>Work Packages</span><b>→</b><span>Schedule</span><b>→</b><span>Cost</span><b>→</b><span>As-Built</span></div></article>
        <article class="panel"><div class="panel-head"><div><p class="eyebrow">ATHENA CONTEXT</p><h3>Ask the Hull, Not the Database</h3></div></div><small>“Why is B50-008 late?” “Which supplier caused the most lost production days?” “What changed on B39-026 since yesterday?” Atlas answers from the same digital thread instead of requiring a manager to know which module or report to open.</small></article>
      </div>
    `;
  };

  const origAthena = base.athenaAnswer.bind(base);
  base.athenaAnswer = (question,ctx) => {
    const q=String(question||"").toLowerCase();
    if(q.includes("po")||q.includes("purchase order")){
      const pos=(ctx.state.purchaseOrders||[]).filter(p=>p.companyId===ctx.currentCompanyId);
      return `Atlas Marine has ${pos.length} demo purchase orders. PO-10488 is the critical exception because the generator promise date is 6 days after B50-008 needs it.`;
    }
    if(q.includes("mrp")||q.includes("planned order")||q.includes("planning")){
      const mrp=(ctx.state.plannedOrders||[]).filter(p=>p.companyId===ctx.currentCompanyId);
      return `The current MRP workbench has ${mrp.length} planned actions. The highest-priority exception is GEN-9KW-01 for B50-008; Atlas recommends expedite or alternate sourcing.`;
    }
    if(q.includes("inventory")||q.includes("stock")||q.includes("warehouse")){
      const short=(ctx.state.inventory||[]).filter(i=>i.companyId===ctx.currentCompanyId&&i.status==="Short");
      return `${short.length} demo inventory item is currently short: ${short.map(i=>i.part+" — "+i.description).join("; ")}. Atlas ties the shortage directly to the affected hull and required date.`;
    }
    if(q.includes("supplier")){
      const rows=(ctx.state.suppliers||[]).filter(s=>s.companyId===ctx.currentCompanyId).sort((a,b)=>a.score-b.score);
      return rows.length?`${rows[0].name} is the lowest-scoring demo supplier at ${rows[0].score}, driven mainly by ${rows[0].onTime}% on-time performance. Its open PO is already connected to the affected hull and schedule risk.`:origAthena(question,ctx);
    }
    if(q.includes("what if")||q.includes("scenario")||q.includes("recover")){
      return "For B50-008, Atlas has three modeled recovery paths: accept the generator delay (+4 delivery days), source an alternate generator (preserves delivery with higher cost), or add a weekend mechanical shift (recovers 2 days).";
    }
    if(q.includes("financial")||q.includes("accounts payable")||q.includes("accounts receivable")||q.includes("cash")){
      return "Atlas Marine financials connect AP, AR, cash, WIP, receipts, labor, and hull cost. In the demo, purchasing receipts and labor tickets automatically feed the hull cost and ledger activity views.";
    }
    return origAthena(question,ctx);
  };
})();