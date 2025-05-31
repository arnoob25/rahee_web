import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ACCOMMODATION_OPTIONS } from "../../config";

const defaultSelected = ["hotel"];

function AccommodationSelector() {
  const [selectedOptions, setSelectedOptions] = useState(
    new Set(defaultSelected)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});

  const toggleSelection = (optionId, newSelected) => {
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
  };

  const selectAllChildren = (parent, newSelected) => {
    newSelected.add(parent.id);
    parent.children.forEach((child) => newSelected.add(child.id));
  };

  const deselectAllChildren = (parent, newSelected) => {
    newSelected.delete(parent.id);
    parent.children.forEach((child) => newSelected.delete(child.id));
  };

  const updateParentState = (parentId, newSelected) => {
    const parent = ACCOMMODATION_OPTIONS.find((opt) => opt.id === parentId);
    if (parent) {
      const allChildrenSelected = parent.children.every((child) =>
        newSelected.has(child.id)
      );
      if (allChildrenSelected) {
        newSelected.add(parentId);
      } else {
        newSelected.delete(parentId);
      }
    }
  };

  const handleOptionChange = (optionId, parentId) => {
    const newSelected = new Set(selectedOptions);
    toggleSelection(optionId, newSelected);
    if (parentId) updateParentState(parentId, newSelected);
    setSelectedOptions(newSelected);
  };

  const handleGroupLabelClick = (option) => {
    const newSelected = new Set(selectedOptions);
    const allSelected = [option.id, ...option.children.map((c) => c.id)].every(
      (id) => newSelected.has(id)
    );

    if (allSelected) {
      deselectAllChildren(option, newSelected);
    } else {
      selectAllChildren(option, newSelected);
    }

    setSelectedOptions(newSelected);
  };

  const handleReset = () => {
    setSelectedOptions(new Set());
  };

  const handleDone = () => {
    setIsOpen(false);
  };

  const isParentSelected = (parentId) => {
    const parent = ACCOMMODATION_OPTIONS.find((opt) => opt.id === parentId);
    return parent?.children.every((child) => selectedOptions.has(child.id));
  };

  const toggleCollapse = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-fit">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full space-x-2 justify-between"
          >
            <span>
              {selectedOptions.size
                ? `Accommodation types`
                : "Select accommodation types"}
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {selectedOptions.size}
              </span>
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-4">
            <h3 className="font-medium text-sm">Accommodation types</h3>
          </div>

          <div className="overflow-y-auto px-4 max-h-64">
            {ACCOMMODATION_OPTIONS.map((option) => (
              <div key={option.id} className="mb-2">
                <div
                  className="flex items-center justify-between gap-2 py-2 px-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => handleGroupLabelClick(option)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={option.id}
                      checked={isParentSelected(option.id)}
                      onCheckedChange={() => handleGroupLabelClick(option)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGroupLabelClick(option);
                      }}
                    >
                      {option.label}
                    </label>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 opacity-50 transition-transform ${
                      openItems[option.id] ? "rotate-180" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCollapse(option.id);
                    }}
                  />
                </div>

                {openItems[option.id] && (
                  <div className="ml-6 mt-2 grid grid-cols-1 gap-2 px-2">
                    {option.children.map((child) => (
                      <div key={child.id} className="flex items-center gap-2">
                        <Checkbox
                          id={child.id}
                          checked={selectedOptions.has(child.id)}
                          onCheckedChange={() =>
                            handleOptionChange(child.id, option.id)
                          }
                        />
                        <label
                          htmlFor={child.id}
                          className="text-sm font-medium leading-none"
                        >
                          {child.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 p-4 border-t">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleDone}>
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default AccommodationSelector;
