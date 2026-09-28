(() => {
  "use strict";
  if (!window.AtlasMarine) return;

  const base = window.AtlasMarine;
  const companyId = "bertram-demo";

  const boms = [
    {model:"28CC",rev:"2026.09",lines:[
      ["ENG-28-TWIN","Twin outboard propulsion set",1,"Propulsion","Demo Engine Supplier",45,"Mechanical","Purchase"],
      ["FUEL-28-KIT","28CC fuel system kit",1,"Fuel","Demo Fuel Systems",21,"Mechanical","Purchase"],
      ["EL-HRN-28C","28CC electrical harness kit",1,"Electrical","Demo Harness Supplier",28,"Electrical","Purchase"],
      ["NAV-DSP-16","16 in navigation display",2,"Electronics","Demo Electronics Supplier",18,"Electrical","Purchase"],
      ["PMP-FW-220","Freshwater pump",1,"Plumbing","Demo Plumbing Supplier",14,"Plumbing","Purchase"],
      ["TRM-ACT-02","Trim actuator assembly",2,"Controls","Demo Motion Systems",21,"Mechanical","Purchase"],
      ["SS-FAST-KIT","Stainless fastener production kit",2,"Hardware","Demo Fastener Supplier",7,"Assembly","Purchase"],
      ["INT-28-KIT","28CC interior / seating kit",1,"Interior","Demo Interior Supplier",35,"Finish","Purchase"]
    ]},
    {model:"34CC",rev:"2026.09",lines:[
      ["ENG-34-TWIN","Twin V10 propulsion package",1,"Propulsion","Demo Engine Supplier",52,"Mechanical","Purchase"],
      ["FUEL-34-KIT","34CC fuel system kit",1,"Fuel","Demo Fuel Systems",24,"Mechanical","Purchase"],
      ["EL-HRN-34C","34CC electrical harness kit",1,"Electrical","Demo Harness Supplier",30,"Electrical","Purchase"],
      ["NAV-DSP-16","16 in navigation display",2,"Electronics","Demo Electronics Supplier",18,"Electrical","Purchase"],
      ["PMP-FW-220","Freshwater pump",1,"Plumbing","Demo Plumbing Supplier",14,"Plumbing","Purchase"],
      ["TRM-ACT-02","Trim actuator assembly",2,"Controls","Demo Motion Systems",21,"Mechanical","Purchase"],
      ["SS-FAST-KIT","Stainless fastener production kit",3,"Hardware","Demo Fastener Supplier",7,"Assembly","Purchase"],
      ["INT-34-KIT","34CC interior / seating kit",1,"Interior","Demo Interior Supplier",38,"Finish","Purchase"]
    ]},
    {model:"39CC",rev:"2026.09",lines:[
      ["ENG-V10-SET","Triple V10 propulsion package",1,"Propulsion","Demo Engine Supplier",56,"Mechanical","Purchase"],
      ["FUEL-39-KIT","39CC fuel system kit",1,"Fuel","Demo Fuel Systems",28,"Mechanical","Purchase"],
      ["EL-HRN-39C","39CC electrical harness kit",1,"Electrical","Demo Harness Supplier",30,"Electrical","Purchase"],
      ["NAV-DSP-16","16 in navigation display",2,"Electronics","Demo Electronics Supplier",18,"Electrical","Purchase"],
      ["NAV-RAD-04","Open-array radar package",1,"Electronics","Demo Electronics Supplier",24,"Electrical","Purchase"],
      ["PMP-FW-220","Freshwater pump",1,"Plumbing","Demo Plumbing Supplier",14,"Plumbing","Purchase"],
      ["TRM-ACT-02","Trim actuator assembly",2,"Controls","Demo Motion Systems",21,"Mechanical","Purchase"],
      ["SS-FAST-KIT","Stainless fastener production kit",3,"Hardware","Demo Fastener Supplier",7,"Assembly","Purchase"],
      ["INT-39-KIT","39CC interior / seating kit",1,"Interior","Demo Interior Supplier",42,"Finish","Purchase"]
    ]},
    {model:"35 Flybridge",rev:"2026.09",lines:[
      ["ENG-35-TWIN","35 Flybridge propulsion package",1,"Propulsion","Demo Engine Supplier",58,"Mechanical","Purchase"],
      ["GEN-7KW-01","7 kW marine generator",1,"Generator","Demo Generator Supplier",40,"Mechanical","Purchase"],
      ["EL-HRN-35F","35 Flybridge electrical harness",1,"Electrical","Demo Harness Supplier",34,"Electrical","Purchase"],
      ["NAV-DSP-16","16 in navigation display",3,"Electronics","Demo Electronics Supplier",18,"Electrical","Purchase"],
      ["PMP-FW-220","Freshwater pump",2,"Plumbing","Demo Plumbing Supplier",14,"Plumbing","Purchase"],
      ["TRM-ACT-02","Trim actuator assembly",2,"Controls","Demo Motion Systems",21,"Mechanical","Purchase"],
      ["SS-FAST-KIT","Stainless fastener production kit",4,"Hardware","Demo Fastener Supplier",7,"Assembly","Purchase"],
      ["INT-UPH-35A","35 Flybridge Atlantic interior package",1,"Interior","Demo Interior Supplier",45,"Finish","Purchase"]
    ]},
    {model:"50 Sport",rev:"2026.09",lines:[
      ["ENG-50-SET","50 Sport propulsion package",1,"Propulsion","Demo Engine Supplier",70,"Mechanical","Purchase"],
      ["GEN-9KW-01","9 kW marine generator",1,"Generator","Demo Generator Supplier",45,"Mechanical","Purchase"],
      ["STAB-50-KIT","50 Sport stabilizer package",1,"Stabilization","Demo Stabilizer Supplier",48,"Mechanical","Purchase"],
      ["EL-HRN-50S","50 Sport electrical harness",1,"Electrical","Demo Harness Supplier",38,"Electrical","Purchase"],
      ["NAV-DSP-16","16 in navigation display",4,"Electronics","Demo Electronics Supplier",18,"Electrical","Purchase"],
      ["NAV-RAD-04","Open-array radar package",1,"Electronics","Demo Electronics Supplier",24,"Electrical","Purchase"],
      ["PMP-FW-220","Freshwater pump",2,"Plumbing","Demo Plumbing Supplier",14,"Plumbing","Purchase"],
      ["SS-FAST-KIT","Stainless fastener production kit",5,"Hardware","Demo Fastener Supplier",7,"Assembly","Purchase"],
      ["INT-50-KIT","50 Sport interior package",1,"Interior","Demo Interior Supplier",56,"Finish","Purchase"]
    ]},
    {model:"61 Convertible",rev:"2026.08",lines:[
      ["ENG-61-SET","61 Convertible propulsion package",1,"Propulsion","Demo Engine Supplier",84,"Mechanical","Purchase"],
      ["GEN-16KW-01","16 kW marine generator",2,"Generator","Demo Generator Supplier",60,"Mechanical","Purchase"],
      ["STAB-61-KIT","61 Convertible stabilizer package",1,"Stabilization","Demo Stabilizer Supplier",54,"Mechanical","Purchase"],
      ["EL-HRN-61C","61 Convertible electrical harness",1,"Electrical","Demo Harness Supplier",45,"Electrical","Purchase"],
      ["NAV-DSP-16","16 in navigation display",5,"Electronics","Demo Electronics Supplier",18,"Electrical","Purchase"],
      ["NAV-61-301","61 Convertible navigation electronics package",1,"Electronics","Demo Electronics Supplier",35,"Electrical","Purchase"],
      ["PMP-FW-220","Freshwater pump",3,"Plumbing","Demo Plumbing Supplier",14,"Plumbing","Purchase"],
      ["SS-FAST-KIT","Stainless fastener production kit",7,"Hardware","Demo Fastener Supplier",7,"Assembly","Purchase"],
      ["INT-61-KIT","61 Convertible interior package",1,"Interior","Demo Interior Supplier",70,"Finish","Purchase"]
    ]}
  ].map(b=>({companyId,...b,lines:b.lines.map(([part,description,qty,category,supplier,leadDays,stage,source])=>({part,description,qty,category,supplier,leadDays,stage,source}))}));

  const moreInventory = [
    ["ENG-28-TWIN","Twin outboard propulsion set",2,1,1,"ENG-RACK-01","Serial controlled"],
    ["FUEL-28-KIT","28CC fuel system kit",3,1,2,"A-08-01","Lot controlled"],
    ["EL-HRN-28C","28CC electrical harness kit",1,0,2,"SEC-ELEC-02","Serialized kit"],
    ["INT-28-KIT","28CC interior / seating kit",1,1,1,"INT-STAGE-01","Kit controlled"],
    ["ENG-34-TWIN","Twin V10 propulsion package",1,1,2,"ENG-RACK-02","Serial controlled"],
    ["FUEL-34-KIT","34CC fuel system kit",2,1,2,"A-08-02","Lot controlled"],
    ["EL-HRN-34C","34CC electrical harness kit",0,0,2,"SEC-ELEC-03","Serialized kit"],
    ["INT-34-KIT","34CC interior / seating kit",1,0,1,"INT-STAGE-02","Kit controlled"],
    ["ENG-V10-SET","Triple V10 propulsion package",2,1,2,"ENG-RACK-03","Serial controlled"],
    ["FUEL-39-KIT","39CC fuel system kit",2,1,2,"A-08-03","Lot controlled"],
    ["NAV-RAD-04","Open-array radar package",1,1,2,"SEC-ELEC-04","Serial controlled"],
    ["INT-39-KIT","39CC interior / seating kit",0,0,2,"INT-STAGE-03","Kit controlled"],
    ["ENG-35-TWIN","35 Flybridge propulsion package",1,1,1,"ENG-RACK-04","Serial controlled"],
    ["GEN-7KW-01","7 kW marine generator",1,0,1,"GEN-CAGE-01","Serial controlled"],
    ["EL-HRN-35F","35 Flybridge electrical harness",1,1,1,"SEC-ELEC-05","Serialized kit"],
    ["ENG-50-SET","50 Sport propulsion package",0,0,1,"ENG-RACK-05","Serial controlled"],
    ["STAB-50-KIT","50 Sport stabilizer package",0,0,1,"MECH-CAGE-02","Serial controlled"],
    ["EL-HRN-50S","50 Sport electrical harness",1,1,0,"SEC-ELEC-06","Serialized kit"],
    ["INT-50-KIT","50 Sport interior package",0,0,1,"INT-STAGE-05","Kit controlled"],
    ["ENG-61-SET","61 Convertible propulsion package",0,0,1,"ENG-RACK-06","Serial controlled"],
    ["GEN-16KW-01","16 kW marine generator",0,0,1,"GEN-CAGE-02","Serial controlled"],
    ["STAB-61-KIT","61 Convertible stabilizer package",0,0,1,"MECH-CAGE-03","Serial controlled"],
    ["EL-HRN-61C","61 Convertible electrical harness",0,0,1,"SEC-ELEC-07","Serialized kit"],
    ["INT-61-KIT","61 Convertible interior package",0,0,1,"INT-STAGE-06","Kit controlled"]
  ].map((x,i)=>({
    id:"inv-plan-"+(i+1),companyId,part:x[0],description:x[1],onHand:x[2],allocated:x[3],onOrder:x[4],
    available:Math.max(0,x[2]-x[3]),location:x[5],lot:x[6],status:(x[2]-x[3])>0?"Healthy":x[4]>0?"Covered":"Short",nextDemand:"New build planning"
  }));

  const priorSeed = base.demoSeed.bind(base);
  base.demoSeed = deps => {
    const seed = priorSeed(deps);
    seed.modelBoms = boms;
    const existing = new Set((seed.inventory||[]).map(i=>i.part));
    seed.inventory = [...(seed.inventory||[]), ...moreInventory.filter(i=>!existing.has(i.part))];
    seed.materialPlans = seed.materialPlans || [];
    return seed;
  };

  function analyze(model, state){
    const sourceBoms=(state.modelBoms&&state.modelBoms.length)?state.modelBoms:boms;
    const bom=sourceBoms.find(b=>b.companyId===companyId&&b.model===model);
    if(!bom) return {bom:null,rows:[]};
    const inv=(state.inventory||[]).filter(i=>i.companyId===companyId);
    const rows=bom.lines.map(line=>{
      const stock=inv.find(i=>i.part===line.part);
      const onHand=Number(stock?.onHand||0);
      const allocated=Number(stock?.allocated||0);
      const available=Math.max(0,Number.isFinite(Number(stock?.available))?Number(stock.available):onHand-allocated);
      const incoming=Math.max(0,Number(stock?.onOrder||0));
      const required=Number(line.qty||0);
      const fromStock=Math.min(required,available);
      const remainingAfterStock=Math.max(0,required-fromStock);
      const fromIncoming=Math.min(remainingAfterStock,incoming);
      const toOrder=Math.max(0,remainingAfterStock-fromIncoming);
      const status=toOrder>0?"Needs Order":remainingAfterStock>0?"Incoming PO":"In Stock";
      return {...line,required,onHand,allocated,available,incoming,fromStock,fromIncoming,toOrder,status,location:stock?.location||"—"};
    });
    return {bom,rows};
  }

  const priorExtra = base.renderExtraViews.bind(base);
  base.renderExtraViews = ctx => {
    priorExtra(ctx);
    const inventory=document.getElementById("inventory");
    if(!inventory) return;

    if(!ctx.state.modelBoms?.length) ctx.state.modelBoms=boms;
    ctx.state.inventory=ctx.state.inventory||[];
    const existingParts=new Set(ctx.state.inventory.filter(i=>i.companyId===ctx.currentCompanyId).map(i=>i.part));
    moreInventory.forEach(item=>{if(!existingParts.has(item.part))ctx.state.inventory.push({...item});});

    const models=(ctx.state.modelBoms||[]).filter(b=>b.companyId===ctx.currentCompanyId);
    let selected=inventory.dataset.planModel || models[0]?.model || "39CC";
    if(!models.some(m=>m.model===selected)) selected=models[0]?.model||"39CC";

    let planner=document.getElementById("buildMaterialPlanner");
    if(!planner){
      planner=document.createElement("div");
      planner.id="buildMaterialPlanner";
      inventory.insertBefore(planner,inventory.firstChild);
    }

    const renderPlanner=()=>{
      const {bom,rows}=analyze(selected,ctx.state);
      if(!bom){planner.innerHTML="";return;}
      const inStock=rows.filter(r=>r.status==="In Stock").length;
      const incoming=rows.filter(r=>r.status==="Incoming PO").length;
      const order=rows.filter(r=>r.status==="Needs Order").length;
      const orderQty=rows.reduce((s,r)=>s+r.toOrder,0);
      const readiness=rows.length?Math.round((rows.length-order)/rows.length*100):100;

      planner.innerHTML=`
        <div class="section-head inventory-planner-head">
          <div>
            <p class="eyebrow">BUILD MATERIAL PLANNER</p>
            <h2>Choose a Boat → Atlas Checks Inventory</h2>
            <p>Select a model and Atlas automatically loads its standard BOM, checks usable stock and incoming supply, and identifies what purchasing needs to order.</p>
          </div>
          <div class="inventory-plan-controls">
            <label>Boat Model
              <select id="inventoryBoatModel">${models.map(m=>`<option value="${ctx.esc(m.model)}" ${m.model===selected?"selected":""}>${ctx.esc(m.model)}</option>`).join("")}</select>
            </label>
            <button id="createMaterialPlan" type="button">Create Purchase Requests</button>
          </div>
        </div>

        <div class="metric-grid">
          <article class="metric"><span>BOM Readiness</span><strong>${readiness}%</strong><small>top-level demo material lines covered</small></article>
          <article class="metric"><span>In Stock</span><strong>${inStock}</strong><small>can allocate immediately</small></article>
          <article class="metric"><span>Incoming</span><strong>${incoming}</strong><small>covered by open supply</small></article>
          <article class="metric"><span>Needs Order</span><strong>${order}</strong><small>${orderQty} total unit${orderQty===1?"":"s"} to source</small></article>
        </div>

        <article class="panel build-plan-summary">
          <div class="panel-head">
            <div><p class="eyebrow">BERTRAM ${ctx.esc(selected)}</p><h3>Material Requirement Check</h3></div>
            <span class="badge">BOM ${ctx.esc(bom.rev)}</span>
          </div>
          <div class="inventory-readiness-bar"><div class="progress"><span style="width:${readiness}%"></span></div><strong>${readiness}% covered</strong></div>
          <div class="table-wrap"><table class="build-material-table"><thead><tr>
            <th>Part</th><th>Description</th><th>Stage</th><th>Required</th><th>On Hand</th><th>Allocated</th><th>Usable</th><th>Incoming</th><th>To Order</th><th>Status</th><th>Supplier</th><th>Lead</th>
          </tr></thead><tbody>
            ${rows.map(r=>`<tr>
              <td><strong>${ctx.esc(r.part)}</strong></td>
              <td>${ctx.esc(r.description)}</td>
              <td>${ctx.esc(r.stage)}</td>
              <td>${r.required}</td>
              <td>${r.onHand}</td>
              <td>${r.allocated}</td>
              <td>${r.available}</td>
              <td>${r.incoming}</td>
              <td><strong>${r.toOrder}</strong></td>
              <td><span class="badge inventory-status ${r.status.toLowerCase().replace(/\s+/g,"-")}">${ctx.esc(r.status)}</span></td>
              <td>${ctx.esc(r.supplier)}</td>
              <td>${r.leadDays} days</td>
            </tr>`).join("")}
          </tbody></table></div>
        </article>

        <div class="two-col inventory-plan-lower">
          <article class="panel">
            <div class="panel-head"><div><p class="eyebrow">AUTO ALLOCATION</p><h3>What Atlas Would Reserve Now</h3></div></div>
            ${rows.filter(r=>r.fromStock>0).map(r=>`<div class="list-row"><div><strong>${ctx.esc(r.part)} · ${ctx.esc(r.description)}</strong><small>${r.fromStock} from usable stock · ${ctx.esc(r.location)}</small></div><span class="badge">Reserve ${r.fromStock}</span></div>`).join("")||'<div class="empty">No stock is currently available to reserve.</div>'}
          </article>
          <article class="panel">
            <div class="panel-head"><div><p class="eyebrow">PURCHASING ACTION</p><h3>Shortages for This Boat</h3></div></div>
            ${rows.filter(r=>r.toOrder>0).map(r=>`<div class="list-row"><div><strong>${ctx.esc(r.part)} · Qty ${r.toOrder}</strong><small>${ctx.esc(r.supplier)} · ${r.leadDays}-day lead · needed for ${ctx.esc(r.stage)}</small></div><span class="badge">Order</span></div>`).join("")||'<div class="empty">No new purchase orders are required for this model with current supply.</div>'}
          </article>
        </div>
      `;

      const select=planner.querySelector("#inventoryBoatModel");
      if(select) select.onchange=()=>{selected=select.value;inventory.dataset.planModel=selected;renderPlanner();};

      const create=planner.querySelector("#createMaterialPlan");
      if(create) create.onclick=()=>{
        const shortages=rows.filter(r=>r.toOrder>0);
        if(!shortages.length){create.textContent="No orders required";create.disabled=true;return;}
        ctx.state.materialPlans=ctx.state.materialPlans||[];
        const stamp=Date.now();
        shortages.forEach((r,i)=>{
          if(!ctx.state.materialPlans.some(p=>p.model===selected&&p.part===r.part&&p.status==="Suggested")){
            ctx.state.materialPlans.push({
              id:"plan-"+stamp+"-"+i,companyId:ctx.currentCompanyId,model:selected,part:r.part,description:r.description,
              qty:r.toOrder,supplier:r.supplier,leadDays:r.leadDays,stage:r.stage,status:"Suggested"
            });
          }
        });
        ctx.saveState();
        create.textContent=`${shortages.length} purchase request${shortages.length===1?"":"s"} created`;
        create.disabled=true;
      };
    };

    renderPlanner();

    const modelsSection=document.getElementById("models");
    if(modelsSection){
      const modelRows=(ctx.state.models||[]).filter(m=>m.companyId===ctx.currentCompanyId);
      modelsSection.querySelectorAll(".project-card").forEach((card,index)=>{
        const model=modelRows[index]?.name;
        if(model && !card.querySelector("[data-plan-model]")){
          const btn=document.createElement("button");
          btn.type="button";
          btn.className="secondary model-inventory-button";
          btn.dataset.planModel=model;
          btn.textContent="Check Inventory";
          card.appendChild(btn);
        }
      });
      modelsSection.querySelectorAll("[data-plan-model]").forEach(btn=>{
        btn.onclick=()=>{
          inventory.dataset.planModel=btn.dataset.planModel;
          ctx.switchView("inventory");
          setTimeout(()=>document.getElementById("buildMaterialPlanner")?.scrollIntoView({behavior:"smooth",block:"start"}),50);
        };
      });
    }
  };

  const priorAthena = base.athenaAnswer.bind(base);
  base.athenaAnswer = (question,ctx) => {
    const q=String(question||"").toLowerCase();
    const model=(ctx.state.modelBoms||[]).find(b=>q.includes(b.model.toLowerCase()));
    if((q.includes("inventory")||q.includes("stock")||q.includes("need")||q.includes("order")) && model){
      const result=analyze(model.model,ctx.state);
      const needs=result.rows.filter(r=>r.toOrder>0);
      const incoming=result.rows.filter(r=>r.status==="Incoming PO");
      const stocked=result.rows.filter(r=>r.status==="In Stock");
      return `For a new ${model.model}, ${stocked.length} BOM lines can be supplied from usable stock, ${incoming.length} are covered by incoming supply, and ${needs.length} need additional purchasing. Items to order: ${needs.map(r=>r.part+" qty "+r.toOrder).join("; ")||"none"}.`;
    }
    return priorAthena(question,ctx);
  };

  const priorApply = base.applyUi.bind(base);
  base.applyUi = vertical => {
    priorApply(vertical);
    const nav=document.getElementById("mainNav");
    const button=nav?.querySelector('[data-view="inventory"]');
    if(button) button.textContent="Inventory & Build Planning";
  };

})();