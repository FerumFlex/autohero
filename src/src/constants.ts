import * as anchor from "@coral-xyz/anchor";

import { PublicKey } from "@solana/web3.js";
export const { SystemProgram } = anchor.web3;

export const programId = new PublicKey("DCXeBRXR5mYGomEe8tSrnsWLu2SW8G6VxAU5bu3eNx9D");
export const storageId = new PublicKey("DygB9uGJeHr8cyT3UbKZ86uoGadE8id5AfCi4BujmDTc");
export const apiUrl = import.meta.env.VITE_API_URL as string;
export const solanaNetwork = import.meta.env.VITE_SOLANA_NETWORK as string;