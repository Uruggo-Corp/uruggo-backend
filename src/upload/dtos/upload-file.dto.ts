import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    description: 'The file to upload',
    required: true,
    format: 'binary',
  })
  file: string;
}
