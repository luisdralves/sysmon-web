import { atom } from 'jotai';
import type { MutableRefObject } from 'react';

export const highFpsAtom = atom(true);
export const siAtom = atom(false);
export const historyAtom = atom<MutableRefObject<HistoryNormalized>>({ current: null! });
