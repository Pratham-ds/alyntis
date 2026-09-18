import {
  Bot,
  Brain,
  Wifi,
  Cpu,
  CircuitBoard,
  Settings2,
  Plane,
  Code2,
  Printer,
  Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Technology {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  image: string;
  features: string[];
}

export const technologies: Technology[] = [
  {
    slug: 'robotics',
    name: 'Robotics',
    description:
      'Build autonomous machines and understand motors, sensors, control systems and robotics.',
    icon: Bot,
    image:
      'https://images.pexels.com/photos/11579194/pexels-photo-11579194.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Motors & Actuators', 'Sensors & Feedback', 'Control Systems', 'Autonomous Navigation'],
  },
  {
    slug: 'ai',
    name: 'Artificial Intelligence',
    description:
      'Explore intelligent systems, machine learning concepts and AI-powered solutions.',
    icon: Brain,
    image:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Machine Learning', 'Pattern Recognition', 'Decision Systems', 'AI Models'],
  },
  {
    slug: 'iot',
    name: 'IoT',
    description: 'Connect devices, collect data and build smart systems.',
    icon: Wifi,
    image:
      'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Sensor Networks', 'Data Collection', 'Cloud Connectivity', 'Smart Systems'],
  },
  {
    slug: 'embedded-systems',
    name: 'Embedded Systems',
    description:
      'Understand microcontrollers, electronics, sensors and real-world computing.',
    icon: Cpu,
    image:
      'https://images.pexels.com/photos/15470542/pexels-photo-15470542.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Microcontrollers', 'Real-time Computing', 'Sensor Integration', 'Hardware Control'],
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    description:
      'Learn circuits, components, sensors, actuators and practical electronics.',
    icon: CircuitBoard,
    image:
      'https://images.pexels.com/photos/459411/pexels-photo-459411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Circuit Design', 'Components & Sensors', 'Actuators', 'Soldering & Prototyping'],
  },
  {
    slug: 'automation',
    name: 'Automation',
    description: 'Design systems that sense, decide and act automatically.',
    icon: Settings2,
    image:
      'https://images.pexels.com/photos/34207359/pexels-photo-34207359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Automated Control', 'Feedback Loops', 'Process Optimization', 'Smart Actuation'],
  },
  {
    slug: 'drones',
    name: 'Drone Technology',
    description:
      'Explore flight systems, sensors, automation and aerial technology.',
    icon: Plane,
    image:
      'https://images.pexels.com/photos/5555813/pexels-photo-5555813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Flight Systems', 'Aerial Sensors', 'Autonomous Flight', 'Aerial Technology'],
  },
  {
    slug: 'coding',
    name: 'Coding & Computational Thinking',
    description:
      'Develop logical thinking, algorithms, programming and problem-solving skills.',
    icon: Code2,
    image:
      'https://images.pexels.com/photos/5530437/pexels-photo-5530437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Programming', 'Algorithms', 'Logical Thinking', 'Problem Solving'],
  },
  {
    slug: '3d-printing',
    name: '3D Printing',
    description:
      'Turn digital designs into physical prototypes and learn modern additive manufacturing through hands-on making.',
    icon: Printer,
    image:
      'https://images.pexels.com/photos/8294607/pexels-photo-8294607.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['3D Design & Modeling', 'Slicing & Print Setup', 'Rapid Prototyping', 'Additive Manufacturing'],
  },
  {
    slug: 'space-technology',
    name: 'Space Technology',
    description:
      'Explore rockets, satellites, space robotics, telemetry and the engineering systems used to explore beyond Earth.',
    icon: Rocket,
    image:
      'https://images.pexels.com/photos/23769/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: ['Rocket Engineering', 'Satellite Systems', 'Space Robotics', 'Telemetry & Communication'],
  },
];

export const technologySlugs = technologies.map((t) => t.slug);
