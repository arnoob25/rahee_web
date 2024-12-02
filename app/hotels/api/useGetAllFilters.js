import { transformQueryDataForFilterWithCategories } from "../utils";
import { getAllFilters } from "./queryFunctions";

// TODO revise based on what the output is 
export function useGetAllFilters() {
  const {
    data: filters,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["filters"],
    queryFn: () => getAllFilters(),
    select: transformQueryDataForFilterWithCategories,
  });

  return { filters, error, isLoading };
}
