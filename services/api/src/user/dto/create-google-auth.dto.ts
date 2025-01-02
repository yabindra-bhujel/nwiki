import { ApiProperty } from '@nestjs/swagger';

export class CredentialResponseDto {
  @ApiProperty({
    required: true,
  })
  credential: string;

  @ApiProperty({ required: true })
  clientId: string;

  @ApiProperty({
    required: true,
  })
  select_by: string;
}

export class CreateGoogleAuthInputDto {
  @ApiProperty({
    required: true,
  })
  credentialResponse: CredentialResponseDto;
}
