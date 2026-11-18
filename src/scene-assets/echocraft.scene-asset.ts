/**
 * ECHOCRAFT VR — The Last Light
 * Scene assets: Procedural Island Diorama, Lighthouse, Sockets, and Memory Fragments.
 */

import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from '@iwsdk/core';

// ==========================================
// COLOR PALETTES
// ==========================================
export const PALETTE = {
  // Storm phase
  rockDark: 0x2d3448,
  rockMid: 0x48526e,
  soilDormant: 0x222838,
  cliffHighlight: 0x5d6888,
  seaDark: 0x0f2238,
  seaFoam: 0x688fa8,
  rain: 0x93b7f5,
  pathSand: 0x3d4454,
  
  // Lighthouse
  lighthouseBase: 0x424a5e,
  lighthouseTower: 0xf1f5f9,
  lighthouseRed: 0xbe2a2a,
  lighthouseRoof: 0x1e2433,
  lighthouseTrim: 0xd6dfe8,
  lanternGlass: 0xfff3d6,
  lanternAmber: 0xffa012,
  lanternWarmGlow: 0xffdc73,
  
  // Fragments & Sockets
  warmthGlow: 0xff8c00,
  warmthCore: 0xffc433,
  lifeGlow: 0x059669,
  lifeCore: 0x34d399,
  hopeGlow: 0x0284c7,
  hopeCore: 0x38bdf8,
  
  // Healed World
  mossGreen: 0x1e4620,
  grassLush: 0x2e7d32,
  flowerYellow: 0xfbbf24,
  flowerPink: 0xf43f5e,
  flowerCyan: 0x38bdf8,
  seaTropical: 0x0891b2,
  seaTropicalFoam: 0xa5f3fc,
  woodWarm: 0x78563a,
};

/**
 * Creates the miniature floating storm island diorama
 */
export function createIslandDiorama(): Group {
  const root = new Group();
  root.name = 'IslandDioramaRoot';

  // 1. Organic Stylized Ocean Base
  const oceanGroup = new Group();
  oceanGroup.name = 'OceanGroup';

  // Irregular faceted shoreline disc (not a hard circular bowl)
  const oceanGeo = new CylinderGeometry(1.68, 1.48, 0.22, 32);
  const posAttr = oceanGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const angle = Math.atan2(z, x);
    const dist = Math.hypot(x, z);
    if (dist > 0.5) {
      // Natural organic wave disturbance along coast
      const disp = 0.08 * Math.sin(angle * 4.0) + 0.04 * Math.cos(angle * 7.0);
      posAttr.setX(i, x + disp * Math.cos(angle));
      posAttr.setZ(i, z + disp * Math.sin(angle));
    }
  }
  oceanGeo.computeVertexNormals();

  const oceanMat = new MeshStandardMaterial({
    color: PALETTE.seaDark,
    roughness: 0.18,
    metalness: 0.12,
    transparent: true,
    opacity: 0.92,
    flatShading: true,
  });
  const oceanMesh = new Mesh(oceanGeo, oceanMat);
  oceanMesh.name = 'OceanMesh';
  oceanMesh.position.y = -0.11;
  oceanMesh.receiveShadow = true;
  oceanGroup.add(oceanMesh);

  // Sea foam shoreline wave ring
  const foamGeo = new RingGeometry(1.36, 1.66, 36);
  const foamMat = new MeshBasicMaterial({
    color: PALETTE.seaFoam,
    transparent: true,
    opacity: 0.42,
    side: DoubleSide,
  });
  const foamMesh = new Mesh(foamGeo, foamMat);
  foamMesh.name = 'FoamRing';
  foamMesh.rotation.x = -Math.PI / 2;
  foamMesh.position.y = 0.005;
  oceanGroup.add(foamMesh);

  root.add(oceanGroup);

  // 2. Beacon Volumetric Beam & Light Core
  // Anchored at the lighthouse lantern room altitude (y ~ 1.62 in diorama space)
  const lighthouseGroup = new Group();
  lighthouseGroup.name = 'LighthouseGroup';
  lighthouseGroup.position.set(-0.2, 0.825, -0.15);

  const beaconCoreMat = new MeshStandardMaterial({
    color: PALETTE.lanternAmber,
    emissive: PALETTE.lanternAmber,
    emissiveIntensity: 1.2,
    roughness: 0.15,
  });
  const beaconCore = new Mesh(new SphereGeometry(0.07, 16, 16), beaconCoreMat);
  beaconCore.name = 'LighthouseBeaconCore';
  beaconCore.position.y = 0.80;
  lighthouseGroup.add(beaconCore);

  // Rotating atmospheric light beam
  const beamGroup = new Group();
  beamGroup.name = 'LighthouseBeamGroup';
  beamGroup.position.set(0, 0.80, 0);

  const beamGeo = new ConeGeometry(0.32, 3.4, 24, 1, true);
  beamGeo.translate(0, 1.7, 0);
  beamGeo.rotateX(Math.PI / 2);

  const beamMat = new MeshBasicMaterial({
    color: PALETTE.lanternWarmGlow,
    transparent: true,
    opacity: 0.24,
    side: DoubleSide,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const beamMesh = new Mesh(beamGeo, beamMat);
  beamMesh.name = 'LighthouseBeamMesh';
  beamGroup.add(beamMesh);

  const innerBeamGeo = new ConeGeometry(0.1, 3.2, 16, 1, true);
  innerBeamGeo.translate(0, 1.6, 0);
  innerBeamGeo.rotateX(Math.PI / 2);
  const innerBeamMat = new MeshBasicMaterial({
    color: 0xffeedd,
    transparent: true,
    opacity: 0.38,
    side: DoubleSide,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const innerBeam = new Mesh(innerBeamGeo, innerBeamMat);
  innerBeam.name = 'InnerBeamMesh';
  beamGroup.add(innerBeam);

  lighthouseGroup.add(beamGroup);
  root.add(lighthouseGroup);

  // 3. Dynamic Foliage & Flora Group (Expands as world heals)
  const floraGroup = new Group();
  floraGroup.name = 'FloraGroup';
  floraGroup.scale.set(0.001, 0.001, 0.001); // starts invisible/dormant in storm

  const mossMat = new MeshStandardMaterial({
    color: PALETTE.grassLush,
    roughness: 0.8,
    flatShading: true,
  });

  // Multiple lush moss mounds on terraces
  const mossCoords: [number, number, number, number][] = [
    [-0.15, 0.83, 0.05, 0.2],
    [0.1, 0.45, 0.15, 0.25],
    [0.42, 0.58, 0.18, 0.28],
    [0.35, 0.42, -0.2, 0.22],
    [-0.35, 0.45, 0.35, 0.2],
    [0.05, 0.68, -0.55, 0.18],
    [-0.38, 0.25, -0.4, 0.22],
  ];

  mossCoords.forEach(([x, y, z, r], idx) => {
    const mound = new Mesh(new SphereGeometry(r, 7, 6), mossMat);
    mound.name = `MossMound_${idx}`;
    mound.position.set(x, y, z);
    mound.scale.set(1, 0.35, 1);
    floraGroup.add(mound);
  });

  // Coastal Wildflowers (Golden, Pink, Cyan)
  const flowerGeo = new SphereGeometry(0.025, 6, 6);
  const fMatYellow = new MeshBasicMaterial({ color: PALETTE.flowerYellow });
  const fMatPink = new MeshBasicMaterial({ color: PALETTE.flowerPink });
  const fMatCyan = new MeshBasicMaterial({ color: PALETTE.flowerCyan });

  const flowerPositions: [number, number, number, MeshBasicMaterial][] = [
    [0.48, 0.64, 0.22, fMatYellow],
    [0.38, 0.62, 0.28, fMatPink],
    [0.45, 0.63, 0.12, fMatCyan],
    [0.12, 0.51, 0.22, fMatYellow],
    [-0.12, 0.87, 0.08, fMatPink],
    [-0.18, 0.86, 0.02, fMatCyan],
    [0.08, 0.72, -0.52, fMatYellow],
  ];

  flowerPositions.forEach(([x, y, z, mat], idx) => {
    const fl = new Mesh(flowerGeo, mat);
    fl.name = `Flower_${idx}`;
    fl.position.set(x, y, z);
    floraGroup.add(fl);
  });

  root.add(floraGroup);

  // 5. Rain Particle System — Fine atmospheric streaks
  const rainCount = 1400;
  const rainGeo = new BufferGeometry();
  const rainPos = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3] = (Math.random() - 0.5) * 5.0;
    rainPos[i * 3 + 1] = Math.random() * 4.0 + 0.1;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
  }
  rainGeo.setAttribute('position', new BufferAttribute(rainPos, 3));

  const rainMat = new PointsMaterial({
    color: PALETTE.rain,
    size: 0.012, // Fine mist/streaks instead of giant squares
    transparent: true,
    opacity: 0.65,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const rainPoints = new Points(rainGeo, rainMat);
  rainPoints.name = 'RainPoints';
  root.add(rainPoints);

  return root;
}

/**
 * Creates one of the three sculpted stone memory sockets with rune engraving
 */
export function createMemorySocket(socketType: 'warmth' | 'life' | 'hope'): Group {
  const root = new Group();
  root.name = `SocketRoot_${socketType}`;

  // Base stone pedestal
  const stoneMat = new MeshStandardMaterial({
    color: PALETTE.rockMid,
    roughness: 0.7,
    metalness: 0.2,
  });

  const pedestal = new Mesh(new CylinderGeometry(0.12, 0.15, 0.08, 12), stoneMat);
  pedestal.name = 'SocketPedestal';
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  root.add(pedestal);

  // Inner carved receptacle bowl
  const bowlMat = new MeshStandardMaterial({
    color: 0x111625,
    roughness: 0.9,
  });
  const bowl = new Mesh(new CylinderGeometry(0.08, 0.04, 0.05, 12), bowlMat);
  bowl.position.y = 0.02;
  root.add(bowl);

  // Glowing Rune Ring
  let runeColor = PALETTE.warmthGlow;
  if (socketType === 'life') runeColor = PALETTE.lifeGlow;
  if (socketType === 'hope') runeColor = PALETTE.hopeGlow;

  const runeMat = new MeshBasicMaterial({
    color: runeColor,
    transparent: true,
    opacity: 0.5,
    side: DoubleSide,
  });
  const runeRing = new Mesh(new RingGeometry(0.06, 0.1, 16), runeMat);
  runeRing.name = 'SocketRuneRing';
  runeRing.rotation.x = -Math.PI / 2;
  runeRing.position.y = 0.042;
  root.add(runeRing);

  // Idle floating beacon pillar (faint guide light)
  const guideGeo = new CylinderGeometry(0.005, 0.06, 0.45, 8, 1, true);
  const guideMat = new MeshBasicMaterial({
    color: runeColor,
    transparent: true,
    opacity: 0.18,
    blending: AdditiveBlending,
    side: DoubleSide,
    depthWrite: false,
  });
  const guideBeam = new Mesh(guideGeo, guideMat);
  guideBeam.name = 'SocketGuideBeam';
  guideBeam.position.y = 0.25;
  root.add(guideBeam);

  return root;
}

/**
 * Creates one of the three glowing memory fragments
 */
export function createMemoryFragment(fragmentType: 'warmth' | 'life' | 'hope'): Group {
  const root = new Group();
  root.name = `MemoryFragment_${fragmentType}`;

  let coreColor = PALETTE.warmthCore;
  let glowColor = PALETTE.warmthGlow;
  let accentColor = 0xffe066;

  if (fragmentType === 'life') {
    coreColor = PALETTE.lifeCore;
    glowColor = PALETTE.lifeGlow;
    accentColor = 0x6ee7b7;
  } else if (fragmentType === 'hope') {
    coreColor = PALETTE.hopeCore;
    glowColor = PALETTE.hopeGlow;
    accentColor = 0x7dd3fc;
  }

  // 1. Faceted Central Crystal
  let gemGeo: BufferGeometry;
  if (fragmentType === 'warmth') {
    gemGeo = new OctahedronGeometry(0.065, 0);
  } else if (fragmentType === 'life') {
    gemGeo = new DodecahedronGeometry(0.062, 0);
  } else {
    gemGeo = new OctahedronGeometry(0.07, 1);
  }

  const gemMat = new MeshStandardMaterial({
    color: coreColor,
    emissive: glowColor,
    emissiveIntensity: 0.85,
    roughness: 0.1,
    metalness: 0.25,
    transparent: true,
    opacity: 0.94,
  });
  const gemMesh = new Mesh(gemGeo, gemMat);
  gemMesh.name = 'FragmentGemMesh';
  gemMesh.castShadow = true;
  root.add(gemMesh);

  // 2. Dual Nested Orbital Gyro-Rings
  const ringMat = new MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: 0.7,
    side: DoubleSide,
    blending: AdditiveBlending,
  });

  const ringMesh = new Mesh(new TorusGeometry(0.092, 0.004, 8, 32), ringMat);
  ringMesh.name = 'FragmentRingMesh';
  ringMesh.rotation.x = Math.PI / 4;
  root.add(ringMesh);

  const innerRingMesh = new Mesh(new TorusGeometry(0.076, 0.003, 8, 24), new MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.55,
    side: DoubleSide,
    blending: AdditiveBlending,
  }));
  innerRingMesh.name = 'FragmentInnerRingMesh';
  innerRingMesh.rotation.y = Math.PI / 3;
  root.add(innerRingMesh);

  // 3. Floating Sparkle / Ember motes around the gem
  const sparkleGeo = new BufferGeometry();
  const sparkleCount = 14;
  const sparklePos = new Float32Array(sparkleCount * 3);
  for (let i = 0; i < sparkleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    const dist = 0.08 + Math.random() * 0.035;
    sparklePos[i * 3] = dist * Math.cos(phi) * Math.cos(theta);
    sparklePos[i * 3 + 1] = dist * Math.sin(phi);
    sparklePos[i * 3 + 2] = dist * Math.cos(phi) * Math.sin(theta);
  }
  sparkleGeo.setAttribute('position', new BufferAttribute(sparklePos, 3));
  const sparkleMat = new PointsMaterial({
    color: accentColor,
    size: 0.012,
    transparent: true,
    opacity: 0.8,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const sparkles = new Points(sparkleGeo, sparkleMat);
  sparkles.name = 'FragmentSparkles';
  root.add(sparkles);

  // 4. Brilliant Radiant Core
  const coreMat = new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    blending: AdditiveBlending,
  });
  const coreMesh = new Mesh(new SphereGeometry(0.026, 10, 10), coreMat);
  coreMesh.name = 'FragmentInnerCore';
  root.add(coreMesh);

  return root;
}

/**
 * Creates the Memory Altar Plinth situated right in front of the seated viewer
 */
export function createMemoryAltarPlinth(): Group {
  const root = new Group();
  root.name = 'MemoryAltarPlinth';

  const stoneMat = new MeshStandardMaterial({
    color: 0x2b3345,
    roughness: 0.75,
    metalness: 0.2,
    flatShading: true,
  });

  const goldTrimMat = new MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.3,
    metalness: 0.8,
  });

  // Sculpted pedestal column
  const column = new Mesh(new CylinderGeometry(0.09, 0.14, 0.72, 10), stoneMat);
  column.position.y = 0.36;
  column.castShadow = true;
  column.receiveShadow = true;
  root.add(column);

  // Pedestal base ring
  const baseRing = new Mesh(new CylinderGeometry(0.18, 0.22, 0.08, 12), stoneMat);
  baseRing.position.y = 0.04;
  baseRing.castShadow = true;
  root.add(baseRing);

  // Elegant curved crescent table plinth
  const table = new Mesh(new BoxGeometry(0.72, 0.05, 0.22), stoneMat);
  table.name = 'AltarTableMesh';
  table.position.y = 0.74;
  table.castShadow = true;
  table.receiveShadow = true;
  root.add(table);

  // Polished metallic trim edge along front
  const trim = new Mesh(new BoxGeometry(0.74, 0.015, 0.02), goldTrimMat);
  trim.position.set(0, 0.74, 0.115);
  root.add(trim);

  // Three soft illuminated carved shrines for the fragments
  const indentMat = new MeshStandardMaterial({
    color: 0x1e2433,
    roughness: 0.9,
  });

  [-0.22, 0.0, 0.22].forEach((x, i) => {
    // Carved stone socket base on altar
    const shrineBase = new Mesh(new CylinderGeometry(0.065, 0.075, 0.03, 16), stoneMat);
    shrineBase.position.set(x, 0.77, 0);
    shrineBase.castShadow = true;
    root.add(shrineBase);

    const indent = new Mesh(new CylinderGeometry(0.045, 0.035, 0.015, 16), indentMat);
    indent.name = `RestingIndent_${i}`;
    indent.position.set(x, 0.785, 0);
    root.add(indent);
  });

  return root;
}
