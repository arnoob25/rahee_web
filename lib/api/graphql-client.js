import { useAppStore } from "@/app/data/appState";
import { GraphQLClient } from "graphql-request";
import { toast } from "sonner";

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const isDevelopment = process.env.NODE_ENV === "development";

const graphQLClient = new GraphQLClient(endpoint);

export const graphQLRequest = async (query, variables = {}) => {
  const { setIsStartingServer } = useAppStore.getState(
    (state) => state.setIsStartingServer
  );

  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      setIsStartingServer(true);
      reject(new Error("Request timed out"));
    }, 10000); // 10 seconds
  });

  try {
    const result = await Promise.race([
      graphQLClient.request(query, variables),
      timeoutPromise,
    ]);
    clearTimeout(timeoutId);
    setIsStartingServer(false);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    setIsStartingServer(false);

    if (isDevelopment) {
      console.error("GraphQL Request Error:", { error });
    }

    const errors = error.response?.errors ?? [];

    if (errors.length > 0) {
      errors.forEach(({ extensions, message }) => {
        const code = extensions?.code;
        const errorToast = getErrorToast(code, message);

        if (errorToast.type === "warning") {
          toast.warning(errorToast.title, {
            description: message ?? errorToast.description,
          });
        } else {
          toast.error(errorToast.title, {
            description: message ?? errorToast.description,
          });
        }
      });
    } else {
      toast.error("Connection Error", {
        description:
          "Unable to connect to the server. Please check your internet connection.",
      });
    }

    throw error;
  }
};

// Error messages for different error codes
const getErrorToast = (code, message) => {
  switch (code) {
    case "BAD_REQUEST":
      return {
        title: "Invalid Request",
        description: "Please check your input and try again.",
        type: "error",
      };
    case "UNAUTHORIZED":
      return {
        title: "Authentication Required",
        description: "Please log in to continue.",
        type: "error",
      };
    case "FORBIDDEN":
      return {
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
        type: "error",
      };
    case "NOT_FOUND":
      return {
        title: "Not Found",
        description: "The requested resource could not be found.",
        type: "error",
      };
    case "CONFLICT":
      return {
        title: "Conflict",
        description: "This action conflicts with existing data.",
        type: "error",
      };
    case "VALIDATION_ERROR":
      return {
        title: "Validation Failed",
        description: message || "Please check your input data.",
        type: "error",
      };
    case "INTERNAL_SERVER_ERROR":
      return {
        title: "Server Error",
        description: "Something went wrong on our end. Please try again later.",
        type: "error",
      };
    case "RATE_LIMITED":
      return {
        title: "Too Many Requests",
        description: "Please wait a moment before trying again.",
        type: "warning",
      };
    case "SERVICE_UNAVAILABLE":
      return {
        title: "Service Unavailable",
        description:
          "The service is temporarily unavailable. Please try again later.",
        type: "error",
      };
    default:
      return {
        title: "Something went wrong",
        description: message || "An unexpected error occurred.",
        type: "error",
      };
  }
};
