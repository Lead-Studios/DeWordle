# DeWordle

DeWordle is a decentralized, blockchain-based word-guessing game built on the StarkNet ecosystem. It merges the fun and challenge of Wordle with the transparency and security of blockchain technology.

## Features

- **Daily Decentralized Word Challenges**: A new word is generated every day and stored securely on-chain.
- **Transparent Gameplay**: Game logic is stored on the blockchain, ensuring fair and verifiable outcomes.
- **Wallet Integration**: Compatible with StarkNet wallets like Argent X for gameplay interactions.
- **On-Chain Rewards**: Players earn tokens or NFTs for successful guesses or streaks.
- **Leaderboards**: Track top players with a decentralized leaderboard.

## Tech Stack

### Frontend

- **Framework**: Next.js (React-based)
- **Styling**: Tailwind CSS for a sleek and responsive design.
- **Wallet Integration**: `starknet.js` for connecting to StarkNet wallets.

### Smart Contracts

- **Language**: Cairo for StarkNet smart contract development.
- **Features**:
  - On-chain storage for the word of the day.
  - Validation of guesses with feedback on correctness.
  - Reward distribution for streaks or successful games.

### Backend & Storage

- **Storage**: IPFS for off-chain metadata (e.g., leaderboard details).
- **Database**: Metadata stored on-chain to ensure decentralization.

### Deployment

- **Frontend Hosting**: Vercel for hosting the Next.js application.
- **Blockchain**: StarkNet for smart contract deployment.

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/dewordle.git
cd dewordle
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Smart Contract Compilation

```bash
cd contracts
starknet-compile wordle_contract.cairo --output wordle_contract_compiled.json
```

### Smart Contract Deployment

```bash
starknet deploy --contract wordle_contract_compiled.json --network alpha
```

### Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
NEXT_PUBLIC_STARKNET_NETWORK=alpha
NEXT_PUBLIC_CONTRACT_ADDRESS=your-deployed-contract-address
```

## Project Structure

```
dewordle/
├── contracts/          # StarkNet Cairo contracts
├── frontend/           # Next.js application
├── README.md           # Project documentation
└── .env                # Environment variables
```

## Workflow

1. **Login**: Users connect their StarkNet wallet.
2. **Play**:
   - Guess the word of the day within 6 attempts.
   - Receive feedback on correct letters and positions.
3. **Rewards**:
   - Earn tokens or NFTs for successful guesses and streaks.
4. **Leaderboard**:
   - Track top players and their achievements on a decentralized leaderboard.
5. **Blockchain Integration**:
   - Transactions signed via StarkNet wallets.
   - Game logic and rewards managed through smart contracts.

## Development Roadmap

### MVP Development

- Implement core gameplay mechanics (word guessing and feedback).
- Integrate wallet connection and transaction signing.
- Deploy smart contracts for word storage and validation.
- Build a minimal leaderboard.

### Advanced Features

- **Streak Rewards**: Enhanced rewards for consecutive wins.
- **Social Sharing**: Share scores and achievements directly from the app.
- **NFT Integration**: Mint unique NFTs for rare achievements.
- **Advanced Leaderboards**: Global rankings with filters for streaks, rewards, and participation.
- **Custom Game Modes**: Allow players to create private games.

### Launch

- Deploy smart contracts on StarkNet mainnet.
- Host the application on Vercel or similar services.

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Contact

For inquiries, reach out to us on TG at [https://t.me/DeWprdle](https://t.me/+GNI5Wz3xioZhYzE8).

---

**Built for fun, fairness, and decentralization!**
