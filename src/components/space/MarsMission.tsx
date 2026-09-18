import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Battery, Camera, Compass, Crosshair, Radio, RotateCcw, Satellite, Signal, Target, Thermometer, Zap } from 'lucide-react';
import './mars-mission.css';

type Point = { x: number; y: number };
type Sample = Point & { id: string; collected: boolean };
type ViewMode = 'third' | 'overhead' | 'rover';
export interface RoverController { move(direction: 'forward' | 'reverse' | 'left' | 'right'): void; stop(): void; reset(): void; }
class SimulationRoverController implements RoverController {
  constructor(private handler: (direction: 'forward' | 'reverse' | 'left' | 'right') => void) {}
  move(direction: 'forward' | 'reverse' | 'left' | 'right') { this.handler(direction); }
  stop() {}
  reset() {}
}
const INITIAL: Sample[] = [{ id: 'A', x: 24, y: 31, collected: false }, { id: 'B', x: 67, y: 26, collected: false }, { id: 'C', x: 76, y: 73, collected: false }];
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export default function MarsMission() {
  const [started, setStarted] = useState(false), [position, setPosition] = useState<Point>({ x: 48, y: 58 });
  const [heading, setHeading] = useState(0), [speed, setSpeed] = useState(0), [battery, setBattery] = useState(100);
  const [samples, setSamples] = useState(INITIAL), [view, setView] = useState<ViewMode>('third');
  const [warning, setWarning] = useState(''), [analysis, setAnalysis] = useState<Sample | null>(null), [complete, setComplete] = useState(false), [elapsed, setElapsed] = useState(0), [travel, setTravel] = useState(0);
  const keys = useRef(new Set<string>()), controller = useRef<SimulationRoverController | null>(null);
  const beacon = useMemo(() => ({ x: 50, y: 12 }), []), charging = useMemo(() => ({ x: 17, y: 76 }), []);
  const obstacles = useMemo(() => [{ x: 38, y: 35, w: 9, h: 7 }, { x: 58, y: 56, w: 12, h: 8 }, { x: 30, y: 72, w: 10, h: 8 }], []);
  const blocked = useCallback((p: Point) => obstacles.some(o => p.x > o.x - 3 && p.x < o.x + o.w + 3 && p.y > o.y - 3 && p.y < o.y + o.h + 3), [obstacles]);
  const move = useCallback((direction: 'forward' | 'reverse' | 'left' | 'right') => {
    if (!started || complete || battery <= 3) return;
    if (direction === 'left' || direction === 'right') { setHeading(h => h + (direction === 'left' ? -8 : 8)); setSpeed(0); return; }
    const r = heading * Math.PI / 180, sign = direction === 'reverse' ? -1 : 1;
    const next = { x: position.x + Math.sin(r) * 1.35 * sign, y: position.y - Math.cos(r) * 1.35 * sign };
    if (next.x < 6 || next.x > 94 || next.y < 7 || next.y > 93 || blocked(next)) { setWarning('OBSTACLE DETECTED'); window.setTimeout(() => setWarning(''), 1200); return; }
    setPosition({ x: clamp(next.x, 6, 94), y: clamp(next.y, 7, 93) }); setTravel(d => d + 1.35); setBattery(b => Math.max(0, b - .18)); setSpeed(1.2);
  }, [battery, blocked, complete, heading, position, started]);
  useEffect(() => { const c = new SimulationRoverController(move); controller.current = c; return () => c.reset(); }, [move]);
  useEffect(() => { if (!started || complete) return; const t = window.setInterval(() => setElapsed(v => v + 1), 1000); return () => window.clearInterval(t); }, [started, complete]);
  useEffect(() => {
    const down = (e: KeyboardEvent) => { const k = e.key.toLowerCase(); if (!['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright'].includes(k)) return; e.preventDefault(); if (keys.current.has(k)) return; keys.current.add(k); controller.current?.move(k === 'w' || k === 'arrowup' ? 'forward' : k === 's' || k === 'arrowdown' ? 'reverse' : k === 'a' || k === 'arrowleft' ? 'left' : 'right'); };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase()); window.addEventListener('keydown', down); window.addEventListener('keyup', up); return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  const signal = clamp(Math.round(98 - dist(position, beacon) * .72), 22, 99), temperature = -38 - Math.round(Math.abs(position.x - 50) * .18);
  const nearby = samples.find(s => !s.collected && dist(position, s) < 5), count = samples.filter(s => s.collected).length;
  const time = `${String(Math.floor(elapsed / 3600)).padStart(2,'0')}:${String(Math.floor(elapsed % 3600 / 60)).padStart(2,'0')}:${String(elapsed % 60).padStart(2,'0')}`;
  const collect = () => { if (!nearby) return; setSamples(v => v.map(s => s.id === nearby.id ? { ...s, collected: true } : s)); setAnalysis(nearby); if (count + 1 === 3) setComplete(true); };
  const reset = () => { setStarted(false); setPosition({ x:48,y:58 }); setHeading(0); setSpeed(0); setBattery(100); setSamples(INITIAL); setAnalysis(null); setComplete(false); setElapsed(0); setTravel(0); setWarning(''); };
  return <section className="mars-mission" aria-labelledby="mars-title">
    <div className="mars-hero"><div className="mars-planet-glow"/><div className="mars-hero-grid"/><span className="space-label">07 // MARS ARRIVAL</span><h2 id="mars-title">MARS: <span>MISSION READY.</span></h2><p>The spacecraft has reached Mars. Now the real mission begins.</p><p className="mars-subcopy">Your rover is ready. Navigate the Martian surface, collect samples and complete your mission.</p>{!started && <button className="mars-start" onClick={() => setStarted(true)}>START ROVER MISSION <Target size={17}/></button>}</div>
    {started && <div className="mission-control-shell"><header className="mission-control-header"><div><span className="space-label">ALYNTIS // MISSION CONTROL</span><h3>MARS ROVER EXPLORATION</h3></div><div className="mission-live"><i/> SIMULATION // EASY</div></header>
      <div className="mission-control-grid"><div className={`mars-terrain view-${view}`} aria-label="Interactive simulated Martian terrain"><div className="terrain-grid"/><div className="terrain-mountains"/>{obstacles.map((o,i)=><div key={i} className="mars-rock" style={{left:`${o.x}%`,top:`${o.y}%`,width:`${o.w}%`,height:`${o.h}%`}}/>)}
        <div className="mission-beacon" style={{left:`${beacon.x}%`,top:`${beacon.y}%`}}><Radio size={12}/><span>COMMS</span></div><div className="charging-station" style={{left:`${charging.x}%`,top:`${charging.y}%`}}><Zap size={12}/><span>CHARGE</span></div>
        {samples.map(s=>!s.collected&&<button key={s.id} className="sample-marker" style={{left:`${s.x}%`,top:`${s.y}%`}} aria-label={`Sample site ${s.id}`}><span>+</span><small>{s.id}</small></button>)}<div className="hazard-zone" style={{left:'61%',top:'76%'}}>HAZARD</div><div className="mission-boundary"/>
        <div className="rover-shadow" style={{left:`${position.x}%`,top:`${position.y}%`}}/><div className="mars-rover" style={{left:`${position.x}%`,top:`${position.y}%`,transform:`translate(-50%,-50%) rotate(${heading}deg)`}} aria-label="Mars rover"><div className="rover-mast"><span/></div><div className="rover-body"/><div className="rover-panel"/><div className="rover-wheel wheel-a"/><div className="rover-wheel wheel-b"/><div className="rover-wheel wheel-c"/><div className="rover-antenna"/></div>
        {warning&&<div className="terrain-warning">⚠ {warning}<small>Navigation required.</small></div>}{nearby&&<button className="collect-sample" onClick={collect}>COLLECT SAMPLE <Target size={15}/></button>}<div className="terrain-view-tag"><Camera size={13}/> {view==='rover'?'ROVER CAM':view==='overhead'?'OVERHEAD':'THIRD PERSON'} <span>REC ●</span></div>
      </div>
      <aside className="mission-sidebar"><div className="telemetry-card"><div className="panel-heading"><span>ROVER TELEMETRY</span><Signal size={14}/></div><div className="online"><i/> ONLINE</div><div className="telemetry-readouts"><div><span>SPEED</span><strong>{speed.toFixed(1)} m/s</strong></div><div><span>BATTERY</span><strong>{Math.round(battery)}%</strong></div><div><span>TEMPERATURE</span><strong>{temperature}°C</strong></div><div><span>SIGNAL</span><strong>{signal}%</strong></div><div><span>DISTANCE</span><strong>{Math.round(travel)} m</strong></div><div><span>SAMPLES</span><strong>{count} / 3</strong></div></div><div className="meter"><span>BATTERY</span><div><i style={{width:`${battery}%`}}/></div></div><div className="meter"><span>SIGNAL</span><div><i style={{width:`${signal}%`}}/></div></div></div>
        <div className="mission-objective"><div className="panel-heading"><span>MISSION OBJECTIVE</span><Crosshair size={14}/></div><h4>MISSION 01 — MARTIAN SAMPLE COLLECTION</h4><p>Collect 3 geological samples.</p>{samples.map(s=><div className="objective-row" key={s.id}><span className={s.collected?'done':''}>{s.collected?'✓':'○'}</span>SAMPLE SITE {s.id}</div>)}<strong className="objective-progress">{count} / 3</strong></div>
        <div className="nav-card"><div className="panel-heading"><span>NAVIGATION</span><Compass size={14}/></div><div className="compass"><span>N</span><b>↑</b><span>W</span><i>●</i><span>E</span><span>S</span></div><div className="coords">X: {position.x.toFixed(1)} &nbsp; Y: {position.y.toFixed(1)} &nbsp; Z: {Math.round(position.y*4.72)}</div></div></aside></div>
      <div className="mission-toolbar"><div className="rover-controls"><span className="control-label">ROVER CONTROL</span><button aria-label="Move forward" onClick={()=>controller.current?.move('forward')}>↑</button><div><button aria-label="Turn left" onClick={()=>controller.current?.move('left')}>←</button><button className="control-center" aria-label="Stop rover" onClick={()=>setSpeed(0)}>●</button><button aria-label="Turn right" onClick={()=>controller.current?.move('right')}>→</button></div><button aria-label="Move reverse" onClick={()=>controller.current?.move('reverse')}>↓</button><small>WASD / ARROW KEYS</small></div><div className="view-controls"><span>CHANGE VIEW</span>{(['third','overhead','rover'] as ViewMode[]).map(v=><button key={v} className={view===v?'active':''} onClick={()=>setView(v)}>{v==='third'?'THIRD PERSON':v==='overhead'?'OVERHEAD':'ROVER CAM'}</button>)}<button onClick={reset} aria-label="Reset mission"><RotateCcw size={14}/></button></div><div className="mission-clock"><span>MISSION TIME</span><strong>{time}</strong></div></div>
      <div className="education-strip"><div><Battery size={15}/><span>WHY POWER MATTERS</span><p>Remote robots must manage energy carefully on long missions.</p></div><div><Radio size={15}/><span>WHY SIGNAL MATTERS</span><p>Communication links let teams send commands and receive rover data.</p></div><div><Satellite size={15}/><span>WHY SLOW MOVEMENT?</span><p>Careful navigation reduces risk on unfamiliar terrain.</p></div></div></div>}
    {battery < 20 && started && !complete && <div className="mars-toast"><Battery size={15}/> LOW POWER — Return to the charging station.</div>}
    {analysis && <div className="sample-modal" role="dialog" aria-modal="true"><div className="sample-modal-card"><span className="space-label">SAMPLE ANALYSIS</span><h3>SAMPLE #{analysis.id}</h3><p><strong>TYPE:</strong> ROCK SAMPLE</p><p>Scientists use geological samples to understand planetary history.</p><button onClick={()=>setAnalysis(null)}>CONTINUE MISSION</button></div></div>}
    {complete && <div className="mission-complete" role="dialog" aria-modal="true"><div className="mission-complete-card"><span className="space-label">MISSION COMPLETE</span><h2>MARS SAMPLE<br/><span>COLLECTION.</span></h2>{samples.map(s=><p key={s.id}>✓ SAMPLE {s.id}</p>)}<p>MISSION DATA COLLECTED · ROVER STATUS OPERATIONAL</p><h3>WELL DONE, MISSION ENGINEER</h3><p>You successfully completed the Mars Rover mission.</p><button onClick={reset}>RUN MISSION AGAIN</button></div></div>}
    <div className="mars-education"><span className="space-label">MARS ROVER // ENGINEERING LAB</span><h3>YOU ARE OPERATING A REMOTE ROBOT.</h3><p>Robotics + Sensors + Navigation + Telemetry + Communication + Space Science</p><div className="mars-systems"><span><Camera size={14}/> SENSORS</span><span><Compass size={14}/> NAVIGATION</span><span><Radio size={14}/> COMMUNICATION</span><span><Thermometer size={14}/> TELEMETRY</span></div></div>
  </section>;
}
