'use strict';
const { Controller, Get, Post, Body, Param, Query, Dependencies, Bind } = require('@nestjs/common');
const { BlockchainService } = require('../blockchain');

@Controller('api/transactions')
@Dependencies(BlockchainService)
class TransactionsController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }

    @Get()
    @Bind(Query('page'), Query('limit'))
    async getAllTransactions(page = 1, limit = 10) {
        return await this.blockchainService.getAllTransactions(
            parseInt(page),
            parseInt(limit)
        );
    }

    @Get('pending')
    async getPendingTransactions() {
        return await this.blockchainService.getPendingTransactions();
    }

    @Get(':hash')
    @Bind(Param('hash'))
    async getTransactionByHash(hash) {
        const tx = await this.blockchainService.getTransactionByHash(hash);
        if (!tx) {
            return { error: 'Transaction not found', statusCode: 404 };
        }
        return tx;
    }

    @Post()
    @Bind(Body())
    async createTransaction(body) {
        try {
            const { fromAddress, toAddress, amount, privateKey } = body;

            if (!fromAddress || !toAddress || !amount || !privateKey) {
                return { error: 'Missing required fields', statusCode: 400 };
            }

            const tx = await this.blockchainService.createTransaction(
                fromAddress,
                toAddress,
                parseFloat(amount),
                privateKey
            );
            return { success: true, transaction: tx };
        } catch (error) {
            return { error: error.message, statusCode: 400 };
        }
    }
}

module.exports = { TransactionsController };
