import SpacePage from './SpacePage';
import MarsMission from '@/components/space/MarsMission';
import SpaceLearning from '@/components/space/SpaceLearning';
import SpaceProgressHub from '@/components/space/SpaceProgressHub';

/** Space experience composed from the cinematic journey, Mars mission, learning program and student progression layers. */
export default function SpaceExperiencePage() {
  return <><SpacePage /><MarsMission /><SpaceLearning /><SpaceProgressHub /></>;
}
