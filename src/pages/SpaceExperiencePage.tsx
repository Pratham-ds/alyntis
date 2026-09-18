import SpacePage from './SpacePage';
import MarsMission from '@/components/space/MarsMission';
import SpaceLearning from '@/components/space/SpaceLearning';

/** Phase 4 extends the existing Space journey with structured learning content. */
export default function SpaceExperiencePage() {
  return <><SpacePage /><MarsMission /><SpaceLearning /></>;
}
