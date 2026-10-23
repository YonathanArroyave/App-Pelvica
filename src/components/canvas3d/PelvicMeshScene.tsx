'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { pelvicVertexShader, pelvicFragmentShader } from './shaders/pelvicKinematic';

interface PelvicKinematicMeshProps {
  contractionFactor: number; // -1.0 a +1.0
}

function PelvicKinematicMesh({ contractionFactor }: PelvicKinematicMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uContractionFactor: { value: 0.0 }
    }),
    []
  );

  useFrame((_, delta) => {
    if (materialRef.current) {
      // Interpolación suave del factor de contracción a 60 FPS
      materialRef.current.uniforms.uContractionFactor.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uContractionFactor.value,
        contractionFactor,
        Math.min(delta * 8.0, 1.0)
      );
    }

    if (meshRef.current) {
      // Rotación suave del modelo para percepción tridimensional
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group>
      {/* Malla del Diafragma Pélvico con Deformación en Vertex Shader */}
      <mesh ref={meshRef} position={[0, -0.1, 0]}>
        {/* Geometría anatómica de honda muscular (Toroide elíptico ligero: < 1500 vértices) */}
        <torusGeometry args={[1.35, 0.42, 24, 48]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={pelvicVertexShader}
          fragmentShader={pelvicFragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>

      {/* Anillo de referencia fija pubococcígea (Estructura de anclaje óseo) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <ringGeometry args={[1.7, 1.76, 48]} />
        <meshBasicMaterial
          color="#212838"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Luces tenues de atmósfera OLED */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} color="#00E5FF" />
      <directionalLight position={[-3, -4, -3]} intensity={0.5} color="#7C4DFF" />
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
      <Canvas
        camera={{ position: [0, 2.2, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <PelvicKinematicMesh contractionFactor={contractionFactor} />
      </Canvas>

      {/* Indicador de Estado Biomecánico */}
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
          {contractionFactor > 0.1 && `Contracción Activa (${Math.round(contractionFactor * 100)}%)`}
          {contractionFactor < -0.1 && `Kegel Inverso / Elongación (${Math.round(Math.abs(contractionFactor) * 100)}%)`}
          {Math.abs(contractionFactor) <= 0.1 && 'Tono Basal en Reposo'}
        </span>
      </div>
    </div>
  );
}
