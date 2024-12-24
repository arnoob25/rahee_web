export function useFilteredPolicies(policies, searchQuery) {
  return React.useMemo(() => {
    if (!searchQuery) return policies;

    const filtered = {};
    Object.entries(policies).forEach(([category, categoryData]) => {
      const matchingSubcategories = {};
      Object.entries(categoryData.subcategories).forEach(
        ([subcategory, subcategoryPolicies]) => {
          const matchingPolicies = {};
          Object.entries(subcategoryPolicies).forEach(([title, content]) => {
            if (
              title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              content.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              matchingPolicies[title] = content;
            }
          });
          if (Object.keys(matchingPolicies).length > 0) {
            matchingSubcategories[subcategory] = matchingPolicies;
          }
        }
      );
      if (Object.keys(matchingSubcategories).length > 0) {
        filtered[category] = {
          ...categoryData,
          subcategories: matchingSubcategories,
        };
      }
    });
    return filtered;
  }, [policies, searchQuery]);
}
