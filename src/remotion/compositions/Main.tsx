import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import {
  TextAnimation,
  Camera,
  BrowserMockup,
  Particles,
  Glow,
  FourColorGradient,
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
// Load fonts
const { fontFamily: outfitFont } = loadOutfit();
const { fontFamily: spaceGroteskFont } = loadSpaceGrotesk();

// ============================================
// Animated Text Component - Flies in/out
// ============================================
interface FlyingTextProps {
  children: React.ReactNode;
  startFrame: number;
  endFrame: number;
  direction?: "up" | "down" | "left" | "right";
  style?: React.CSSProperties;
  exitDirection?: "up" | "down" | "left" | "right";
  stayVisible?: boolean;
}

const FlyingText: React.FC<FlyingTextProps> = ({
  children,
  startFrame,
  endFrame,
  direction = "up",
  exitDirection,
  style,
  stayVisible = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterDuration = 20;
  const exitDuration = 15;

  // Entry animation
  const entryProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: enterDuration,
  });

  // Exit animation
  const exitStart = endFrame - exitDuration;
  const exitProgress = stayVisible
    ? 0
    : interpolate(frame, [exitStart, endFrame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });

  const getOffset = (dir: string, progress: number, isExit: boolean) => {
    const distance = isExit ? 80 : 120;
    const value = isExit ? progress * distance : (1 - progress) * distance;
    switch (dir) {
      case "up":
        return { x: 0, y: isExit ? -value : value };
      case "down":
        return { x: 0, y: isExit ? value : -value };
      case "left":
        return { x: isExit ? -value : value, y: 0 };
      case "right":
        return { x: isExit ? value : -value, y: 0 };
      default:
        return { x: 0, y: value };
    }
  };

  const entryOffset = getOffset(direction, entryProgress, false);
  const exitOffset = getOffset(exitDirection || direction, exitProgress, true);

  const isVisible = frame >= startFrame && (stayVisible || frame <= endFrame);
  const opacity = isVisible
    ? interpolate(entryProgress, [0, 0.3], [0, 1], {
        extrapolateRight: "clamp",
      }) *
      (1 - exitProgress)
    : 0;

  const scale = interpolate(entryProgress, [0, 1], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${entryOffset.x + exitOffset.x}px, ${entryOffset.y + exitOffset.y}px) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// Animated Element - Generic flying wrapper
// ============================================
interface FlyingElementProps {
  children: React.ReactNode;
  startFrame: number;
  endFrame?: number;
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
  fromScale?: number;
  toScale?: number;
  fromRotation?: number;
  toRotation?: number;
  style?: React.CSSProperties;
  stayVisible?: boolean;
}

const FlyingElement: React.FC<FlyingElementProps> = ({
  children,
  startFrame,
  endFrame = 9999,
  fromX = 0,
  fromY = 100,
  toX = 0,
  toY = 0,
  fromScale = 0.8,
  toScale = 1,
  fromRotation = 0,
  toRotation = 0,
  style,
  stayVisible = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
    durationInFrames: 25,
  });

  const exitProgress =
    !stayVisible && frame > endFrame - 20
      ? interpolate(frame, [endFrame - 20, endFrame], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        })
      : 0;

  const x =
    interpolate(enterProgress, [0, 1], [fromX, toX]) - exitProgress * 100;
  const y =
    interpolate(enterProgress, [0, 1], [fromY, toY]) - exitProgress * 80;
  const scale =
    interpolate(enterProgress, [0, 1], [fromScale, toScale]) *
    (1 - exitProgress * 0.3);
  const rotation = interpolate(
    enterProgress,
    [0, 1],
    [fromRotation, toRotation],
  );
  const opacity =
    frame >= startFrame
      ? interpolate(enterProgress, [0, 0.2], [0, 1], {
          extrapolateRight: "clamp",
        }) *
        (1 - exitProgress)
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// Word Flipper - Words that flip/change in place
// ============================================
interface WordFlipperProps {
  words: string[];
  startFrame: number;
  frameDuration: number;
  style?: React.CSSProperties;
  fontSize?: number;
  color?: string;
}

const WordFlipper: React.FC<WordFlipperProps> = ({
  words,
  startFrame,
  frameDuration,
  style,
  fontSize = 80,
  color = COLORS.text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;
  if (localFrame < 0) return null;

  const currentIndex = Math.min(
    Math.floor(localFrame / frameDuration),
    words.length - 1,
  );
  const frameInWord = localFrame % frameDuration;

  const flipProgress = spring({
    frame: frameInWord,
    fps,
    config: { damping: 12, stiffness: 150 },
    durationInFrames: 12,
  });

  const scale = interpolate(flipProgress, [0, 0.5, 1], [0.7, 1.1, 1], {
    extrapolateRight: "clamp",
  });
  const rotateX = interpolate(flipProgress, [0, 1], [-90, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  const opacity = interpolate(flipProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontFamily: spaceGroteskFont,
        fontSize,
        fontWeight: 800,
        color,
        transform: `scale(${scale}) perspective(500px) rotateX(${rotateX}deg)`,
        opacity,
        textShadow: `0 0 40px ${COLORS.primary}60`,
        ...style,
      }}
    >
      {words[currentIndex]}
    </div>
  );
};

// ============================================
// Problem Cards - Fly in one by one
// ============================================
const ProblemCards: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const problems = [
    { icon: "📊", text: "Scattered Analytics", x: -280, y: -60 },
    { icon: "💳", text: "Multiple Payments", x: 280, y: -60 },
    { icon: "📧", text: "Separate Emails", x: -280, y: 60 },
    { icon: "🔗", text: "Disconnected Tools", x: 280, y: 60 },
  ];

  return (
    <>
      {problems.map((problem, i) => {
        const delay = i * 8;
        const cardStart = startFrame + delay;
        const cardEnd = endFrame;

        return (
          <FlyingElement
            key={i}
            startFrame={cardStart}
            endFrame={cardEnd}
            fromX={problem.x * 2}
            fromY={problem.y + 200}
            toX={problem.x}
            toY={problem.y}
            fromScale={0.5}
            toScale={1}
            fromRotation={problem.x > 0 ? 15 : -15}
            toRotation={0}
            stayVisible={false}
            style={{
              left: "50%",
              top: "50%",
              marginLeft: -100,
              marginTop: -30,
            }}
          >
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: 16,
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(239, 68, 68, 0.2)",
              }}
            >
              <span style={{ fontSize: 28 }}>{problem.icon}</span>
              <span
                style={{
                  fontFamily: outfitFont,
                  fontSize: 18,
                  fontWeight: 500,
                  color: COLORS.text,
                  whiteSpace: "nowrap",
                }}
              >
                {problem.text}
              </span>
            </div>
          </FlyingElement>
        );
      })}
    </>
  );
};

// ============================================
// Feature Cards - Fly in elegantly
// ============================================
const FeatureCards: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const features = [
    { icon: "🎨", title: "Digital Products", x: -300 },
    { icon: "📈", title: "Smart Analytics", x: 0 },
    { icon: "💰", title: "Built-in Payments", x: 300 },
  ];

  return (
    <>
      {features.map((feature, i) => {
        const delay = i * 10;
        return (
          <FlyingElement
            key={i}
            startFrame={startFrame + delay}
            endFrame={endFrame}
            fromX={feature.x}
            fromY={250}
            toX={feature.x}
            toY={80}
            fromScale={0.6}
            toScale={1}
            stayVisible={false}
            style={{
              left: "50%",
              top: "50%",
              marginLeft: -90,
              marginTop: -60,
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 24,
                padding: "28px 36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                minWidth: 180,
                boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${COLORS.primary}20`,
              }}
            >
              <span style={{ fontSize: 44 }}>{feature.icon}</span>
              <span
                style={{
                  fontFamily: spaceGroteskFont,
                  fontSize: 20,
                  fontWeight: 600,
                  color: COLORS.text,
                  textAlign: "center",
                }}
              >
                {feature.title}
              </span>
            </div>
          </FlyingElement>
        );
      })}
    </>
  );
};

// ============================================
// Browser Mockup Animation
// ============================================
const AnimatedBrowser: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 60 },
    durationInFrames: 35,
  });

  const exitProgress = interpolate(frame, [endFrame - 25, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const scale =
    interpolate(progress, [0, 1], [0.3, 0.65]) * (1 - exitProgress * 0.5);
  const y = interpolate(progress, [0, 1], [300, 40]) - exitProgress * 150;
  const rotateX = interpolate(progress, [0, 1], [30, 8]) + exitProgress * 20;
  const rotateY = interpolate(progress, [0, 1], [-20, -5]);
  const opacity =
    frame >= startFrame
      ? interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }) *
        (1 - exitProgress)
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translateY(${y}px) scale(${scale}) perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        opacity,
        transformStyle: "preserve-3d",
      }}
    >
      <Glow color={COLORS.primary} intensity={60}>
        <BrowserMockup
          url="superlinks.ai"
          browser="arc"
          theme="dark"
          width={1100}
          shadow
        >
          <Img src={SCREENSHOT_URL} style={{ width: "100%", height: "auto" }} />
        </BrowserMockup>
      </Glow>
    </div>
  );
};

// ============================================
// CTA Button with Glow
// ============================================
const CTAButton: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
    durationInFrames: 30,
  });

  const pulse = 1 + Math.sin((frame - startFrame) * 0.12) * 0.04;
  const glowPulse = 40 + Math.sin((frame - startFrame) * 0.1) * 15;

  const opacity =
    frame >= startFrame
      ? interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" })
      : 0;
  const y = interpolate(progress, [0, 1], [60, 0]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]) * pulse;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translateY(${80 + y}px) scale(${scale})`,
        opacity,
      }}
    >
      <Glow
        color={COLORS.primary}
        intensity={glowPulse}
        pulsate
        pulseDuration={2}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
            color: COLORS.text,
            fontFamily: outfitFont,
            fontSize: 26,
            fontWeight: 600,
            padding: "20px 56px",
            borderRadius: 9999,
            boxShadow: `0 0 60px ${COLORS.primary}80, 0 10px 40px rgba(0,0,0,0.4)`,
            cursor: "pointer",
          }}
        >
          Start for Free →
        </div>
      </Glow>
    </div>
  );
};

// ============================================
// Main Composition - Single Canvas Flow
// ============================================
export const Main: React.FC = () => {
  // Timeline (all on same canvas)
  const TIMELINE = {
    // Phase 1: Hook words (0-90)
    hookStart: 0,
    hookWords: 90,

    // Phase 2: Subtext (60-150)
    subtextStart: 60,
    subtextEnd: 150,

    // Phase 3: Problem (120-240)
    problemTitleStart: 120,
    problemTitleEnd: 200,
    problemCardsStart: 150,
    problemCardsEnd: 260,

    // Phase 4: Solution transition (230-400)
    solutionTitleStart: 240,
    solutionTitleEnd: 320,
    browserStart: 280,
    browserEnd: 420,

    // Phase 5: Features (380-520)
    featuresTitleStart: 400,
    featuresTitleEnd: 480,
    featureCardsStart: 430,
    featureCardsEnd: 540,

    // Phase 6: Magic/AI moment (500-620)
    magicStart: 520,
    magicEnd: 640,
    aiTextStart: 550,
    aiTextEnd: 630,

    // Phase 7: Tagline (600-720)
    taglineStart: 620,
    taglineEnd: 750,

    // Phase 8: CTA (700+)
    logoStart: 700,
    ctaStart: 730,
    subCtaStart: 760,
  };

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.background, overflow: "hidden" }}
    >
      {/* Base animated gradient - always present */}
      <FourColorGradient
        topLeft={COLORS.primary}
        topRight="#FF8C66"
        bottomLeft="#1a1a2e"
        bottomRight={COLORS.background}
        animate
        animationType="shift"
        speed={0.3}
        style={{ opacity: 0.35 }}
      />

      {/* Floating particles - always present */}
      <Particles
        count={40}
        colors={[COLORS.primary, COLORS.accent, "#FFD700"]}
        size={[2, 6]}
        speed={0.4}
        type="dust"
        style={{ opacity: 0.5 }}
      />

      {/* Camera wrapper for subtle movement */}
      <Camera wiggle={0.012} wiggleSpeed={0.3}>
        <AbsoluteFill>
          {/* ==================== PHASE 1: Hook ==================== */}
          {/* Main hook words that flip */}
          <FlyingElement
            startFrame={TIMELINE.hookStart}
            endFrame={TIMELINE.hookWords + 30}
            fromY={50}
            toY={0}
            fromScale={0.9}
            stayVisible={false}
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <WordFlipper
              words={["Create.", "Launch.", "Monetize.", "Superlinks."]}
              startFrame={TIMELINE.hookStart + 10}
              frameDuration={22}
              fontSize={120}
              color={COLORS.text}
              style={{ textAlign: "center" }}
            />
          </FlyingElement>

          {/* ==================== PHASE 2: Subtext ==================== */}
          <FlyingText
            startFrame={TIMELINE.subtextStart}
            endFrame={TIMELINE.subtextEnd}
            direction="up"
            style={{ left: "50%", top: "58%", transform: "translateX(-50%)" }}
          >
            <div
              style={{
                fontFamily: spaceGroteskFont,
                fontSize: 48,
                fontWeight: 600,
                color: COLORS.text,
                textAlign: "center",
              }}
            >
              With <span style={{ color: COLORS.primary }}>Zero Code</span>{" "}
              Required
            </div>
          </FlyingText>

          <FlyingText
            startFrame={TIMELINE.subtextStart + 15}
            endFrame={TIMELINE.subtextEnd}
            direction="up"
            style={{ left: "50%", top: "68%", transform: "translateX(-50%)" }}
          >
            <div
              style={{
                fontFamily: outfitFont,
                fontSize: 24,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              AI-powered platform for creators
            </div>
          </FlyingText>

          {/* ==================== PHASE 3: Problem ==================== */}
          <FlyingText
            startFrame={TIMELINE.problemTitleStart}
            endFrame={TIMELINE.problemTitleEnd}
            direction="down"
            style={{ left: "50%", top: "28%", transform: "translateX(-50%)" }}
          >
            <div
              style={{
                fontFamily: spaceGroteskFont,
                fontSize: 52,
                fontWeight: 700,
                color: COLORS.text,
                textAlign: "center",
              }}
            >
              Still juggling{" "}
              <span style={{ color: COLORS.error }}>10+ tools</span>?
            </div>
          </FlyingText>

          <ProblemCards
            startFrame={TIMELINE.problemCardsStart}
            endFrame={TIMELINE.problemCardsEnd}
          />

          {/* ==================== PHASE 4: Solution ==================== */}
          <FlyingText
            startFrame={TIMELINE.solutionTitleStart}
            endFrame={TIMELINE.solutionTitleEnd}
            direction="left"
            exitDirection="up"
            style={{ left: "50%", top: "22%", transform: "translateX(-50%)" }}
          >
            <div
              style={{
                fontFamily: spaceGroteskFont,
                fontSize: 56,
                fontWeight: 700,
                color: COLORS.text,
                textAlign: "center",
              }}
            >
              Everything in{" "}
              <span style={{ color: COLORS.primary }}>One Place</span>
            </div>
          </FlyingText>

          <AnimatedBrowser
            startFrame={TIMELINE.browserStart}
            endFrame={TIMELINE.browserEnd}
          />

          {/* ==================== PHASE 5: Features ==================== */}
          <FlyingText
            startFrame={TIMELINE.featuresTitleStart}
            endFrame={TIMELINE.featuresTitleEnd}
            direction="right"
            style={{ left: "50%", top: "20%", transform: "translateX(-50%)" }}
          >
            <div
              style={{
                fontFamily: spaceGroteskFont,
                fontSize: 48,
                fontWeight: 700,
                color: COLORS.text,
              }}
            >
              Built for <span style={{ color: COLORS.primary }}>Creators</span>
            </div>
          </FlyingText>

          <FeatureCards
            startFrame={TIMELINE.featureCardsStart}
            endFrame={TIMELINE.featureCardsEnd}
          />

          {/* ==================== PHASE 6: AI/Magic ==================== */}
          <FlyingText
            startFrame={TIMELINE.aiTextStart}
            endFrame={TIMELINE.aiTextEnd}
            direction="up"
            style={{ left: "50%", top: "45%", transform: "translateX(-50%)" }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: spaceGroteskFont,
                  fontSize: 72,
                  fontWeight: 800,
                  color: COLORS.text,
                  textShadow: `0 0 60px ${COLORS.primary}80`,
                }}
              >
                Powered by <span style={{ color: COLORS.primary }}>AI</span>
              </div>
              <div
                style={{
                  fontFamily: outfitFont,
                  fontSize: 28,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 16,
                }}
              >
                Build smarter. Launch faster.
              </div>
            </div>
          </FlyingText>

          {/* ==================== PHASE 7: Tagline ==================== */}
          <FlyingElement
            startFrame={TIMELINE.taglineStart}
            endFrame={TIMELINE.taglineEnd}
            fromY={100}
            toY={-60}
            fromScale={0.8}
            stayVisible={false}
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <TextAnimation
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "words" });
                tl.from(split.words, {
                  opacity: 0,
                  y: 60,
                  rotateX: -90,
                  stagger: 0.1,
                  duration: 0.6,
                  ease: "back.out(1.5)",
                });
                return tl;
              }}
              style={{
                fontFamily: spaceGroteskFont,
                fontSize: 64,
                fontWeight: 800,
                color: COLORS.text,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Turn Your Knowledge
              <br />
              <span style={{ color: COLORS.primary }}>Into Income</span>
            </TextAnimation>
          </FlyingElement>

          {/* ==================== PHASE 8: CTA ==================== */}
          {/* Logo */}
          <FlyingElement
            startFrame={TIMELINE.logoStart}
            fromY={-80}
            toY={-140}
            fromScale={0.7}
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                fontFamily: spaceGroteskFont,
                fontSize: 64,
                fontWeight: 800,
                color: COLORS.text,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: COLORS.primary }}>Super</span>
              <span>links</span>
              <span style={{ color: COLORS.primary, fontSize: 42 }}>.ai</span>
            </div>
          </FlyingElement>

          {/* CTA Button */}
          <CTAButton startFrame={TIMELINE.ctaStart} />

          {/* Sub-CTA text */}
          <FlyingText
            startFrame={TIMELINE.subCtaStart}
            endFrame={9999}
            direction="up"
            stayVisible
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, 160px)",
            }}
          >
            <div
              style={{
                fontFamily: outfitFont,
                fontSize: 18,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              No credit card required • Cancel anytime
            </div>
          </FlyingText>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
