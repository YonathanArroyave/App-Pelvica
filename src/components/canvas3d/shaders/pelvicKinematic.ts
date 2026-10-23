// ==============================================================================
// GLSL Shaders for 3D Pelvic Mesh Kinematics
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Lightweight WebGL, 60 FPS, Low-Poly Kinematic Deformations
// ==============================================================================

export const pelvicVertexShader = /* glsl */ `
  uniform float uContractionFactor; // -1.0 (Kegel Inverso) | 0.0 (Reposo) | +1.0 (Contracción Máxima)
  varying vec3 vNormal;
  varying float vFactor;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vFactor = uContractionFactor;
    vec3 displacement = position;

    if (uContractionFactor >= 0.0) {
      // Fase Contracción: Vector de ascenso craneal (Y+) y estrechamiento interno (XZ-)
      displacement.y += normal.y * uContractionFactor * 0.35;
      displacement.xz -= normal.xz * uContractionFactor * 0.15;
    } else {
      // Fase Relajación / Kegel Inverso: Elongación descendente (Y-) y expansión lateral (XZ+)
      float downFactor = abs(uContractionFactor);
      displacement.y -= normal.y * downFactor * 0.25;
      displacement.xz += normal.xz * downFactor * 0.20;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacement, 1.0);
  }
`;

export const pelvicFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying float vFactor;

  void main() {
    vec3 cyanColor = vec3(0.0, 0.898, 1.0);      // #00E5FF (Base / Inicio tensión)
    vec3 violetColor = vec3(0.486, 0.302, 1.0);  // #7C4DFF (Contracción máxima)
    vec3 emeraldColor = vec3(0.0, 0.902, 0.463); // #00E676 (Kegel Inverso / Relajación)

    vec3 baseColor = vFactor >= 0.0
      ? mix(cyanColor, violetColor, clamp(vFactor, 0.0, 1.0))
      : mix(cyanColor, emeraldColor, clamp(abs(vFactor), 0.0, 1.0));

    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
    vec3 finalColor = mix(baseColor * 0.75, baseColor * 1.25, fresnel);

    gl_FragColor = vec4(finalColor, 0.92);
  }
`;
