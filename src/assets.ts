/**
 * ECHOCRAFT VR — Asset Catalog
 * Shared runtime/editor catalog of procedural 3D models and spatial UI panels.
 * Evaluated deterministically in both application and editor realms.
 */

import { AssetType, defineAssets } from '@iwsdk/core';
import {
  createIslandDiorama,
  createMemoryAltarPlinth,
  createMemoryFragment,
  createMemorySocket,
} from './scene-assets/echocraft.scene-asset.js';

const publicAssetUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/u, '')}`;

const uikitml = (fileName: string, name: string) => ({
  url: publicAssetUrl(`ui/${fileName}`),
  type: AssetType.UIKitML,
  name,
});

export default defineAssets({
  // The Island Diorama and Lighthouse
  'island-diorama': createIslandDiorama(),

  // Memory Sockets
  'socket-warmth': createMemorySocket('warmth'),
  'socket-life': createMemorySocket('life'),
  'socket-hope': createMemorySocket('hope'),

  // Memory Fragments
  'fragment-warmth': createMemoryFragment('warmth'),
  'fragment-life': createMemoryFragment('life'),
  'fragment-hope': createMemoryFragment('hope'),

  // Player Seated Altar
  'altar-plinth': createMemoryAltarPlinth(),

  // Spatial UI HUD
  'echocraft-hud': uikitml('echocraft-hud.uikitml', 'EchoCraft HUD'),
});
