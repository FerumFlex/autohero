import { writeFileSync, readFileSync } from 'fs';

const storageFile = "storage.txt";

export const readStorageAddress = () => {
    return readFileSync(storageFile, "utf-8");
}

export const writeStorageAddress = (address: string) => {
    writeFileSync(storageFile, address);
}


export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
