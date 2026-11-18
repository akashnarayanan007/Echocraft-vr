/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineComponents } from '@iwsdk/core';
import {
  DioramaWorld,
  LighthouseBeam,
  MemoryFragment,
  MemorySocket,
} from './echocraft-components.js';

export default defineComponents([
  MemoryFragment,
  MemorySocket,
  DioramaWorld,
  LighthouseBeam,
]);
