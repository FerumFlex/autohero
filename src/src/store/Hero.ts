import { makeAutoObservable } from "mobx";
import { IDL, Autohero } from "@/types/autohero";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { programId } from "@/constants";

const SECONDS_IN_DAY = 86400;

export class HeroStore {
  connection: any = null;
  wallet: any = null;
  heroAddress: string = "";
  hero: any = null;
  isReady: boolean = false;
  currentUnixTimestamp: number = Date.now() / 1000;

  constructor() {
    makeAutoObservable(this);
  }

  async setConnectionParams(connection: any, wallet: any) {
    this.connection = connection;
    this.wallet = wallet;
    this.loadInfo();
    this.loadHero();
  }

  loadInfo = () => {
    if (!this.connection || !this.wallet || !this.heroAddress) {
      return;
    }

    const provider = new AnchorProvider(
      this.connection,
      this.wallet as unknown as AnchorWallet,
      {}
    );
    const program = new Program<Autohero>(IDL, programId, provider);
    program.account.hero.fetch(new PublicKey(this.heroAddress)).then(data => {
      // console.log("Hero data loaded: ", data);
      this.setHero(data);
    });
  }

  setHero(hero: any) {
    this.hero = hero;
    this.isReady = true;
  }

  clearHero() {
    this.hero = null;
    this.isReady = false;
    this.heroAddress = "";
    const key = this.wallet.publicKey.toBase58();
    localStorage.removeItem(key);
  }

  loadHero() {
    if (this.heroAddress) {
      return;
    }
    if (!this.wallet) {
      return;
    }

    const heroAddress = localStorage.getItem(this.wallet.publicKey.toBase58());
    if (heroAddress) {
      // console.log("Hero address loaded: ", heroAddress);
      this.heroAddress = heroAddress;
    }
  }

  setHeroAddress(heroAddress: string) {
    this.heroAddress = heroAddress;
    const key = this.wallet.publicKey.toBase58();
    localStorage.setItem(key, this.heroAddress);
  }

  setCurrentUnixTimestamp() {
    this.currentUnixTimestamp = Date.now() / 1000;
  }

  isEventApplied(event: BN) {
    for (let appliedEvent of this.hero.appliedEvents) {
      if (appliedEvent.toString() === event.toString()) {
        return true;
      }
    }
    return false;
  }

  get selector() {
    return this.hero.random;
  }

  get exp(): number {
    return this.currentUnixTimestamp - this.hero.created + this.hero.additionalExp;
  }

  get level(): number {
    const days: number = this.exp / SECONDS_IN_DAY;
    return 100.0 * Math.log10(days + 1.0) + 1.0;
  }

  get levelInt(): number {
    return Math.floor(this.level);
  }

  get attack(): number {
    return this.hero.baseAttack + this.levelInt;
  }

  get defense(): number {
    return this.hero.baseDefense + this.levelInt;
  }

  get maxHitpoints(): number {
    return this.levelInt * 10;
  }

  get hitpoints(): number {
    const now: number = this.currentUnixTimestamp;
    const maxHits: number = this.maxHitpoints;
    const heal: number = Math.floor((now - this.hero.deltaHitpointsUpdate) / 10);
    let currentHits: number = maxHits - this.hero.deltaHitpoints + heal;
    return currentHits > maxHits ? maxHits : currentHits;
  }
}