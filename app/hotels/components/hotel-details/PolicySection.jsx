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
import { useHorizontalScroll, useScrollToElement } from "@/hooks/use-scroll";
import { observable } from "@legendapp/state";
import { toValidSelector } from "@/lib/string-parsers";
import { DynamicIcon } from "@/app/components/DynamicIcon";
import { POLICY_DEFAULT_ICON } from "@/config/icons-map";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";
import { HorizontalScrollButtons } from "@/app/components/HorizontalScrollButtons";
import {
  filterPoliciesByType,
  getFeaturedRules,
  getPolicyTypes,
  useFormatPolicyData,
} from "../../data/format-data/hotelPolicyData";
import { cn } from "@/lib/utils";

const selectedCategory$ = observable(null);
const searchQuery$ = observable("");

const secondaryLabel =
  "flex items-center gap-1 mb-1 text-sm text-muted-foreground";

export function PolicySection({ policies, id, className }) {
  const policiesWithRules = useFormatPolicyData(policies);
  const featuredRules = getFeaturedRules(policies);

  if (!policiesWithRules) return <>Loading</>;

  return (
    <section
      id={id}
      className={cn("py-2 pr-2 space-y-7 rounded-lg", className)}
    >
      <FeaturedRules rules={featuredRules} />
      {/* <SearchBar /> */}
      <div className="flex flex-row gap-6">
        <span>
          <div htmlFor="categories" className={secondaryLabel}>
            <ListTree className="w-3.5 h-3.5" />
            Policy Type
          </div>
          <PolicyTypes id="categories" className="mt-3" />
        </span>
        <div className="w-full overflow-hidden">
          <div htmlFor="categories" className={secondaryLabel}>
            <ListTree className="w-3.5 h-3.5" />
            All Policies
          </div>
          <PolicyContent
            id="all-policies"
            policiesWithRules={policiesWithRules}
            className="mt-3"
          />
        </div>
      </div>
    </section>
  );
}

function PolicyTypes({ className }) {
  const policyTypes = getPolicyTypes();

  const scrollToCategory = useScrollToElement();

  const handleScrollToCategory = (categoryTitle) => {
    const validCategorySelector = toValidSelector(categoryTitle);
    scrollToCategory(validCategorySelector, 0, true);
    selectedCategory$.set(validCategorySelector);
  };

  return (
    <div
      className={cn(
        "flex-shrink hidden max-w-sm min-w-fit ml-1 md:block",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        {policyTypes.map(({ id, label, description, icon }) => (
          <Button
            key={id}
            variant="ghost"
            size="lg"
            onClick={() => {
              handleScrollToCategory(id);
            }}
            className="justify-start px-4 text-base text-muted-foreground"
          >
            <DynamicIcon
              name={icon}
              FallbackIcon={POLICY_DEFAULT_ICON}
              className="h-6"
            />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function PolicyContent({ policiesWithRules, className }) {
  const policyTypes = getPolicyTypes();
  return (
    <div
      className={cn(
        "flex-grow overflow-y-auto border h-fit md:max-h-[40rem] rounded-xl scrollbar-hide",
        className
      )}
    >
      <div className="h-3 sticky top-0 z-20" />
      <div className="flex flex-col gap-2 md:col-span-3">
        {policyTypes?.map(({ id, label, icon, description }) => (
          <Card
            key={id}
            id={toValidSelector(id)}
            className="border-0 shadow-transparent"
          >
            <CardHeader className="sticky top-0 p-0 bg-background">
              <CardTitle className="flex px-6 py-4 items-center gap-2">
                <DynamicIcon
                  name={icon}
                  FallbackIcon={POLICY_DEFAULT_ICON}
                  className="w-5 h-5"
                />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 ml-5">
              <PolicyAccordion
                policiesWithRules={filterPoliciesByType(policiesWithRules, id)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PolicyAccordion({ policiesWithRules }) {
  const scrollToPolicy = useScrollToElement();

  function handleScrollToPolicy(policyItem) {
    const validPolicyItemSelector = toValidSelector(policyItem);
    setTimeout(() => scrollToPolicy(validPolicyItemSelector, 50, true), 250);
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {policiesWithRules.map(({ id, label, icon, rules }) => (
        <AccordionItem value={`item-${id}`} key={id} id={toValidSelector(id)}>
          <AccordionTrigger onClick={() => handleScrollToPolicy(id)}>
            <div className="flex flex-row items-center justify-start gap-2">
              <DynamicIcon name={icon} FallbackIcon={POLICY_DEFAULT_ICON} />
              {label}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 ml-3">
            <ul className="list-disc pl-5">
              {rules.map(({ id, label, icon, description }) => (
                <li key={id} className="mb-3">
                  <Label htmlFor={id}>{label}</Label>
                  <div id={id} className="text-sm text-muted-foreground">
                    {description}
                  </div>
                </li>
              ))}
            </ul>
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

const FeaturedRules = ({ rules }) => {
  const { scrollRef, scrollTo, canScrollLeft, canScrollRight } =
    useHorizontalScroll(rules);

  return (
    <HorizontalScrollButtons
      wideScreenOnly
      floating
      scrollTo={scrollTo}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
    >
      <BasicPolicyList policies={rules} ref={scrollRef} />
    </HorizontalScrollButtons>
  );
};

const BasicPolicyList = forwardRef(({ policies }, ref) => {
  return (
    <div
      ref={ref}
      className="flex gap-2 overflow-x-auto snap-mandatory snap-x scrollbar-hide"
    >
      {policies.map(({ id, label, icon, description }) => (
        <div
          key={id}
          className="px-6 py-4 border rounded-lg snap-start min-w-fit"
        >
          <div className="flex items-center gap-4">
            <DynamicIcon
              name={icon}
              FallbackIcon={POLICY_DEFAULT_ICON}
              className="w-6 h-6"
            />
            <div>
              <h3 className="text-base font-medium whitespace-nowrap">
                {label}
              </h3>
              <p className="text-sm text-muted-foreground max-w-40 line-clamp-1">
                {description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
BasicPolicyList.displayName = BasicPolicyList;
