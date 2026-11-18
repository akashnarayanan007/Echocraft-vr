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
  rockDark: 0x24283b,
  rockMid: 0x3b4261,
  soilDormant: 0x1f2335,
  seaDark: 0x111c2e,
  seaFoam: 0x415678,
  rain: 0x7aa2f7,
  
  // Lighthouse
  lighthouseBase: 0x3f465d,
  lighthouseTower: 0xe0e6ed,
  lighthouseRed: 0xa83232,
  lighthouseRoof: 0x222638,
  lanternGlass: 0xffeedd,
  lanternAmber: 0xffaa22,
  lanternWarmGlow: 0xffdd66,
  
  // Fragments & Sockets
  warmthGlow: 0xff9900,
  warmthCore: 0xffcc44,
  lifeGlow: 0x10b981,
  lifeCore: 0x34d399,
  hopeGlow: 0x06b6d4,
  hopeCore: 0x38bdf8,
  
  // Healed World
  mossGreen: 0x2d6a4f,
  grassLush: 0x40916c,
  flowerYellow: 0xffd166,
  flowerPink: 0xff758f,
  flowerCyan: 0x70d6ff,
  seaTropical: 0x14746f,
  woodWarm: 0x5e503f,
};

/**
 * Creates the miniature floating storm island diorama
 */
export function createIslandDiorama(): Group {
  const root = new Group();
  root.name = 'IslandDioramaRoot';

  // 1. Ocean Base Disc with layered rings
  const oceanGroup = new Group();
  oceanGroup.name = 'OceanGroup';

  const oceanGeo = new CylinderGeometry(1.6, 1.4, 0.25, 48);
  const oceanMat = new MeshStandardMaterial({
    color: PALETTE.seaDark,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9,
  });
  const oceanMesh = new Mesh(oceanGeo, oceanMat);
  oceanMesh.name = 'OceanMesh';
  oceanMesh.position.y = -0.125;
  oceanMesh.receiveShadow = true;
  oceanGroup.add(oceanMesh);

  // Sea foam edge ring
  const foamGeo = new RingGeometry(1.35, 1.58, 48);
  const foamMat = new MeshBasicMaterial({
    color: PALETTE.seaFoam,
    transparent: true,
    opacity: 0.45,
    side: DoubleSide,
  });
  const foamMesh = new Mesh(foamGeo, foamMat);
  foamMesh.name = 'FoamRing';
  foamMesh.rotation.x = -Math.PI / 2;
  foamMesh.position.y = 0.005;
  oceanGroup.add(foamMesh);

  root.add(oceanGroup);

  // 2. Rocky Crag Island Island Base
  const terrainGroup = new Group();
  terrainGroup.name = 'TerrainGroup';

  // Lower craggy cliff rocks
  const cliffMat = new MeshStandardMaterial({
    color: PALETTE.rockDark,
    roughness: 0.85,
    metalness: 0.15,
    flatShading: true,
  });

  const mainRockGeo = new CylinderGeometry(0.95, 0.6, 0.5, 9, 2);
  const mainRock = new Mesh(mainRockGeo, cliffMat);
  mainRock.name = 'MainRock';
  mainRock.position.set(0, 0.2, 0);
  mainRock.castShadow = true;
  mainRock.receiveShadow = true;
  terrainGroup.add(mainRock);

  // Secondary elevated rock outcrop (Lighthouse Plateau)
  const lighthousePlateauGeo = new CylinderGeometry(0.55, 0.7, 0.45, 8);
  const lighthousePlateau = new Mesh(lighthousePlateauGeo, cliffMat);
  lighthousePlateau.name = 'LighthousePlateau';
  lighthousePlateau.position.set(-0.2, 0.6, -0.15);
  lighthousePlateau.castShadow = true;
  lighthousePlateau.receiveShadow = true;
  terrainGroup.add(lighthousePlateau);

  // Terraced cliff outcrop for Life Socket
  const gardenPlateauGeo = new CylinderGeometry(0.35, 0.45, 0.35, 7);
  const gardenPlateau = new Mesh(gardenPlateauGeo, cliffMat);
  gardenPlateau.name = 'GardenPlateau';
  gardenPlateau.position.set(0.45, 0.4, 0.2);
  gardenPlateau.castShadow = true;
  gardenPlateau.receiveShadow = true;
  terrainGroup.add(gardenPlateau);

  // Scenic Promontory Lookout for Hope Socket
  const lookoutGeo = new CylinderGeometry(0.28, 0.38, 0.4, 6);
  const lookoutPlateau = new Mesh(lookoutGeo, cliffMat);
  lookoutPlateau.name = 'LookoutPlateau';
  lookoutPlateau.position.set(0.1, 0.5, -0.6);
  lookoutPlateau.castShadow = true;
  lookoutPlateau.receiveShadow = true;
  terrainGroup.add(lookoutPlateau);

  // Wooden jetty / pier extending into ocean
  const pierMat = new MeshStandardMaterial({
    color: PALETTE.woodWarm,
    roughness: 0.9,
  });
  const pierMesh = new Mesh(new BoxGeometry(0.2, 0.04, 0.45), pierMat);
  pierMesh.name = 'PierMesh';
  pierMesh.position.set(-0.55, 0.08, 0.75);
  pierMesh.rotation.y = 0.3;
  pierMesh.castShadow = true;
  terrainGroup.add(pierMesh);

  // Small pier posts
  for (let i = 0; i < 4; i++) {
    const post = new Mesh(new CylinderGeometry(0.015, 0.015, 0.25, 6), pierMat);
    const zOffset = (i % 2) * 0.35 - 0.175;
    const xOffset = (Math.floor(i / 2) - 0.5) * 0.18;
    post.position.set(pierMesh.position.x + xOffset, 0.05, pierMesh.position.z + zOffset);
    terrainGroup.add(post);
  }

  root.add(terrainGroup);

  // 3. Stylized Nautical Lighthouse
  const lighthouseGroup = new Group();
  lighthouseGroup.name = 'LighthouseGroup';
  lighthouseGroup.position.set(-0.2, 0.825, -0.15);

  // Stone base pedestal
  const baseMesh = new Mesh(
    new CylinderGeometry(0.24, 0.28, 0.15, 12),
    new MeshStandardMaterial({ color: PALETTE.lighthouseBase, roughness: 0.8 }),
  );
  baseMesh.name = 'LighthouseBase';
  baseMesh.castShadow = true;
  lighthouseGroup.add(baseMesh);

  // Tapered tower with classic red and white stripes
  const towerHeight = 0.75;
  const towerBottom = new Mesh(
    new CylinderGeometry(0.17, 0.22, towerHeight * 0.5, 16),
    new MeshStandardMaterial({ color: PALETTE.lighthouseTower, roughness: 0.5 }),
  );
  towerBottom.position.y = 0.26;
  towerBottom.castShadow = true;
  lighthouseGroup.add(towerBottom);

  const towerStripe = new Mesh(
    new CylinderGeometry(0.14, 0.17, towerHeight * 0.3, 16),
    new MeshStandardMaterial({ color: PALETTE.lighthouseRed, roughness: 0.5 }),
  );
  towerStripe.position.y = 0.52;
  towerStripe.castShadow = true;
  lighthouseGroup.add(towerStripe);

  const towerTop = new Mesh(
    new CylinderGeometry(0.12, 0.14, towerHeight * 0.2, 16),
    new MeshStandardMaterial({ color: PALETTE.lighthouseTower, roughness: 0.5 }),
  );
  towerTop.position.y = 0.7;
  towerTop.castShadow = true;
  lighthouseGroup.add(towerTop);

  // Lantern room balcony & railing
  const balcony = new Mesh(
    new CylinderGeometry(0.18, 0.18, 0.04, 16),
    new MeshStandardMaterial({ color: PALETTE.lighthouseRoof, roughness: 0.6 }),
  );
  balcony.position.y = 0.79;
  balcony.castShadow = true;
  lighthouseGroup.add(balcony);

  // Lantern glass enclosure
  const lanternGlass = new Mesh(
    new CylinderGeometry(0.13, 0.13, 0.14, 12),
    new MeshStandardMaterial({
      color: PALETTE.lanternGlass,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
    }),
  );
  lanternGlass.position.y = 0.88;
  lighthouseGroup.add(lanternGlass);

  // Glowing Lantern Core
  const beaconCoreMat = new MeshStandardMaterial({
    color: PALETTE.lanternAmber,
    emissive: PALETTE.lanternAmber,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });
  const beaconCore = new Mesh(new SphereGeometry(0.06, 12, 12), beaconCoreMat);
  beaconCore.name = 'LighthouseBeaconCore';
  beaconCore.position.y = 0.88;
  lighthouseGroup.add(beaconCore);

  // Lantern copper dome roof
  const domeRoof = new Mesh(
    new ConeGeometry(0.16, 0.16, 16),
    new MeshStandardMaterial({ color: PALETTE.lighthouseRoof, roughness: 0.4 }),
  );
  domeRoof.position.y = 1.03;
  domeRoof.castShadow = true;
  lighthouseGroup.add(domeRoof);

  // Weather vane spire
  const spire = new Mesh(
    new CylinderGeometry(0.008, 0.015, 0.12, 8),
    new MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.2 }),
  );
  spire.position.y = 1.15;
  lighthouseGroup.add(spire);

  // Rotating light beam (starts faint cone)
  const beamGroup = new Group();
  beamGroup.name = 'LighthouseBeamGroup';
  beamGroup.position.set(0, 0.88, 0);

  const beamGeo = new ConeGeometry(0.4, 2.4, 16, 1, true);
  beamGeo.translate(0, 1.2, 0);
  beamGeo.rotateX(Math.PI / 2); // Point beam forward along +Z

  const beamMat = new MeshBasicMaterial({
    color: PALETTE.lanternWarmGlow,
    transparent: true,
    opacity: 0.18,
    side: DoubleSide,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const beamMesh = new Mesh(beamGeo, beamMat);
  beamMesh.name = 'LighthouseBeamMesh';
  beamGroup.add(beamMesh);
  lighthouseGroup.add(beamGroup);

  root.add(lighthouseGroup);

  // 4. Dynamic Foliage & Flora Group (Expands as world heals)
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

  // 5. Rain Particle System
  const rainCount = 650;
  const rainGeo = new BufferGeometry();
  const rainPos = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3] = (Math.random() - 0.5) * 4.0;
    rainPos[i * 3 + 1] = Math.random() * 3.5 + 0.2;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
  }
  rainGeo.setAttribute('position', new BufferAttribute(rainPos, 3));

  const rainMat = new PointsMaterial({
    color: PALETTE.rain,
    size: 0.035,
    transparent: true,
    opacity: 0.75,
    blending: AdditiveBlending,
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

  if (fragmentType === 'life') {
    coreColor = PALETTE.lifeCore;
    glowColor = PALETTE.lifeGlow;
  } else if (fragmentType === 'hope') {
    coreColor = PALETTE.hopeCore;
    glowColor = PALETTE.hopeGlow;
  }

  // 1. Faceted Central Gem
  let gemGeo: BufferGeometry;
  if (fragmentType === 'warmth') {
    // Octahedral golden crystal
    gemGeo = new OctahedronGeometry(0.065, 0);
  } else if (fragmentType === 'life') {
    // Emerald dodecahedron
    gemGeo = new DodecahedronGeometry(0.06, 0);
  } else {
    // Celestial star crystal
    gemGeo = new OctahedronGeometry(0.07, 1);
  }

  const gemMat = new MeshStandardMaterial({
    color: coreColor,
    emissive: glowColor,
    emissiveIntensity: 0.7,
    roughness: 0.15,
    metalness: 0.3,
    transparent: true,
    opacity: 0.92,
  });
  const gemMesh = new Mesh(gemGeo, gemMat);
  gemMesh.name = 'FragmentGemMesh';
  gemMesh.castShadow = true;
  root.add(gemMesh);

  // 2. Outer Rotating Halo Ring
  const ringMat = new MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: 0.65,
    side: DoubleSide,
    blending: AdditiveBlending,
  });
  const ringMesh = new Mesh(new TorusGeometry(0.095, 0.005, 8, 24), ringMat);
  ringMesh.name = 'FragmentRingMesh';
  ringMesh.rotation.x = Math.PI / 4;
  root.add(ringMesh);

  // 3. Inner pulsing core
  const coreMat = new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
    blending: AdditiveBlending,
  });
  const coreMesh = new Mesh(new SphereGeometry(0.025, 8, 8), coreMat);
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
    color: 0x1f2430,
    roughness: 0.8,
    metalness: 0.2,
  });

  // Elegant curved crescent plinth table
  const table = new Mesh(new BoxGeometry(0.9, 0.08, 0.28), stoneMat);
  table.name = 'AltarTableMesh';
  table.position.y = 0.76;
  table.castShadow = true;
  table.receiveShadow = true;
  root.add(table);

  // Pedestal column
  const column = new Mesh(new CylinderGeometry(0.12, 0.18, 0.72, 12), stoneMat);
  column.position.y = 0.36;
  column.castShadow = true;
  column.receiveShadow = true;
  root.add(column);

  // Three soft illuminated resting indentations for the fragments
  const indentMat = new MeshBasicMaterial({
    color: 0x334155,
    transparent: true,
    opacity: 0.5,
  });

  [-0.26, 0.0, 0.26].forEach((x, i) => {
    const indent = new Mesh(new CylinderGeometry(0.07, 0.05, 0.015, 16), indentMat);
    indent.name = `RestingIndent_${i}`;
    indent.position.set(x, 0.805, 0);
    root.add(indent);
  });

  return root;
}
