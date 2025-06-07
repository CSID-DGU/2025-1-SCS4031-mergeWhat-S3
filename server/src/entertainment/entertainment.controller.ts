// src/entertainment/entertainment.controller.ts

import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EntertainmentService } from './entertainment.service';

@Controller('entertainment-image')
export class EntertainmentController {
  constructor(private readonly entertainmentService: EntertainmentService) {}

  @Get(':marketId/:placeName/:isIndoor')
  async getImage(
    @Param('marketId', ParseIntPipe) marketId: number,
    @Param('placeName') placeName: string,
    @Param('isIndoor') isIndoor: string,
  ) {
    const imageUrl = await this.entertainmentService.findImageUrl(
      marketId,
      decodeURIComponent(placeName),
      isIndoor === 'true',
    );

    if (!imageUrl) {
      return { image_url: null };
    }

    return { image_url: imageUrl };
  }
}
