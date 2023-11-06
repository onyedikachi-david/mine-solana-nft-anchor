import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MineSolanaNftAnchor } from "../target/types/mine_solana_nft_anchor";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  MPL_TOKEN_METADATA_PROGRAM_ID,
  findMasterEditionPda,
  findMetadataPda,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { publicKey } from "@metaplex-foundation/umi";

describe("mine-solana-nft-anchor", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace
    .MineSolanaNftAnchor as Program<MineSolanaNftAnchor>;

  const signer = provider.wallet;

  const umi = createUmi("https://api.devnet.solana.com")
    .use(walletAdapterIdentity(signer))
    .use(mplTokenMetadata());

  const mint = anchor.web3.Keypair.generate();

  // deriving the associated token account for the mint account

  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    signer.publicKey
  );

  // Derive the metadata account
  let metadataAccount = findMetadataPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  // derive the master edition pda

  let masterEditionAccount = findMasterEditionPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  /*

  const umi = createUmi();

umi.use(nftStorageUploader({ token: "YOUR NFT.STORAGE API KEY" }));


const imageBuffer = readFileSync('PATH TO IMAGE FILE')
async function uploader() {
  const [imageUri] = await umi.uploader.upload([
    createGenericFile(imageBuffer, 'FILE NAME.PNG'),
  ]);

  // Upload the JSON metadata.
  const uri = await umi.uploader.uploadJson({
    name: 'NFT #1',
    description: 'description 1',
    image: imageUri,
  })
  console.log("uri", uri);
}

uploader();
  */

  //  Your transaction signature 2G48ZKakxot4Ui39cK421VbPnzrALRXMr18C5MAvReNKJae8Qwh51iBiXj4Z2AnKTTEbC9mxBwsc8kT2oRNzeCY1
  // mint nft tx: https://explorer.solana.com/tx/2G48ZKakxot4Ui39cK421VbPnzrALRXMr18C5MAvReNKJae8Qwh51iBiXj4Z2AnKTTEbC9mxBwsc8kT2oRNzeCY1?cluster=devnet
  // minted nft: https://explorer.solana.com/address/HVPSayCEJWCH1jDmfTUkHZscBuiDKnDUNX4TQAWPpS6G?cluster=devnet
  //Program Id: FoYSrfkztZJXMBa3Xv96JA7Khr5Tyccx6Q9Z4V8k7DQc

  it("Mints NFT!", async () => {
    const umi = createUmi("https://api.devnet.solana.com")
      .use(walletAdapterIdentity(signer))
      .use(mplTokenMetadata());

    const mint = anchor.web3.Keypair.generate();

    // deriving the associated token account for the mint account

    const associatedTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      signer.publicKey
    );

    // Derive the metadata account
    let metadataAccount = findMetadataPda(umi, {
      mint: publicKey(mint.publicKey),
    })[0];

    // derive the master edition pda

    let masterEditionAccount = findMasterEditionPda(umi, {
      mint: publicKey(mint.publicKey),
    })[0];

    const metadata = {
      name: "Life",
      symbol: "LFE",
      uri: "https://raw.githubusercontent.com/onyedikachi-david/mine-solana-nft-anchor/main/metadata.json",
    };
    // Add your test here.
    const tx = await program.methods
      .initialize(metadata.name, metadata.symbol, metadata.uri)
      .accounts({
        signer: provider.publicKey,
        mint: mint.publicKey,
        associatedTokenAccount,
        metadataAccount,
        masterEditionAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();
    console.log("Your transaction signature", tx);
    console.log(
      `mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
    console.log(
      `minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
    );
  });
});
