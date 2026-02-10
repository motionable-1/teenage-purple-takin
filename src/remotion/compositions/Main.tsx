import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
  Artifact,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import {
  TransitionSeries,
  getPresentation,
  createTiming,
  StompStream,
  ElasticStream,
  TextAnimation,
  Camera,
  BrowserMockup,
  Particles,
  Glow,
  FourColorGradient,
  LinearGradient,
} from "../library";

// Brand Colors
const COLORS = {
  primary: "#F56B3D",
  background: "#09090B",
  text: "#FAFAFA",
  accent: "#FF8C66",
  dark: "#0A0A0C",
  muted: "#27272A",
  success: "#22C55E",
  error: "#EF4444",
};

// Assets
const SCREENSHOT_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/screenshots/1770733285214_2g1skptgwns_screenshot_url_1770733285214.png";
const MAGIC_IMAGE_URL =
  "https://v3b.fal.media/files/b/0a8dec93/Yd2qw877E3cuVTBKjt-TC_IzIBPrBw.png";

// Load fonts
const { fontFamily: outfitFont } = loadOutfit();
const { fontFamily: spaceGroteskFont } = loadSpaceGrotesk();

// ============================================
// Scene 1: Hook - Bold Statement
// ============================================
const HookScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Animated gradient background */}
      <FourColorGradient
        topLeft="#F56B3D"
        topRight="#FF8C66"
        bottomLeft="#09090B"
        bottomRight="#1a1a1a"
        animate
        animationType="rotate"
        speed={0.3}
        style={{ opacity: 0.4 }}
      />

      {/* Floating particles */}
      <Particles
        count={30}
        colors={[COLORS.primary, COLORS.accent]}
        size={[2, 6]}
        speed={0.5}
        type="dust"
        style={{ opacity: 0.6 }}
      />

      <Camera wiggle={0.02} wiggleSpeed={0.5}>
        <AbsoluteFill className="flex items-center justify-center">
          <div style={{ fontFamily: spaceGroteskFont }}>
            <StompStream
              text="Create Launch Monetize"
              wordsPerGroup={1}
              fontSize={110}
              fontWeight={800}
              color={COLORS.text}
              transitionDuration={0.25}
            />
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 2: Amplify Hook
// ============================================
const AmplifyScene: React.FC = () => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [0, 20], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const subOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [15, 35], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <LinearGradient
        colors={[
          { color: COLORS.primary, position: 0 },
          { color: "#FF8C66", position: 50 },
          { color: COLORS.background, position: 100 },
        ]}
        direction="to-bottom-right"
        style={{ opacity: 0.15 }}
      />

      <Camera wiggle={0.015} wiggleSpeed={0.4}>
        <AbsoluteFill className="flex flex-col items-center justify-center gap-6">
          <div
            style={{
              fontFamily: spaceGroteskFont,
              fontSize: 72,
              fontWeight: 700,
              color: COLORS.text,
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
              textAlign: "center",
            }}
          >
            With <span style={{ color: COLORS.primary }}>Zero Code</span>{" "}
            Required
          </div>

          <div
            style={{
              fontFamily: outfitFont,
              fontSize: 32,
              fontWeight: 400,
              color: "rgba(250, 250, 250, 0.7)",
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
              textAlign: "center",
            }}
          >
            AI-powered platform for creators
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 3: Problem Statement
// ============================================
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  const problems = [
    { icon: "📊", text: "Scattered Analytics", delay: 0 },
    { icon: "💳", text: "Multiple Payment Tools", delay: 8 },
    { icon: "📧", text: "Separate Email Lists", delay: 16 },
    { icon: "🔗", text: "Disconnected Products", delay: 24 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0F0F11" }}>
      {/* Red warning gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.15), transparent 60%)",
        }}
      />

      <Camera wiggle={0.025} wiggleSpeed={0.6}>
        <AbsoluteFill className="flex flex-col items-center justify-center gap-8">
          <TextAnimation
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.from(split.chars, {
                opacity: 0,
                y: 30,
                rotateX: -90,
                stagger: 0.02,
                duration: 0.4,
                ease: "back.out(1.4)",
              });
              return tl;
            }}
            style={{
              fontFamily: spaceGroteskFont,
              fontSize: 56,
              fontWeight: 700,
              color: COLORS.text,
              textAlign: "center",
            }}
          >
            Still juggling{" "}
            <span style={{ color: COLORS.error }}>10+ tools</span>?
          </TextAnimation>

          <div
            className="flex flex-wrap justify-center gap-4 mt-8"
            style={{ maxWidth: 900 }}
          >
            {problems.map((problem, i) => {
              const itemOpacity = interpolate(
                frame,
                [problem.delay, problem.delay + 10],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              const itemScale = interpolate(
                frame,
                [problem.delay, problem.delay + 12],
                [0.8, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(1.5)),
                },
              );
              const shake =
                frame > problem.delay + 15
                  ? Math.sin((frame - problem.delay) * 0.3) * 2
                  : 0;

              return (
                <div
                  key={i}
                  style={{
                    opacity: itemOpacity,
                    transform: `scale(${itemScale}) translateX(${shake}px)`,
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: 12,
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 28 }}>{problem.icon}</span>
                  <span
                    style={{
                      fontFamily: outfitFont,
                      fontSize: 20,
                      fontWeight: 500,
                      color: COLORS.text,
                    }}
                  >
                    {problem.text}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 4: Solution Reveal - Browser Mockup
// ============================================
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: 30,
  });

  const browserY = interpolate(frame, [0, 30], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const rotateX = interpolate(frame, [0, 40], [15, 5], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const rotateY = interpolate(frame, [0, 40], [-8, -3], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }}>
      {/* Light gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(245, 107, 61, 0.1), transparent 50%)",
        }}
      />

      <Camera wiggle={0.01} wiggleSpeed={0.3}>
        <AbsoluteFill
          className="flex items-center justify-center"
          style={{ perspective: 1200 }}
        >
          <div
            style={{
              transform: `scale(${browserScale}) translateY(${browserY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <Glow color={COLORS.primary} intensity={80}>
              <BrowserMockup
                url="superlinks.ai"
                browser="arc"
                theme="light"
                width={900}
                shadow
              >
                <Img
                  src={SCREENSHOT_URL}
                  style={{ width: "100%", height: "auto" }}
                />
              </BrowserMockup>
            </Glow>
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 5: Feature Highlights
// ============================================
const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    {
      icon: "🎨",
      title: "Digital Products",
      desc: "Courses, templates, ebooks",
    },
    { icon: "📈", title: "Smart Analytics", desc: "Real-time insights" },
    { icon: "💰", title: "Built-in Payments", desc: "Stripe integration" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <FourColorGradient
        topLeft={COLORS.primary}
        topRight="#FF8C66"
        bottomLeft={COLORS.background}
        bottomRight="#1a1a2e"
        animate
        animationType="pulse"
        speed={0.4}
        style={{ opacity: 0.3 }}
      />

      <Camera wiggle={0.02} wiggleSpeed={0.4}>
        <AbsoluteFill className="flex flex-col items-center justify-center gap-12">
          <TextAnimation
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                scale: 0.8,
                y: 20,
                stagger: 0.08,
                duration: 0.5,
                ease: "back.out(1.7)",
              });
              return tl;
            }}
            style={{
              fontFamily: spaceGroteskFont,
              fontSize: 52,
              fontWeight: 700,
              color: COLORS.text,
              textAlign: "center",
            }}
          >
            Everything in{" "}
            <span style={{ color: COLORS.primary }}>One Place</span>
          </TextAnimation>

          <div className="flex gap-8">
            {features.map((feature, i) => {
              const delay = 20 + i * 12;
              const cardOpacity = interpolate(
                frame,
                [delay, delay + 12],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              );
              const cardY = interpolate(frame, [delay, delay + 15], [40, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.back(1.5)),
              });
              const cardScale = spring({
                frame: Math.max(0, frame - delay),
                fps,
                config: { damping: 12, stiffness: 100 },
              });

              return (
                <div
                  key={i}
                  style={{
                    opacity: cardOpacity,
                    transform: `translateY(${cardY}px) scale(${cardScale})`,
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 20,
                    padding: "32px 40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    minWidth: 220,
                  }}
                >
                  <span style={{ fontSize: 48 }}>{feature.icon}</span>
                  <span
                    style={{
                      fontFamily: spaceGroteskFont,
                      fontSize: 24,
                      fontWeight: 600,
                      color: COLORS.text,
                    }}
                  >
                    {feature.title}
                  </span>
                  <span
                    style={{
                      fontFamily: outfitFont,
                      fontSize: 16,
                      color: "rgba(250, 250, 250, 0.6)",
                    }}
                  >
                    {feature.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 6: Magic Moment - AI Visual
// ============================================
const MagicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imageScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 },
    durationInFrames: 40,
  });

  const imageOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [25, 45], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* AI-generated background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: imageOpacity * 0.8,
          transform: `scale(${0.9 + imageScale * 0.15})`,
        }}
      >
        <Img
          src={MAGIC_IMAGE_URL}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${COLORS.background} 0%, transparent 50%, ${COLORS.background}80 100%)`,
          }}
        />
      </div>

      <Particles
        count={50}
        colors={[COLORS.primary, COLORS.accent]}
        size={[2, 5]}
        speed={0.8}
        type="sparks"
        style={{ opacity: 0.5 }}
      />

      <Camera wiggle={0.02} wiggleSpeed={0.5}>
        <AbsoluteFill className="flex flex-col items-center justify-end pb-24">
          <div
            style={{
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: spaceGroteskFont,
                fontSize: 64,
                fontWeight: 700,
                color: COLORS.text,
                textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              }}
            >
              Powered by <span style={{ color: COLORS.primary }}>AI</span>
            </div>
            <div
              style={{
                fontFamily: outfitFont,
                fontSize: 24,
                color: "rgba(250, 250, 250, 0.7)",
                marginTop: 12,
              }}
            >
              Build smarter, launch faster
            </div>
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 7: Tagline
// ============================================
const TaglineScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <LinearGradient
        colors={[
          { color: COLORS.primary, position: 0 },
          { color: "#FF8C66", position: 100 },
        ]}
        direction="to-right"
        style={{ opacity: 0.2 }}
      />

      <Particles
        count={25}
        colors={[COLORS.primary, COLORS.accent, "#FFD700"]}
        size={[3, 8]}
        speed={0.4}
        type="confetti"
        style={{ opacity: 0.5 }}
      />

      <Camera wiggle={0.015} wiggleSpeed={0.4}>
        <AbsoluteFill className="flex items-center justify-center">
          <div style={{ fontFamily: spaceGroteskFont }}>
            <ElasticStream
              text="Turn Your Knowledge Into Income"
              wordsPerGroup={2}
              fontSize={80}
              fontWeight={800}
              color={COLORS.text}
              transitionDuration={0.3}
            />
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 8: CTA + Logo
// ============================================
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
    durationInFrames: 25,
  });

  const buttonOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const buttonY = interpolate(frame, [20, 40], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  // Button pulse
  const pulseScale = 1 + Math.sin(frame * 0.15) * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <FourColorGradient
        topLeft={COLORS.primary}
        topRight="#FF8C66"
        bottomLeft={COLORS.background}
        bottomRight="#1a1a2e"
        animate
        animationType="shift"
        speed={0.5}
        style={{ opacity: 0.25 }}
      />

      <Camera wiggle={0.01} wiggleSpeed={0.3}>
        <AbsoluteFill className="flex flex-col items-center justify-center gap-10">
          {/* Logo / Brand Name */}
          <div
            style={{
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
            }}
          >
            <div
              style={{
                fontFamily: spaceGroteskFont,
                fontSize: 72,
                fontWeight: 800,
                color: COLORS.text,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ color: COLORS.primary }}>Super</span>
              <span>links</span>
              <span style={{ color: COLORS.primary, fontSize: 48 }}>.ai</span>
            </div>
          </div>

          {/* CTA Button */}
          <div
            style={{
              opacity: buttonOpacity,
              transform: `translateY(${buttonY}px) scale(${pulseScale})`,
            }}
          >
            <Glow
              color={COLORS.primary}
              intensity={40}
              pulsate
              pulseDuration={1.5}
            >
              <div
                style={{
                  background: COLORS.primary,
                  color: COLORS.text,
                  fontFamily: outfitFont,
                  fontSize: 24,
                  fontWeight: 600,
                  padding: "18px 48px",
                  borderRadius: 9999,
                  boxShadow: `0 0 40px ${COLORS.primary}80`,
                }}
              >
                Start for Free →
              </div>
            </Glow>
          </div>

          {/* Tagline */}
          <div
            style={{
              opacity: buttonOpacity,
              fontFamily: outfitFont,
              fontSize: 18,
              color: "rgba(250, 250, 250, 0.5)",
              marginTop: 8,
            }}
          >
            No credit card required
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

// ============================================
// Main Composition
// ============================================
export const Main: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene durations in frames (30fps)
  const SCENE_DURATIONS = {
    hook: 90, // 3s
    amplify: 75, // 2.5s
    problem: 100, // 3.3s
    solution: 100, // 3.3s
    features: 110, // 3.7s
    magic: 100, // 3.3s
    tagline: 90, // 3s
    cta: 120, // 4s (longer for ending)
  };

  const TRANSITION_DURATION = 12; // 0.4s transitions

  return (
    <>
      {frame === 0 && (
        <Artifact filename="thumbnail.jpeg" content={Artifact.Thumbnail} />
      )}

      <AbsoluteFill>
        <TransitionSeries>
          {/* Scene 1: Hook */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hook}>
            <HookScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={getPresentation("whipPan")}
            timing={createTiming("snappy", TRANSITION_DURATION)}
          />

          {/* Scene 2: Amplify */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.amplify}>
            <AmplifyScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={getPresentation("glitch")}
            timing={createTiming("snappy", TRANSITION_DURATION)}
          />

          {/* Scene 3: Problem */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.problem}>
            <ProblemScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={getPresentation("flashWhite")}
            timing={createTiming("snappy", TRANSITION_DURATION)}
          />

          {/* Scene 4: Solution */}
          <TransitionSeries.Sequence
            durationInFrames={SCENE_DURATIONS.solution}
          >
            <SolutionScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={getPresentation("zoomIn")}
            timing={createTiming("smooth", TRANSITION_DURATION)}
          />

          {/* Scene 5: Features */}
          <TransitionSeries.Sequence
            durationInFrames={SCENE_DURATIONS.features}
          >
            <FeaturesScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={getPresentation("blurDissolve")}
            timing={createTiming("smooth", TRANSITION_DURATION)}
          />

          {/* Scene 6: Magic Moment */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.magic}>
            <MagicScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={getPresentation("slideUp")}
            timing={createTiming("snappy", TRANSITION_DURATION)}
          />

          {/* Scene 7: Tagline */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.tagline}>
            <TaglineScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={getPresentation("morphCircle")}
            timing={createTiming("smooth", TRANSITION_DURATION)}
          />

          {/* Scene 8: CTA */}
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cta}>
            <CTAScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </>
  );
};
