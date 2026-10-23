'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Layers, Eye, Compass, Info, Sparkles } from 'lucide-react';
import { pelvicVertexShader, pelvicFragmentShader } from './shaders/pelvicKinematic';

interface PelvicKinematicMeshProps {
  contractionFactor: number; // -1.0 a +1.0
  viewMode: 'ANATOMICAL_3D' | 'SAGITTAL_CROSS';
}

/**
 * 1. MODELO ANATÓMICO 3D: Suelo Pélvico Masculino Completo
 * Representa:
 * - Marco óseo pélvico (Sínfisis púbica anterior, ramas isquiopubianas, tuberosidades isquiáticas y cóccix posterior)
 * - M. Bulboesponjoso (línea media anterior, recubre el bulbo del pene y la uretra)
 * - Mm. Isquiocavernosos (haces laterales en "V")
 * - Complejo del M. Elevador del Ano (Hamaca del haz pubococcígeo y puborrectal)
 * - Esfínter uretral y cuerpo perineal central
 */
function MalePerinealAnatomy({ contractionFactor }: { contractionFactor: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bulbospongiosusRef = useRef<THREE.Mesh>(null);
  const leftIschioRef = useRef<THREE.Mesh>(null);
  const rightIschioRef = useRef<THREE.Mesh>(null);
  const levatorAniRef = useRef<THREE.Mesh>(null);
  const sphincterRef = useRef<THREE.Mesh>(null);
  const liftRingsRef = useRef<THREE.Group>(null);

  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uContractionFactor: { value: 0.0 }
    }),
    []
  );

  // Marco Óseo Pélvico Masculino (Curva anatómica androide cerrada)
  const pelvicBoneCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0.15, 1.0),       // Sínfisis Púbica (Anterior)
      new THREE.Vector3(0.5, 0.0, 0.6),      // Rama isquiopubiana derecha
      new THREE.Vector3(0.9, -0.2, -0.1),    // Tuberosidad isquiática derecha
      new THREE.Vector3(0.65, 0.1, -0.7),    // Espina ciática derecha
      new THREE.Vector3(0, 0.45, -1.0),      // Cóccix / Sacro (Posterior)
      new THREE.Vector3(-0.65, 0.1, -0.7),   // Espina ciática izquierda
      new THREE.Vector3(-0.9, -0.2, -0.1),   // Tuberosidad isquiática izquierda
      new THREE.Vector3(-0.5, 0.0, 0.6),     // Rama isquiopubiana izquierda
      new THREE.Vector3(0, 0.15, 1.0)        // Cierre en pubis
    ];
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  // Hamaca del Elevador del Ano (Geometría parabólica posterior)
  const levatorAniGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(1.4, 1.2, 16, 16);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Dar forma cóncava de hamaca anatómica
      const z = -(x * x * 0.4 + y * y * 0.3);
      pos.setXYZ(i, x, y * 0.7 - 0.2, z);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((_, delta) => {
    // Rotación orbital lenta para percibir profundidad 3D
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }

    // Actualizar uniform del shader
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uContractionFactor.value = THREE.MathUtils.lerp(
        shaderMaterialRef.current.uniforms.uContractionFactor.value,
        contractionFactor,
        Math.min(delta * 8.0, 1.0)
      );
    }

    const targetFactor = contractionFactor;

    // 1. Deformación del Músculo Bulboesponjoso (Engrosamiento y elevación craneal)
    if (bulbospongiosusRef.current) {
      const liftY = targetFactor >= 0 ? targetFactor * 0.18 : targetFactor * 0.12;
      const thickness = targetFactor >= 0 ? 1.0 + targetFactor * 0.35 : 1.0 - Math.abs(targetFactor) * 0.2;
      bulbospongiosusRef.current.position.y = THREE.MathUtils.lerp(
        bulbospongiosusRef.current.position.y,
        0.05 + liftY,
        0.15
      );
      bulbospongiosusRef.current.scale.set(thickness, thickness, 1.0 - (targetFactor >= 0 ? targetFactor * 0.1 : 0));
    }

    // 2. Músculos Isquiocavernosos (Tensión lateral en "V")
    if (leftIschioRef.current && rightIschioRef.current) {
      const ischioScale = targetFactor >= 0 ? 1.0 + targetFactor * 0.25 : 1.0 - Math.abs(targetFactor) * 0.15;
      leftIschioRef.current.scale.set(ischioScale, ischioScale, 1.0);
      rightIschioRef.current.scale.set(ischioScale, ischioScale, 1.0);
    }

    // 3. Elevador del Ano (Vector de ascenso de la hamaca)
    if (levatorAniRef.current) {
      const hammockLift = targetFactor >= 0 ? targetFactor * 0.25 : targetFactor * 0.2;
      levatorAniRef.current.position.y = THREE.MathUtils.lerp(
        levatorAniRef.current.position.y,
        -0.1 + hammockLift,
        0.15
      );
    }

    // 4. Esfínter Uretral (Constricción radial concéntrica)
    if (sphincterRef.current) {
      const sphincterConstriction = targetFactor >= 0 ? 1.0 - targetFactor * 0.45 : 1.0 + Math.abs(targetFactor) * 0.35;
      sphincterRef.current.scale.set(sphincterConstriction, sphincterConstriction, 1.0);
    }

    // 5. Anillos de Elevación Biofeedback (Pulso visual de dirección)
    if (liftRingsRef.current) {
      liftRingsRef.current.position.y = THREE.MathUtils.lerp(
        liftRingsRef.current.position.y,
        targetFactor * 0.3,
        0.15
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* A. MARCO ÓSEO PÉLVICO (Estructura de anclaje anatómico)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <mesh>
        <tubeGeometry args={[pelvicBoneCurve, 64, 0.05, 12, true]} />
        <meshStandardMaterial
          color="#1C2433"
          roughness={0.6}
          metalness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Sínfisis Púbica (Relieve anterior) */}
      <mesh position={[0, 0.18, 1.0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#2E384D" roughness={0.5} />
      </mesh>

      {/* Tuberosidades Isquiáticas (Relieves laterales de apoyo) */}
      <mesh position={[0.9, -0.2, -0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2E384D" />
      </mesh>
      <mesh position={[-0.9, -0.2, -0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2E384D" />
      </mesh>

      {/* Cóccix posterior */}
      <mesh position={[0, 0.45, -1.0]}>
        <coneGeometry args={[0.07, 0.22, 16]} />
        <meshStandardMaterial color="#2E384D" />
      </mesh>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* B. MÚSCULO BULBOESPONJOSO CENTRAL (Motor del cierre eyaculatorio) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <mesh
        ref={bulbospongiosusRef}
        position={[0, 0.05, 0.42]}
        rotation={[Math.PI / 10, 0, 0]}
      >
        {/* Cuerpo fusiforme que rodea la uretra y bulbo del pene */}
        <capsuleGeometry args={[0.13, 0.55, 16, 24]} />
        <shaderMaterial
          ref={shaderMaterialRef}
          vertexShader={pelvicVertexShader}
          fragmentShader={pelvicFragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Uretra Esponjosa (Canal central translúcido) */}
      <mesh position={[0, 0.05, 0.42]} rotation={[Math.PI / 10, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 16]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.4} />
      </mesh>

      {/* Esfínter Uretral Externo (Anillo concéntrico que se ocluye) */}
      <mesh
        ref={sphincterRef}
        position={[0, 0.12, 0.18]}
        rotation={[Math.PI / 2 + Math.PI / 10, 0, 0]}
      >
        <torusGeometry args={[0.16, 0.035, 16, 32]} />
        <meshStandardMaterial
          color={contractionFactor > 0 ? '#7C4DFF' : '#00E5FF'}
          emissive={contractionFactor > 0 ? '#7C4DFF' : '#00E5FF'}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* C. MÚSCULOS ISQUIOCAVERNOSOS LATERALES (Haces en "V")         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Haz Izquierdo: Desde rama isquiática al pubis */}
      <mesh
        ref={leftIschioRef}
        position={[-0.38, -0.04, 0.46]}
        rotation={[Math.PI / 14, -Math.PI / 6, -Math.PI / 16]}
      >
        <capsuleGeometry args={[0.09, 0.52, 16, 20]} />
        <meshStandardMaterial
          color={contractionFactor > 0.1 ? '#7C4DFF' : contractionFactor < -0.1 ? '#00E676' : '#00E5FF'}
          roughness={0.4}
          metalness={0.3}
          wireframe={false}
        />
      </mesh>

      {/* Haz Derecho: Simétrico en V */}
      <mesh
        ref={rightIschioRef}
        position={[0.38, -0.04, 0.46]}
        rotation={[Math.PI / 14, Math.PI / 6, Math.PI / 16]}
      >
        <capsuleGeometry args={[0.09, 0.52, 16, 20]} />
        <meshStandardMaterial
          color={contractionFactor > 0.1 ? '#7C4DFF' : contractionFactor < -0.1 ? '#00E676' : '#00E5FF'}
          roughness={0.4}
          metalness={0.3}
          wireframe={false}
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* D. CUERPO PERINEAL (Centro tendinoso de inserción)             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <mesh position={[0, -0.06, 0.08]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* E. COMPLEJO DEL ELEVADOR DEL ANO (Hamaca Pubococcígea)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <mesh
        ref={levatorAniRef}
        geometry={levatorAniGeometry}
        position={[0, -0.08, -0.42]}
        rotation={[-Math.PI / 2.3, 0, 0]}
      >
        <meshStandardMaterial
          color={contractionFactor > 0.1 ? '#7C4DFF' : contractionFactor < -0.1 ? '#00E676' : '#00E5FF'}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* F. VECTORES DE ELEVACIÓN / LIFT (Biofeedback dinámico)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={liftRingsRef} position={[0, 0, 0.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
          <ringGeometry args={[0.45, 0.48, 32]} />
          <meshBasicMaterial
            color={contractionFactor > 0.1 ? '#7C4DFF' : contractionFactor < -0.1 ? '#00E676' : '#00E5FF'}
            transparent
            opacity={Math.abs(contractionFactor) * 0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Luces OLED Ambientales */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 3]} intensity={1.0} color="#00E5FF" />
      <directionalLight position={[-2, -3, -2]} intensity={0.6} color="#7C4DFF" />
      <pointLight position={[0, 0.2, 0.3]} intensity={0.8} color="#00E5FF" distance={2} />
    </group>
  );
}

/**
 * 2. CORTE SAGITAL FUNCIONAL 3D (Corte Lateral de Perfil)
 * Muestra el mecanismo de "Cierre y Elevación" (Arnold Kegel):
 * - Hueso Púbico al frente y Cóccix detrás
 * - Vejiga y canal uretral
 * - Honda muscular del pubococcígeo traccionando anterosuperiormente hacia el pubis
 */
function SagittalCrossSection({ contractionFactor }: { contractionFactor: number }) {
  const slingRef = useRef<THREE.Mesh>(null);
  const bladderNeckRef = useRef<THREE.Mesh>(null);

  // Curva de la honda muscular pubococcígea de perfil
  const slingCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.9, 0.35, 0),    // Anclaje al Pubis (Anterior)
      new THREE.Vector3(-0.35, -0.3, 0),   // Cuna bajo la uretra / cuello vesical
      new THREE.Vector3(0.4, -0.2, 0),     // Paso retro-rectal
      new THREE.Vector3(0.9, 0.45, 0)      // Anclaje al Cóccix (Posterior)
    ]);
  }, []);

  useFrame((_, delta) => {
    const target = contractionFactor;
    if (slingRef.current) {
      // Elevación hacia el pubis (+Y y desplazamiento anterior -X)
      const liftY = target >= 0 ? target * 0.25 : target * 0.15;
      const pullForwardX = target >= 0 ? -target * 0.12 : 0;
      slingRef.current.position.y = THREE.MathUtils.lerp(
        slingRef.current.position.y,
        liftY,
        0.15
      );
      slingRef.current.position.x = THREE.MathUtils.lerp(
        slingRef.current.position.x,
        pullForwardX,
        0.15
      );
    }

    if (bladderNeckRef.current) {
      const neckY = target >= 0 ? target * 0.2 : target * 0.1;
      bladderNeckRef.current.position.y = THREE.MathUtils.lerp(
        bladderNeckRef.current.position.y,
        -0.05 + neckY,
        0.15
      );
    }
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* Sínfisis Púbica (Anterior - Izquierda) */}
      <mesh position={[-0.95, 0.35, 0]}>
        <boxGeometry args={[0.22, 0.4, 0.15]} />
        <meshStandardMaterial color="#2E384D" roughness={0.4} />
      </mesh>

      {/* Cóccix / Sacro (Posterior - Derecha) */}
      <mesh position={[0.95, 0.5, 0]}>
        <coneGeometry args={[0.15, 0.5, 16]} />
        <meshStandardMaterial color="#2E384D" roughness={0.4} />
      </mesh>

      {/* Contorno de Vejiga (Translúcida) */}
      <mesh position={[-0.25, 0.45, 0]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#00E5FF" transparent opacity={0.25} wireframe={true} />
      </mesh>

      {/* Uretra (Canal que desciende y atraviesa el suelo pélvico) */}
      <mesh position={[-0.3, 0.0, 0]} rotation={[0, 0, Math.PI / 16]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 16]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
      </mesh>

      {/* Cuello Vesical / Esfínter que se eleva */}
      <mesh ref={bladderNeckRef} position={[-0.3, -0.05, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color={contractionFactor > 0.1 ? '#7C4DFF' : '#00E5FF'}
          emissive={contractionFactor > 0.1 ? '#7C4DFF' : '#00E5FF'}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Honda Muscular del Pubococcígeo (Tubo curvo activo) */}
      <mesh ref={slingRef}>
        <tubeGeometry args={[slingCurve, 48, 0.065, 16, false]} />
        <meshStandardMaterial
          color={contractionFactor > 0.1 ? '#7C4DFF' : contractionFactor < -0.1 ? '#00E676' : '#00E5FF'}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Indicadores de Texto Lateral */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 3, 3]} intensity={1.0} color="#00E5FF" />
      <directionalLight position={[0, -3, -3]} intensity={0.5} color="#7C4DFF" />
    </group>
  );
}

interface PelvicMeshSceneProps {
  contractionFactor: number;
  className?: string;
}

export function PelvicMeshScene({
  contractionFactor,
  className = 'w-full h-64'
}: PelvicMeshSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'ANATOMICAL_3D' | 'SAGITTAL_CROSS'>('ANATOMICAL_3D');
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center justify-center bg-[#090A0F] ${className}`}>
        <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controles Flotantes de Vista Anatómica */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-[#090A0F]/80 backdrop-blur-md p-1 rounded-xl border border-[#212838]">
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'ANATOMICAL_3D' ? 'SAGITTAL_CROSS' : 'ANATOMICAL_3D')}
          className="px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 bg-[#181D2B] text-gray-300 hover:text-white transition-all cursor-pointer"
          title="Cambiar perspectiva 3D"
        >
          <Layers className="w-3 h-3 text-[#00E5FF]" />
          <span>{viewMode === 'ANATOMICAL_3D' ? 'Vista 3D' : 'Corte Lateral'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowLabels(!showLabels)}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
            showLabels
              ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
              : 'bg-[#181D2B] text-gray-400 hover:text-white'
          }`}
          title="Alternar etiquetas médicas"
        >
          <Info className="w-3 h-3" />
          <span>Info</span>
        </button>
      </div>

      {/* Lienzo WebGL Three.js a 60 FPS */}
      <Canvas
        camera={
          viewMode === 'ANATOMICAL_3D'
            ? { position: [0, 2.4, 2.8], fov: 42 }
            : { position: [0, 0.1, 3.2], fov: 38 }
        }
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        {viewMode === 'ANATOMICAL_3D' ? (
          <MalePerinealAnatomy contractionFactor={contractionFactor} />
        ) : (
          <SagittalCrossSection contractionFactor={contractionFactor} />
        )}
      </Canvas>

      {/* Overlay de Etiquetas Anatómicas Médicas Interactivas */}
      {showLabels && viewMode === 'ANATOMICAL_3D' && (
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-[10px] font-semibold animate-fadeIn">
          <div className="flex justify-between items-start">
            <span className="bg-[#090A0F]/85 border border-[#212838] px-2 py-0.5 rounded text-[#00E5FF]">
              ▲ Sínfisis Púbica (Anterior)
            </span>
            <span className="bg-[#090A0F]/85 border border-[#212838] px-2 py-0.5 rounded text-gray-300">
              Mm. Isquiocavernosos (V lateral)
            </span>
          </div>

          <div className="flex justify-between items-end">
            <span className="bg-[#090A0F]/85 border border-[#00E5FF]/30 px-2 py-0.5 rounded text-[#00E5FF]">
              ● M. Bulboesponjoso (Línea media)
            </span>
            <span className="bg-[#090A0F]/85 border border-[#7C4DFF]/30 px-2 py-0.5 rounded text-[#7C4DFF]">
              ▼ Elevador del Ano / Cóccix (Posterior)
            </span>
          </div>
        </div>
      )}

      {showLabels && viewMode === 'SAGITTAL_CROSS' && (
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-[10px] font-semibold animate-fadeIn">
          <div className="flex justify-between items-start">
            <span className="bg-[#090A0F]/85 border border-[#212838] px-2 py-0.5 rounded text-gray-300">
              ◄ Pubis (Frontal)
            </span>
            <span className="bg-[#090A0F]/85 border border-[#212838] px-2 py-0.5 rounded text-gray-300">
              Cóccix / Sacro (Posterior) ►
            </span>
          </div>

          <div className="text-center">
            <span className="bg-[#090A0F]/85 border border-[#7C4DFF]/40 px-2.5 py-0.5 rounded-full text-[#7C4DFF]">
              ▲ Vector de Cierre & Elevación (Arnold Kegel)
            </span>
          </div>
        </div>
      )}

      {/* Indicador de Estado Biomecánico Dinámico */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
        <span
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md transition-all duration-300 ${
            contractionFactor > 0.1
              ? 'bg-[#7C4DFF]/20 text-[#7C4DFF] border-[#7C4DFF]/40 shadow-sm shadow-violet-500/20'
              : contractionFactor < -0.1
              ? 'bg-[#00E676]/20 text-[#00E676] border-[#00E676]/40 shadow-sm shadow-emerald-500/20'
              : 'bg-[#090A0F]/70 text-gray-400 border-[#212838]'
          }`}
        >
          {contractionFactor > 0.1 &&
            `↑ Elevación Craneal (${Math.round(contractionFactor * 100)}%) • Cierre Esfinteriano`}
          {contractionFactor < -0.1 &&
            `↓ Elongación Caudal (${Math.round(Math.abs(contractionFactor) * 100)}%) • Kegel Inverso`}
          {Math.abs(contractionFactor) <= 0.1 && 'Tono Basal en Reposo (Músculos Relajados)'}
        </span>
      </div>
    </div>
  );
}
