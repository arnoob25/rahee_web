import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { policies } from "../api/mockData";
import { useFilteredPolicies } from "../hooks/useHotelPolicies";
import { useScrollToElement } from "@/hooks/use-scroll";
import { observable } from "@legendapp/state";
import { toValidSelector } from "@/lib/string-parsers";
import { DynamicIcon } from "@/app/components/DynamicIcon";
import { POLICY_DEFAULT_ICON } from "@/config/icons-map";
import { Label } from "@/components/ui/label";

const selectedCategory$ = observable(null);
const searchQuery$ = observable("");

export function Policy() {
  const filteredPolicies = useFilteredPolicies(policies, searchQuery$.get());

  return (
    <div className="rounded-lg py-2 pr-2 ">
      <SearchBar />
      <div className="flex flex-row gap-5">
        <CategoryList policies={policies} />
        <PolicyContent filteredPolicies={filteredPolicies} />
      </div>
    </div>
  );
}

function CategoryList({ policies }) {
  const scrollToCategory = useScrollToElement();

  const handleScrollToCategory = (categoryTitle) => {
    const validCategorySelector = toValidSelector(categoryTitle);
    scrollToCategory(validCategorySelector);
    selectedCategory$.set(validCategorySelector);
  };

  return (
    <div className="flex-shrink hidden min-w-fit max-w-sm md:block">
      <div className="flex flex-col gap-3">
        {Object.entries(policies).map(([category]) => (
          <Button
            key={category}
            variant="ghost"
            size="lg"
            onClick={() => {
              handleScrollToCategory(category);
            }}
            className="justify-start px-4 text-lg"
          >
            <DynamicIcon
              name={category}
              FallbackIcon={POLICY_DEFAULT_ICON}
              className="h-6"
            />
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}

function PolicyContent({ filteredPolicies }) {
  return (
    <div className="rounded-xl flex-grow overflow-y-auto overflow-auto scrollbar-hide">
      <div className="flex flex-col md:col-span-3 h-fit md:max-h-[35rem] gap-2">
        {Object.entries(filteredPolicies).map(
          ([category, { subcategories }]) => (
            <Card
              key={category}
              id={toValidSelector(category)}
              className="border-0 shadow-transparent"
            >
              <CardHeader className="py-4">
                <CardTitle className="flex items-center gap-2">
                  <DynamicIcon
                    name={category}
                    FallbackIcon={POLICY_DEFAULT_ICON}
                    className="h-5 w-5"
                  />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8">
                <PolicyAccordion subcategories={subcategories} />
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

function PolicyAccordion({ subcategories }) {
  const scrollToPolicy = useScrollToElement();

  function handleScrollToPolicy(policyItem) {
    const validPolicyItemSelector = toValidSelector(policyItem);
    setTimeout(() => scrollToPolicy(validPolicyItemSelector, -10), 250);
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(subcategories).map(([subcategory, policies], index) => (
        <AccordionItem
          value={`item-${index}`}
          key={subcategory}
          id={toValidSelector(subcategory)}
        >
          <AccordionTrigger onClick={() => handleScrollToPolicy(subcategory)}>
            <div className="flex flex-row gap-2 justify-start items-center">
              <DynamicIcon
                name={subcategory}
                FallbackIcon={POLICY_DEFAULT_ICON}
              />
              {subcategory}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            {Object.entries(policies).map(([title, content]) => (
              <div key={title} className="mb-4">
                <Label htmlFor={title}>{title}</Label>
                <div id={title} className="text-sm text-muted-foreground">
                  {content}
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function SearchBar() {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search policies..."
        className="pl-10"
        value={searchQuery$.get()}
        disabled
        onChange={(e) => searchQuery$.set(e.target.value)}
      />
    </div>
  );
}
