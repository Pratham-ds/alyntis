import SEO from '@/components/ui/SEO';
import Hero from '@/components/home/Hero';
import Mission from '@/components/home/Mission';
import Philosophy from '@/components/home/Philosophy';
import TechnologyGrid from '@/components/home/TechnologyGrid';
import ProjectPreview from '@/components/home/ProjectPreview';
import ClassWiseLearning from '@/components/home/ClassWiseLearning';
import HowItWorks from '@/components/home/HowItWorks';
import ForSchools from '@/components/home/ForSchools';
import Platform from '@/components/home/Platform';
import StudentExperience from '@/components/home/StudentExperience';
import InnovationPortfolio from '@/components/home/InnovationPortfolio';
import Challenges from '@/components/home/Challenges';
import AskAlyntis from '@/components/home/AskAlyntis';
import ForParents from '@/components/home/ForParents';
import WhyAlyntis from '@/components/home/WhyAlyntis';
import Testimonials from '@/components/home/Testimonials';
import FutureVision from '@/components/home/FutureVision';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Alyntis — From Consumers to Makers | Preparing Minds to Build the Future"
        description="Alyntis is a mission-driven technology and learning platform preparing the next generation to become creators, builders and innovators. Robotics, AI, IoT, electronics, drones and more."
        ogImage="https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
      />
      <Hero />
      <Mission />
      <Philosophy />
      <TechnologyGrid />
      <ProjectPreview />
      <ClassWiseLearning />
      <HowItWorks />
      <ForSchools />
      <Platform />
      <StudentExperience />
      <InnovationPortfolio />
      <Challenges />
      <AskAlyntis />
      <ForParents />
      <WhyAlyntis />
      <Testimonials />
      <FutureVision />
      <CTASection />
    </>
  );
}
