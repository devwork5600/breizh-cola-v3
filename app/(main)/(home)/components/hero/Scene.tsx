"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Group } from "three";

import { CanLighting } from "@/components/experience/cans/CanLighting";
import FloatingCan from "@/components/experience/cans/FloatingCan";
import { useAnimationStore } from "@/store/useAnimationStore";
import { useBubbleStore } from "@/store/useBubbleStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";

import { HERO_CONFIG } from "./heroConfig";

gsap.registerPlugin(ScrollTrigger);

export default function Scene({ onReady }: { onReady?: () => void }) {
  const groupRef = useRef<Group>(null);
  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can3Ref = useRef<Group>(null);

  // Driven by ResponsiveProvider's gsap.matchMedia(), which keeps
  // `breakpoint` in lockstep with the same media queries Tailwind's CSS
  // classes use (rather than a manually-diffed innerWidth reading), and
  // ticks `resizeCount` on every raw resize so this effect can force a full
  // rebuild even within one breakpoint bucket.
  const breakpoint = useResponsiveStore((s) => s.breakpoint);
  const resizeCount = useResponsiveStore((s) => s.resizeCount);
  const config = HERO_CONFIG[breakpoint];

  const createIntroTimeline = useAnimationStore((s) => s.createIntroTimeline);
  const introPlayed = useAnimationStore((s) => s.introPlayed);
  const setBubblesPlaying = useBubbleStore((s) => s.setPlaying);

  const [ready, setReady] = useState(false);
  const introQueuedRef = useRef(false);

  // Runs synchronously before paint, outside any GSAP context, purely to
  // hide all 3 cans at their untouched R3F defaults for the one frame
  // before the effect below (gated on `ready`) gets to position them -
  // otherwise that default pose flashes on screen first.
  useLayoutEffect(() => {
    can1Ref.current?.scale.set(0, 0, 0);
    can2Ref.current?.scale.set(0, 0, 0);
    can3Ref.current?.scale.set(0, 0, 0);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    onReady?.();
    return () => cancelAnimationFrame(raf);
  }, [onReady]);

  // Single effect owning can1/can2/can3's intro + scroll choreography,
  // mirroring the reference project's Scene.tsx structure: everything - the
  // intro/return-visit positioning AND the scroll-scrub - lives in one
  // useGSAP, and can1/can2/can3/group-rotation all scrub on the *same*
  // timeline. Splitting can1 onto its own separate ScrollTrigger (an
  // earlier version of this file did, to solve a "from" capture timing
  // issue) meant two independently-smoothed scrub instances (scrub: 1 on
  // each) driving what's meant to look like one composition - each drifts
  // by a slightly different amount during a fast scroll reversal, so the
  // cans visibly fall out of sync with each other on the way back up. One
  // shared timeline can't desync from itself.
  useGSAP(
    () => {
      if (!ready || !can1Ref.current || !can2Ref.current || !can3Ref.current) {
        return;
      }

      // Defensive cleanup matching the reference: useGSAP's context revert
      // kills whatever *this* run of the effect created, but explicitly
      // killing anything still tied to ".hero" first guarantees no stray
      // ScrollTrigger from an earlier build can keep driving these cans
      // alongside the fresh one.
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === ".hero") t.kill();
      });

      gsap.set(can2Ref.current.position, {
        ...config.scrollCan2.from.position,
      });
      gsap.set(can2Ref.current.scale, {
        x: config.scrollCan2.from.scale,
        y: config.scrollCan2.from.scale,
        z: config.scrollCan2.from.scale,
      });
      gsap.set(can3Ref.current.position, {
        ...config.scrollCan3.from.position,
      });
      gsap.set(can3Ref.current.scale, {
        x: config.scrollCan3.from.scale,
        y: config.scrollCan3.from.scale,
        z: config.scrollCan3.from.scale,
      });

      if (groupRef.current) {
        gsap.set(groupRef.current.rotation, { y: 0 });
      }

      if (introPlayed) {
        gsap.set(can1Ref.current.position, { ...config.finalCan1.position });
        gsap.set(can1Ref.current.scale, {
          x: config.finalCan1.scale,
          y: config.finalCan1.scale,
          z: config.finalCan1.scale,
        });
      } else if (!introQueuedRef.current) {
        // Guarded so this only ever runs once per page load. Without the
        // guard, a resize firing (resizeCount ticks on every one, not just
        // breakpoint crossings) before the intro's ~1s tween has finished
        // re-enters this branch while introPlayed is still false and
        // queues ANOTHER copy of these tweens onto the *same* shared,
        // already-playing timeline (createIntroTimeline() memoizes the
        // timeline, not its content) - stacking a second, contradictory
        // move-to-target after the first instead of replacing it. Once
        // introPlayed flips true the branch above re-syncs everything to
        // the current breakpoint anyway.
        introQueuedRef.current = true;

        gsap.set(can1Ref.current.position, {
          ...config.introCan1.from.position,
        });
        gsap.set(can1Ref.current.scale, {
          x: config.introCan1.from.scale,
          y: config.introCan1.from.scale,
          z: config.introCan1.from.scale,
        });

        const tl = createIntroTimeline();
        tl.to(can1Ref.current.position, {
          ...config.introCan1.to.position,
          duration: 1,
          ease: "back.out(1.4)",
        });
        if (config.introCan1.to.rotation) {
          tl.to(
            can1Ref.current.rotation,
            {
              ...config.introCan1.to.rotation,
              duration: 1,
              ease: "back.out(1.4)",
            },
            "<"
          );
        }

        // Bubbles only autostart the first time the intro actually plays -
        // a return visit within the session skips straight to the resting
        // state above and leaves them off until the user hits "Bulles".
        tl.call(() => setBubblesPlaying(true));
      }

      // The scroll scrub only gets built once can1's resting position is
      // actually known (return visit, set above) or settled by the intro
      // tween completing (which flips `introPlayed` and re-triggers this
      // effect via the dependency array). Building it any earlier would
      // make GSAP capture can1's "from" off its untouched default position
      // instead of where it visually ends up.
      if (introPlayed) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom 10%",
            scrub: 1,
            // invalidateOnRefresh deliberately left off: it would make
            // GSAP re-capture every tween's "from" on every refresh(), not
            // just this build's first render - including refreshes that
            // fire later while the user is mid-scroll. That re-anchors the
            // scrub to whatever in-between value a property had at that
            // moment instead of the deliberate per-breakpoint start set
            // via gsap.set() above. The gsap.set() calls already guarantee
            // a correct "from" the moment this fresh timeline is built;
            // nothing after that should be allowed to move it.
          },
        });

        if (groupRef.current) {
          scrollTl.to(
            groupRef.current.rotation,
            { y: config.scrollGroupRotationY },
            0
          );
        }

        scrollTl.to(
          can1Ref.current.position,
          { ...config.scrollCan1.position },
          0
        );
        if (config.scrollCan1.rotation) {
          scrollTl.to(
            can1Ref.current.rotation,
            { ...config.scrollCan1.rotation },
            0
          );
        }

        scrollTl.to(
          can2Ref.current.position,
          { ...config.scrollCan2.to.position },
          0
        );
        if (config.scrollCan2.to.rotation) {
          scrollTl.to(
            can2Ref.current.rotation,
            { ...config.scrollCan2.to.rotation },
            0
          );
        }
        if (config.scrollCan2.to.scale) {
          const s = config.scrollCan2.to.scale;
          scrollTl.to(can2Ref.current.scale, { x: s, y: s, z: s }, 0);
        }

        scrollTl.to(
          can3Ref.current.position,
          { ...config.scrollCan3.to.position },
          0
        );
        if (config.scrollCan3.to.rotation) {
          scrollTl.to(
            can3Ref.current.rotation,
            { ...config.scrollCan3.to.rotation },
            0
          );
        }
        if (config.scrollCan3.to.scale) {
          const s = config.scrollCan3.to.scale;
          scrollTl.to(can3Ref.current.scale, { x: s, y: s, z: s }, 0);
        }
      }

      // A breakpoint change swaps in new transform targets above, but the
      // ScrollTrigger's own start/end (computed in pixels against the
      // pre-resize layout) doesn't recompute on its own - refresh forces
      // that, otherwise the scrub reads progress against stale boundaries
      // and renders a mix of the old and new breakpoint's positions.
      ScrollTrigger.refresh();
    },
    { dependencies: [ready, breakpoint, introPlayed, resizeCount] }
  );

  return (
    <group ref={groupRef}>
      <FloatingCan ref={can1Ref} flavor="original" />
      <FloatingCan ref={can2Ref} flavor="zero" floatSpeed={0.9} />
      <FloatingCan ref={can3Ref} flavor="coffee" floatSpeed={1.1} />
      <CanLighting />
    </group>
  );
}
