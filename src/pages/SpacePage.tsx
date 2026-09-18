import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, Orbit, Rocket, Satellite, School, Sparkles } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import './space.css';

type Planet = {
  name: string;
  tagline: string;
  color: string;
  radius: number;
  orbit: number;
  period: number;
  temp: string;
  day: string;
  moons: number;
  fact: string;
};

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

const destinations = [
  ['EARTH', 'Our living laboratory', 'Study our planet, climate, atmosphere and the systems that make life possible.', '🌍'],
  ['MOON', 'Our nearest frontier', 'Explore lunar geology, phases, gravity and the engineering challenges of lunar missions.', '🌕'],
  ['MARS', 'The red frontier', 'Investigate rovers, habitats, Martian geology and the science of future exploration.', '🔴'],
  ['SATURN', 'World of rings', 'Discover gas giants, planetary rings and the moons orbiting a distant world.', '🪐'],
  ['ASTEROIDS', 'Ancient building blocks', 'Learn how small bodies reveal clues about the origins of our Solar System.', '☄️'],
  ['DEEP SPACE', 'Beyond the familiar', 'Journey through stars, galaxies, black holes and the scale of the observable universe.', '🌌'],
];

export default function SpacePage() {
  const [selected, setSelected] = useState<Planet>(planets[3]);
  const [destination, setDestination] = useState(destinations[0]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setOffset({ x: (event.clientX / window.innerWidth - 0.5) * 14, y: (event.clientY / window.innerHeight - 0.5) * 10 });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const starField = useMemo(() => Array.from({ length: 95 }, (_, i) => ({
    left: `${(i * 47) % 101}%`, top: `${(i * 83) % 101}%`, delay: `${(i % 9) * 0.4}s`, size: `${1 + (i % 3) / 2}px`,
  })), []);

  return (
    <main className="space-page">
      <SEO title="Space & Innovation — Alyntis" description="Explore Alyntis Space & Innovation through astronomy, robotics, satellites, AI and engineering missions." />

      <section className="space-hero">
        <div className="space-stars" aria-hidden="true">
          {starField.map((star, i) => <span key={i} style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay }} />)}
        </div>
        <div className="space-nebula space-nebula-one" style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }} />
        <div className="space-nebula space-nebula-two" style={{ transform: `translate3d(${-offset.x}px, ${-offset.y}px, 0)` }} />
        <div className="space-orbit orbit-a" />
        <div className="space-orbit orbit-b" />
        <div className="space-hero-content">
          <div className="space-kicker"><span className="space-status-dot" /> ALYNTIS // SPACE & INNOVATION</div>
          <div className="space-eyebrow"><Rocket size={15} /> MISSION CONTROL ONLINE</div>
          <h1>EXPLORE<br /><span>BEYOND LIMITS</span></h1>
          <p className="space-tagline">Learn. Build. Program. Explore.</p>
          <p className="space-description">A hands-on space innovation experience where students explore astronomy, robotics, satellites, AI and engineering through real missions and challenges.</p>
          <div className="space-actions">
            <a className="space-primary" href="#solar-system">START YOUR MISSION <ArrowRight size={17} /></a>
            <a className="space-secondary" href="/request-demo">BRING IT TO YOUR SCHOOL <School size={17} /></a>
          </div>
          <div className="space-scroll"><ChevronDown size={18} /> SCROLL TO EXPLORE</div>
        </div>
        <div className="space-hero-hud hud-left">SYS 01<br /><strong>DEEP SPACE</strong><br />SECTOR 03</div>
        <div className="space-hero-hud hud-right">ALT 000.00<br /><strong>MISSION READY</strong><br />ALYNTIS // 2026</div>
      </section>

      <section id="solar-system" className="space-section solar-section">
        <div className="space-section-heading"><div><span className="space-label">01 // NAVIGATION</span><h2>THE SOLAR SYSTEM</h2></div><p>Select a world. Inspect the data. Start asking better questions.</p></div>
        <div className="solar-layout">
          <div className="solar-stage" aria-label="Interactive Solar System">
            <div className="sun">SUN</div>
            {planets.map((planet) => (
              <button key={planet.name} className={`planet-orbit ${selected.name === planet.name ? 'selected' : ''}`} style={{ width: `${planet.orbit * 2}%`, height: `${planet.orbit * 2}%`, animationDuration: `${planet.period}s` }} onClick={() => setSelected(planet)} aria-label={`Explore ${planet.name}`}>
                <span className="planet" style={{ width: planet.radius * 2, height: planet.radius * 2, background: planet.color }}>{planet.name === 'Earth' ? '◉' : ''}</span>
              </button>
            ))}
          </div>
          <aside className="space-hud-card">
            <div className="hud-card-top"><span>PLANETARY DOSSIER</span><Orbit size={15} /></div>
            <div className="planet-title"><span className="selected-dot" style={{ background: selected.color }} />{selected.name}</div>
            <div className="planet-subtitle">{selected.tagline}</div>
            <p>{selected.fact}</p>
            <div className="planet-stats">
              <div><span>AVERAGE TEMP</span><strong>{selected.temp}</strong></div>
              <div><span>DAY LENGTH</span><strong>{selected.day}</strong></div>
              <div><span>MOONS</span><strong>{selected.moons}</strong></div>
            </div>
            <button className="hud-button" onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}>EXPLORE {selected.name.toUpperCase()} <ArrowRight size={16} /></button>
          </aside>
        </div>
      </section>

      <section id="destinations" className="space-section destinations-section">
        <div className="space-section-heading"><div><span className="space-label">02 // MISSION SELECT</span><h2>CHOOSE YOUR DESTINATION</h2></div><p>Every destination is a doorway into a new engineering problem.</p></div>
        <div className="destination-grid">
          {destinations.map((item) => (
            <button key={item[0]} className={`destination-card ${destination[0] === item[0] ? 'active' : ''}`} onClick={() => setDestination(item)}>
              <span className="destination-icon">{item[3]}</span><span className="destination-number">{String(destinations.indexOf(item) + 1).padStart(2, '0')}</span><h3>{item[0]}</h3><p>{item[1]}</p><ArrowRight size={17} />
            </button>
          ))}
        </div>
        <div className="destination-detail">
          <div><span className="space-label">ACTIVE DESTINATION</span><h3>{destination[3]} {destination[0]}</h3><p>{destination[2]}</p></div>
          <div className="detail-readout"><span>MISSION TYPE</span><strong>EXPLORATION</strong><span>STATUS</span><strong>READY FOR DISCOVERY</strong></div>
        </div>
      </section>

      <section className="space-section mission-section">
        <div className="mission-panel"><div><span className="space-label">03 // ALYNTIS APPROACH</span><h2>SPACE IS THE CLASSROOM.</h2><p>Students learn by investigating real questions, building practical systems and thinking like engineers. Astronomy becomes a gateway to robotics, AI, electronics, coding and scientific problem solving.</p></div><div className="mission-pillars"><div><Sparkles size={18} /><strong>DISCOVER</strong><span>Understand the universe</span></div><div><Satellite size={18} /><strong>BUILD</strong><span>Engineer the mission</span></div><div><Orbit size={18} /><strong>EXPLORE</strong><span>Test and iterate</span></div></div></div>
      </section>

      <section className="space-final-cta"><div className="space-final-glow" /><span className="space-label">MISSION CONTROL // ALYNTIS</span><h2>READY TO GO<br /><span>BEYOND?</span></h2><p>Bring a future-facing space and innovation experience to your school.</p><a href="/request-demo" className="space-primary">BRING IT TO YOUR SCHOOL <ArrowRight size={17} /></a></section>
    </main>
  );
}
