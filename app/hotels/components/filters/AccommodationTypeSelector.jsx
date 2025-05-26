import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { observer } from "@legendapp/state/react";
import { ACCOMMODATION_OPTIONS } from "../../config";

// TODO: get accommodation options from the Database

const appliedFilters$ = {
  accommodationTypes: ["hotel"],
};

const AccommodationSelector = observer(function Component() {
  const [selectedOptions, setSelectedOptions] = useState(
    new Set(appliedFilters$.accommodationTypes.get())
  );
  const [isOpen, setIsOpen] = useState(false);

  const setSelectedAccommodationTypes = (types) => {
    setSelectedOptions(types);
    const AccommodationTypes = Array.from(types);
    appliedFilters$.AccommodationTypes.set(AccommodationTypes);
  };

  const toggleSelection = (optionId, newSelected) => {
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
  };

  const selectAllChildren = (parent, newSelected) => {
    parent.children.forEach((child) => {
      newSelected.add(child.id);
    });
  };

  const deselectAllChildren = (parent, newSelected) => {
    parent.children.forEach((child) => {
      newSelected.delete(child.id);
    });
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
    const parent = ACCOMMODATION_OPTIONS.find((opt) => opt.id === optionId);

    if (parent?.children) {
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
        deselectAllChildren(parent, newSelected);
      } else {
        newSelected.add(optionId);
        selectAllChildren(parent, newSelected);
      }
    } else {
      toggleSelection(optionId, newSelected);
      if (parentId) {
        updateParentState(parentId, newSelected);
      }
    }

    setSelectedOptions(newSelected);
  };

  const handleReset = () => {
    setSelectedAccommodationTypes(new Set());
  };

  const handleDone = () => {
    setSelectedAccommodationTypes(selectedOptions);
    setIsOpen(false);
  };

  const isParentSelected = (parentId) => {
    const parent = ACCOMMODATION_OPTIONS.find((opt) => opt.id === parentId);
    return parent?.children.every((child) => selectedOptions.has(child.id));
  };

  return (
    <div className="w-fit">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            <span>
              {selectedOptions.size
                ? `${selectedOptions.size} accommodation ${
                    selectedOptions.size > 1 ? "types" : "type"
                  } selected`
                : "Select accommodation types"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-4">
            <h3 className="font-medium text-sm">Accommodation types</h3>
          </div>
          <div className="overflow-y-auto px-4">
            <Accordion
              defaultValue={ACCOMMODATION_OPTIONS[0].id}
              className="w-full gap-2"
            >
              {ACCOMMODATION_OPTIONS.map((option) => (
                <AccordionItem
                  key={option.id}
                  value={option.id}
                  className="border-0"
                >
                  <div className="flex items-center gap-2 py-2 px-2 hover:bg-muted rounded-md">
                    <Checkbox
                      id={option.id}
                      checked={isParentSelected(option.id)}
                      onCheckedChange={(checked) => {
                        handleOptionChange(option.id);
                      }}
                    />
                    <AccordionTrigger className="hover:no-underline flex-1 p-0">
                      <div className="flex justify-between items-center w-full">
                        <label
                          htmlFor={option.id}
                          className="text-sm font-medium leading-none"
                        >
                          {option.label}
                        </label>
                      </div>
                    </AccordionTrigger>
                  </div>

                  <AccordionContent className="my-2 ml-6 p-0">
                    <div className="grid grid-cols-1 gap-4 px-2">
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
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
});

export default AccommodationSelector;
