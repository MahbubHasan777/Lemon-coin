'use strict';
const { Injectable, Dependencies } = require('@nestjs/common');
const { getModelToken } = require('@nestjs/mongoose');
const { TransactionUtil, BlockUtil, ChainUtil } = require('./blockchain.utils');

@Injectable()
@Dependencies(getModelToken('Block'), getModelToken('Transaction'), getModelToken('Wallet'))
class BlockchainService {
    constructor(
        blockModel,
        transactionModel,
        walletModel
    ) {
        this.blockModel = blockModel;
        this.transactionModel = transactionModel;
        this.walletModel = walletModel;
        this.difficulty = 2;
        this.miningReward = 10;
        this.pendingTransactions = [];

        this.initializeChain();
    }

    async initializeChain() {
        const blockCount = await this.blockModel.countDocuments();
        if (blockCount === 0) {
            const genesis = ChainUtil.createGenesisBlock();
            await this.blockModel.create(genesis);
            console.log('Genesis block created');
        }
    }

    // Block Methods
    async getAllBlocks(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const blocks = await this.blockModel
            .find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
        const total = await this.blockModel.countDocuments();
        return { blocks, total, page, limit };
    }

    async getBlockByHash(hash) {
        return await this.blockModel.findOne({ hash });
    }

    async getLatestBlock() {
        return await this.blockModel.findOne().sort({ timestamp: -1 });
    }

    // Transaction Methods
    async getAllTransactions(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const transactions = await this.transactionModel
            .find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
        const total = await this.transactionModel.countDocuments();
        return { transactions, total, page, limit };
    }

    async getTransactionByHash(hash) {
        return await this.transactionModel.findOne({ hash });
    }

    async createTransaction(fromAddress, toAddress, amount, privateKey) {
        const timestamp = Date.now();
        const hash = TransactionUtil.calculateHash(fromAddress, toAddress, amount, timestamp);
        const signature = TransactionUtil.sign(hash, privateKey);

        // Verify signature
        if (!TransactionUtil.verify(hash, signature, fromAddress)) {
            throw new Error('Invalid signature');
        }

        // Check balance
        const balance = await this.getBalance(fromAddress);
        if (balance < amount) {
            throw new Error('Insufficient balance');
        }

        const tx = {
            hash,
            fromAddress,
            toAddress,
            amount,
            timestamp,
            signature,
            status: 'pending'
        };

        await this.transactionModel.create(tx);
        this.pendingTransactions.push(tx);

        return tx;
    }

    async getPendingTransactions() {
        return this.pendingTransactions;
    }

    // Mining Methods
    async minePendingTransactions(minerAddress) {
        // Add mining reward transaction
        const rewardTx = {
            hash: TransactionUtil.calculateHash(null, minerAddress, this.miningReward, Date.now()),
            fromAddress: null,
            toAddress: minerAddress,
            amount: this.miningReward,
            timestamp: Date.now(),
            signature: null,
            status: 'confirmed'
        };

        const transactions = [...this.pendingTransactions, rewardTx];
        const txHashes = transactions.map(tx => tx.hash);

        const latestBlock = await this.getLatestBlock();
        const timestamp = Date.now();
        const { hash, nonce } = BlockUtil.mineBlock(
            latestBlock.hash,
            timestamp,
            txHashes,
            this.difficulty
        );

        const newBlock = {
            hash,
            previousHash: latestBlock.hash,
            timestamp,
            nonce,
            difficulty: this.difficulty,
            miner: minerAddress,
            transactions: txHashes,
            transactionCount: transactions.length
        };

        await this.blockModel.create(newBlock);

        // Save reward transaction
        await this.transactionModel.create(rewardTx);

        // Update pending transactions to confirmed
        for (const tx of this.pendingTransactions) {
            await this.transactionModel.updateOne(
                { hash: tx.hash },
                { status: 'confirmed', blockHash: hash }
            );
        }

        // Update wallet balances
        await this.updateWalletBalance(minerAddress, this.miningReward);
        for (const tx of this.pendingTransactions) {
            if (tx.fromAddress) {
                await this.updateWalletBalance(tx.fromAddress, -tx.amount);
            }
            await this.updateWalletBalance(tx.toAddress, tx.amount);
        }

        this.pendingTransactions = [];

        return newBlock;
    }

    // Wallet/Address Methods
    async getBalance(address) {
        const wallet = await this.walletModel.findOne({ address });
        return wallet ? wallet.balance : 0;
    }

    async getAddressInfo(address) {
        let wallet = await this.walletModel.findOne({ address });
        if (!wallet) {
            wallet = { address, balance: 0, transactionCount: 0 };
        }

        const transactions = await this.transactionModel
            .find({ $or: [{ fromAddress: address }, { toAddress: address }] })
            .sort({ timestamp: -1 })
            .limit(50);

        return { ...wallet.toObject?.() || wallet, transactions };
    }

    async updateWalletBalance(address, amount) {
        await this.walletModel.updateOne(
            { address },
            {
                $inc: { balance: amount, transactionCount: 1 },
                $set: { lastSeen: new Date() },
                $setOnInsert: { address, firstSeen: new Date() }
            },
            { upsert: true }
        );
    }

    // Stats
    async getStats() {
        const totalBlocks = await this.blockModel.countDocuments();
        const totalTransactions = await this.transactionModel.countDocuments();
        const pendingTransactions = this.pendingTransactions.length;
        const latestBlock = await this.getLatestBlock();

        return {
            totalBlocks,
            totalTransactions,
            pendingTransactions,
            difficulty: this.difficulty,
            miningReward: this.miningReward,
            latestBlockHash: latestBlock?.hash || null
        };
    }

    // Generate new wallet with bonus
    async createWalletWithBonus() {
        const wallet = TransactionUtil.generateWallet();
        // Give 1000 LEMON bonus
        await this.updateWalletBalance(wallet.address, 1000);

        return {
            ...wallet,
            balance: 1000
        };
    }

    // Generate new wallet
    generateWallet() {
        return TransactionUtil.generateWallet();
    }
}

module.exports = { BlockchainService };
