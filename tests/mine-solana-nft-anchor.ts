import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MineSolanaNftAnchor } from "../target/types/mine_solana_nft_anchor";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  findMasterEditionPda,
  findMetadataPda,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { getAssociatedTokenAddress } from "@solana/spl-token";
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
  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
