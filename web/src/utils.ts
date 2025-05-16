import { BN } from "@coral-xyz/anchor";
import { solanaNetwork, solanaRpcUrl } from "./constants"

export function solanaTxLink(tx: string) {
  if (solanaNetwork === "localnet") {
    return `https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=${solanaRpcUrl}`;
  }
  return `https://explorer.solana.com/tx/${tx}?cluster=${solanaNetwork}`;
}

export function timeDifference(current: number, previous: number) {

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed/1000) + ' seconds ago';
  }

  else if (elapsed < msPerHour) {
    return Math.round(elapsed/msPerMinute) + ' minutes ago';
  }

  else if (elapsed < msPerDay ) {
    return Math.round(elapsed/msPerHour ) + ' hours ago';
  }

  else if (elapsed < msPerMonth) {
    return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
  }

  else if (elapsed < msPerYear) {
    return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
  }

  else {
    return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export function firstByte(value: number) {
  return value & 0xFF;
}

export function firstByteBN(value: BN) {
  return value.words[0] & 0xFF;
}

export function secondByteBN(value: BN) {
  return (value.words[0] >> 8) & 0xFF;
}

export function countBits(value: number) {
  let count = 0;
  while (value) {
    count += value & 1;
    value >>= 1;
  }
  return count;
}

export function formatAddressShort(address: string) {
  return address.slice(0, 4) + "..." + address.slice(-4);
}
