/**
 * ECHOCRAFT VR — Story, Interaction & Transformation Systems
 * Governs fragment grab & snap, world healing transitions, procedural animation, and the final immersive expansion.
 */

import {
  createSystem,
  DirectionalLightComponent,
  DistanceGrabbable,
  DomeGradient,
  Entity,
  Grabbed,
  IBLGradient,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OneHandGrabbable,
  Points,
  PointsMaterial,
  Pressed,
  RayInteractable,
  UIKit,
  UIKitMLAsset,
  Vector3,
  VisibilityState,
} from '@iwsdk/core';
import { SoundEngine } from './echocraft-audio.js';
import {
  DioramaWorld,
  LighthouseBeam,
  MemoryFragment,
  MemorySocket,
} from './echocraft-components.js';

export class EchoCraftStorySystem extends createSystem({
  fragments: { required: [MemoryFragment] },
  heldFragments: { required: [MemoryFragment, Grabbed] },
  clickedFragments: { required: [MemoryFragment, Pressed] },
  sockets: { required: [MemorySocket] },
  dioramas: { required: [DioramaWorld] },
  beams: { required: [LighthouseBeam] },
  skies: { required: [DomeGradient] },
  ibls: { required: [IBLGradient] },
  dirLights: { required: [DirectionalLightComponent] },
}) {
  private tempVecA = new Vector3();
  private tempVecB = new Vector3();
  private socketPositions = new Map<string, Vector3>();
  private initialPositions = new Map<string, Vector3>();

  // HUD references
  private hudPanel: UIKitMLAsset | null = null;
  private badgeWarmth: UIKit.Text | null = null;
  private badgeLife: UIKit.Text | null = null;
  private badgeHope: UIKit.Text | null = null;
  private promptText: UIKit.Text | null = null;
  private epiloguePanel: UIKit.Container | null = null;

  // Scene visual handles
  private rainPoints: Points | null = null;
  private floraGroup: Entity | null = null;
  private lighthouseBeamGroup: Entity | null = null;
  private oceanMesh: Mesh | null = null;
  private beaconCoreMesh: Mesh | null = null;
  private restorationPulseMesh: Mesh | null = null;

  // Pulse wave animation state
  private pulseActive = false;
  private pulseProgress = 1.0;
  private animTime = 0;

  // Target values for smooth lerps
  private targetDioramaScale = 0.55;
  private currentDioramaScale = 0.55;
  private targetDioramaY = 0.95;
  private currentDioramaY = 0.95;
  private targetDioramaZ = -1.35;
  private currentDioramaZ = -1.35;

  private targetFloraScale = 0.001;
  private currentFloraScale = 0.001;

  private targetRainOpacity = 0.75;
  private currentRainOpacity = 0.75;

  private targetBeamIntensity = 0.18;
  private currentBeamIntensity = 0.18;
  private beamRotationSpeed = 1.2;

  init(): void {
    // 1. Cache socket locations from scene
    this.queries.sockets.entities.forEach((socketEntity) => {
      const socketId = socketEntity.getValue(MemorySocket, 'socketId') || '';
      if (socketEntity.object3D) {
        socketEntity.object3D.updateWorldMatrix(true, false);
        const worldPos = new Vector3();
        socketEntity.object3D.getWorldPosition(worldPos);
        this.socketPositions.set(socketId, worldPos);
      }
    });

    // 2. Cache fragment initial locations
    this.queries.fragments.entities.forEach((fragEntity) => {
      const fragId = fragEntity.getValue(MemoryFragment, 'fragmentId') || '';
      const ix = fragEntity.getValue(MemoryFragment, 'initialX') || 0;
      const iy = fragEntity.getValue(MemoryFragment, 'initialY') || 0.88;
      const iz = fragEntity.getValue(MemoryFragment, 'initialZ') || -0.68;
      this.initialPositions.set(fragId, new Vector3(ix, iy, iz));
    });

    // 3. Subscribe to grab / release lifecycle
    const onGrab = (_entity: Entity) => {
      SoundEngine.playChime('grab');
    };

    const onRelease = (entity: Entity) => {
      this.checkFragmentSnapping(entity);
    };

    const offGrab = this.queries.heldFragments.subscribe('qualify', onGrab);
    const offRelease = this.queries.heldFragments.subscribe('disqualify', onRelease);
    this.cleanupFuncs.push(offGrab, offRelease);

    // 4. Ray / Mouse Click to socket fragment directly (100% desktop accessible)
    const onClickFragment = (entity: Entity) => {
      const isSocketed = entity.getValue(MemoryFragment, 'isSocketed');
      if (!isSocketed) {
        const fragId = (entity.getValue(MemoryFragment, 'fragmentId') || 'warmth') as 'warmth' | 'life' | 'hope';
        this.socketFragmentById(fragId);
      }
    };
    const offClick = this.queries.clickedFragments.subscribe('qualify', onClickFragment);
    this.cleanupFuncs.push(offClick);

    // 5. Wire Spatial HUD Panel
    this.setupHUD();

    // 6. Keyboard accessibility shortcuts & user audio initiation
    const onKeyDown = (e: KeyboardEvent) => {
      SoundEngine.startAmbience();
      if (e.key === '1') this.socketFragmentById('warmth');
      if (e.key === '2') this.socketFragmentById('life');
      if (e.key === '3') this.socketFragmentById('hope');
      if (e.key === 'r' || e.key === 'R') this.restartExperience();
      if (e.key === 'm' || e.key === 'M') SoundEngine.toggleMute();
    };
    window.addEventListener('keydown', onKeyDown);
    this.cleanupFuncs.push(() => window.removeEventListener('keydown', onKeyDown));

    // 7. Audio gesture listener for mouse/touch
    const onUserGesture = () => {
      SoundEngine.startAmbience();
    };
    window.addEventListener('pointerdown', onUserGesture, { once: true });
    window.addEventListener('touchstart', onUserGesture, { once: true });
  }

  private setupHUD(): void {
    const hud = this.world.getSceneObject<UIKitMLAsset>('hud-panel-node');
    if (!hud) return;
    this.hudPanel = hud;

    this.badgeWarmth = hud.getElementById<UIKit.Text>('badge-warmth');
    this.badgeLife = hud.getElementById<UIKit.Text>('badge-life');
    this.badgeHope = hud.getElementById<UIKit.Text>('badge-hope');
    this.promptText = hud.getElementById<UIKit.Text>('narrative-prompt');
    this.epiloguePanel = hud.getElementById<UIKit.Container>('epilogue-panel');

    // Mini snap buttons
    const btnWarmth = hud.getElementById('btn-snap-warmth');
    const btnLife = hud.getElementById('btn-snap-life');
    const btnHope = hud.getElementById('btn-snap-hope');
    const btnRestart = hud.getElementById('btn-restart');

    const snapWarmth = () => this.socketFragmentById('warmth');
    const snapLife = () => this.socketFragmentById('life');
    const snapHope = () => this.socketFragmentById('hope');
    const doRestart = () => this.restartExperience();

    btnWarmth?.addEventListener('click', snapWarmth);
    btnLife?.addEventListener('click', snapLife);
    btnHope?.addEventListener('click', snapHope);
    btnRestart?.addEventListener('click', doRestart);

    this.cleanupFuncs.push(
      () => btnWarmth?.removeEventListener('click', snapWarmth),
      () => btnLife?.removeEventListener('click', snapLife),
      () => btnHope?.removeEventListener('click', snapHope),
      () => btnRestart?.removeEventListener('click', doRestart),
    );

    // XR Enter / Exit buttons
    const xrButton = hud.getElementById('xr-button');
    const exitButton = hud.getElementById('exit-button');
    if (xrButton && exitButton) {
      if (!this.world.xrEnabled) {
        xrButton.setProperties({ display: 'none' });
        exitButton.setProperties({ display: 'none' });
      } else {
        const launchXR = () => this.world.launchXR();
        const exitXR = () => this.world.exitXR();
        xrButton.addEventListener('click', launchXR);
        exitButton.addEventListener('click', exitXR);
        this.cleanupFuncs.push(
          () => xrButton.removeEventListener('click', launchXR),
          () => exitButton.removeEventListener('click', exitXR),
          this.world.visibilityState.subscribe((state) => {
            const is2D = state === VisibilityState.NonImmersive;
            xrButton.setProperties({ display: is2D ? 'flex' : 'none' });
            exitButton.setProperties({ display: is2D ? 'none' : 'flex' });
          }),
        );
      }
    }
  }

  private getFirstDiorama(): Entity | undefined {
    for (const e of this.queries.dioramas.entities) {
      return e;
    }
    return undefined;
  }

  private findFragment(predicate: (e: Entity) => boolean): Entity | undefined {
    for (const e of this.queries.fragments.entities) {
      if (predicate(e)) return e;
    }
    return undefined;
  }

  private findSocket(predicate: (s: Entity) => boolean): Entity | undefined {
    for (const s of this.queries.sockets.entities) {
      if (predicate(s)) return s;
    }
    return undefined;
  }

  /**
   * Snaps a fragment into its matching stone socket
   */
  public socketFragmentById(fragmentId: 'warmth' | 'life' | 'hope'): void {
    const fragEntity = this.findFragment(
      (e) => e.getValue(MemoryFragment, 'fragmentId') === fragmentId,
    );
    if (!fragEntity) return;

    if (fragEntity.getValue(MemoryFragment, 'isSocketed')) return;

    const matchingSocketId = `socket-${fragmentId}`;
    const socketEntity = this.findSocket(
      (s) => s.getValue(MemorySocket, 'socketId') === matchingSocketId,
    );
    if (!socketEntity || socketEntity.getValue(MemorySocket, 'isOccupied')) return;

    // Perform snap
    fragEntity.setValue(MemoryFragment, 'isSocketed', true);
    fragEntity.setValue(MemoryFragment, 'socketId', matchingSocketId);
    socketEntity.setValue(MemorySocket, 'isOccupied', true);

    // Detach from grab systems once placed
    if (fragEntity.hasComponent(DistanceGrabbable)) {
      fragEntity.removeComponent(DistanceGrabbable);
    }
    if (fragEntity.hasComponent(OneHandGrabbable)) {
      fragEntity.removeComponent(OneHandGrabbable);
    }

    // Move object to socket position and attach so it scales with the world
    if (fragEntity.object3D && socketEntity.object3D) {
      socketEntity.object3D.updateWorldMatrix(true, false);
      const targetPos = new Vector3();
      socketEntity.object3D.getWorldPosition(targetPos);
      targetPos.y += 0.05; // rest comfortably in socket bowl
      fragEntity.object3D.position.copy(targetPos);
      socketEntity.object3D.attach(fragEntity.object3D);
      fragEntity.object3D.scale.set(0.65, 0.65, 0.65);

      // Boost socket rune glow and guide beam upon activation
      const rune = socketEntity.object3D.getObjectByName('SocketRuneRing') as Mesh;
      if (rune && rune.material) {
        (rune.material as MeshBasicMaterial).opacity = 1.0;
      }
      const beam = socketEntity.object3D.getObjectByName('SocketGuideBeam') as Mesh;
      if (beam && beam.material) {
        (beam.material as MeshBasicMaterial).opacity = 0.75;
      }
    }

    // Play musical harmonic chime
    SoundEngine.playChime(fragmentId);

    // Check world progression
    this.advanceWorldProgression();
  }

  /**
   * Checks snapping when player drops/releases a fragment in 3D space
   */
  private checkFragmentSnapping(fragEntity: Entity): void {
    if (fragEntity.getValue(MemoryFragment, 'isSocketed')) return;

    const fragId = fragEntity.getValue(MemoryFragment, 'fragmentId') || 'warmth';
    const matchingSocketId = `socket-${fragId}`;

    const socketEntity = this.findSocket(
      (s) => s.getValue(MemorySocket, 'socketId') === matchingSocketId,
    );

    if (fragEntity.object3D && socketEntity && socketEntity.object3D) {
      fragEntity.object3D.getWorldPosition(this.tempVecA);
      socketEntity.object3D.getWorldPosition(this.tempVecB);

      const distance = this.tempVecA.distanceTo(this.tempVecB);
      const snapRadius = socketEntity.getValue(MemorySocket, 'snapRadius') || 0.35;

      if (distance <= snapRadius && !socketEntity.getValue(MemorySocket, 'isOccupied')) {
        this.socketFragmentById(fragId as 'warmth' | 'life' | 'hope');
        return;
      }
    }

    // If released outside socket: play feedback chime & smoothly return to altar plinth
    SoundEngine.playChime('wrong');
    const initPos = this.initialPositions.get(fragId);
    if (initPos && fragEntity.object3D) {
      fragEntity.object3D.position.copy(initPos);
    }
  }

  /**
   * Evaluates world progression stage and triggers visual transformations
   */
  private advanceWorldProgression(): void {
    let placedCount = 0;
    this.queries.fragments.entities.forEach((f) => {
      if (f.getValue(MemoryFragment, 'isSocketed')) placedCount++;
    });

    const dioramaEntity = this.getFirstDiorama();
    if (dioramaEntity) {
      dioramaEntity.setValue(DioramaWorld, 'stage', placedCount);
    }

    // Update HUD Badges
    const warmthPlaced = this.isFragmentPlaced('warmth');
    const lifePlaced = this.isFragmentPlaced('life');
    const hopePlaced = this.isFragmentPlaced('hope');

    if (this.badgeWarmth) {
      this.badgeWarmth.setProperties({
        text: warmthPlaced ? 'RESTORED' : 'WAITING',
        color: warmthPlaced ? '#10b981' : '#64748b',
      });
    }
    if (this.badgeLife) {
      this.badgeLife.setProperties({
        text: lifePlaced ? 'RESTORED' : 'WAITING',
        color: lifePlaced ? '#10b981' : '#64748b',
      });
    }
    if (this.badgeHope) {
      this.badgeHope.setProperties({
        text: hopePlaced ? 'RESTORED' : 'WAITING',
        color: hopePlaced ? '#10b981' : '#64748b',
      });
    }

    // Update ambience audio layer to match progress
    SoundEngine.setAmbienceStage(placedCount);

    // Trigger visual restoration pulse shockwave
    this.pulseActive = true;
    this.pulseProgress = 0.0;
    if (this.restorationPulseMesh) {
      this.restorationPulseMesh.visible = true;
      this.restorationPulseMesh.scale.set(0.1, 0.1, 0.1);
      const pulseMat = this.restorationPulseMesh.material as MeshBasicMaterial;
      if (pulseMat) {
        pulseMat.opacity = 0.85;
        if (placedCount === 1) pulseMat.color.setHex(0xf59e0b); // Warm amber
        else if (placedCount === 2) pulseMat.color.setHex(0x10b981); // Emerald life
        else if (placedCount === 3) pulseMat.color.setHex(0x38bdf8); // Azure dawn
      }
    }

    // Apply Transformation Stages
    if (placedCount === 1) {
      // Stage 1: Warmth restored — rain eases, beacon awakens
      this.targetRainOpacity = 0.45;
      this.targetBeamIntensity = 0.5;
      this.beamRotationSpeed = 2.0;
      if (this.promptText) {
        this.promptText.setProperties({
          text: "The lighthouse lantern rekindles. Warmth pierces the stormy dark. Now restore the island's living bloom.",
        });
      }
    } else if (placedCount === 2) {
      // Stage 2: Life restored — flora blooms, rain diminishes to mist
      this.targetRainOpacity = 0.15;
      this.targetFloraScale = 1.0;
      this.targetBeamIntensity = 0.8;
      this.beamRotationSpeed = 2.8;
      if (this.promptText) {
        this.promptText.setProperties({
          text: 'Moss carpets the crags and wild coastal flowers open! The storm gives way. Place the final beacon of Hope.',
        });
      }
    } else if (placedCount === 3) {
      // Stage 3: COMPLETE — Grand Sunrise & Immersive Expansion
      this.targetRainOpacity = 0.0;
      this.targetFloraScale = 1.0;
      this.targetBeamIntensity = 1.0;
      this.beamRotationSpeed = 3.5;

      // Expand Diorama gracefully into cinematic world surrounding player without near-clipping
      // Diorama grows slightly and shifts back so the island remains a beautifully framed monumental viewpoint
      this.targetDioramaScale = 0.85;
      this.targetDioramaY = 0.95;
      this.targetDioramaZ = -1.65;

      // Shift ocean material to brilliant tropical sunrise turquoise
      if (this.oceanMesh && (this.oceanMesh.material as MeshStandardMaterial).color) {
        (this.oceanMesh.material as MeshStandardMaterial).color.setHex(0x14b8a6);
        (this.oceanMesh.material as MeshStandardMaterial).roughness = 0.15;
      }

      // Transition Sky & IBL Environment to radiant golden sunrise
      this.queries.skies.entities.forEach((skyEntity) => {
        const skyCol = skyEntity.getVectorView(DomeGradient, 'sky');
        const eqCol = skyEntity.getVectorView(DomeGradient, 'equator');
        const groundCol = skyEntity.getVectorView(DomeGradient, 'ground');
        if (skyCol && eqCol && groundCol) {
          // Brilliant dawn sky: warm gold-peach sky, rose-coral horizon, warm turquoise ground
          skyCol[0] = 0.95; skyCol[1] = 0.58; skyCol[2] = 0.38; skyCol[3] = 1.0;
          eqCol[0] = 0.98; eqCol[1] = 0.78; eqCol[2] = 0.52; eqCol[3] = 1.0;
          groundCol[0] = 0.12; groundCol[1] = 0.28; groundCol[2] = 0.36; groundCol[3] = 1.0;
          skyEntity.setValue(DomeGradient, '_needsUpdate', true);
        }
      });

      this.queries.ibls.entities.forEach((iblEntity) => {
        const skyCol = iblEntity.getVectorView(IBLGradient, 'sky');
        const eqCol = iblEntity.getVectorView(IBLGradient, 'equator');
        if (skyCol && eqCol) {
          skyCol[0] = 0.95; skyCol[1] = 0.70; skyCol[2] = 0.50; skyCol[3] = 1.0;
          eqCol[0] = 0.98; eqCol[1] = 0.85; eqCol[2] = 0.65; eqCol[3] = 1.0;
          iblEntity.setValue(IBLGradient, 'intensity', 1.35);
          iblEntity.setValue(IBLGradient, '_needsUpdate', true);
        }
      });

      this.queries.dirLights.entities.forEach((lightEntity) => {
        const col = lightEntity.getVectorView(DirectionalLightComponent, 'color');
        if (col) {
          col[0] = 1.0; col[1] = 0.88; col[2] = 0.68; col[3] = 1.0;
          lightEntity.setValue(DirectionalLightComponent, 'intensity', 3.2);
        }
      });

      if (dioramaEntity) {
        dioramaEntity.setValue(DioramaWorld, 'isExpanded', true);
      }

      if (this.promptText) {
        this.promptText.setProperties({
          text: 'The sky breaks into radiant dawn. You stand inside the restored memory of The Last Light.',
        });
      }

      if (this.epiloguePanel) {
        this.epiloguePanel.setProperties({ display: 'flex' });
      }

      SoundEngine.playChime('complete');
    }
  }

  private isFragmentPlaced(fragId: string): boolean {
    const f = this.findFragment(
      (e) => e.getValue(MemoryFragment, 'fragmentId') === fragId,
    );
    return f ? (f.getValue(MemoryFragment, 'isSocketed') ?? false) : false;
  }

  /**
   * Resets the experience back to Stage 0
   */
  public restartExperience(): void {
    // Reset Diorama
    const dioramaEntity = this.getFirstDiorama();
    if (dioramaEntity) {
      dioramaEntity.setValue(DioramaWorld, 'stage', 0);
      dioramaEntity.setValue(DioramaWorld, 'isExpanded', false);
      dioramaEntity.setValue(DioramaWorld, 'expansionProgress', 0);
    }

    this.targetDioramaScale = 0.55;
    this.targetDioramaY = 0.95;
    this.targetDioramaZ = -1.35;
    this.targetFloraScale = 0.001;
    this.targetRainOpacity = 0.75;
    this.targetBeamIntensity = 0.18;
    this.beamRotationSpeed = 1.2;

    // Reset ocean to storm sea
    if (this.oceanMesh && (this.oceanMesh.material as MeshStandardMaterial).color) {
      (this.oceanMesh.material as MeshStandardMaterial).color.setHex(0x0f2238);
      (this.oceanMesh.material as MeshStandardMaterial).roughness = 0.2;
    }

    // Reset Sky & Lighting to stormy atmosphere
    this.queries.skies.entities.forEach((skyEntity) => {
      const skyCol = skyEntity.getVectorView(DomeGradient, 'sky');
      const eqCol = skyEntity.getVectorView(DomeGradient, 'equator');
      const groundCol = skyEntity.getVectorView(DomeGradient, 'ground');
      if (skyCol && eqCol && groundCol) {
        skyCol[0] = 0.06; skyCol[1] = 0.12; skyCol[2] = 0.22; skyCol[3] = 1.0;
        eqCol[0] = 0.12; eqCol[1] = 0.18; eqCol[2] = 0.28; eqCol[3] = 1.0;
        groundCol[0] = 0.04; groundCol[1] = 0.06; groundCol[2] = 0.10; groundCol[3] = 1.0;
        skyEntity.setValue(DomeGradient, '_needsUpdate', true);
      }
    });

    this.queries.ibls.entities.forEach((iblEntity) => {
      const skyCol = iblEntity.getVectorView(IBLGradient, 'sky');
      const eqCol = iblEntity.getVectorView(IBLGradient, 'equator');
      if (skyCol && eqCol) {
        skyCol[0] = 0.22; skyCol[1] = 0.32; skyCol[2] = 0.48; skyCol[3] = 1.0;
        eqCol[0] = 0.16; eqCol[1] = 0.24; eqCol[2] = 0.36; eqCol[3] = 1.0;
        iblEntity.setValue(IBLGradient, 'intensity', 0.55);
        iblEntity.setValue(IBLGradient, '_needsUpdate', true);
      }
    });

    this.queries.dirLights.entities.forEach((lightEntity) => {
      const col = lightEntity.getVectorView(DirectionalLightComponent, 'color');
      if (col) {
        col[0] = 0.82; col[1] = 0.88; col[2] = 1.0; col[3] = 1.0;
        lightEntity.setValue(DirectionalLightComponent, 'intensity', 2.4);
      }
    });

    // Reset Sockets & their rune lights
    this.queries.sockets.entities.forEach((s) => {
      s.setValue(MemorySocket, 'isOccupied', false);
      if (s.object3D) {
        const rune = s.object3D.getObjectByName('SocketRuneRing') as Mesh;
        if (rune && rune.material) {
          (rune.material as MeshBasicMaterial).opacity = 0.5;
        }
        const beam = s.object3D.getObjectByName('SocketGuideBeam') as Mesh;
        if (beam && beam.material) {
          (beam.material as MeshBasicMaterial).opacity = 0.18;
        }
      }
    });

    // Reset Fragments
    this.queries.fragments.entities.forEach((fragEntity) => {
      fragEntity.setValue(MemoryFragment, 'isSocketed', false);
      fragEntity.setValue(MemoryFragment, 'socketId', '');

      const fragId = fragEntity.getValue(MemoryFragment, 'fragmentId') || 'warmth';
      const initPos = this.initialPositions.get(fragId);
      if (initPos && fragEntity.object3D) {
        this.world.scene.attach(fragEntity.object3D);
        fragEntity.object3D.position.copy(initPos);
        fragEntity.object3D.scale.set(1.0, 1.0, 1.0);
      }

      // Restore grabbable components if removed
      if (!fragEntity.hasComponent(OneHandGrabbable)) {
        fragEntity.addComponent(OneHandGrabbable);
      }
      if (!fragEntity.hasComponent(DistanceGrabbable)) {
        fragEntity.addComponent(DistanceGrabbable, { movementMode: 'MoveTowardsTarget' });
      }
      if (!fragEntity.hasComponent(RayInteractable)) {
        fragEntity.addComponent(RayInteractable);
      }
    });

    // Reset HUD
    if (this.badgeWarmth) this.badgeWarmth.setProperties({ text: 'WAITING', color: '#64748b' });
    if (this.badgeLife) this.badgeLife.setProperties({ text: 'WAITING', color: '#64748b' });
    if (this.badgeHope) this.badgeHope.setProperties({ text: 'WAITING', color: '#64748b' });
    if (this.promptText) {
      this.promptText.setProperties({
        text: 'The storm batters the island. Place the three glowing memory fragments into their stone shrines to heal the world.',
      });
    }
    if (this.epiloguePanel) {
      this.epiloguePanel.setProperties({ display: 'none' });
    }

    SoundEngine.setAmbienceStage(0);
    this.pulseActive = false;
    this.pulseProgress = 1.0;
    if (this.restorationPulseMesh) {
      this.restorationPulseMesh.visible = false;
    }
    SoundEngine.playChime('reset');
  }

  update(delta: number): void {
    // 1. Smooth lerp for diorama scale & position (Expansion animation)
    const dioramaEntity = this.getFirstDiorama();
    if (dioramaEntity && dioramaEntity.object3D) {
      this.currentDioramaScale += (this.targetDioramaScale - this.currentDioramaScale) * Math.min(1, delta * 2.5);
      this.currentDioramaY += (this.targetDioramaY - this.currentDioramaY) * Math.min(1, delta * 2.5);
      this.currentDioramaZ += (this.targetDioramaZ - this.currentDioramaZ) * Math.min(1, delta * 2.5);

      dioramaEntity.object3D.scale.setScalar(this.currentDioramaScale);
      dioramaEntity.object3D.position.y = this.currentDioramaY;
      dioramaEntity.object3D.position.z = this.currentDioramaZ;

      // Also ensure sockets follow diorama scale and position
      const isExpanded = dioramaEntity.getValue(DioramaWorld, 'isExpanded');
      if (isExpanded) {
        // Keep sockets hidden or scaled with diorama during full immersion
      }
    }

    // 2. Smooth lerp for flora growth
    this.currentFloraScale += (this.targetFloraScale - this.currentFloraScale) * Math.min(1, delta * 2.0);
    if (!this.floraGroup && dioramaEntity?.object3D) {
      const flora = dioramaEntity.object3D.getObjectByName('FloraGroup');
      if (flora) this.floraGroup = flora as unknown as Entity;
    }
    if (this.floraGroup && (this.floraGroup as unknown as Mesh).scale) {
      (this.floraGroup as unknown as Mesh).scale.setScalar(Math.max(0.001, this.currentFloraScale));
    }

    // 3. Smooth lerp for rain particles
    this.currentRainOpacity += (this.targetRainOpacity - this.currentRainOpacity) * Math.min(1, delta * 3.0);
    if (!this.rainPoints && dioramaEntity?.object3D) {
      const rain = dioramaEntity.object3D.getObjectByName('RainPoints');
      if (rain) this.rainPoints = rain as Points;
    }
    if (this.rainPoints) {
      const mat = this.rainPoints.material as PointsMaterial;
      if (mat) mat.opacity = this.currentRainOpacity;

      // Animate falling rain
      if (this.currentRainOpacity > 0.01) {
        const geo = this.rainPoints.geometry;
        const posAttr = geo.getAttribute('position');
        const count = posAttr.count;
        for (let i = 0; i < count; i++) {
          let y = posAttr.getY(i) - delta * 4.2;
          if (y < 0.1) y = 3.5;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }
    }

    // 4. Rotating Lighthouse Beam & Ocean handle
    if (!this.oceanMesh && dioramaEntity?.object3D) {
      const ocean = dioramaEntity.object3D.getObjectByName('OceanMesh');
      if (ocean) this.oceanMesh = ocean as Mesh;
    }
    if (!this.lighthouseBeamGroup && dioramaEntity?.object3D) {
      const beam = dioramaEntity.object3D.getObjectByName('LighthouseBeamGroup');
      if (beam) this.lighthouseBeamGroup = beam as unknown as Entity;
    }
    if (this.lighthouseBeamGroup && (this.lighthouseBeamGroup as unknown as Mesh).rotation) {
      (this.lighthouseBeamGroup as unknown as Mesh).rotation.y += this.beamRotationSpeed * delta;
    }

    // 5. Restoration Pulse Shockwave animation
    if (!this.restorationPulseMesh && dioramaEntity?.object3D) {
      const pulse = dioramaEntity.object3D.getObjectByName('RestorationPulseMesh');
      if (pulse) {
        this.restorationPulseMesh = pulse as Mesh;
        this.restorationPulseMesh.visible = this.pulseActive;
      }
    }
    if (this.pulseActive && this.restorationPulseMesh) {
      this.pulseProgress += delta * 1.6; // ~0.62 second shockwave burst
      if (this.pulseProgress >= 1.0) {
        this.pulseActive = false;
        this.restorationPulseMesh.visible = false;
      } else {
        const currentScale = 0.1 + this.pulseProgress * 3.8;
        this.restorationPulseMesh.scale.set(currentScale, currentScale, currentScale);
        const pulseMat = this.restorationPulseMesh.material as MeshBasicMaterial;
        if (pulseMat) {
          pulseMat.opacity = Math.max(0, 0.85 * (1.0 - this.pulseProgress));
        }
      }
    }

    // 6. Idle breathing & sparkle orbit for unplaced memory fragments
    this.animTime += delta;
    const pulseFactor = 1.0 + 0.08 * Math.sin(this.animTime * 3.2);

    this.queries.fragments.entities.forEach((f) => {
      const isSocketed = f.getValue(MemoryFragment, 'isSocketed');
      if (!isSocketed && f.object3D) {
        // Subtle gem breathing pulse
        const gem = f.object3D.getObjectByName('FragmentGemMesh');
        if (gem) {
          gem.scale.setScalar(pulseFactor);
        }

        // Rotate sparkles motes
        const sparkles = f.object3D.getObjectByName('FragmentSparkles');
        if (sparkles) {
          sparkles.rotation.y += 1.4 * delta;
          sparkles.rotation.x += 0.8 * delta;
        }

        // Rotate outer halo ring
        const ring = f.object3D.getObjectByName('FragmentRingMesh');
        if (ring) {
          ring.rotation.z += 1.8 * delta;
          ring.rotation.x += 1.2 * delta;
        }
      }
    });
  }
}
