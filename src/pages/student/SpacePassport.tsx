import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Award, BookOpen, CheckCircle2, ChevronRight, Compass, Lock, Rocket, Sparkles, Target, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { missions, spaceModules } from '@/data/spaceLearning';
import './space-passport.css';

type ProgressRow = { id:string; item_type:'module'|'activity'|'mission'|'challenge'; item_id:string; status:'in_progress'|'completed'; xp_awarded:number; completed_at:string|null };
type BadgeRow = { badge_id:string; unlocked_at:string };

const BADGES = [
  ['rocket-engineer','🚀','ROCKET ENGINEER','Complete Rocket Engineering + its activity.'],
  ['mars-explorer','🔴','MARS EXPLORER','Complete Mars Rover + Mars Sample Hunt.'],
  ['rover-engineer','🤖','ROVER ENGINEER','Complete Mars Rover + rover navigation activity.'],
  ['satellite-engineer','🛰️','SATELLITE ENGINEER','Complete Satellite Engineering + telemetry activity.'],
  ['communications-engineer','📡','COMMUNICATIONS ENGINEER','Complete Space Communication + its activity.'],
  ['lunar-scientist','🌕','LUNAR SCIENTIST','Complete Moon Base + its activity.'],
  ['space-ai-engineer','🧠','SPACE AI ENGINEER','Complete AI for Space + its activity.'],
  ['earth-observation-scientist','🌍','EARTH OBSERVATION SCIENTIST','Complete Earth Observation + its activity.'],
  ['astronomer','🔭','ASTRONOMER','Complete Astronomy + its activity.'],
] as const;

const LEVELS = [
  { name:'SPACE CADET', min:0, max:500 },
  { name:'JUNIOR EXPLORER', min:500, max:2000 },
  { name:'MISSION ENGINEER', min:2000, max:4000 },
  { name:'SPACE INNOVATOR', min:4000, max:4000 },
];

const skillGroups = [
  { name:'ASTRONOMY', icon:'🔭', ids:['astronomy'], description:'Observe celestial objects, patterns and planetary motion.', prerequisite:'Astronomy module' },
  { name:'ROCKETS', icon:'🚀', ids:['rocket-engineering'], description:'Understand thrust, pressure and aerodynamic design.', prerequisite:'Rocket Engineering module' },
  { name:'SATELLITES', icon:'🛰️', ids:['satellite-engineering'], description:'Explore sensors, telemetry and remote data.', prerequisite:'Satellite Engineering module' },
  { name:'ROBOTICS', icon:'🤖', ids:['mars-rover'], description:'Build navigation thinking around sensors, motors and control.', prerequisite:'Mars Rover module' },
  { name:'ROVER', icon:'🔴', ids:['mars-rover'], description:'Apply robotic navigation to a simulated Mars mission.', prerequisite:'Robotics' },
  { name:'COMMUNICATION', icon:'📡', ids:['space-communication'], description:'Reason about signals, telemetry and mission reliability.', prerequisite:'Space Communication module' },
  { name:'EARTH OBSERVATION', icon:'🌍', ids:['earth-observation'], description:'Turn satellite-style observations into evidence.', prerequisite:'Earth Observation module' },
  { name:'AUTONOMOUS + AI', icon:'🧠', ids:['ai-space'], description:'Explore computer vision and autonomous decision making.', prerequisite:'AI for Space module' },
];

function levelFor(xp:number){ return LEVELS.reduce((current, level) => xp >= level.min ? level : current, LEVELS[0]); }

export default function SpacePassport(){
  const { profile, session } = useAuth();
  const [progress,setProgress]=useState<ProgressRow[]>([]);
  const [badges,setBadges]=useState<BadgeRow[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  const load=async()=>{
    if(!session?.user){setLoading(false);return;}
    setLoading(true); setError('');
    const [p,b]=await Promise.all([
      supabase.from('student_space_progress').select('id,item_type,item_id,status,xp_awarded,completed_at').eq('user_id',session.user.id).order('completed_at',{ascending:false}),
      supabase.from('student_space_badges').select('badge_id,unlocked_at').eq('user_id',session.user.id).order('unlocked_at',{ascending:false}),
    ]);
    if(p.error||b.error) setError(p.error?.message||b.error?.message||'Could not load your Space Passport.');
    setProgress((p.data||[]) as ProgressRow[]); setBadges((b.data||[]) as BadgeRow[]); setLoading(false);
  };
  useEffect(()=>{load();},[session?.user?.id]);

  const completed=new Set(progress.filter(x=>x.status==='completed').map(x=>`${x.item_type}:${x.item_id}`));
  const xp=progress.reduce((sum,x)=>sum+(x.status==='completed'?x.xp_awarded:0),0);
  const level=levelFor(xp); const levelIndex=LEVELS.findIndex(x=>x.name===level.name);
  const next=LEVELS[Math.min(levelIndex+1,LEVELS.length-1)];
  const levelSpan=next.min===level.min?1:next.min-level.min;
  const levelProgress=next.min===level.min?100:Math.min(100,Math.round(((xp-level.min)/levelSpan)*100));
  const missionsDone=progress.filter(x=>x.item_type==='mission'&&x.status==='completed');
  const badgeIds=new Set(badges.map(b=>b.badge_id));
  const moduleDone=spaceModules.filter(m=>completed.has(`module:${m.id}`));
  const categories=useMemo(()=>[
    ['Astronomy',['astronomy']],['Robotics',['mars-rover']],['Rockets',['rocket-engineering']],['Satellites',['satellite-engineering']],['Communication',['space-communication']],['Earth Observation',['earth-observation']],['AI',['ai-space']]
  ].map(([name,ids])=>({name:String(name),value:Math.round((ids as string[]).filter(id=>completed.has(`module:${id}`)).length/(ids as string[]).length*100)})),[progress]);

  if(!session) return <main className="space-passport-page"><div className="passport-empty"><Rocket size={42}/><h1>SPACE PASSPORT</h1><p>Sign in as a student to track your Space learning journey.</p><Link to="/login" className="passport-action">SIGN IN <ChevronRight size={16}/></Link></div></main>;
  if(loading) return <main className="space-passport-page"><div className="passport-loading">INITIALIZING SPACE PASSPORT…</div></main>;

  return <main className="space-passport-page">
    <div className="passport-stars" aria-hidden="true"/><div className="passport-shell">
      <header className="passport-header"><Link to="/space" className="passport-back"><ArrowLeft size={16}/> BACK TO SPACE</Link><span className="passport-code">ALYNTIS // STUDENT MISSION SYSTEM</span><Link to="/space" className="passport-space-link">EXPLORE SPACE <ChevronRight size={15}/></Link></header>
      <section className="passport-hero">
        <div className="passport-emblem"><div>AP</div><span>ALYNTIS<br/>SPACE</span></div>
        <div className="passport-identity"><span className="space-passport-label">DIGITAL ASTRONAUT PASSPORT</span><h1>ALYNTIS <span>SPACE PASSPORT</span></h1><p>{profile?.full_name || 'Student'} {profile?.school ? `· ${profile.school}` : ''}</p><div className="level-row"><span className="level-pill"><Sparkles size={14}/> {level.name}</span><span>{xp.toLocaleString()} XP</span></div></div>
        <div className="passport-stats"><div><strong>{xp.toLocaleString()}</strong><span>XP EARNED</span></div><div><strong>{missionsDone.length}</strong><span>MISSIONS</span></div><div><strong>{badges.length}</strong><span>BADGES</span></div><div><strong>{progress.filter(x=>x.item_type==='activity'&&x.status==='completed').length}</strong><span>ACTIVITIES</span></div></div>
      </section>

      <section className="passport-level-panel"><div><span className="passport-section-label">SPACE LEVEL</span><h2>{level.name}</h2><p>{next.min===level.min?'Maximum level reached — keep exploring and building.':`${xp.toLocaleString()} / ${next.min.toLocaleString()} XP to ${next.name}`}</p></div><div className="level-track"><div className="level-track-fill" style={{width:`${levelProgress}%`}}/></div><div className="level-markers">{LEVELS.map((l,i)=><span className={i<=levelIndex?'unlocked':''} key={l.name}>{i+1} · {l.name}</span>)}</div></section>

      {error&&<div className="passport-error" role="alert">{error}</div>}

      <section className="passport-grid">
        <div className="passport-panel passport-missions"><div className="panel-title"><div><span className="passport-section-label">MISSION PROGRESS</span><h2>YOUR MISSION LOG</h2></div><Target size={20}/></div>{missions.map(m=>{const done=completed.has(`mission:${m.id}`); const row=missionsDone.find(x=>x.item_id===m.id); return <div className="mission-log-row" key={m.id}><span className={done?'mission-check done':'mission-check'}>{done?<CheckCircle2 size={16}/>:<span/>}</span><div><strong>{m.title}</strong><small>{m.id.toUpperCase()} · {m.time}</small></div>{done?<time>{row?.completed_at?new Date(row.completed_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'COMPLETED'}</time>:<span className="mission-state">NOT STARTED</span>}</div>})}</div>
        <div className="passport-panel passport-badges"><div className="panel-title"><div><span className="passport-section-label">ACHIEVEMENTS</span><h2>BADGE PATCHES</h2></div><Award size={20}/></div><div className="badge-grid">{BADGES.map(([id,icon,name,desc])=>{const unlocked=badgeIds.has(id);return <div className={`passport-badge ${unlocked?'unlocked':''}`} key={id}><div className="badge-icon">{unlocked?icon:<Lock size={18}/>}</div><strong>{name}</strong><small>{unlocked?'UNLOCKED':desc}</small></div>})}</div></div>
      </section>

      <section className="passport-panel passport-skills"><div className="panel-title"><div><span className="passport-section-label">PROGRESSION SYSTEM</span><h2>SPACE SKILL TREE</h2></div><Compass size={20}/></div><div className="skill-tree"><div className="skill-root"><span>✦</span><strong>SPACE</strong></div><div className="skill-connector"/>{skillGroups.map((skill,i)=>{const pct=Math.round(skill.ids.filter(id=>completed.has(`module:${id}`)).length/skill.ids.length*100);return <div className={`skill-node ${pct===100?'unlocked':''}`} key={skill.name}><span className="skill-icon">{pct===100?skill.icon:<Lock size={15}/>}</span><div><strong>{skill.name}</strong><small>{skill.description}</small><em>{pct}% · {pct===100?'UNLOCKED':`Requires ${skill.prerequisite}`}</em></div>{i<skillGroups.length-1&&<span className="node-line"/>}</div>})}</div></section>

      <section className="passport-grid bottom-grid">
        <div className="passport-panel"><div className="panel-title"><div><span className="passport-section-label">SPACE KNOWLEDGE</span><h2>LEARNING PROGRESS</h2></div><BookOpen size={20}/></div><div className="knowledge-list">{categories.map(c=><div key={c.name}><div><span>{c.name}</span><strong>{c.value}%</strong></div><div className="knowledge-track"><i style={{width:`${c.value}%`}}/></div></div>)}</div><p className="panel-note">Progress is calculated from completed learning modules — nothing is awarded just for opening a page.</p></div>
        <div className="passport-panel"><div className="panel-title"><div><span className="passport-section-label">MISSION STAMPS</span><h2>COMPLETED MISSIONS</h2></div><Trophy size={20}/></div>{missionsDone.length===0?<div className="empty-stamps">Complete a mission to receive your first digital mission stamp.</div>:<div className="stamp-list">{missionsDone.map(row=>{const m=missions.find(x=>x.id===row.item_id);return <div className="mission-stamp" key={row.id}><span>MISSION STAMP</span><strong>{row.item_id.replace('mission-','MARS-')==='MARS-01'?'MARS-01':row.item_id.toUpperCase()}</strong><b>{m?.title||row.item_id}</b><small>✓ COMPLETED · {row.completed_at?new Date(row.completed_at).toLocaleDateString('en-IN'):''}</small></div>})}</div>}</div>
      </section>

      <section className="passport-panel recent-log"><div className="panel-title"><div><span className="passport-section-label">ACHIEVEMENT HISTORY</span><h2>RECENT ACTIVITY</h2></div><Sparkles size={20}/></div>{progress.length===0&&badges.length===0?<p className="empty-stamps">Your mission history will appear here as you learn and complete activities.</p>:<div className="history-list">{[...progress.slice(0,8).map(x=>({date:x.completed_at,label:x.item_id,type:x.item_type,xp:x.xp_awarded})),...badges.slice(0,4).map(x=>({date:x.unlocked_at,label:BADGES.find(b=>b[0]===x.badge_id)?.[2]||x.badge_id,type:'badge',xp:0}))].sort((a,b)=>new Date(b.date||0).getTime()-new Date(a.date||0).getTime()).slice(0,10).map((item,i)=><div key={`${item.type}-${item.label}-${i}`}><time>{item.date?new Date(item.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}):''}</time><span>{item.type==='badge'?'🏅':'✓'}</span><div><strong>{item.label}</strong><small>{item.type==='badge'?'Badge unlocked':item.type.toUpperCase()}</small></div>{item.xp>0&&<b>+{item.xp} XP</b>}</div>)}</div>}</section>

      <div className="passport-footer"><span>ALYNTIS SPACE & INNOVATION</span><span>LEARN · BUILD · EXPLORE</span><span>{moduleDone.length}/{spaceModules.length} MODULES COMPLETE</span></div>
    </div>
  </main>;
}
