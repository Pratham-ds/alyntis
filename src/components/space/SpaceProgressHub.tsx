import { useState } from 'react';
import { Award, CheckCircle2, ChevronRight, Rocket, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { missions, spaceModules } from '@/data/spaceLearning';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import './space-progress-hub.css';

export default function SpaceProgressHub(){
  const { session } = useAuth();
  const [busy,setBusy]=useState('');
  const [message,setMessage]=useState('');
  const complete=async(type:'module'|'activity'|'mission'|'challenge',id:string)=>{
    if(!session){setMessage('Sign in as a student to save Space progress.');return;}
    setBusy(`${type}:${id}`);setMessage('');
    const {data,error}=await supabase.rpc('complete_space_item',{p_item_type:type,p_item_id:id});
    setBusy('');
    if(error){setMessage(error.message);return;}
    const unlocked=(data?.new_badges||[]) as string[];
    setMessage(unlocked.length?`Achievement unlocked: ${unlocked.join(', ')}.`:`Progress saved. +${type==='module'?50:type==='activity'?100:type==='mission'?150:100} XP.`);
  };
  return <section className="space-progress-hub" aria-labelledby="space-progress-title">
    <div className="progress-hub-inner">
      <div className="progress-hub-heading"><div><span className="space-label">07 // STUDENT PROGRESSION</span><h2 id="space-progress-title">TRACK YOUR <span>MISSION.</span></h2><p>Complete learning experiences to build your Space Passport. Rewards are recorded once per item.</p></div><Link to="/space/passport" className="passport-hub-link"><Rocket size={16}/> OPEN SPACE PASSPORT <ChevronRight size={15}/></Link></div>
      {!session&&<div className="progress-login"><Sparkles size={16}/> Sign in to persist modules, activities, missions, XP and badges.</div>}
      {message&&<div className="progress-message" role="status"><Award size={15}/>{message}</div>}
      <div className="progress-hub-grid"><div><div className="hub-subtitle"><Target size={15}/> LEARNING MODULES</div>{spaceModules.map(m=><div className="progress-item" key={m.id}><span className="progress-icon">{m.icon}</span><div><strong>{m.title}</strong><small>{m.duration} · {m.difficulty}</small></div><button disabled={!!busy} onClick={()=>complete('module',m.id)}>{busy===`module:${m.id}`?'SAVING…':'COMPLETE MODULE'} <CheckCircle2 size={13}/></button></div>)}</div><div><div className="hub-subtitle"><Rocket size={15}/> EDUCATIONAL MISSIONS</div>{missions.map(m=><div className="progress-item" key={m.id}><span className="progress-icon">{m.id==='mission-01'?'🔴':'🎯'}</span><div><strong>{m.title}</strong><small>{m.time} · {m.difficulty}</small></div><button disabled={!!busy} onClick={()=>complete('mission',m.id)}>{busy===`mission:${m.id}`?'SAVING…':'COMPLETE MISSION'} <CheckCircle2 size={13}/></button></div>)}</div></div>
      <div className="progress-hub-note">Use the completion action after you have actually completed the learning experience. The database enforces one reward per student and item.</div>
    </div>
  </section>;
}
