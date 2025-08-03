import { NextResponse } from "next/server";

export async function GET() {
    const sampleData = [
        {
            mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            symbol: "USDC",
            rates: {
                kamino: {
                    lendingRate: 0.0424,
                    borrowingRate: 0.0725,
                },
            },
        },
    ];

    return NextResponse.json(sampleData);
}
