const { Controller, Get, Param, Query, Dependencies, Bind } = require('@nestjs/common');
const { BlockchainService } = require('../blockchain');

@Controller('api/blocks')
@Dependencies(BlockchainService)
class BlocksController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }

    @Get()
    @Bind(Query('page'), Query('limit'))
    async getAllBlocks(page = 1, limit = 10) {
        return await this.blockchainService.getAllBlocks(
            parseInt(page),
            parseInt(limit)
        );
    }

    @Get('latest')
    async getLatestBlock() {
        return await this.blockchainService.getLatestBlock();
    }

    @Get(':hash')
    @Bind(Param('hash'))
    async getBlockByHash(hash) {
        const block = await this.blockchainService.getBlockByHash(hash);
        if (!block) {
            return { error: 'Block not found', statusCode: 404 };
        }
        return block;
    }
}

module.exports = { BlocksController };
