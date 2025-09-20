import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import axios from "axios";

interface RequestData {
  fullName: string;
  email: string;
  mobileNumber: string;
}

interface DigiLockerRequestBody {
  data: {
    expiry_minutes: number;
    send_sms: boolean;
    send_email: boolean;
    verify_phone: boolean;
    verify_email: boolean;
    redirect_url: string;
    prefill_options: {
      full_name: string;
      user_email: string;
      mobile_number: string;
    };
  };
}

interface DigiLockerResponse {
  data: {
    client_id: string;
    token: string;
    url: string;
    expiry_seconds: number;
  };
  status_code: number;
  message_code: string;
  message: string;
  success: boolean;
}

interface ErrorResponse {
  success: boolean;
  message: string;
  error: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Get the form data from the request
    const requestData: RequestData = await request.json();
    console.log("📥 Received request data:", requestData);
    const { fullName, email, mobileNumber } = requestData;

    if (!fullName || !email || !mobileNumber) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
          error: "Full name, email, and mobile number are required",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        {
          success: false,
          message: "Invalid email format",
          error: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      return Response.json(
        {
          success: false,
          message: "Invalid mobile number format",
          error: "Please provide a valid 10-digit mobile number",
        },
        { status: 400 }
      );
    }

    const apiToken = process.env.SUREPASS_API_TOKEN || "";
    const baseUrl = process.env.SUREPASS_BASE_URL || "";

    if (!apiToken) {
      console.error("Missing SUREPASS_API_TOKEN environment variable");
      return Response.json(
        {
          success: false,
          message: "Server configuration error",
          error: "API token not configured",
        },
        { status: 500 }
      );
    }

    if (!baseUrl) {
      console.error("Missing SUREPASS_BASE_URL environment variable");
      return Response.json(
        {
          success: false,
          message: "Server configuration error",
          error: "Base URL not configured",
        },
        { status: 500 }
      );
    }

    const body: DigiLockerRequestBody = {
      data: {
        expiry_minutes: 10,
        send_sms: true,
        send_email: true,
        verify_phone: true,
        verify_email: true,
        redirect_url: 'https://www.titantechinvestments.in/close',
        prefill_options: {
          full_name: fullName,
          user_email: email,
          mobile_number: mobileNumber,
        },
      },
    };

    // Add retry logic with progressive timeouts
    const MAX_RETRIES = 3;
    const timeouts = [15000, 20000, 30000]; // Progressive timeouts: 15s, 20s, 30s
    let lastError = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`Making DigiLocker initialization attempt ${attempt + 1} with ${timeouts[attempt]}ms timeout`);
        
        // Create an AbortController for this attempt
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeouts[attempt]);

        try {
          // Make the request to the DigiLocker API using axios with timeout
          const response = await axios.post(
            `${baseUrl}/api/v1/digilocker/initialize`,
            body,
            {
              headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              timeout: timeouts[attempt],
              signal: controller.signal
            }
          );

          // Clear the timeout since request completed
          clearTimeout(timeoutId);

          console.log(`DigiLocker initialization attempt ${attempt + 1} successful:`, response.data);

          // Axios automatically parses JSON response
          const data: DigiLockerResponse = response.data;

          // If the response is successful, set the cookies with proper expiry
          if (data.success) {
            // In your Next.js version, cookies() returns a Promise
            const cookieStore = await cookies();

            // Set cookies for client_id and token with proper expiry
            cookieStore.set("digilocker_client_id", data.data.client_id, {
              path: "/",
              maxAge: data.data.expiry_seconds || 600, // Use API provided expiry or default to 600 seconds
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === 'production', // Enable secure flag in production
            });

            cookieStore.set("digilocker_token", data.data.token, {
              path: "/",
              maxAge: data.data.expiry_seconds || 600, // Use API provided expiry or default to 600 seconds
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === 'production', // Enable secure flag in production
            });

            // Log successful initialization
            console.log("DigiLocker initialized successfully:", {
              client_id: data.data.client_id,
              expiry_seconds: data.data.expiry_seconds,
              url: data.data.url
            });
          }

          // Return the response data
          return Response.json(data);
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        lastError = error;
        console.error(`DigiLocker initialization attempt ${attempt + 1} failed:`, error);

        // If it's not a timeout error or if it's the last attempt, don't retry
        if ((axios.isAxiosError(error) && error.code !== 'ECONNABORTED') || attempt === MAX_RETRIES - 1) {
          break;
        }

        // Wait before retrying (exponential backoff)
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${backoffTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }

    // If we get here, all retries failed
    console.error("All DigiLocker initialization attempts failed");

    // Handle axios specific errors
    if (axios.isAxiosError(lastError)) {
      const status = lastError.response?.status || 500;
      let errorMessage = lastError.response?.data?.message || lastError.message;

      // Special handling for timeout errors
      if (lastError.code === 'ECONNABORTED') {
        errorMessage = "DigiLocker service is temporarily unavailable. Please try again in a few minutes. If the issue persists, try using a different network connection.";
      }

      const errorResponse: ErrorResponse = {
        success: false,
        message: "Failed to initialize DigiLocker",
        error: errorMessage,
      };

      return Response.json(errorResponse, { status });
    }

    // Handle other errors
    const errorMessage = lastError instanceof Error ? lastError.message : "Unknown error";

    const errorResponse: ErrorResponse = {
      success: false,
      message: "Failed to initialize DigiLocker",
      error: errorMessage,
    };

    return Response.json(errorResponse, { status: 500 });
  } catch (error) {
    console.error("Error in DigiLocker initialization route:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      message: "Failed to initialize DigiLocker",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return Response.json(errorResponse, { status: 500 });
  }
}
