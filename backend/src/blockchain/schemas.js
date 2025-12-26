'use strict';
const { Prop, SchemaFactory } = require('@nestjs/mongoose');
const { Document, Schema } = require('mongoose');

// Transaction Schema
class Transaction extends Document { }

const TransactionSchema = new Schema({
    hash: { type: String, required: true, unique: true, index: true },
    fromAddress: { type: String, index: true },
    toAddress: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    signature: { type: String },
    blockHash: { type: String, index: true },
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' }
}, { timestamps: true });

// Block Schema  
class Block extends Document { }

const BlockSchema = new Schema({
    hash: { type: String, required: true, unique: true, index: true },
    previousHash: { type: String, required: true },
    timestamp: { type: Number, required: true },
    nonce: { type: Number, required: true },
    difficulty: { type: Number, required: true },
    miner: { type: String, index: true },
    transactionCount: { type: Number, default: 0 },
    transactions: [{ type: String }] // Array of transaction hashes
}, { timestamps: true });

// Wallet/Address Schema
class Wallet extends Document { }

const WalletSchema = new Schema({
    address: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0 },
    transactionCount: { type: Number, default: 0 },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
    Transaction,
    TransactionSchema,
    Block,
    BlockSchema,
    Wallet,
    WalletSchema
};
