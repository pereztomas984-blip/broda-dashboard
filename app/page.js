"use client";
 
import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  LayoutDashboard, Users, DollarSign, FileImage, Plus, Bell, Zap,
  TrendingUp, Clock, MessageSquare, Send, Bot, ArrowUpRight,
  ChevronRight, Activity, Menu, X, FileText, Video, Folder,
  AlertTriangle, Settings
} from "lucide-react";
 
const C = {
  bg:"#0A0A0A", surface:"#111111", card:"#161616", border:"#222222",
  orange:"#F97316", orangeLow:"#F9731614",
  green:"#22C55E",  greenLow:"#22C55E14",
  amber:"#EAB308",  amberLow:"#EAB30814",
  red:"#EF4444",    redLow:"#EF444414",
  t1:"#EBEBEB", t2:"#8A8A8A", t3:"#444444",
};
 
const ROLES = {
  charlie:{ name:"Charlie", title:"CEO & Estrategia", color:C.orange,  initials:"CH" },
  tomi:   { name:"Tomi",    title:"Operaciones",      color:"#D4D4D4", initials:"TO" },
  thiago: { name:"Thiago",  title:"Contenido",        color:C.green,   initials:"TH" },
};
 
const CLIENTS = [
  { id:1, name:"DESPA",         health:"green",
    stages:{"E00 · Arqueología":100,"E01 · Identidad":74,"E02 · Growth":8,"E03 · AI & Auto":0} },
  { id:2, name:"MARQ",          health:"amber",
    stages:{"E00 · Arqueología":52,"E01 · Identidad":0,"E02 · Growth":0,"E03 · AI & Auto":0} },
  { id:3, name:"Crudo y Queso", health:"green",
    stages:{"E00 · Arqueología":100,"E01 · Identidad":100,"E02 · Growth":41,"E03 · AI & Auto":0} },
  { id:4, name:"NN Startup",    health:"red", stalled:true,
    stages:{"E00 · Arqueología":100,"E01 · Identidad":19,"E02 · Growth":0,"E03 · AI & Auto":0} },
];
 
const FINANCE = [
  {m:"Ene",real:4200,proj:4000},{m:"Feb",real:5800,proj:5200},
  {m:"Mar",real:5200,proj:5800},{m:"Abr",real:7400,proj:6500},
  {m:"May",real:6900,proj:7200},{m:"Jun",real:8100,proj:8000},
  {m:"Jul",real:null,proj:9200},{m:"Ago",real:null,proj:10400},
];
 
const DRIVE = [
  {name:"Brand Guidelines DESPA v3",ext:"PDF",  client:"DESPA", time:"hace 2h", type:"pdf"},
  {name:"Hero Reel — Final Cut",    ext:"MP4",  client:"C&Q",   time:"hace 5h", type:"video"},
  {name:"Propuesta MARQ E00",       ext:"PDF",  client:"MARQ",  time:"ayer",    type:"pdf"},
  {name:"Moodboard Identidad v2",   ext:"FIG",  client:"NNS",   time:"ayer",    type:"design"},
  {name:"Reporte Semanal Apr 21",   ext:"LOOM", client:"BRODA", time:"hace 3h", type:"video"},
];
 
const INSIGHTS = {
  charlie:[
    "DESPA está al 74% de Etapa 01. Thiago terminó el Brand Guidelines — revisalo antes de enviarlo al cliente.",
    "Pipeline: NutriFit lleva 7 días sin respuesta. Riesgo de pérdida alto — enviá follow-up hoy.",
  ],
  tomi:[
    "3 tareas de MARQ vencidas esta semana. El Brief de Identidad es bloqueante para E01. Prioridad máxima.",
    "Crudo y Queso espera el reporte semanal desde ayer. 5 minutos en Loom alcanzan.",
  ],
  thiago:[
    "El Reel de ayer tiene 8.4% de engagement — mejor del mes. Publicá el siguiente antes del viernes.",
    "Tenés 4 piezas en producción y 0 listas para publicar. Desbloqueá la cola de contenido de BRODA.",
  ],
};
 
const NAV = [
  {id:"dashboard",icon:LayoutDashboard,label:"Dashboard"},
  {id:"clients",  icon:Users,          label:"Clientes"},
  {id:"finance",  icon:DollarSign,     label:"Finanzas"},
  {id:"content",  icon:FileImage,      label:"Contenido"},
];
 
const card = (x={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, ...x });
const hc = h => ({green:C.green,amber:C.amber,red:C.red}[h]||C.t3);
 
function Avatar({initials,color,sz=32}){
  const bg=color===C.orange?C.orangeLow:color===C.green?C.greenLow:"#D4D4D414";
  return(
    <div style={{width:sz,height:sz,borderRadius:"50%",background:bg,border:`1.5px solid ${color}33`,
      display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*.3,
      fontWeight:700,color,flexShrink:0,letterSpacing:"0.05em"}}>
      {initials}
    </div>
  );
}
 
function Bar({v,active,stalled}){
  const pct=Math.min(100,Math.max(0,v));
  const col=stalled?C.red:pct===100?C.green:active?C.orange:C.t3;
  return(
    <div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden"}}>
      {pct>0&&<div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:2,transition:"width 1s ease"}}/>}
    </div>
  );
}
 
function FileCard({f}){
  const [hover,setHover]=useState(false);
  const map={pdf:{color:C.orange,bg:C.orangeLow,Icon:FileText},video:{color:"#D4D4D4",bg:"#D4D4D414",Icon:Video},design:{color:C.green,bg:C.greenLow,Icon:Folder}};
  const {color,bg,Icon}=map[f.type]||map.pdf;
  return(
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{...card({padding:14,borderRadius:14,cursor:"pointer",borderColor:hover?C.orange+"44":C.border,transition:"border-color 0.15s"})}}>
      <div style={{width:36,height:36,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
        <Icon size={16} color={color}/>
      </div>
      <div style={{fontSize:11,fontWeight:600,color:C.t1,lineHeight:1.4,marginBottom:4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{f.name}</div>
      <div style={{fontSize:10,color:C.t2}}>{f.client} · {f.time}</div>
      <div style={{marginTop:8,padding:"2px 6px",borderRadius:4,background:C.border,display:"inline-block",fontSize:9,fontWeight:700,color:C.t3,letterSpacing:"0.06em"}}>{f.ext}</div>
    </div>
  );
}
 
function DotLoad({load,color}){
  const filled=Math.round(load/10);
  return(
    <div style={{display:"flex",gap:3}}>
      {Array.from({length:10},(_,i)=>(
        <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<filled?color:C.border}}/>
      ))}
    </div>
  );
}
 
const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:#0A0A0A}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
  .fu {animation:fadeUp 0.4s ease both}
  .fu1{animation:fadeUp 0.4s 0.07s ease both}
  .fu2{animation:fadeUp 0.4s 0.14s ease both}
  .fu3{animation:fadeUp 0.4s 0.21s ease both}
  .slide-in{animation:slideIn 0.28s ease both}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#2A2A2A;border-radius:2px}
  button{cursor:pointer;transition:all 0.15s ease;font-family:inherit}
  input{font-family:inherit}
  input:focus{outline:none}
`;
 
export default function Page(){
  const[role,setRole]=useState("charlie");
  const[section,setSection]=useState("dashboard");
  const[chatOpen,setChatOpen]=useState(true);
  const[sidebar,setSidebar]=useState(true);
  const[msgs,setMsgs]=useState([{from:"ai",text:"¡Hola! Soy tu Copilot de BRODA. Preguntame sobre clientes, métricas o pedime que redacte algo."}]);
  const[input,setInput]=useState("");
  const[insightI,setInsightI]=useState(0);
  const[typed,setTyped]=useState("");
  const chatEnd=useRef(null);
 
  const insightList=INSIGHTS[role];
  const currentInsight=insightList[insightI%insightList.length];
 
  useEffect(()=>{setInsightI(0);},[role]);
  useEffect(()=>{
    const t=setInterval(()=>setInsightI(i=>(i+1)%insightList.length),9000);
    return()=>clearInterval(t);
  },[role,insightList.length]);
  useEffect(()=>{
    setTyped("");let i=0;
    const t=setInterval(()=>{setTyped(currentInsight.slice(0,++i));if(i>=currentInsight.length)clearInterval(t);},18);
    return()=>clearInterval(t);
  },[currentInsight]);
  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
 
  const send=()=>{
    if(!input.trim())return;
    const m=input;setInput("");
    setMsgs(p=>[...p,{from:"user",text:m}]);
    setTimeout(()=>setMsgs(p=>[...p,{from:"ai",text:`Procesando "${m}"… En producción accedería a Notion y Drive en tiempo real.`}]),900);
  };
 
  const r=ROLES[role];
  const sectionLabel=NAV.find(x=>x.id===section)?.label||"Dashboard";
 
  return(
    <>
      <style>{CSS}</style>
      <div style={{fontFamily:"'Outfit',system-ui,sans-serif",background:C.bg,height:"100vh",color:C.t1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>
 
          {/* SIDEBAR */}
          <aside style={{width:sidebar?220:60,flexShrink:0,transition:"width 0.2s ease",background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"20px 0"}}>
            <div style={{padding:"0 16px 24px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:10,flexShrink:0,background:C.orangeLow,border:`1px solid ${C.orange}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Zap size={14} color={C.orange}/>
              </div>
              {sidebar&&<span style={{fontSize:15,fontWeight:800,letterSpacing:"-0.03em",color:C.t1}}>BRODA</span>}
            </div>
            <nav style={{flex:1,padding:"0 8px"}}>
              {NAV.map(({id,icon:Icon,label})=>{
                const a=section===id;
                return(
                  <button key={id} onClick={()=>setSection(id)} style={{width:"100%",padding:"9px 10px",marginBottom:2,borderRadius:10,border:"none",display:"flex",alignItems:"center",gap:9,background:a?C.orangeLow:"transparent",color:a?C.orange:C.t2,borderLeft:`2px solid ${a?C.orange:"transparent"}`,textAlign:"left"}}>
                    <Icon size={15}/>{sidebar&&<span style={{fontSize:13,fontWeight:a?600:400}}>{label}</span>}
                  </button>
                );
              })}
            </nav>
            <div style={{padding:"0 8px 12px"}}>
              <button style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"none",background:C.orange,color:"#fff",display:"flex",alignItems:"center",justifyContent:sidebar?"flex-start":"center",gap:7,fontSize:13,fontWeight:700}}>
                <Plus size={14}/>{sidebar&&"Nuevo Cliente"}
              </button>
            </div>
            <button onClick={()=>setSidebar(s=>!s)} style={{margin:"0 8px",padding:7,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.t3,display:"flex",justifyContent:"center"}}>
              {sidebar?<ChevronRight size={13}/>:<Menu size={13}/>}
            </button>
          </aside>
 
          {/* MAIN */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
            <header style={{height:58,flexShrink:0,background:C.surface,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 20px",gap:14}}>
              <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:12,color:C.t3,fontWeight:500}}>BRODA OS</span>
                <span style={{fontSize:12,color:C.t3}}>/</span>
                <span style={{fontSize:12,color:C.t2,fontWeight:600}}>{sectionLabel}</span>
              </div>
              <div style={{display:"flex",gap:5}}>
                {Object.entries(ROLES).map(([k,rl])=>{
                  const a=role===k;
                  const bg=a?(rl.color===C.orange?C.orangeLow:rl.color===C.green?C.greenLow:"#D4D4D414"):"transparent";
                  return(
                    <button key={k} onClick={()=>setRole(k)} style={{padding:"5px 10px",borderRadius:20,border:`1px solid ${a?rl.color+"44":C.border}`,background:bg,color:a?rl.color:C.t2,fontSize:12,fontWeight:a?700:400,display:"flex",alignItems:"center",gap:6}}>
                      <Avatar initials={rl.initials} color={rl.color} sz={20}/>{rl.name}
                    </button>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:6}}>
                <button style={{padding:7,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.t2,position:"relative"}}>
                  <Bell size={14}/><span style={{position:"absolute",top:5,right:5,width:5,height:5,borderRadius:"50%",background:C.orange}}/>
                </button>
                <button onClick={()=>setChatOpen(o=>!o)} style={{padding:7,borderRadius:8,border:`1px solid ${chatOpen?C.orange+"44":C.border}`,background:chatOpen?C.orangeLow:"transparent",color:chatOpen?C.orange:C.t2}}>
                  <MessageSquare size={14}/>
                </button>
                <button style={{padding:7,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.t2}}>
                  <Settings size={14}/>
                </button>
              </div>
            </header>
 
            <div style={{flex:1,overflowY:"auto",padding:20,paddingBottom:40}}>
 
              {/* AI INSIGHT */}
              <div className="fu" style={{...card({padding:"16px 18px",marginBottom:20}),borderColor:C.orange+"33",background:"linear-gradient(135deg,#161616,#1B1208)"}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:34,height:34,borderRadius:10,flexShrink:0,background:C.orangeLow,border:`1px solid ${C.orange}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Bot size={15} color={C.orange}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:10,fontWeight:800,color:C.orange,letterSpacing:"0.1em"}}>BRODA AI INSIGHT</span>
                      <span style={{width:5,height:5,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite",flexShrink:0}}/>
                      <span style={{fontSize:10,color:C.t3,marginLeft:"auto"}}>para {r.name}</span>
                    </div>
                    <p style={{fontSize:13,color:C.t2,margin:0,lineHeight:1.7,minHeight:22,fontWeight:400}}>
                      {typed}<span style={{display:"inline-block",width:2,height:12,background:C.orange,marginLeft:2,verticalAlign:"middle",animation:"pulse 0.9s infinite"}}/>
                    </p>
                  </div>
                </div>
              </div>
 
              {/* KPIs */}
              <div className="fu1" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                {[
                  {label:"Clientes Activos", val:"4",     delta:"+1 este mes",      color:C.green,  Icon:Users},
                  {label:"Ingresos del Mes", val:"$8.1K", delta:"+18% vs anterior", color:C.orange, Icon:TrendingUp},
                  {label:"Tareas Pendientes",val:"27",    delta:"3 urgentes",        color:C.amber,  Icon:Clock},
                  {label:"NPS Promedio",     val:"8.7",   delta:"+0.3 vs anterior", color:C.t2,     Icon:Activity},
                ].map(({label,val,delta,color,Icon},i)=>(
                  <div key={i} style={{...card({padding:16})}}>
                    <div style={{marginBottom:10}}><Icon size={14} color={color}/></div>
                    <div style={{fontSize:26,fontWeight:800,color:C.t1,lineHeight:1,marginBottom:5}}>{val}</div>
                    <div style={{fontSize:10,color:C.t3,marginBottom:5,fontWeight:500,letterSpacing:"0.04em",textTransform:"uppercase"}}>{label}</div>
                    <div style={{fontSize:11,color:color,fontWeight:600}}>{delta}</div>
                  </div>
                ))}
              </div>
 
              {/* Main Grid */}
              <div className="fu2" style={{display:"grid",gridTemplateColumns:"1.45fr 1fr",gap:14,marginBottom:14}}>
                <div style={{...card({padding:18})}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                    <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",color:C.t3,textTransform:"uppercase"}}>Salud de Proyectos</span>
                    <span style={{fontSize:10,color:C.t3}}>4 activos</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:20}}>
                    {CLIENTS.map(cl=>(
                      <div key={cl.id}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                          <div style={{width:7,height:7,borderRadius:"50%",background:hc(cl.health),flexShrink:0}}/>
                          <span style={{fontSize:14,fontWeight:700,color:C.t1}}>{cl.name}</span>
                          {cl.stalled&&(
                            <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:C.redLow,color:C.red,border:`1px solid ${C.red}33`,fontWeight:700,letterSpacing:"0.04em",display:"flex",alignItems:"center",gap:3}}>
                              <AlertTriangle size={8}/>ESTANCADO
                            </span>
                          )}
                          <span style={{marginLeft:"auto",color:C.t3}}><ArrowUpRight size={12}/></span>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:7}}>
                          {Object.entries(cl.stages).map(([stage,pct])=>{
                            const isActive=pct>0&&pct<100;
                            const isStalled=cl.stalled&&stage.includes("E01");
                            return(
                              <div key={stage}>
                                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                  <span style={{fontSize:10,color:isStalled?C.red:C.t3,fontWeight:500}}>{stage}</span>
                                  <span style={{fontSize:10,fontWeight:700,color:pct===100?C.green:isActive?C.orange:C.t3}}>{pct>0?`${pct}%`:"—"}</span>
                                </div>
                                <Bar v={pct} active={isActive&&!isStalled} stalled={isStalled}/>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
 
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{...card({padding:18}),flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",color:C.t3,textTransform:"uppercase"}}>Finanzas 2025</span>
                      <div style={{display:"flex",gap:12,fontSize:10}}>
                        <span style={{color:C.orange,fontWeight:600}}>● Real</span>
                        <span style={{color:C.t3}}>⋯ Proyectado</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={148}>
                      <AreaChart data={FINANCE} margin={{top:4,right:4,left:-28,bottom:0}}>
                        <defs>
                          <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={C.orange} stopOpacity={0.22}/>
                            <stop offset="95%" stopColor={C.orange} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={C.t3} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={C.t3} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="m" tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:C.t3,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`$${Math.round(v/1000)}k`}/>
                        <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,fontSize:11}} labelStyle={{color:C.t2}} formatter={(v,n)=>v?[`$${Number(v).toLocaleString()}`,n==="real"?"Real":"Proyectado"]:["—",""]}/>
                        <Area type="monotone" dataKey="proj" stroke={C.t3} strokeWidth={1.5} fill="url(#gG)" strokeDasharray="5 3" connectNulls/>
                        <Area type="monotone" dataKey="real" stroke={C.orange} strokeWidth={2.5} fill="url(#gO)" connectNulls/>
                      </AreaChart>
                    </ResponsiveContainer>
                    <div style={{display:"flex",justifyContent:"space-around",paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                      {[{l:"Ingresos",v:"$44.9K",c:C.orange},{l:"Proyectado",v:"$53.2K",c:C.t2},{l:"Balance",v:"+18%",c:C.green}].map(({l,v,c})=>(
                        <div key={l} style={{textAlign:"center"}}>
                          <div style={{fontSize:14,fontWeight:800,color:c}}>{v}</div>
                          <div style={{fontSize:10,color:C.t3,marginTop:2,fontWeight:500}}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
 
                  <div style={{...card({padding:18})}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",color:C.t3,marginBottom:16,textTransform:"uppercase"}}>Carga del Equipo</div>
                    {Object.entries(ROLES).map(([k,rl],idx)=>{
                      const loads={charlie:75,tomi:93,thiago:60};
                      const tasks={charlie:8,tomi:13,thiago:7};
                      const ld=loads[k];
                      const sc=ld>85?C.red:ld>65?C.amber:C.green;
                      const st=ld>85?"Sobrecargado":ld>65?"En carga":"Disponible";
                      return(
                        <div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:idx<2?14:0}}>
                          <Avatar initials={rl.initials} color={rl.color} sz={32}/>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                              <span style={{fontSize:13,fontWeight:600,color:C.t1}}>{rl.name}</span>
                              <span style={{fontSize:10,color:sc,fontWeight:600}}>{st}</span>
                            </div>
                            <DotLoad load={ld} color={ld>85?C.orange:rl.color}/>
                            <div style={{fontSize:10,color:C.t3,marginTop:4}}>{tasks[k]} tareas · {ld}% capacidad</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
 
              {/* DRIVE */}
              <div className="fu3" style={{...card({padding:18})}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",color:C.t3,textTransform:"uppercase"}}>Recientes en Drive</span>
                  <button style={{fontSize:11,color:C.orange,background:"none",border:"none",display:"flex",alignItems:"center",gap:4,fontWeight:600}}>
                    Ver todo<ArrowUpRight size={11}/>
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
                  {DRIVE.map((f,i)=><FileCard key={i} f={f}/>)}
                </div>
              </div>
            </div>
          </div>
 
          {/* CHAT */}
          {chatOpen&&(
            <div className="slide-in" style={{width:275,flexShrink:0,borderLeft:`1px solid ${C.border}`,background:C.surface,display:"flex",flexDirection:"column"}}>
              <div style={{padding:"16px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:30,height:30,borderRadius:9,flexShrink:0,background:C.orangeLow,border:`1px solid ${C.orange}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Bot size={13} color={C.orange}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.t1}}>BRODA Copilot</div>
                  <div style={{fontSize:10,color:C.green,display:"flex",alignItems:"center",gap:4}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>
                    Activo · Notion + Drive
                  </div>
                </div>
                <button onClick={()=>setChatOpen(false)} style={{background:"none",border:"none",color:C.t3,padding:4}}>
                  <X size={13}/>
                </button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"14px 12px",display:"flex",flexDirection:"column",gap:10}}>
                {msgs.map((m,i)=>(
                  <div key={i} style={{display:"flex",flexDirection:m.from==="user"?"row-reverse":"row",gap:7,alignItems:"flex-start"}}>
                    {m.from==="ai"&&(
                      <div style={{width:22,height:22,borderRadius:6,flexShrink:0,marginTop:1,background:C.orangeLow,border:`1px solid ${C.orange}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Bot size={10} color={C.orange}/>
                      </div>
                    )}
                    <div style={{maxWidth:"82%",padding:"9px 11px",borderRadius:m.from==="user"?"12px 4px 12px 12px":"4px 12px 12px 12px",background:m.from==="user"?C.orangeLow:C.card,border:`1px solid ${m.from==="user"?C.orange+"33":C.border}`,fontSize:12,color:C.t2,lineHeight:1.6}}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEnd}/>
              </div>
              <div style={{padding:"6px 12px 8px"}}>
                {["¿Cómo va DESPA esta semana?","¿Cuál es el saldo del mes?","Redactá el reporte semanal"].map((q,i)=>(
                  <button key={i} onClick={()=>setInput(q)} style={{width:"100%",padding:"6px 9px",marginBottom:4,borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:C.t3,fontSize:11,textAlign:"left"}}>
                    {q}
                  </button>
                ))}
              </div>
              <div style={{padding:"8px 12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:7}}>
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Preguntá algo..."
                  style={{flex:1,padding:"9px 12px",borderRadius:9,fontSize:12,background:C.card,border:`1px solid ${C.border}`,color:C.t1}}/>
                <button onClick={send} style={{padding:"9px 12px",borderRadius:9,border:"none",background:C.orange,color:"#fff",display:"flex",alignItems:"center"}}>
                  <Send size={13}/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
