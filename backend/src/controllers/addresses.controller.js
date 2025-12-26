const { Controller, Get, Post, Param, Dependencies, Bind } = require('@nestjs/common');
const { BlockchainService } = require('../blockchain');

@Controller('api/addresses')
@Dependencies(BlockchainService)
class AddressesController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }

    @Get(':address')
    @Bind(Param('address'))
    async getAddressInfo(address) {
        return await this.blockchainService.getAddressInfo(address);
    }

    @Get(':address/balance')
    @Bind(Param('address'))
    async getBalance(address) {
        const balance = await this.blockchainService.getBalance(address);
        return { address, balance };
    }

    @Get(':address/transactions')
    @Bind(Param('address'))
    async getAddressTransactions(address) {
        const info = await this.blockchainService.getAddressInfo(address);
        return info.transactions || [];
    }

    @Post('generate')
    async generateWallet() {
        return await this.blockchainService.createWalletWithBonus();
    }
}

module.exports = { AddressesController };
