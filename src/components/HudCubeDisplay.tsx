import { BiBriefcase as Briefcase, BiMapPin as MapPin } from 'react-icons/bi';
import { BsMailbox as Mail } from 'react-icons/bs';
import * as THREE from 'three';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { developerProfile } from '../utils/developerData';

interface MaterialColors {
  primary: string;
  glow: string;
  bg: string;
}

function RubiksCubeCore({ colors }: { colors: MaterialColors }) {
  const size = 5.6;
  const segmentSize = size / 3;
  const spacingOffset = 0.04;

  const blocks = useMemo(() => {
    const coords = [-1, 0, 1];
    const grid: [number, number, number][] = [];
    coords.forEach((x) => {
      coords.forEach((y) => {
        coords.forEach((z) => {
          grid.push([x, y, z]);
        });
      });
    });
    return grid;
  }, []);

  const materials = useMemo(() => {
    // Avoid processing unparsed fallback variable placeholders
    const baseBg = colors.bg.startsWith('var') ? '#0d1b30' : colors.bg;
    const basePrimary = colors.primary.startsWith('var')
      ? '#67e8f9'
      : colors.primary;

    const meshColor = new THREE.Color(baseBg).clone().multiplyScalar(0.4);
    const emissiveColor = new THREE.Color(baseBg);
    const specularColor = new THREE.Color(basePrimary);
    const lineColor = new THREE.Color(basePrimary);

    return { meshColor, emissiveColor, specularColor, lineColor };
  }, [colors]);

  return (
    <group>
      {blocks.map((pos, idx) => (
        <mesh
          key={idx}
          position={[
            pos[0] * (segmentSize + spacingOffset),
            pos[1] * (segmentSize + spacingOffset),
            pos[2] * (segmentSize + spacingOffset),
          ]}
        >
          <boxGeometry args={[segmentSize, segmentSize, segmentSize]} />
          <meshPhongMaterial
            color={materials.meshColor}
            emissive={materials.emissiveColor}
            specular={materials.specularColor}
            shininess={80}
            transparent
            opacity={0.88}
          />
          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.BoxGeometry(segmentSize, segmentSize, segmentSize),
              ]}
            />
            <lineBasicMaterial
              color={materials.lineColor}
              transparent
              opacity={0.35}
            />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
}

function SpinningCube() {
  const cubeRef = useRef<THREE.Group>(null!);
  const [isPaused, setIsPaused] = useState(false);

  // Use structural tokens directly as layout defaults to avoid erratic state jumps
  const [themeColors, setThemeColors] = useState<MaterialColors>({
    primary: 'var(--hud-primary)',
    glow: 'var(--hud-glow)',
    bg: 'var(--hud-bg)',
  });

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue('--hud-primary').trim();
    const glowColor = rootStyle.getPropertyValue('--hud-glow').trim();
    const bgColor = rootStyle.getPropertyValue('--hud-bg').trim();

    setThemeColors({
      primary: primaryColor || '#67e8f9',
      glow: glowColor || 'rgba(103, 232, 249, 0.4)',
      bg: bgColor || '#0d1b30',
    });
  }, []);

  useEffect(() => {
    if (!cubeRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const target = cubeRef.current;

      // Ensure clean spatial tracking defaults before initializing runtime vectors
      target.position.y = 6.5;
      target.rotation.y = 0;

      // 1. Entrance Drop and Bounce Sequence
      tl.to(target.position, {
        y: 0,
        duration: 1.4,
        ease: 'bounce.out',
      });

      // 2. Chained Rotational Loop Block
      const triggerRotationSequence = () => {
        gsap.to(target.rotation, {
          y: target.rotation.y - Math.PI / 2,
          duration: 3,
          ease: 'back.out(1.70158)',
          onStart: () => setIsPaused(false),
          onComplete: () => {
            setIsPaused(true);
            gsap.delayedCall(8.0, triggerRotationSequence);
          },
        });
      };

      tl.add(() => triggerRotationSequence());

      // 3. Isolated Ambient Drift Loop (Replaces manual Math.sin calculations)
      gsap.to(target.rotation, {
        x: 0.08,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  const size = 5.6;
  const offset = size / 2 + 0.35;

  const panelInlineStyle = {
    backgroundColor: 'var(--hud-bg)',
    borderColor: 'var(--hud-border)',
    color: 'var(--hud-text)',
    boxShadow: '0 0 45px var(--hud-glow)',
  };

  const titleInlineStyle = {
    color: 'var(--hud-primary)',
    borderColor: 'var(--hud-border)',
    filter: 'drop-shadow(0 0 10px var(--hud-primary))',
  };

  const panelStyleClass =
    'w-[310px] h-[310px] backdrop-blur-xl border p-6 clip-angled-br flex flex-col justify-between select-none transition-all duration-200';

  const glowingTitleClass =
    'border-b pb-3 flex items-center gap-2 text-base font-bold tracking-[0.2em] font-mono';

  const FrontCardLayout = () => (
    <div
      className={`${panelStyleClass} ${isPaused ? 'animate-sync-pulse' : ''}`}
      style={panelInlineStyle}
    >
      <div>
        <h3 className={glowingTitleClass} style={titleInlineStyle}>
          <span
            className='animate-pulse text-xs'
            style={{ color: 'var(--hud-primary)' }}
          >
            ◉
          </span>{' '}
          SYS.INFO
        </h3>
        <ul className='space-y-5 text-[15px] font-bold font-mono mt-4 compliance-target'>
          <li className='flex items-center gap-3.5'>
            <MapPin
              className='w-5 h-5 node-icon'
              style={{ color: 'var(--hud-primary)' }}
            />{' '}
            {developerProfile.location}
          </li>
          <li className='flex items-center gap-3.5'>
            <Briefcase
              className='w-5 h-5 node-icon'
              style={{ color: 'var(--hud-primary)' }}
            />{' '}
            {developerProfile.status}
          </li>
          <li className='flex items-center gap-3.5'>
            <Mail
              className='w-5 h-5 node-icon'
              style={{ color: 'var(--hud-primary)' }}
            />{' '}
            {developerProfile.socialLinks.email}
          </li>
        </ul>
      </div>

      <div className='w-full pt-2 relative overflow-hidden'>
        <a
          href={`mailto:${developerProfile.socialLinks.email}`}
          className='block w-full py-4 text-center font-heading font-black tracking-[0.2em] text-sm relative overflow-hidden transition-all duration-300 clip-angled cursor-pointer'
          style={{
            backgroundColor: 'var(--hud-primary)',
            color: 'var(--hud-surface)',
            boxShadow: isPaused ? '0 0 25px var(--hud-primary)' : 'none',
            transform: isPaused ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          INITIATE_CONTACT
          {isPaused && (
            <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.4s_infinite]' />
          )}
        </a>
      </div>
    </div>
  );

  const BackCardLayout = () => (
    <div
      className={`${panelStyleClass} ${isPaused ? 'animate-sync-pulse' : ''}`}
      style={panelInlineStyle}
    >
      <div>
        <h3 className={glowingTitleClass} style={titleInlineStyle}>
          <span className='text-xs' style={{ color: 'var(--hud-primary)' }}>
            ◉
          </span>{' '}
          CORE SKILLS
        </h3>
        <div className='grid grid-cols-2 gap-x-5 gap-y-5 text-[15px] font-mono mt-5 compliance-target'>
          {developerProfile.skills.map((skill, i) => (
            <div key={i} className='flex items-center gap-2 font-bold'>
              <span
                className='font-black node-bullet'
                style={{ color: 'var(--hud-accent)' }}
              >
                ▹
              </span>{' '}
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <group ref={cubeRef}>
      <RubiksCubeCore colors={themeColors} />

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial
          color={
            themeColors.primary.startsWith('var')
              ? '#67e8f9'
              : themeColors.primary
          }
          transparent
          opacity={0.4}
        />
      </lineSegments>

      {/* FACE 1: FRONT */}
      <Html
        position={[0, 0, offset]}
        transform
        distanceFactor={6.5}
        occlude='blending'
        pointerEvents='auto'
      >
        <FrontCardLayout />
      </Html>

      {/* FACE 2: RIGHT */}
      <Html
        position={[offset, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        transform
        distanceFactor={6.5}
        occlude='blending'
        pointerEvents='none'
      >
        <BackCardLayout />
      </Html>

      {/* FACE 3: BACK */}
      <Html
        position={[0, 0, -offset]}
        rotation={[0, Math.PI, 0]}
        transform
        distanceFactor={6.5}
        occlude='blending'
        pointerEvents='auto'
      >
        <FrontCardLayout />
      </Html>

      {/* FACE 4: LEFT */}
      <Html
        position={[-offset, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        transform
        distanceFactor={6.5}
        occlude='blending'
        pointerEvents='none'
      >
        <BackCardLayout />
      </Html>
    </group>
  );
}

export default function HudCubeDisplay() {
  return (
    <div className='w-full max-w-[560px] aspect-square mx-auto relative'>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ borderRadius: '20px' }}
      >
        <SpinningCube />
        <ambientLight intensity={0.3} color='#c5d0ff' />
        <directionalLight position={[8, 10, 6]} intensity={1.6} />
        <pointLight position={[-10, -8, -8]} intensity={0.8} />
      </Canvas>
      <div
        className='absolute inset-0 -z-10 border rounded-3xl scale-[1.05] blur-md pointer-events-none'
        style={{ borderColor: 'var(--hud-border)' }}
      />
    </div>
  );
}
