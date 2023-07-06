# Decentralized-Ecommerce-Network

Decentralized Ecommerce Network(DEN) is a decentralized ecommerce platform for connecting buyers and sellers directly(peer-to-peer) without any intermediatory using Solana Blockchain.

## Abstract

The concept of decentralized ecommerce has gained significant attention in recent years
as a potential alternative to traditional online marketplaces. Decentralized ecommerce
utilizes blockchain technology to facilitate peer-to-peer transactions, eliminating the need
for a central authority to oversee and facilitate the exchange of goods and services. This
approach offers a number of potential benefits, including reduced fees, increased security
and privacy, and greater control for users over their own data.

As with any emerging technology, there are challenges and opportunities presented by
decentralized ecommerce. One of the main problems that current decentralized
marketplace faces are they are based upon Ethereum blockchain technology. That in itself
consumes a lot of gas fees. Because Ethereum block time and block size is large thereby
the number of transactions is low.

Digital asset marketplaces or DAM provide a complete framework for their users for
buying and selling their project. Since its beginning in 2009, the market for digital assets
has changed. Following its rapid expansion in 2016–18, there were major downward
corrections in 2018–19. DAM acts as a trusted intermediary between issuers and
investors of digital assets. They propose a set of tools and services to facilitate
transactions between the different users. To build this kind of application you would
require some Ethereum smart contracts written in the solidity programming language.
You would require a web application and web3.js library to turn this web application into
a blockchain website. While building DAM in Ethereum it would cost more in terms of
gas fees but we can reduce this by using Solana blockchain because it uses a new type of
technology called PROOF OF HISTORY. It would increase the number of transactions
and decrease the block time.

## Technologies

Frontend: React + Chakra UI + Vite
Decentralized Storage: Arweave
Blockchain: Solana + Anchor Framework + Rust

## How to run the project locally:

1. Install solana tool suite, solana-test-validator, rust, anchor (refer docs).
2. Use solana locally:
   ```
   solana config set --url localhost
   ```
3. Run a local ledger:
   ```
   solana-test-validator
   ```
4. Clone the repo and change directory to it.
5. Build the program:
   ```
   anchor build
   ```
   Update the Program ID of each program. To get the updated program id, run the command:
   ```
   anchor keys list
   ```
6. Deploy the program:
   ```
   anchor deploy
   ```
7. Run local arweave instance:
   ```
   npx arlocal
   ```
8. Run react locally (or build):
   ```
   cd app
   npm run dev
   ```
