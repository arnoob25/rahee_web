import { X } from "lucide-react";

function FilterDisplay({ filters, onRemove }) {
  return (
    <>
      {filters.length > 0 && (
        <div className="flex items-center overflow-x-auto px-1 rounded-md border gap-1">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap"
            >
              {filter.name}
              <button
                onClick={() => onRemove(filter.id)}
                className="ml-2 rounded-full p-1 hover:bg-muted-foreground/20"
                aria-label={`Remove ${filter.name} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default FilterDisplay;
