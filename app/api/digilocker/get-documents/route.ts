// File: app/api/digilocker/list-documents/route.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import axios from "axios";
import { addCorsHeaders, handleCors } from '@/lib/cors';

// Define types for DigiLocker list documents response
interface DigiLockerDocument {
  file_id: string;
  name: string;
  doc_type: string;
  downloaded: boolean;
  issuer: string;
  description: string;
}

interface ListDocumentsResponse {
  data: {
    documents: DigiLockerDocument[];
  };
  status_code: number;
  success: boolean;
  message: string;
  message_code: string;
}

// Define type for our filtered response
interface FilteredDocumentsResponse {
  success: boolean;
  documents: DigiLockerDocument[];
  aadhaarFileId: string | null;
  panFileId: string | null;
  message?: string;
  error?: string;
  missingDocuments?: string[];
}

export async function GET(request: NextRequest): Promise<Response> {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    // Get the client_id from cookies
    const cookieStore = await cookies();
    const clientId = cookieStore.get("digilocker_client_id")?.value;
    const token = cookieStore.get("digilocker_token")?.value;

    if (!clientId || !token) {
      const response = Response.json(
        {
          success: false,
          documents: [],
          aadhaarFileId: null,
          panFileId: null,
          message: "DigiLocker session not found",
        },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Get the API token from environment variables
    const apiToken = process.env.SUREPASS_API_TOKEN || "";

    if (!apiToken) {
      console.error("Missing SUREPASS_API_TOKEN environment variable");
      const response = Response.json(
        {
          success: false,
          documents: [],
          aadhaarFileId: null,
          panFileId: null,
          message: "Server configuration error",
          error: "API token not configured",
        },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }

    // Make the request to the DigiLocker API using axios
    const axiosResponse = await axios.get<ListDocumentsResponse>(
      `https://kyc-api.surepass.io/api/v1/digilocker/list-documents/${clientId}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    // Extract the documents from the response
    const { data } = axiosResponse;

    if (!data.success) {
      const response = Response.json(
        {
          success: false,
          documents: [],
          aadhaarFileId: null,
          panFileId: null,
          message: data.message || "Failed to fetch documents",
        },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Find Aadhaar and PAN documents
    let aadhaarFileId: string | null = null;
    let panFileId: string | null = null;

    // Process the documents
    const documents = data.data.documents;

    for (const doc of documents) {
      // Check for Aadhaar documents
      if (
        doc.doc_type === "ADHAR" ||
        doc.name.toLowerCase().includes("aadhaar") ||
        doc.name.toLowerCase().includes("aadhar") ||
        doc.description.toLowerCase().includes("aadhaar") ||
        doc.description.toLowerCase().includes("aadhar")
      ) {
        aadhaarFileId = doc.file_id;
      }

      // Check for PAN documents
      if (
        doc.doc_type === "PANCR" ||
        doc.name.toLowerCase().includes("pan") ||
        doc.description.toLowerCase().includes("pan verification")
      ) {
        panFileId = doc.file_id;
      }
    }

    // Check if both documents are found
    const missingDocuments: string[] = [];

    if (!aadhaarFileId) {
      missingDocuments.push("Aadhaar");
    }

    if (!panFileId) {
      missingDocuments.push("PAN");
    }

    // If any documents are missing, return an error
    if (missingDocuments.length > 0) {
      const response = Response.json(
        {
          success: false,
          documents,
          aadhaarFileId,
          panFileId,
          message: `Required document(s) not found: ${missingDocuments.join(", ")}`,
          missingDocuments,
        },
        { status: 422 }
      );
      return addCorsHeaders(response);
    }

    // Return the filtered response with both documents found
    const filteredResponse: FilteredDocumentsResponse = {
      success: true,
      documents,
      aadhaarFileId,
      panFileId,
    };

    const response = Response.json(filteredResponse);
    return addCorsHeaders(response);
  } catch (error) {
    console.error("Error fetching DigiLocker documents:", error);

    // Handle axios specific errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;

      const response = Response.json(
        {
          success: false,
          documents: [],
          aadhaarFileId: null,
          panFileId: null,
          message: "Failed to fetch DigiLocker documents",
          error: errorMessage,
        },
        { status }
      );
      return addCorsHeaders(response);
    }

    // Handle other errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    const response = Response.json(
      {
        success: false,
        documents: [],
        aadhaarFileId: null,
        panFileId: null,
        message: "Failed to fetch DigiLocker documents",
        error: errorMessage,
      },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
