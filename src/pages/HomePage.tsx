import SEO from '@/components/ui/SEO';
import Hero from '@/components/home/Hero';
import HomepageTrustBar from '@/components/home/HomepageTrustBar';
import Mission from '@/components/home/Mission';
import Solutions from '@/components/home/Solutions';
import TechnologyGrid from '@/components/home/TechnologyGrid';
import LearningPath from '@/components/home/LearningPath';
import HowItWorks from '@/components/home/HowItWorks';
import ForSchools from '@/components/home/ForSchools';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Alyntis | STEM, Robotics, AI, ML, IoT & Space Technology"
        description="Alyntis helps schools prepare students for the future through hands-on learning in STEM, Robotics, Artificial Intelligence, Machine Learning, IoT, Embedded Systems, Drone Technology and Space Technology."
        ogImage="https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
      <Hero />
      <HomepageTrustBar />
      <Mission />
      <Solutions />
      <TechnologyGrid />
      <LearningPath />
      <HowItWorks />
      <ForSchools />
      <CTASection />
    </>
  );
}
