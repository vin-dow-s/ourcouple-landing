import { Composition } from "remotion";
import { ProductDemoLaunch, DURATION_FRAMES, FPS } from "./ProductDemoLaunch";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ProductDemoLaunch"
      component={ProductDemoLaunch}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
