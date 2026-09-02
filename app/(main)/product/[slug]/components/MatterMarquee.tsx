"use client";

import Matter from "matter-js";
import { useCallback, useEffect, useRef, useState } from "react";

import { Breakpoint } from "@/lib/useBreakpoint";
import { useResponsiveStore } from "@/store/useResponsiveStore";

// Responsive radius scale factors by breakpoint.
const RADIUS_SCALE_FACTORS: Record<Breakpoint, number> = {
  xs: 8,
  sm: 8,
  md: 6,
  lg: 6,
  xl: 5.5,
  xxl: 4,
};

// The two cannons are smaller than the original single one; bubbles are
// scaled to match.
const CANNON_SCALE = 0.98;

// Resting bodies always sit with a few pixels of steady-state penetration
// into whatever they're resting on - that's inherent to how the solver
// settles a body under continuous gravity, not something iteration counts
// fix. With the floor's top edge exactly at the canvas/container's bottom
// clip line, that penetration was rendered off-canvas, cutting off the
// bottom of resting sprites. Raising the floor by this many pixels keeps
// the penetration within the visible area instead.
const FLOOR_INSET = 10;

// can-zero.png and can-coffee.png are straightened and cropped tight to
// their opaque pixels, so the collider can match the rendered box almost
// exactly. Kept just under 1.0 so anti-aliased edge pixels from the crop
// don't tip it into overflow.
const CAN_BODY = {
  widthFraction: 0.99,
  heightFraction: 0.99,
  yCenterFraction: 0.5,
};

// Flip on to render every collider (cans in green, sticker balls in yellow)
// over the actual art, to visually check the fit instead of inferring it
// from resting positions. Ball colliders need a separate afterRender draw
// (see the render effect below) since matter-js's sprite branch and its
// wireframe/stroke branch are mutually exclusive - a body with a sprite
// never gets an outline from the renderer itself.
const DEBUG_SHOW_COLLIDERS = false;

const buildCanBody = (rectCan: DOMRect, sceneRect: DOMRect) => {
  const left = rectCan.left - sceneRect.left;
  const top = rectCan.top - sceneRect.top;
  const centerX = left + rectCan.width / 2;
  const centerY = top + CAN_BODY.yCenterFraction * rectCan.height;

  return Matter.Bodies.rectangle(
    centerX,
    centerY,
    CAN_BODY.widthFraction * rectCan.width,
    CAN_BODY.heightFraction * rectCan.height,
    {
      isStatic: true,
      render: DEBUG_SHOW_COLLIDERS
        ? {
            visible: true,
            fillStyle: "rgba(0, 255, 0, 0.35)",
            strokeStyle: "#00ff00",
            lineWidth: 2,
          }
        : { visible: false },
    }
  );
};

export default function MatterMarquee() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canLeftRef = useRef<HTMLDivElement>(null);
  const canRightRef = useRef<HTMLDivElement>(null);
  const buttonLeftRef = useRef<HTMLButtonElement>(null);
  const buttonRightRef = useRef<HTMLButtonElement>(null);

  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const wallRefsRef = useRef<Matter.Body[]>([]);
  const canBodyLeftRef = useRef<Matter.Body | null>(null);
  const canBodyRightRef = useRef<Matter.Body | null>(null);
  // The rect each can body was last built from, so the resize handler can
  // skip rebuilding it when a ResizeObserver tick fires but the can's own
  // box didn't actually change size or position.
  const canRectLeftRef = useRef<DOMRect | null>(null);
  const canRectRightRef = useRef<DOMRect | null>(null);
  const buttonBodyLeftRef = useRef<Matter.Body | null>(null);
  const buttonBodyRightRef = useRef<Matter.Body | null>(null);
  const firingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFiringRef = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [isFull, setIsFull] = useState(false);

  const breakpoint = useResponsiveStore((s) => s.breakpoint);
  // Deliberately not memoized on [] like most getters here: a new function
  // identity per breakpoint is what re-triggers the init effect below and
  // rebuilds the engine from scratch on a breakpoint change, clearing out
  // any balls that were fired - matching the reference's reset-on-resize
  // behavior instead of just repositioning the walls/cans in place.
  const getRadiusScale = useCallback(
    () => RADIUS_SCALE_FACTORS[breakpoint] ?? RADIUS_SCALE_FACTORS.sm,
    [breakpoint]
  );

  const sponsorImages = [
    "/sponsorts/music/t1.png",
    "/sponsorts/music/t2.png",
    "/sponsorts/music/t3.png",
    "/sponsorts/music/t4.png",
    "/sponsorts/music/t5.png",
    "/sponsorts/music/t6.png",
    "/sponsorts/music/t7.png",
    "/sponsorts/music/t8.png",
  ];

  const originalImageSize = 200;

  // 1. PRELOAD ALL ASSETS (Sponsors + Can) with error handling and timeout
  useEffect(() => {
    const assets = [...sponsorImages, "/can-zero.png", "/can-coffee.png"];
    let loadedCount = 0;
    let mounted = true;

    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn("Image loading timeout - proceeding anyway");
        setLoaded(true);
      }
    }, 5000);

    const promises = assets.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loadedCount++;
            if (mounted && loadedCount === assets.length) {
              clearTimeout(timeout);
              setLoaded(true);
            }
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            loadedCount++;
            if (mounted && loadedCount === assets.length) {
              clearTimeout(timeout);
              setLoaded(true);
            }
            resolve();
          };
        })
    );

    Promise.all(promises);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. FIRE CANNON LOGIC with proper interval management
  const fireCannon = useCallback(
    (side: "left" | "right") => {
      const canRef = side === "left" ? canLeftRef : canRightRef;

      if (
        isFiringRef.current ||
        !engineRef.current ||
        !sceneRef.current ||
        !canRef.current ||
        !loaded ||
        isFull
      )
        return;

      isFiringRef.current = true;

      const engine = engineRef.current;
      const scene = sceneRef.current;
      const sceneRect = scene.getBoundingClientRect();

      const rect = canRef.current.getBoundingClientRect();
      const baseX = rect.left - sceneRect.left + rect.width / 2;
      const baseY = rect.top - sceneRect.top + 10;

      const total = 8;
      const spreadDeg = 25;
      const baseAngleDeg = -90;
      const speedFactor =
        Math.min(scene.offsetWidth, scene.offsetHeight) * 0.012;
      const radius =
        scene.offsetWidth * 0.007 * getRadiusScale() * CANNON_SCALE;

      let count = 0;

      firingIntervalRef.current = setInterval(() => {
        const maxBodies = 40;
        const currentBodies = engine.world.bodies.filter(
          (body) => !body.isStatic
        ).length;

        if (currentBodies >= maxBodies) {
          setIsFull(true);
          if (firingIntervalRef.current) {
            clearInterval(firingIntervalRef.current);
            firingIntervalRef.current = null;
          }
          isFiringRef.current = false;
          return;
        }

        if (count >= total) {
          if (firingIntervalRef.current) {
            clearInterval(firingIntervalRef.current);
            firingIntervalRef.current = null;
          }
          isFiringRef.current = false;
          return;
        }

        const angleDeg =
          baseAngleDeg + (Math.random() * spreadDeg * 2 - spreadDeg);
        const angleRad = (angleDeg * Math.PI) / 180;

        const velocity = {
          x: Math.cos(angleRad) * speedFactor,
          y: Math.sin(angleRad) * speedFactor,
        };

        const image =
          sponsorImages[Math.floor(Math.random() * sponsorImages.length)];

        const circle = Matter.Bodies.circle(baseX, baseY, radius, {
          restitution: 0.6,
          friction: 0.05,
          frictionAir: 0.03,
          density: 0.1,
          render: {
            sprite: {
              texture: image,
              xScale: (radius * 2) / originalImageSize,
              yScale: (radius * 2) / originalImageSize,
            },
          },
        });

        Matter.Body.setVelocity(circle, velocity);
        Matter.Body.setAngularVelocity(circle, (Math.random() - 0.5) * 0.3);
        Matter.World.add(engine.world, circle);

        count++;
      }, 60);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded, getRadiusScale, isFull]
  );

  // 3. INIT MATTER ENGINE
  useEffect(() => {
    if (!loaded) return;

    const initMatter = () => {
      window.requestAnimationFrame(() => {
        const scene = sceneRef.current;
        const canLeft = canLeftRef.current;
        const canRight = canRightRef.current;
        const btnLeft = buttonLeftRef.current;
        const btnRight = buttonRightRef.current;

        if (!scene || !canLeft || !canRight) return;

        const width = scene.offsetWidth;
        const height = scene.offsetHeight;
        const sceneRect = scene.getBoundingClientRect();

        if (engineRef.current) {
          Matter.Render.stop(renderRef.current!);
          Matter.Runner.stop(runnerRef.current!);
          Matter.World.clear(engineRef.current.world, false);
          Matter.Engine.clear(engineRef.current);
          renderRef.current?.canvas.remove();
        }

        const engine = Matter.Engine.create();
        engine.positionIterations = 4;
        engine.velocityIterations = 3;
        engine.gravity.y = 1.5;
        engineRef.current = engine;

        const render = Matter.Render.create({
          element: scene,
          engine,
          options: {
            width,
            height,
            wireframes: false,
            background: "transparent",
          },
        });

        renderRef.current = render;
        Matter.Render.run(render);

        if (DEBUG_SHOW_COLLIDERS) {
          Matter.Events.on(render, "afterRender", () => {
            const ctx = render.context;
            ctx.save();
            ctx.strokeStyle = "#ffff00";
            ctx.lineWidth = 2;
            for (const body of engine.world.bodies) {
              if (body.isStatic) continue;
              for (const part of body.parts) {
                if (!part.circleRadius) continue;
                ctx.beginPath();
                ctx.arc(
                  part.position.x,
                  part.position.y,
                  part.circleRadius,
                  0,
                  2 * Math.PI
                );
                ctx.stroke();
              }
            }
            ctx.restore();
          });
        }

        const runner = Matter.Runner.create();
        runnerRef.current = runner;
        Matter.Runner.run(runner, engine);

        const wallOptions = { isStatic: true, render: { visible: false } };
        const walls = [
          Matter.Bodies.rectangle(
            width / 2,
            height + 25 - FLOOR_INSET,
            width,
            50,
            wallOptions
          ),
          Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions),
          Matter.Bodies.rectangle(
            width + 25,
            height / 2,
            50,
            height,
            wallOptions
          ),
          Matter.Bodies.rectangle(width / 2, -25, width, 50, wallOptions),
        ];
        wallRefsRef.current = walls;
        Matter.World.add(engine.world, walls);

        const canBodies: Matter.Body[] = [];
        [
          { can: canLeft, bodyRef: canBodyLeftRef, rectRef: canRectLeftRef },
          {
            can: canRight,
            bodyRef: canBodyRightRef,
            rectRef: canRectRightRef,
          },
        ].forEach(({ can, bodyRef, rectRef }) => {
          const rectCan = can.getBoundingClientRect();
          if (rectCan.width > 0) {
            const canBody = buildCanBody(rectCan, sceneRect);
            bodyRef.current = canBody;
            rectRef.current = rectCan;
            canBodies.push(canBody);
          }
        });
        Matter.World.add(engine.world, canBodies);

        const buttonBodies: Matter.Body[] = [];
        [
          { btn: btnLeft, bodyRef: buttonBodyLeftRef },
          { btn: btnRight, bodyRef: buttonBodyRightRef },
        ].forEach(({ btn, bodyRef }) => {
          if (!btn) return;
          const rect = btn.getBoundingClientRect();
          const body = Matter.Bodies.rectangle(
            rect.left - sceneRect.left + rect.width / 2,
            rect.top - sceneRect.top + rect.height / 2,
            rect.width,
            rect.height,
            { isStatic: true, render: { visible: false } }
          );
          bodyRef.current = body;
          buttonBodies.push(body);
        });
        Matter.World.add(engine.world, buttonBodies);
      });
    };

    initMatter();

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (
          !sceneRef.current ||
          !engineRef.current ||
          !renderRef.current ||
          !wallRefsRef.current.length
        )
          return;

        const width = sceneRef.current.offsetWidth;
        const height = sceneRef.current.offsetHeight;
        const sceneRect = sceneRef.current.getBoundingClientRect();

        renderRef.current.canvas.width = width;
        renderRef.current.canvas.height = height;
        renderRef.current.options.width = width;
        renderRef.current.options.height = height;

        if (wallRefsRef.current.length === 4) {
          const [floor, left, right, ceiling] = wallRefsRef.current;

          Matter.Body.setPosition(floor, {
            x: width / 2,
            y: height + 25 - FLOOR_INSET,
          });
          Matter.Body.scale(
            floor,
            width / (floor.bounds.max.x - floor.bounds.min.x),
            1
          );

          Matter.Body.setPosition(left, { x: -25, y: height / 2 });
          Matter.Body.scale(
            left,
            1,
            height / (left.bounds.max.y - left.bounds.min.y)
          );

          Matter.Body.setPosition(right, { x: width + 25, y: height / 2 });
          Matter.Body.scale(
            right,
            1,
            height / (right.bounds.max.y - right.bounds.min.y)
          );

          Matter.Body.setPosition(ceiling, { x: width / 2, y: -25 });
          Matter.Body.scale(
            ceiling,
            width / (ceiling.bounds.max.x - ceiling.bounds.min.x),
            1
          );
        }

        // Can bodies are rebuilt from scratch rather than scaled in place,
        // simpler than reasoning about Body.scale's effect on a rectangle
        // relative to its own center. Skipped entirely when the can's rect
        // hasn't actually changed, so a ResizeObserver tick that doesn't
        // affect these elements (e.g. mobile viewport chrome show/hide)
        // doesn't pay for two rebuilds.
        [
          {
            bodyRef: canBodyLeftRef,
            elRef: canLeftRef,
            rectRef: canRectLeftRef,
          },
          {
            bodyRef: canBodyRightRef,
            elRef: canRightRef,
            rectRef: canRectRightRef,
          },
        ].forEach(({ bodyRef, elRef, rectRef }) => {
          if (!bodyRef.current || !elRef.current || !engineRef.current) return;

          const rectCan = elRef.current.getBoundingClientRect();
          const prevRect = rectRef.current;
          if (
            prevRect &&
            Math.abs(prevRect.width - rectCan.width) < 0.5 &&
            Math.abs(prevRect.height - rectCan.height) < 0.5 &&
            Math.abs(prevRect.left - rectCan.left) < 0.5 &&
            Math.abs(prevRect.top - rectCan.top) < 0.5
          ) {
            return;
          }

          Matter.World.remove(engineRef.current.world, bodyRef.current);
          const newBody = buildCanBody(rectCan, sceneRect);
          Matter.World.add(engineRef.current.world, newBody);
          bodyRef.current = newBody;
          rectRef.current = rectCan;
        });

        [
          { bodyRef: buttonBodyLeftRef, elRef: buttonLeftRef },
          { bodyRef: buttonBodyRightRef, elRef: buttonRightRef },
        ].forEach(({ bodyRef, elRef }) => {
          if (!bodyRef.current || !elRef.current) return;

          const rect = elRef.current.getBoundingClientRect();
          const currentWidth =
            bodyRef.current.bounds.max.x - bodyRef.current.bounds.min.x;
          const currentHeight =
            bodyRef.current.bounds.max.y - bodyRef.current.bounds.min.y;

          if (currentWidth !== rect.width || currentHeight !== rect.height) {
            Matter.Body.scale(
              bodyRef.current,
              rect.width / currentWidth,
              rect.height / currentHeight
            );
          }
          Matter.Body.setPosition(bodyRef.current, {
            x: rect.left - sceneRect.left + rect.width / 2,
            y: rect.top - sceneRect.top + rect.height / 2,
          });
        });
      }, 250);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (sceneRef.current) resizeObserver.observe(sceneRef.current);

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      if (firingIntervalRef.current) {
        clearInterval(firingIntervalRef.current);
      }
      if (engineRef.current) {
        Matter.Render.stop(renderRef.current!);
        Matter.Runner.stop(runnerRef.current!);
        renderRef.current?.canvas.remove();
      }
    };
  }, [loaded, getRadiusScale]);

  return (
    <div className="relative z-999 flex h-[70vh] w-full justify-center overflow-hidden bg-transparent lg:h-screen">
      <button
        ref={buttonLeftRef}
        disabled={!loaded || isFull}
        className={`text-secondary bg-primary font-poppins border-secondary absolute top-[48%] left-1/6 z-50 -translate-x-1/2 -rotate-3 skew-x-3 rounded-md border-2 px-[1.05rem] py-[0.7rem] text-[1.05rem] font-semibold uppercase transition-opacity sm:px-[1.4rem] sm:py-[0.7rem] sm:text-[1.225rem] lg:text-[1.4rem] ${!loaded || isFull ? "opacity-50" : "opacity-100"} whitespace-nowrap`}
        onClick={() => fireCannon("left")}
      >
        {!loaded ? "Loading..." : isFull ? "empty" : "Open"}
      </button>
      <button
        ref={buttonRightRef}
        disabled={!loaded || isFull}
        className={`text-secondary bg-primary font-poppins border-secondary absolute top-[58%] left-5/6 z-50 -translate-x-1/2 rotate-2 skew-x-3 rounded-md border-2 px-[1.05rem] py-[0.7rem] text-[1.05rem] font-semibold uppercase transition-opacity sm:px-[1.4rem] sm:py-[0.7rem] sm:text-[1.225rem] lg:text-[1.4rem] ${!loaded || isFull ? "opacity-50" : "opacity-100"} whitespace-nowrap`}
        onClick={() => fireCannon("right")}
      >
        {!loaded ? "Loading..." : isFull ? "empty" : "Open"}
      </button>

      <div
        ref={sceneRef}
        className="pointer-events-none absolute inset-0 z-10"
      />

      <div
        ref={canLeftRef}
        className="pointer-events-none absolute bottom-0 left-1/3 z-20 -translate-x-1/2 transform"
      >
        <img
          src="/can-zero.png"
          className="block w-28 sm:w-39 lg:w-50 xl:w-56 2xl:w-59"
          alt="Canette Breizh Cola Zéro"
        />
      </div>
      <div
        ref={canRightRef}
        className="pointer-events-none absolute bottom-0 left-2/3 z-20 -translate-x-1/2 transform"
      >
        <img
          src="/can-coffee.png"
          className="block w-28 sm:w-39 lg:w-50 xl:w-56 2xl:w-59"
          alt="Canette Breizh Cola Coffee"
        />
      </div>
    </div>
  );
}
