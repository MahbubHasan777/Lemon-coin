'use strict';
const { Controller, Get, Post, Dependencies } = require('@nestjs/common');
const { BlockchainService } = require('../blockchain');

@Controller('api')
@Dependencies(BlockchainService)
class StatsController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }

    @Get('stats')
    async getStats() {
        return await this.blockchainService.getStats();
    }

    @Post('wallet/generate')
    generateWallet() {
        return this.blockchainService.generateWallet();
    }
}

module.exports = { StatsController };
