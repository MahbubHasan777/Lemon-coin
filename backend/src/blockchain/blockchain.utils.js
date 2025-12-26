'use strict';
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class TransactionUtil {

    static calculateHash(fromAddress, toAddress, amount, timestamp) {
        return crypto
            .createHash('sha256')
            .update((fromAddress || '') + toAddress + amount + timestamp)
            .digest('hex');
    }


    static sign(txHash, privateKey) {
        const key = ec.keyFromPrivate(privateKey);
        const sig = key.sign(txHash, 'base64');
        return sig.toDER('hex');
    }


    static verify(txHash, signature, fromAddress) {
        if (!fromAddress) return true; // Mining reward
        if (!signature) return false;

        try {
            const publicKey = ec.keyFromPublic(fromAddress, 'hex');
            return publicKey.verify(txHash, signature);
        } catch (e) {
            return false;
        }
    }


    static generateWallet() {
        const key = ec.genKeyPair();
        return {
            privateKey: key.getPrivate('hex'),
            publicKey: key.getPublic('hex'),
            address: key.getPublic('hex')
        };
    }


    static getPublicKey(privateKey) {
        const key = ec.keyFromPrivate(privateKey);
        return key.getPublic('hex');
    }
}


class BlockUtil {

    static calculateHash(previousHash, timestamp, transactions, nonce) {
        return crypto
            .createHash('sha256')
            .update(previousHash + timestamp + JSON.stringify(transactions) + nonce)
            .digest('hex');
    }


    static mineBlock(previousHash, timestamp, transactions, difficulty) {
        let nonce = 0;
        let hash;
        const target = Array(difficulty + 1).join('0');

        do {
            nonce++;
            hash = this.calculateHash(previousHash, timestamp, transactions, nonce);
        } while (hash.substring(0, difficulty) !== target);

        return { hash, nonce };
    }


    static isValidHash(block) {
        const calculatedHash = this.calculateHash(
            block.previousHash,
            block.timestamp,
            block.transactions,
            block.nonce
        );
        return block.hash === calculatedHash;
    }
}


class ChainUtil {

    static createGenesisBlock() {
        const timestamp = Date.parse('2024-01-01');
        const previousHash = '0';
        const transactions = [];
        const { hash, nonce } = BlockUtil.mineBlock(previousHash, timestamp, transactions, 2);

        return {
            hash,
            previousHash,
            timestamp,
            nonce,
            difficulty: 2,
            miner: 'genesis',
            transactions,
            transactionCount: 0
        };
    }
}

module.exports = {
    TransactionUtil,
    BlockUtil,
    ChainUtil,
    ec
};
