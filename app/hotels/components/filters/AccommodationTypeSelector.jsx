"use client";

import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  ACCOMMODATION_OPTIONS,
  DEFAULT_ACCOMMODATION_TYPES,
} from "../../config";
import { useHotelFilterStore } from "../../data/hotelFilters";

export default function AccommodationSelector({ onApply }) {
  const {
    selectedOptions,
    isOpen,
    setIsOpen,
    openItems,
    handleOptionChange,
    handleGroupLabelClick,
    handleReset,
    isParentSelected,
    toggleCollapse,
  } = useAccommodationSelector(ACCOMMODATION_OPTIONS);

  return (
    <div className="w-fit">
      <Popover
        open={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) onApply(); // refetch hotels when closed
          setIsOpen(isOpen);
        }}
      >
        <AccommodationTrigger
          selectedCount={selectedOptions.size}
          isOpen={isOpen}
        />

        <PopoverContent className="w-[280px] p-0" align="start">
          <AccommodationHeader />

          <AccommodationList
            options={ACCOMMODATION_OPTIONS}
            selectedOptions={selectedOptions}
            openItems={openItems}
            isParentSelected={isParentSelected}
            handleGroupLabelClick={handleGroupLabelClick}
            handleOptionChange={handleOptionChange}
            toggleCollapse={toggleCollapse}
          />

          <div className="flex items-center justify-end mt-4 p-3 border-t">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function AccommodationTrigger({ selectedCount, isOpen }) {
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full space-x-2 justify-between"
      >
        <span>
          {selectedCount ? `Accommodation types` : "Select accommodation type"}
          {selectedCount > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {selectedCount}
            </span>
          )}
        </span>
      </Button>
    </PopoverTrigger>
  );
}

function AccommodationHeader() {
  return (
    <div className="p-4">
      <h3 className="font-medium text-sm">Accommodation types</h3>
    </div>
  );
}

function AccommodationList({
  options,
  selectedOptions,
  openItems,
  isParentSelected,
  handleGroupLabelClick,
  handleOptionChange,
  toggleCollapse,
}) {
  return (
    <div className="px-4">
      {options.map((option) => (
        <div key={option.id} className="mb-2">
          <AccommodationOption
            option={option}
            isParentSelected={isParentSelected}
            isOpen={openItems[option.id]}
            onGroupClick={handleGroupLabelClick}
            onToggleCollapse={toggleCollapse}
          />

          {openItems[option.id] && (
            <div className="ml-6 mr-2 grid grid-cols-1 gap-2 px-2">
              {option.children.map((child) => (
                <AccommodationChildOption
                  key={child.id}
                  child={child}
                  isSelected={selectedOptions.has(child.id)}
                  onOptionChange={handleOptionChange}
                  parentId={option.id}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AccommodationOption({
  option,
  isParentSelected,
  isOpen,
  onGroupClick,
  onToggleCollapse,
}) {
  return (
    <div className="flex w-full justify-between items-center">
      <div
        role="button"
        className="flex items-center flex-grow px-2 py-3 gap-2 hover:bg-muted rounded-md"
        onClick={() => onGroupClick(option)}
      >
        <Checkbox
          checked={isParentSelected(option.id)}
          onCheckedChange={() => onGroupClick(option)}
          onClick={(e) => e.stopPropagation()}
        />
        <span className="text-sm font-medium leading-none">{option.label}</span>
      </div>
      <button
        className="min-w-fit px-3 py-3 opacity-50 transition-transform hover:bg-muted rounded-md"
        onClick={(e) => {
          e.stopPropagation();
          onToggleCollapse(option.id);
        }}
      >
        <ChevronDown className={`w-4 h-4 ${isOpen ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}

function AccommodationChildOption({
  child,
  isSelected,
  onOptionChange,
  parentId,
}) {
  return (
    <div
      role="button"
      onClick={() => onOptionChange(child.id, parentId)}
      className="flex justify-start items-center gap-2 p-2 rounded-md hover:bg-muted"
    >
      <Checkbox checked={isSelected} />
      <span className="text-sm font-medium leading-none pointer-events-auto">
        {child.label}
      </span>
    </div>
  );
}

function useAccommodationSelector(options) {
  const {
    accommodationTypes: selectedOptions,
    setSelectedAccommodationTypes: setSelectedOptions,
  } = useHotelFilterStore();
  const [isOpen, setIsOpen] = useState(false); // nom nom nom
  const [openItems, setOpenItems] = useState({});

  const toggleSelection = (optionId, newSelected) => {
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
  };

  const selectAllChildren = (parent, newSelected) => {
    parent.children.forEach((child) => newSelected.add(child.id));
  };

  const deselectAllChildren = (parent, newSelected) => {
    parent.children.forEach((child) => newSelected.delete(child.id));
  };

  const updateParentState = (parentId, newSelected) => {
    const parent = options.find((opt) => opt.id === parentId);
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
    const allSelected = [...option.children.map((c) => c.id)].every((id) =>
      newSelected.has(id)
    );

    if (allSelected) {
      deselectAllChildren(option, newSelected);
    } else {
      selectAllChildren(option, newSelected);
    }

    setSelectedOptions(newSelected);
  };

  const handleReset = () => {
    setSelectedOptions(new Set(DEFAULT_ACCOMMODATION_TYPES));
  };

  const isParentSelected = (parentId) => {
    const parent = options.find((opt) => opt.id === parentId);
    return parent?.children.every((child) => selectedOptions.has(child.id));
  };

  const toggleCollapse = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    selectedOptions,
    isOpen,
    setIsOpen,
    openItems,
    handleOptionChange,
    handleGroupLabelClick,
    handleReset,
    isParentSelected,
    toggleCollapse,
  };
}
