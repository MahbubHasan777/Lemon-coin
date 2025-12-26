'use strict';
const { Controller, Get, Post, Body, Dependencies, Bind } = require('@nestjs/common');
const { BlockchainService } = require('../blockchain');

@Controller('api/mining')
@Dependencies(BlockchainService)
class MiningController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }

    @Post('mine')
    @Bind(Body())
    async minePendingTransactions(body) {
        try {
            const { minerAddress } = body;

            if (!minerAddress) {
                return { error: 'Miner address is required', statusCode: 400 };
            }

            const block = await this.blockchainService.minePendingTransactions(minerAddress);
            return { success: true, block };
        } catch (error) {
            return { error: error.message, statusCode: 500 };
        }
    }

    @Get('pending')
    async getPendingTransactions() {
        return await this.blockchainService.getPendingTransactions();
    }
}

module.exports = { MiningController };
