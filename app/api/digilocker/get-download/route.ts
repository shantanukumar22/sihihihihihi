// File: app/api/digilocker/download-documents/route.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import axios, { AxiosResponse } from "axios";
import { addCorsHeaders, handleCors } from '@/lib/cors';

// Define types for DigiLocker document download response
interface DocumentDownloadResponse {
  data: {
    download_url: string;
    mime_type: string;
  };
  status_code: number;
  success: boolean;
  message: string;
  message_code: string;
}

// Define type for our combined download response
// interface CombinedDownloadResponse {
//   success: boolean;
//   aadhaar: {
//     download_url: string;
//     mime_type: string;
//   } | null;
//   pan: {
//     download_url: string;
//     mime_type: string;
//   } | null;
//   message?: string;
//   error?: string;
// }

export async function POST(request: NextRequest): Promise<Response> {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    // Get request data with file IDs
    const requestData = await request.json();
    const { aadhaarFileId, panFileId } = requestData;

    // Validate request
    if (!aadhaarFileId || !panFileId) {
      const response = Response.json(
        {
          success: false,
          aadhaar: null,
          pan: null,
          message: "Both Aadhaar and PAN file IDs are required",
        },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Get the client_id from cookies
    const cookieStore = await cookies();
    const clientId = cookieStore.get("digilocker_client_id")?.value;

    if (!clientId) {
      const response = Response.json(
        {
          success: false,
          aadhaar: null,
          pan: null,
          message: "DigiLocker session not found",
        },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Get the API token from environment variables
    const apiToken = process.env.SUREPASS_API_TOKEN || "";
    const baseUrl = process.env.SUREPASS_BASE_URL || "";

    if (!apiToken) {
      console.error("Missing SUREPASS_API_TOKEN environment variable");
      const response = Response.json(
        {
          success: false,
          aadhaar: null,
          pan: null,
          message: "Server configuration error",
          error: "API token not configured",
        },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }

    if (!baseUrl) {
      console.error("Missing SUREPASS_BASE_URL environment variable");
      const response = Response.json(
        {
          success: false,
          aadhaar: null,
          pan: null,
          message: "Server configuration error",
          error: "Base URL not configured",
        },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }

    // Function to download a document with retries
    const downloadDocument = async (fileId: string): Promise<AxiosResponse<DocumentDownloadResponse>> => {
      const MAX_RETRIES = 3;
      let lastError = null;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const response = await axios.post(
            `${baseUrl}/api/v1/digilocker/download`,
            { file_id: fileId, client_id: clientId },
            {
              headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
              },
              timeout: 30000, // 30 second timeout
            }
          );
          return response;
        } catch (error) {
          lastError = error;
          console.error(`Document download attempt ${attempt + 1} failed for file ${fileId}:`, error);

          // If it's not a timeout error, don't retry
          if (axios.isAxiosError(error) && error.code !== 'ECONNABORTED') {
            break;
          }

          // Wait before retrying (exponential backoff)
          if (attempt < MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          }
        }
      }

      throw lastError;
    };

    try {
      // Download documents sequentially to avoid conflicts
      const [aadhaarResponse, panResponse] = await Promise.all([
        downloadDocument(aadhaarFileId),
        downloadDocument(panFileId)
      ]);

      // Check if both downloads were successful
      if (
        aadhaarResponse?.data?.success &&
        panResponse?.data?.success &&
        aadhaarResponse?.data?.data?.download_url &&
        panResponse?.data?.data?.download_url
      ) {
        const response = Response.json({
          success: true,
          aadhaar: aadhaarResponse.data.data,
          pan: panResponse.data.data,
        });
        return addCorsHeaders(response);
      }

      // If any download failed, return error
      const response = Response.json({
        success: false,
        aadhaar: aadhaarResponse?.data?.data || null,
        pan: panResponse?.data?.data || null,
        message: "Failed to download one or more documents",
      });
      return addCorsHeaders(response);
    } catch (error) {
      console.error("Error downloading documents:", error);

      // Handle axios specific errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        let errorMessage = error.response?.data?.message || error.message;

        // Special handling for timeout errors
        if (error.code === 'ECONNABORTED') {
          errorMessage = "Document download service is temporarily unavailable. Please try again in a few minutes.";
        }

        const response = Response.json({
          success: false,
          aadhaar: null,
          pan: null,
          message: "Failed to download documents",
          error: errorMessage,
        }, { status });
        return addCorsHeaders(response);
      }

      // Handle other errors
      const response = Response.json({
        success: false,
        aadhaar: null,
        pan: null,
        message: "Failed to download documents",
        error: error instanceof Error ? error.message : "Unknown error",
      }, { status: 500 });
      return addCorsHeaders(response);
    }
  } catch (error) {
    console.error("Error in document download route:", error);

    const response = Response.json({
      success: false,
      aadhaar: null,
      pan: null,
      message: "Failed to download documents",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
    return addCorsHeaders(response);
  }
}
