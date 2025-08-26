'use client';

import type {MowerConfig} from '@/components/types';
import {useMowers} from '@/stores/configStore';
import {createContext, useContext, useState, type PropsWithChildren} from 'react';

interface SelectedMowerContextType {
  selectedMower: MowerConfig | null;
  setSelectedMower: (mower: MowerConfig) => void;
}

const SelectedMowerContext = createContext<SelectedMowerContextType | undefined>(undefined);

export function SelectedMowerProvider({children}: PropsWithChildren) {
  const mowers = useMowers();
  const [selectedMower, setSelectedMower] = useState<MowerConfig | null>(mowers.length > 0 ? mowers[0] : null);
  return (
    <SelectedMowerContext.Provider value={{selectedMower, setSelectedMower}}>{children}</SelectedMowerContext.Provider>
  );
}

export function useSelectedMower() {
  return useContext(SelectedMowerContext)!;
}
