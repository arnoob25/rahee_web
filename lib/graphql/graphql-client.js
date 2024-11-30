import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;

const graphQLClient = new GraphQLClient(endpoint);

// A function that returns a query fetcher for react-query
export const graphQLRequest = async (query, variables = {}) => {
  try {
    return await graphQLClient.request(query, variables);
  } catch (error) {
    console.error("GraphQL Request Error:", error);
    throw error;
  }
};
