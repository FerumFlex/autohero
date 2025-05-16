import * as anchor from "@coral-xyz/anchor";

import { PublicKey } from "@solana/web3.js";
export const { SystemProgram } = anchor.web3;

export const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ID as string);

export const [storageId, storageBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("events_storage")],
  new PublicKey(programId)
);
export const [tokenId, tokenBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("mint")],
  new PublicKey(programId)
);
export const apiUrl = import.meta.env.VITE_API_URL as string;
export const solanaNetwork = import.meta.env.VITE_SOLANA_NETWORK as string;
export const solanaRpcUrl = import.meta.env.VITE_SOLANA_RPC_URL as string;

export const races = [
  { id: 'human', label: 'Human', icon: '👤', value: 1 },
  { id: 'elf', label: 'Elf', icon: '🧝', value: 2 },
  { id: 'dwarf', label: 'Dwarf', icon: '🧔', value: 3 },
  { id: 'orc', label: 'Orc', icon: '👹', value: 4 },
  { id: 'dragon', label: 'Dragon', icon: '🐉', value: 5 },
];

export const racesMap = new Map(races.map(race => [race.value, race]));
export const getRaceByLabel = (label: string) => {
  for (const race of races) {
    if (race.label === label) {
      return race;
    }
  }
  return null;
};
