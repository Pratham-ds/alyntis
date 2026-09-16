export interface Program {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  topics: string[];
  status: 'Available' | 'Coming Soon';
}

export const programs: Program[] = [
  {
    slug: 'robotics',
    name: 'Robotics',
    tagline: 'Build machines that move, sense and decide.',
    description:
      'The Robotics program takes students from understanding basic motors and sensors to building fully autonomous robots. Students learn mechanical structure, electronic wiring, control logic and programming — then put it all together in working robot projects.',
    image:
      'https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    topics: ['Motors & Drive Systems', 'Sensors & Perception', 'Control Logic', 'Autonomous Navigation', 'Robot Programming', 'Mechanical Design'],
    status: 'Available',
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    tagline: 'Understand the building blocks of all technology.',
    description:
      'The Electronics program teaches students how circuits work — from basic components like resistors and capacitors to sensors, actuators and full circuit design. Students learn by building real, working circuits on breadboards.',
    image:
      'https://images.pexels.com/photos/459411/pexels-photo-459411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    topics: ['Circuit Fundamentals', 'Components & Sensors', 'Breadboarding', 'Actuators', 'Prototyping', 'Soldering Basics'],
    status: 'Available',
  },
  {
    slug: 'iot-smart-systems',
    name: 'IoT & Smart Systems',
    tagline: 'Connect the physical world to the digital.',
    description:
      'The IoT & Smart Systems program shows students how to connect sensors and devices to build smart, data-driven systems. Students learn how real-world systems like smart homes, smart agriculture and smart cities work — by building them.',
    image:
      'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    topics: ['Sensor Networks', 'Data Collection', 'Cloud Connectivity', 'Smart Automation', 'Remote Monitoring', 'Real-world Applications'],
    status: 'Available',
  },
  {
    slug: 'ai-foundations',
    name: 'AI Foundations',
    tagline: 'Understand how machines learn and decide.',
    description:
      'The AI Foundations program introduces students to the world of artificial intelligence — how machines learn, recognize patterns and make decisions. Students explore concepts through practical, age-appropriate activities and build AI-powered mini-projects.',
    image:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    topics: ['Machine Learning Concepts', 'Pattern Recognition', 'AI in Everyday Life', 'Training Models', 'AI Ethics', 'Building AI Projects'],
    status: 'Coming Soon',
  },
  {
    slug: 'drone-technology',
    name: 'Drone Technology',
    tagline: 'Explore the skies with autonomous flight.',
    description:
      'The Drone Technology program introduces students to the world of aerial systems — flight mechanics, sensors, autonomous navigation and real-world applications. Students learn how drones work and explore their potential in agriculture, monitoring and more.',
    image:
      'https://images.pexels.com/photos/5555813/pexels-photo-5555813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    topics: ['Flight Mechanics', 'Drone Sensors', 'Autonomous Flight', 'Aerial Mapping', 'Safety & Regulations', 'Real-world Applications'],
    status: 'Coming Soon',
  },
];
