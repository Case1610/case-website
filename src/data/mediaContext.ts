import { createContext, useContext } from 'react';
import type { MediaManifest } from './mediaTypes';

export type MediaState =
  | { status: 'loading' }
  | { status: 'ready'; manifest: MediaManifest }
  | { status: 'error' };

export const MediaContext = createContext<MediaState>({ status: 'loading' });

export const useMedia = () => useContext(MediaContext);
