import { Main } from "./compositions/Main";

// Single composition configuration
// Single canvas flow: ~27s at 30fps
export const composition = {
  id: "Main",
  component: Main,
  durationInFrames: 820,
  fps: 30,
  width: 1280,
  height: 720,
};
