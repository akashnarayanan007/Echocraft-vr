/**
 * ECHOCRAFT VR — ECS Components
 * System-free module containing component declarations for world state, fragments, and sockets.
 */

import { createComponent, Types } from '@iwsdk/core';

export const MemoryFragment = createComponent('MemoryFragment', {
  fragmentId: { type: Types.String, default: 'warmth' },
  isSocketed: { type: Types.Boolean, default: false },
  socketId: { type: Types.String, default: '' },
  initialX: { type: Types.Float32, default: 0 },
  initialY: { type: Types.Float32, default: 0 },
  initialZ: { type: Types.Float32, default: 0 },
});

export const MemorySocket = createComponent('MemorySocket', {
  socketId: { type: Types.String, default: 'socket-warmth' },
  acceptedFragmentId: { type: Types.String, default: 'warmth' },
  isOccupied: { type: Types.Boolean, default: false },
  snapRadius: { type: Types.Float32, default: 0.35 },
});

export const DioramaWorld = createComponent('DioramaWorld', {
  stage: { type: Types.Int32, default: 0 },
  expansionProgress: { type: Types.Float32, default: 0 },
  isExpanded: { type: Types.Boolean, default: false },
});

export const LighthouseBeam = createComponent('LighthouseBeam', {
  rotationSpeed: { type: Types.Float32, default: 1.0 },
  intensity: { type: Types.Float32, default: 0.2 },
});
