import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Orbit, Rocket, Satellite, School, Sparkles, Check, Radio, Fuel, Gauge } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import './space.css';

type Planet = { name: string; tagline: string; color: string; radius: number; orbit: number; period: number; temp: string; day: string; moons: number; fact: string };
type MissionStage = 'launch' | 'orbit' | 'deep-space' | 'landing' | 'exploration';
type Destination = [string, string, string, string];

const planets: Planet[] = [
  { name: 'Mercury', tagline: 'THE SWIFT PLANET', color: '#a9a39a', radius: 7, orbit: 18, period: 10, temp: '167°C', day: '58d 15h', moons: 0, fact: 'The smallest planet and the closest to the Sun.' },
  { name: 'Venus', tagline: 'THE CLOUDED WORLD', color: '#d8a45b', radius: 10, orbit: 25, period: 14, temp: '464°C', day: '243d', moons: 0, fact: 'A thick carbon-dioxide atmosphere makes Venus the hottest planet.' },
  { name: 'Earth', tagline: 'OUR HOME WORLD', color: '#3c91d8', radius: 11, orbit: 33, period: 18, temp: '15°C', day: '23h 56m', moons: 1, fact: 'The only world currently known to support life.' },
  { name: 'Mars', tagline: 'THE RED PLANET', color: '#c85b43', radius: 9, orbit: 41, period: 22, temp: '-63°C', day: '24h 37m', moons: 2, fact: 'A cold desert world with ancient valleys, volcanoes and polar ice.' },
  { name: 'Jupiter', tagline: 'THE GAS GIANT', color: '#c9936c', radius: 20, orbit: 50, period: 28, temp: '-110°C', day: '9h 56m', moons: 95, fact: 'The largest planet, famous for its Great Red Spot storm.' },
  { name: 'Saturn', tagline: 'THE RINGED WORLD', color: '#d9bd83', radius: 17, orbit: 59, period: 34, temp: '-140°C', day: '10h 42m', moons: 146, fact: 'A gas giant surrounded by a spectacular system of icy rings.' },
  { name: 'Uranus', tagline: 'THE ICE GIANT', color: '#83cbd0', radius: 13, orbit: 68, period: 40, temp: '-195°C', day: '17h 14m', moons: 28, fact: 'An ice giant that rotates on its side relative to its orbit.' },
  { name: 'Neptune', tagline: 'THE BLUE FRONTIER', color: '#4779d5', radius: 13, orbit: 77, period: 46, temp: '-200°C', day: '16h 6m', moons: 16, fact: 'The most distant major planet, with some of the fastest winds in the Solar System.' },
];

const destinations: Destination[] = [
  ['EARTH', 'Our living laboratory', 'Study our planet, climate, atmosphere and the systems that make life possible.', '🌍'],
  ['MOON', 'Our nearest frontier', 'Explore lunar geology, phases, gravity and the engineering challenges of lunar missions.', '🌕'],
  ['MARS', 'The red frontier', 'Investigate rovers, habitats, Martian geology and the science of future exploration.', '🔴'],
  ['SATURN', 'World of rings', 'Discover gas giants, planetary rings and the moons orbiting a distant world.', '🪐'],
  ['ASTEROIDS', 'Ancient building blocks', 'Learn how small bodies reveal clues about the origins of our Solar System.', '☄️'],
  ['DEEP SPACE', 'Beyond the familiar', 'Journey through stars, galaxies, black holes and the scale of the observable universe.', '🌌'],
];

const stages: { id: MissionStage; label: string; icon: string; title: string; description: string }[] = [
  { id: 'launch', label: 'LAUNCH', icon: '🚀', title: 'PREPARE THE SPACECRAFT', description: 'Run systems checks, ignite propulsion and leave the atmosphere.' },
  { id: 'orbit', label: 'ORBIT', icon: '🛰️', title: 'ENTER EARTH’S ORBIT', description: 'Stabilize the spacecraft and begin the journey beyond low Earth orbit.' },
  { id: 'deep-space', label: 'DEEP SPACE', icon: '🌌', title: 'TRAVEL BEYOND EARTH', description: 'Navigate the dark between worlds while mission telemetry stays online.' },
  { id: 'landing', label: 'LANDING', icon: '🔴', title: 'REACH THE DESTINATION', description: 'Approach the selected world and prepare for arrival.' },
  { id: 'exploration', label: 'EXPLORATION', icon: '🤖', title: 'BEGIN THE SCIENTIFIC MISSION', description: 'The destination is ready. Investigation starts here.' },
];

const facts = [
  'Earth completes one orbit around the Sun in approximately 365.25 days.',
  'Satellites in low Earth orbit travel at several kilometres per second.',
  'A day on Mars lasts about 24 hours and 37 minutes.',
  'The Moon is about 384,400 kilometres from Earth on average.',
];

export default function SpacePage() {
  const [selected, setSelected] = useState<Planet>(planets[3]);
  const [destination, setDestination] = useState<Destination>(destinations[0]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [missionStage, setMissionStage] = useState<MissionStage>('launch');
  const [launching, setLaunching] = useState(false);
  const [launchStep, setLaunchStep] = useState(0);
  const [launchStarted, setLaunchStarted] = useState(false);
  const missionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onMove = (event: MouseEvent) => setOffset({ x: (event.clientX / window.innerWidth - 0.5) * 14, y: (event.clientY / window.innerHeight - 0.5) * 10 });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const root = missionRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-mission-stage]'));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const stage = visible?.target.getAttribute('data-mission-stage') as MissionStage | null;
      if (stage) setMissionStage(stage);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!launching) return;
    const timer = window.setInterval(() => {
      setLaunchStep((step) => {
        if (step >= 7) { window.clearInterval(timer); return 7; }
        return step + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [launching]);

  const starField = useMemo(() => Array.from({ length: 95 }, (_, i) => ({ left: `${(i * 47) % 101}%`, top: `${(i * 83) % 101}%`, delay: `${(i % 9) * 0.4}s`, size: `${1 + (i % 3) / 2}px` })), []);
  const stageIndex = stages.findIndex((stage) => stage.id === missionStage);
  const launchLabels = ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'IGNITION', 'LIFTOFF', 'ORBIT INSERTION'];
  const telemetry = { altitude: launchStarted ? Math.min(408, Math.round(launchStep * 58 + 4)) : 4, velocity: launchStarted ? Math.min(7.66, Number((launchStep * 1.05).toFixed(1))) : 0.1, fuel: launchStarted ? Math.max(72, 100 - launchStep * 3) : 100, signal: launchStarted ? Math.min(99, 92 + launchStep) : 92 };

  const startLaunch = () => {
    if (launching) return;
    setLaunchStarted(true);
    setLaunching(true);
    setLaunchStep(0);
  };

  return (
    <main className="space-page">
      <SEO title="Space & Innovation — Alyntis" description="Explore Alyntis Space & Innovation through astronomy, robotics, satellites, AI and engineering missions." />

      <section className="space-hero">
        <div className="space-stars" aria-hidden="true">{starField.map((star, i) => <span key={i} style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay }} />)}</div>
        <div className="space-nebula space-nebula-one" style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }} />
        <div className="space-nebula space-nebula-two" style={{ transform: `translate3d(${-offset.x}px, ${-offset.y}px, 0)` }} />
        <div className="space-orbit orbit-a" /><div className="space-orbit orbit-b" />
        <div className="space-hero-content">
          <div className="space-kicker"><span className="space-status-dot" /> ALYNTIS // SPACE & INNOVATION</div>
          <div className="space-eyebrow"><Rocket size={15} /> MISSION CONTROL ONLINE</div>
          <h1>EXPLORE<br /><span>BEYOND LIMITS</span></h1>
          <p className="space-tagline">Learn. Build. Program. Explore.</p>
          <p className="space-description">A hands-on space innovation experience where students explore astronomy, robotics, satellites, AI and engineering through real missions and challenges.</p>
          <div className="space-actions"><a className="space-primary" href="#solar-system">START YOUR MISSION <ArrowRight size={17} /></a><a className="space-secondary" href="/request-demo">BRING IT TO YOUR SCHOOL <School size={17} /></a></div>
          <div className="space-scroll"><ChevronDown size={18} /> SCROLL TO EXPLORE</div>
        </div>
        <div className="space-hero-hud hud-left">SYS 01<br /><strong>DEEP SPACE</strong><br />SECTOR 03</div><div className="space-hero-hud hud-right">ALT 000.00<br /><strong>MISSION READY</strong><br />ALYNTIS // 2026</div>
      </section>

      <section id="solar-system" className="space-section solar-section">
        <div className="space-section-heading"><div><span className="space-label">01 // NAVIGATION</span><h2>THE SOLAR SYSTEM</h2></div><p>Select a world. Inspect the data. Start asking better questions.</p></div>
        <div className="solar-layout"><div className="solar-stage" aria-label="Interactive Solar System"><div className="sun">SUN</div>{planets.map((planet) => <button key={planet.name} className={`planet-orbit ${selected.name === planet.name ? 'selected' : ''}`} style={{ width: `${planet.orbit * 2}%`, height: `${planet.orbit * 2}%`, animationDuration: `${planet.period}s` }} onClick={() => setSelected(planet)} aria-label={`Explore ${planet.name}`}><span className="planet" style={{ width: planet.radius * 2, height: planet.radius * 2, background: planet.color }}>{planet.name === 'Earth' ? '◉' : ''}</span></button>)}</div>
          <aside className="space-hud-card"><div className="hud-card-top"><span>PLANETARY DOSSIER</span><Orbit size={15} /></div><div className="planet-title"><span className="selected-dot" style={{ background: selected.color }} />{selected.name}</div><div className="planet-subtitle">{selected.tagline}</div><p>{selected.fact}</p><div className="planet-stats"><div><span>AVERAGE TEMP</span><strong>{selected.temp}</strong></div><div><span>DAY LENGTH</span><strong>{selected.day}</strong></div><div><span>MOONS</span><strong>{selected.moons}</strong></div></div><button className="hud-button" onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}>EXPLORE {selected.name.toUpperCase()} <ArrowRight size={16} /></button></aside>
        </div>
      </section>

      <section id="destinations" className="space-section destinations-section">
        <div className="space-section-heading"><div><span className="space-label">02 // MISSION SELECT</span><h2>CHOOSE YOUR DESTINATION</h2></div><p>Every destination is a doorway into a new engineering problem.</p></div>
        <div className="destination-grid">{destinations.map((item, index) => <button key={item[0]} className={`destination-card ${destination[0] === item[0] ? 'active' : ''}`} onClick={() => setDestination(item)}><span className="destination-icon">{item[3]}</span><span className="destination-number">{String(index + 1).padStart(2, '0')}</span><h3>{item[0]}</h3><p>{item[1]}</p><ArrowRight size={17} /></button>)}</div>
        <div className="destination-detail"><div><span className="space-label">ACTIVE DESTINATION</span><h3>{destination[3]} {destination[0]}</h3><p>{destination[2]}</p></div><div className="detail-readout"><span>MISSION TYPE</span><strong>EXPLORATION</strong><span>STATUS</span><strong>READY FOR DISCOVERY</strong></div></div>
      </section>

      <section ref={missionRef} className="mission-journey" aria-label="Alyntis Mission Journey">
        <div className="mission-spaceback" aria-hidden="true"><div className="mission-stars" /><div className="mission-earth" /><div className="mission-nebula" /><div className={`mission-spacecraft stage-${stageIndex}`}><span className="thruster" /></div></div>
        <div className="mission-progress" aria-label="Mission progress"><span className="space-label">MISSION PROGRESS</span>{stages.map((stage, index) => <button key={stage.id} className={missionStage === stage.id ? 'active' : index < stageIndex ? 'complete' : ''} onClick={() => document.getElementById(`mission-${stage.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><i>{index < stageIndex ? '✓' : '●'}</i><span>{stage.label}</span></button>)}</div>
        <div className="mission-journey-heading"><span className="space-label">03 // MISSION JOURNEY</span><h2>YOUR MISSION<br /><span>BEGINS.</span></h2><p>Scroll through the mission sequence. Your spacecraft will follow the journey.</p></div>
        {stages.map((stage, index) => <article key={stage.id} id={`mission-${stage.id}`} data-mission-stage={stage.id} className={`mission-stage mission-stage-${stage.id}`}><div className="mission-stage-copy"><span className="mission-stage-number">0{index + 1}</span><span className="mission-stage-icon">{stage.icon}</span><span className="space-label">{stage.label}</span><h3>{stage.title}</h3><p>{stage.description}</p>{index === 0 && <a href="#launch-sequence" className="mission-link">READY FOR LIFTOFF <ArrowRight size={15} /></a>}{index === 4 && <a href="#mission-ready" className="mission-link">MISSION READY <ArrowRight size={15} /></a>}</div><div className="mission-fact"><span>DID YOU KNOW?</span><p>{facts[index % facts.length]}</p></div></article>)}
      </section>

      <section id="launch-sequence" className={`launch-sequence ${launching ? 'is-launching' : ''} ${launchStep >= 7 ? 'is-orbit' : ''}`}>
        <div className="launch-atmosphere" /><div className="launch-clouds" aria-hidden="true" /><div className="launch-stars" aria-hidden="true" />
        <div className="launch-copy"><span className="space-label">04 // LAUNCH CONTROL</span><h2>READY FOR<br /><span>LIFTOFF?</span></h2><p>Complete the simulated spacecraft checks, then launch into orbit.</p><button className="space-primary launch-button" onClick={startLaunch} disabled={launching} aria-label="Start the Alyntis simulated launch sequence">{launching ? launchLabels[Math.min(launchStep, 7)] : 'LAUNCH'} <Rocket size={17} /></button></div>
        <div className={`rocket-stage ${launching ? `launch-progress-${launchStep}` : ''}`} aria-label="Educational simulated spacecraft launch"><div className="rocket-body"><div className="rocket-window" /><div className="rocket-fin fin-left" /><div className="rocket-fin fin-right" /></div><div className="rocket-flame" /><div className="rocket-smoke" /></div>
        <div className="launch-checklist"><div className="hud-card-top"><span>ALYNTIS MISSION CONTROL</span><Radio size={14} /></div><div className="launch-mission-id">MISSION <strong>ALYNTIS-01</strong></div><div className="system-list">{['Navigation', 'Communication', 'Power', 'Propulsion', 'Life Support'].map((item) => <div key={item}><Check size={13} />{item}<span>READY</span></div>)}</div><div className="all-systems">ALL SYSTEMS READY</div></div>
        <div className="telemetry-hud"><div className="hud-card-top"><span>LIVE TELEMETRY // SIMULATION</span><Gauge size={14} /></div><div className="telemetry-grid"><div><span>ALTITUDE</span><strong>{telemetry.altitude} KM</strong></div><div><span>VELOCITY</span><strong>{telemetry.velocity} KM/S</strong></div><div><span>FUEL</span><strong>{telemetry.fuel}%</strong></div><div><span>SIGNAL</span><strong>{telemetry.signal}%</strong></div></div><div className="telemetry-system"><span><Fuel size={12} /> PROPULSION</span><span><Radio size={12} /> COMMUNICATION</span></div></div>
        {launchStep >= 7 && <div className="orbit-insertion"><Satellite size={18} /><span>ORBIT INSERTION</span><strong>LEO // STABLE</strong><small>408 KM · 7.66 KM/S</small></div>}
      </section>

      <section className="space-arrival" id="mission-ready">
        <div className="arrival-orbit" /><div className="arrival-planet" /><div className="arrival-copy"><span className="space-label">05 // DESTINATION ACQUIRED</span><h2>MISSION<br /><span>READY.</span></h2><p><strong>{destination[0]}</strong> is now the active mission target. The journey from launch to exploration is complete.</p><div className="arrival-status"><span>DESTINATION ACQUIRED</span><strong>● ARRIVAL CONFIRMED</strong></div><button className="space-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BEGIN EXPLORATION <ArrowRight size={17} /></button></div>
      </section>

      <section className="space-section mission-section"><div className="mission-panel"><div><span className="space-label">06 // ALYNTIS APPROACH</span><h2>SPACE IS THE CLASSROOM.</h2><p>Students learn by investigating real questions, building practical systems and thinking like engineers. Astronomy becomes a gateway to robotics, AI, electronics, coding and scientific problem solving.</p></div><div className="mission-pillars"><div><Sparkles size={18} /><strong>DISCOVER</strong><span>Understand the universe</span></div><div><Satellite size={18} /><strong>BUILD</strong><span>Engineer the mission</span></div><div><Orbit size={18} /><strong>EXPLORE</strong><span>Test and iterate</span></div></div></div></section>
      <section className="space-final-cta"><div className="space-final-glow" /><span className="space-label">MISSION CONTROL // ALYNTIS</span><h2>READY TO GO<br /><span>BEYOND?</span></h2><p>Bring a future-facing space and innovation experience to your school.</p><a href="/request-demo" className="space-primary">BRING IT TO YOUR SCHOOL <ArrowRight size={17} /></a></section>
    </main>
  );
}
