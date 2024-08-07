import { DevConfigService } from './common/providers/DevConfigService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private devConfigService: DevConfigService) {}
  getHello(): string {
    return `Hello World!  ${this.devConfigService.getDBHOST}`;
  }
}
