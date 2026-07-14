import { ApiProperty } from "@nestjs/swagger";

export class InitiatePaymentDto {

    @ApiProperty()
    bookingId!: string

    @ApiProperty()
    customerPhone!: string
}

export class VerifyPaymentDto {

    @ApiProperty()
    providerOrderId!: string;

    @ApiProperty()
    providerPaymentId!: string;

    @ApiProperty()
    signature!: string;

}