import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const json = (body: unknown, status=200) => new Response(JSON.stringify(body), {status,headers:{...cors,"Content-Type":"application/json"}});

Deno.serve(async req => {
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"Method not allowed."},405);

  const url=Deno.env.get("SUPABASE_URL");
  const anon=Deno.env.get("SUPABASE_ANON_KEY");
  const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!anon||!service)return json({error:"Supabase function secrets are missing."},500);

  const auth=req.headers.get("Authorization")||"";
  const callerClient=createClient(url,anon,{global:{headers:{Authorization:auth}},auth:{persistSession:false}});
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user:caller},error:callerError}=await callerClient.auth.getUser();
  if(callerError||!caller)return json({error:"A valid signed-in Atlas session is required."},401);

  const body=await req.json();
  const companyId=String(body.company_id||"");
  if(!companyId)return json({error:"Choose a company first."},400);

  const {data:profile}=await admin.from("profiles").select("is_platform_owner,is_active").eq("user_id",caller.id).maybeSingle();
  let allowed=profile?.is_active!==false&&profile?.is_platform_owner===true;
  if(!allowed){
    const {data:membership}=await admin.from("company_memberships").select("role_id,is_active").eq("user_id",caller.id).eq("company_id",companyId).eq("is_active",true).maybeSingle();
    if(membership?.role_id){
      const {data:role}=await admin.from("roles").select("code").eq("id",membership.role_id).maybeSingle();
      allowed=["owner","company_admin"].includes(String(role?.code||""));
    }
  }
  if(!allowed)return json({error:"Only an Owner or Company Admin can manage users."},403);

  const action=String(body.action||"");
  if(action==="invite"){
    const email=String(body.email||"").trim().toLowerCase();
    const first=String(body.first_name||"").trim();
    const last=String(body.last_name||"").trim();
    const roleCode=String(body.role_code||"").trim();
    const redirectTo=String(body.redirect_to||"").trim();
    if(!email||!first||!last)return json({error:"First name, last name, and email are required."},400);
    const {data:role}=await admin.from("roles").select("id,code,display_name").eq("code",roleCode).maybeSingle();
    if(!role)return json({error:`Role ${roleCode} does not exist.`},400);

    const listed=(await admin.auth.admin.listUsers({page:1,perPage:1000})).data.users;
    let authUser=listed.find(u=>u.email?.toLowerCase()===email);
    let invited=false;
    if(!authUser){
      const result=await admin.auth.admin.inviteUserByEmail(email,{redirectTo,data:{first_name:first,last_name:last,display_name:`${first} ${last}`}});
      if(result.error)return json({error:result.error.message},400);
      authUser=result.data.user;invited=true;
    }
    if(!authUser)return json({error:"Atlas could not create the authentication account."},500);

    const {error:profileError}=await admin.from("profiles").upsert({
      user_id:authUser.id,email,first_name:first,last_name:last,display_name:`${first} ${last}`,
      is_active:true,is_platform_owner:false,invite_status:authUser.email_confirmed_at?"active":"invited",invited_at:new Date().toISOString()
    },{onConflict:"user_id"});
    if(profileError)return json({error:profileError.message},500);

    const {error:membershipError}=await admin.from("company_memberships").upsert({
      company_id:companyId,user_id:authUser.id,role_id:role.id,is_active:true
    },{onConflict:"company_id,user_id"});
    if(membershipError)return json({error:membershipError.message},500);

    return json({success:true,message:invited?`Invitation sent to ${email}.`:`${email} already had an Atlas login and was added to the company.`});
  }

  const userId=String(body.user_id||"");
  if(!userId)return json({error:"User ID is required."},400);

  if(action==="disable"||action==="enable"){
    const active=action==="enable";
    await admin.from("profiles").update({is_active:active}).eq("user_id",userId);
    await admin.from("company_memberships").update({is_active:active}).eq("user_id",userId).eq("company_id",companyId);
    return json({success:true,message:active?"User enabled.":"User disabled."});
  }

  if(action==="resend"){
    const email=String(body.email||"").trim();
    const result=await admin.auth.admin.inviteUserByEmail(email);
    if(result.error)return json({error:result.error.message},400);
    return json({success:true,message:`Invitation resent to ${email}.`});
  }

  return json({error:"Unsupported action."},400);
});