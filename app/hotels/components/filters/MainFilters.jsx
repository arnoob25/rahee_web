"use client";

import { useUrlParamAsFilter } from "@/lib/hooks/useUrlParamAsFilter";
import { useState } from "react";

const NameFilter = () => {
  const { getUrlFilter, setUrlFilters } = useUrlParamAsFilter();
  const [nameParam, setNameParam] = useState(getUrlFilter("name") || "");

  const handleNameChange = (e) => {
    e.preventDefault();
    setUrlFilters("name", nameParam);
  };

  return (
    <div>
      <form onSubmit={handleNameChange}>
        <input
          value={nameParam}
          onChange={(e) => setNameParam(e.target.value)}
        />
        <button type="submit" />
      </form>
    </div>
  );
};

export default NameFilter;
