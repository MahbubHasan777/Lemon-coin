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

    // ... (rest of methods)

    // Generate new wallet with bonus
    async createWalletWithBonus() {
        const wallet = TransactionUtil.generateWallet();
        // Give 1000 LEMON bonus
        await this.updateWalletBalance(wallet.address, 1000);

        // Also ensure we track this as a "bonus" transaction for history if needed, 
        // but for now updating balance directly is instant and simplest for the user goal.
        return {
            ...wallet,
            balance: 1000
        };
    }

    generateWallet() {
        return TransactionUtil.generateWallet();
    }
}


module.exports = { BlockchainService };
