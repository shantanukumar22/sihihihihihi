import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Make request to SurePass API for PAN verification
    const response = await axios.post(
      "https://kyc-api.surepass.io/api/v1/pan/pan",
      {
        id_number: body.id_number,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Customer-Id": "c8519de6-d2a3-4319-8119-2dcd080b0fd8",
          Authorization: `Bearer ${process.env.SUREPASS_API_TOKEN}`,
        },
      }
    );

    // Return the response data
    return NextResponse.json({
      success: true,
      data: response.data.data,
    });
  } catch (error: unknown) {
    console.error("Error verifying PAN:", error);
    return NextResponse.json(
      {
        success: false,
        message: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to verify PAN",
      },
      { status: 500 }
    );
  }
}
