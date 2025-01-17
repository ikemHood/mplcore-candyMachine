import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    addConfigLines,
    create as createCandyMachine,
    mplCandyMachine as mplCoreCandyMachine
} from '@metaplex-foundation/mpl-core-candy-machine'
import { mplCore, createCollection } from "@metaplex-foundation/mpl-core";
import { some, sol, dateTime, none } from '@metaplex-foundation/umi'
import {
    type TransactionBuilderSendAndConfirmOptions,
    createSignerFromKeypair,
    generateSigner,
    signerIdentity,
} from "@metaplex-foundation/umi"
import type { PublicKey as umiPublicKey } from "@metaplex-foundation/umi-public-keys";
import type { Keypair as umiKeypair } from "@metaplex-foundation/umi";
import config, { configLines } from "./config";
import { Keypair as web3Keypair } from "@solana/web3.js";
import fs from 'fs'
import 'dotenv/config';

//create UMI to connect solana devnet.
const umi = createUmi("https://api.devnet.solana.com", "processed").use(
    mplCore()
).use(mplCoreCandyMachine());

//create a keypairs
const WALLET = web3Keypair.fromSecretKey(new Uint8Array(config.signer! as any));
const wallet_publicKey: umiPublicKey =
    WALLET.publicKey.toBase58() as umiPublicKey;
const payer_keypair: umiKeypair = {
    publicKey: wallet_publicKey,
    secretKey: WALLET.secretKey,
};
const COLLECTION = generateSigner(umi);
const CANDY_MACHINE = generateSigner(umi);
const UPDATE_AUTHORITY = generateSigner(umi);

const payer = createSignerFromKeypair(umi, payer_keypair);
const collection = createSignerFromKeypair(umi, COLLECTION);
const candyMachine = createSignerFromKeypair(umi, CANDY_MACHINE);
const updateAuthority = createSignerFromKeypair(umi, UPDATE_AUTHORITY);

umi.use(signerIdentity(payer));

const txConfig: TransactionBuilderSendAndConfirmOptions = {
    send: { skipPreflight: true },
    confirm: { commitment: "processed" },
};

let tx = await createCollection(umi, {
    collection,
    name: "Ai Football fantasy",
    uri: "https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/abdoulaye_ndiaye.json",
}).sendAndConfirm(umi);

console.log("Collection created")

const createIx = await createCandyMachine(umi, {
    candyMachine,
    collection: collection.publicKey,
    collectionUpdateAuthority: umi.identity,
    itemsAvailable: 20,
    authority: umi.identity.publicKey,
    isMutable: true,
    hiddenSettings: none(),
    configLineSettings: none(),
    guards: {
        botTax: some({ lamports: sol(0.0001), lastInstruction: true }),
        solPayment: some({
            lamports: sol(0.01),
            destination: updateAuthority.publicKey
        }),
        // startDate: some({ date: dateTime(new Date().getTime() + 1000 * 60 * 1) }),
    },
});

await createIx.sendAndConfirm(umi);

console.log("Candy machine created")

// Split config lines into smaller batches
async function addConfigLinesInBatches(
    umi: any,
    candyMachinePublicKey: any,
    configLines: any[],
    batchSize: number = 5
) {
    let currentIndex = 0;

    for (let i = 0; i < configLines.length; i += batchSize) {
        const batch = configLines.slice(i, i + batchSize);
        const insertIx = await addConfigLines(umi, {
            candyMachine: candyMachinePublicKey,
            index: currentIndex,
            configLines: batch,
        });

        await insertIx.sendAndConfirm(umi, txConfig);
        console.log(`Added batch ${Math.floor(i / batchSize) + 1} of config lines`);

        currentIndex += batch.length;
    }
}

await addConfigLinesInBatches(umi, candyMachine.publicKey, configLines);

console.log("All config lines added");

const accountKeys = {
    wallet: {
        publicKey: payer_keypair.publicKey,
        secretKey: Array.from(payer_keypair.secretKey)
    },
    collection: {
        publicKey: COLLECTION.publicKey,
        secretKey: Array.from(COLLECTION.secretKey)
    },
    candyMachine: {
        publicKey: CANDY_MACHINE.publicKey,
        secretKey: Array.from(CANDY_MACHINE.secretKey)
    },
    updateAuthority: {
        publicKey: UPDATE_AUTHORITY.publicKey,
        secretKey: Array.from(UPDATE_AUTHORITY.secretKey)
    }
};

fs.writeFileSync(
    'account-keys.json',
    JSON.stringify(accountKeys, null, 2)
);

console.log("Account keys saved")
