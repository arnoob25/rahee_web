import { ListTree, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { basicPolicies, policies } from "../api/mockData";
import { useFilteredPolicies } from "../hooks/useHotelPolicies";
import { useHorizontalScroll, useScrollToElement } from "@/hooks/use-scroll";
import { observable } from "@legendapp/state";
import { toValidSelector } from "@/lib/string-parsers";
import { DynamicIcon } from "@/app/components/DynamicIcon";
import { POLICY_DEFAULT_ICON } from "@/config/icons-map";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";
import { HorizontalScrollButtons } from "@/app/components/HorizontalScrollButtons";

const selectedCategory$ = observable(null);
const searchQuery$ = observable("");

const secondaryLabel =
  "flex items-center gap-1 mb-1 text-sm text-muted-foreground";

export function Policies() {
  const filteredPolicies = useFilteredPolicies(policies, searchQuery$.get());

  return (
    <div className="py-2 pr-2 space-y-4 rounded-lg">
      <HighlightedPolicies />
      {/* <SearchBar /> */}
      <div className="flex flex-row gap-6">
        <span>
          <div htmlFor="categories" className={secondaryLabel}>
            <ListTree className="w-3.5 h-3.5" />
            Policy Type
          </div>
          <CategoryList id="categories" policies={policies} />
        </span>
        <div className="w-full">
          <div htmlFor="categories" className={secondaryLabel}>
            <ListTree className="w-3.5 h-3.5" />
            All Policies
          </div>
          <PolicyContent
            id="all-policies"
            filteredPolicies={filteredPolicies}
          />
        </div>
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
    <div className="flex-shrink hidden max-w-sm min-w-fit md:block">
      <div className="flex flex-col gap-3">
        {Object.entries(policies).map(([category]) => (
          <Button
            key={category}
            variant="ghost"
            size="lg"
            onClick={() => {
              handleScrollToCategory(category);
            }}
            className="justify-start px-4 text-base"
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
    <div className="flex-grow overflow-y-auto border h-fit md:max-h-[28rem] rounded-xl scrollbar-hide">
      <div className="flex flex-col gap-2 md:col-span-3">
        {Object.entries(filteredPolicies).map(
          ([category, { subcategories }]) => (
            <Card
              key={category}
              id={toValidSelector(category)}
              className="border-0 shadow-transparent"
            >
              <CardHeader className="sticky top-0 py-4 bg-background">
                <CardTitle className="flex items-center gap-2">
                  <DynamicIcon
                    name={category}
                    FallbackIcon={POLICY_DEFAULT_ICON}
                    className="w-5 h-5"
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
    setTimeout(() => scrollToPolicy(validPolicyItemSelector, 45), 250);
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
            <div className="flex flex-row items-center justify-start gap-2">
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
    <div className="relative">
      <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
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

const HighlightedPolicies = () => {
  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(basicPolicies);

  return (
    <HorizontalScrollButtons
      wideScreenOnly
      floating
      scrollTo={scrollTo}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
    >
      <BasicPolicyList policies={basicPolicies} ref={scrollRef} />
    </HorizontalScrollButtons>
  );
};

const BasicPolicyList = forwardRef(({ policies }, ref) => {
  return (
    <div
      ref={ref}
      className="flex gap-2 overflow-x-auto snap-mandatory snap-x scrollbar-hide"
    >
      {policies.map((policy, index) => (
        <div
          key={policy.name}
          className="px-6 py-4 border rounded-lg snap-start min-w-fit"
        >
          <div className="flex items-center gap-4">
            <DynamicIcon
              name={policy.icon}
              FallbackIcon={POLICY_DEFAULT_ICON}
              className="w-6 h-6"
            />
            <div>
              <h3 className="text-base font-medium whitespace-nowrap">
                {policy.name}
              </h3>
              <p className="text-sm text-muted-foreground max-w-40 line-clamp-1">
                {policy.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
BasicPolicyList.displayName = BasicPolicyList;
