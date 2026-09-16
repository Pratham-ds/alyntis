export interface Project {
  slug: string;
  name: string;
  technology: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  classLevel: string;
  image: string;
  description: string;
  estimatedTime: string;
  techSlugs: string[];
}

export const projects: Project[] = [
  {
    slug: 'line-follower-robot',
    name: 'Line Follower Robot',
    technology: 'Robotics',
    difficulty: 'Intermediate',
    classLevel: 'Class 8',
    image:
      'https://images.pexels.com/photos/7868836/pexels-photo-7868836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Build an autonomous robot that follows a line using infrared sensors and motor control logic.',
    estimatedTime: '4-6 hours',
    techSlugs: ['robotics', 'electronics', 'embedded-systems', 'coding'],
  },
  {
    slug: 'obstacle-avoiding-robot',
    name: 'Obstacle Avoiding Robot',
    technology: 'Robotics',
    difficulty: 'Intermediate',
    classLevel: 'Class 9',
    image:
      'https://images.pexels.com/photos/7869034/pexels-photo-7869034.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Create a robot that detects and avoids obstacles using ultrasonic sensors and automated navigation.',
    estimatedTime: '4-6 hours',
    techSlugs: ['robotics', 'electronics', 'embedded-systems', 'coding'],
  },
  {
    slug: 'smart-dustbin',
    name: 'Smart Dustbin',
    technology: 'IoT',
    difficulty: 'Beginner',
    classLevel: 'Class 7',
    image:
      'https://images.pexels.com/photos/15470540/pexels-photo-15470540.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Build a dustbin that opens automatically using an ultrasonic sensor and a servo motor.',
    estimatedTime: '2-3 hours',
    techSlugs: ['iot', 'electronics', 'embedded-systems', 'coding'],
  },
  {
    slug: 'smart-irrigation-system',
    name: 'Smart Irrigation System',
    technology: 'IoT',
    difficulty: 'Advanced',
    classLevel: 'Class 10',
    image:
      'https://images.pexels.com/photos/34182297/pexels-photo-34182297.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Design an automated irrigation system that waters plants based on soil moisture sensor data.',
    estimatedTime: '6-8 hours',
    techSlugs: ['iot', 'electronics', 'embedded-systems', 'automation', 'coding'],
  },
  {
    slug: 'smart-street-light',
    name: 'Smart Street Light',
    technology: 'IoT',
    difficulty: 'Intermediate',
    classLevel: 'Class 8',
    image:
      'https://images.pexels.com/photos/37549154/pexels-photo-37549154.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Build a street light that turns on automatically at night and adjusts brightness based on motion.',
    estimatedTime: '3-5 hours',
    techSlugs: ['iot', 'electronics', 'embedded-systems', 'automation'],
  },
  {
    slug: 'iot-weather-station',
    name: 'IoT Weather Station',
    technology: 'IoT',
    difficulty: 'Advanced',
    classLevel: 'Class 10',
    image:
      'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Create a weather monitoring station that collects temperature, humidity and pressure data and sends it to the cloud.',
    estimatedTime: '6-8 hours',
    techSlugs: ['iot', 'electronics', 'embedded-systems', 'coding'],
  },
  {
    slug: 'automatic-door',
    name: 'Automatic Door',
    technology: 'Automation',
    difficulty: 'Intermediate',
    classLevel: 'Class 9',
    image:
      'https://images.pexels.com/photos/34207369/pexels-photo-34207369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Design an automated door system that opens when it detects motion using a PIR sensor and servo motor.',
    estimatedTime: '3-5 hours',
    techSlugs: ['automation', 'electronics', 'embedded-systems', 'coding'],
  },
  {
    slug: 'mini-robotic-arm',
    name: 'Mini Robotic Arm',
    technology: 'Robotics',
    difficulty: 'Advanced',
    classLevel: 'Senior',
    image:
      'https://images.pexels.com/photos/34207359/pexels-photo-34207359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Build a multi-degree-of-freedom robotic arm controlled by servo motors and programmed for precise movements.',
    estimatedTime: '8-10 hours',
    techSlugs: ['robotics', 'electronics', 'embedded-systems', 'coding', 'automation'],
  },
  {
    slug: 'smart-parking-system',
    name: 'Smart Parking System',
    technology: 'IoT',
    difficulty: 'Advanced',
    classLevel: 'Class 10',
    image:
      'https://images.pexels.com/photos/37549157/pexels-photo-37549157.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Create a parking management system that detects available slots using IR sensors and displays status in real time.',
    estimatedTime: '6-8 hours',
    techSlugs: ['iot', 'electronics', 'embedded-systems', 'coding', 'automation'],
  },
  {
    slug: 'environmental-monitoring-system',
    name: 'Environmental Monitoring System',
    technology: 'IoT',
    difficulty: 'Advanced',
    classLevel: 'Senior',
    image:
      'https://images.pexels.com/photos/18734704/pexels-photo-18734704.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      'Build a comprehensive environmental monitoring system that tracks air quality, temperature, humidity and pollution levels.',
    estimatedTime: '8-12 hours',
    techSlugs: ['iot', 'electronics', 'embedded-systems', 'coding', 'automation'],
  },
];

export const classFilters = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Senior'];
export const techFilters = ['Robotics', 'AI', 'IoT', 'Electronics', 'Embedded Systems', 'Automation', 'Drones'];
