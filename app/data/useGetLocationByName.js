export function useGetLocationByName(textSearchTerm) {
  const isSearchTermValid = textSearchTerm?.trim().length > 0;

  return {
    locations: [],
    error: null,
    status: isSearchTermValid,
    refetch: () => {},
  };
}
