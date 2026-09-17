import SEO from '@/components/ui/SEO';
import Hero from '@/components/home/Hero';
import Mission from '@/components/home/Mission';
import TechnologyGrid from '@/components/home/TechnologyGrid';
import HowItWorks from '@/components/home/HowItWorks';
import ForSchools from '@/components/home/ForSchools';
import Platform from '@/components/home/Platform';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Alyntis — From Consumers to Makers | Technology Education for Schools"
        description="Alyntis helps schools deliver structured, project-based technology education across robotics, AI, IoT, electronics, drones and 3D printing."
        ogImage="https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
      />
      <Hero />
      <Mission />
      <TechnologyGrid />
      <HowItWorks />
      <ForSchools />
      <Platform />
      <CTASection />
    </>
  );
}
