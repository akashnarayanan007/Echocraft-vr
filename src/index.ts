/**
 * ECHOCRAFT VR — Entry Point
 * Build a Memory. Step Inside Its Story.
 */

import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { EchoCraftStorySystem } from './echocraft-systems.js';

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  world.registerSystem(EchoCraftStorySystem);
});
