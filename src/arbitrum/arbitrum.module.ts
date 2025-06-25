import { Module } from '@nestjs/common';
import { ArbitrumService } from './arbitrum.service';

@Module({
    providers: [ArbitrumService],
    exports: [ArbitrumService],
})
export class ArbitrumModule { }
