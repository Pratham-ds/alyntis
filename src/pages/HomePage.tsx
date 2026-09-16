import SEO from '@/components/ui/SEO';
import Hero from '@/components/home/Hero';
import Mission from '@/components/home/Mission';
import TechnologyGrid from '@/components/home/TechnologyGrid';
import ClassWiseLearning from '@/components/home/ClassWiseLearning';
import HowItWorks from '@/components/home/HowItWorks';
import ForSchools from '@/components/home/ForSchools';
import Platform from '@/components/home/Platform';
import StudentExperience from '@/components/home/StudentExperience';
import InnovationPortfolio from '@/components/home/InnovationPortfolio';
import Challenges from '@/components/home/Challenges';
import ForParents from '@/components/home/ForParents';
import WhyAlyntis from '@/components/home/WhyAlyntis';
import Testimonials from '@/components/home/Testimonials';
import FutureVision from '@/components/home/FutureVision';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Alyntis — From Consumers to Makers | Technology Learning for Schools"
        description="Alyntis helps schools build structured, hands-on technology learning through robotics, AI, IoT, embedded systems, electronics, automation, drones, coding and 3D printing."
        ogImage="https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
      />
      <Hero />
      <Mission />
      <TechnologyGrid />
      <ClassWiseLearning />
      <HowItWorks />
      <ForSchools />
      <Platform />
      <StudentExperience />
      <InnovationPortfolio />
      <Challenges />
      <ForParents />
      <WhyAlyntis />
      <Testimonials />
      <FutureVision />
      <CTASection />
    </>
  );
}
