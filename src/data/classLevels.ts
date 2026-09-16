export interface ClassLevel {
  level: string;
  title: string;
  description: string;
  complexity: number;
}

export const classLevels: ClassLevel[] = [
  { level: 'Class 6', title: 'Discover Technology', description: 'Introduction to the world of technology, circuits and how things work.', complexity: 1 },
  { level: 'Class 7', title: 'Build Foundations', description: 'Learn core electronics, sensors and build first working projects.', complexity: 2 },
  { level: 'Class 8', title: 'Create Smart Systems', description: 'Combine sensors, code and logic to build smart, responsive systems.', complexity: 3 },
  { level: 'Class 9', title: 'Solve Real Problems', description: 'Apply robotics and IoT to design solutions for real-world problems.', complexity: 4 },
  { level: 'Class 10', title: 'Engineer & Innovate', description: 'Tackle advanced projects, integrate multiple technologies and innovate.', complexity: 5 },
  { level: 'Senior Classes', title: 'Build the Future', description: 'Take on complex engineering challenges and develop independent innovations.', complexity: 6 },
];
