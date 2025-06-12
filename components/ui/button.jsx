import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Check, ChevronDown } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const ButtonWithOptions = React.forwardRef((props, ref) => {
  const {
    className,
    variant,
    size,
    asChild = false,
    label,
    actionLabel,
    Icon,
    children,
    options,
    disabled,
    onOptionsSubmit,
    ...rest
  } = props;

  const [selectedOptions, setSelectedOptions] = React.useState(
    options.map((option) => option.id) ?? []
  );
  const hasOptions = Array.isArray(options) && options.length > 0;

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const getLabel = () => {
    if (!hasOptions) return label ?? children;
    if (selectedOptions.length === 0) return label ?? children;
    if (selectedOptions.length === options.length)
      return `${actionLabel} for All`;
    return (
      (actionLabel ? actionLabel + " for" : "") +
      "  " +
      selectedOptions.length +
      " selected"
    );
  };

  return (
    <div
      className={cn(
        "flex justify-end items-center",
        disabled ? "opacity-50 pointer-events-none" : ""
      )}
    >
      <button
        {...rest}
        className={cn(
          buttonVariants({ variant, size, className }),
          "flex-1 mx-0 justify-between items-center gap-2 rounded-r-none"
        )}
        ref={ref}
        disabled={selectedOptions.length === 0}
        onClick={() => onOptionsSubmit(selectedOptions)}
      >
        {Icon ? <Icon className="pl-0 ml-0" /> : null}
        {getLabel()}
      </button>

      {hasOptions && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                buttonVariants({ variant, size }),
                "w-auto h-full bg-foreground/95 mx-0 px-2 rounded-l-none"
              )}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2 space-y-2">
            {options.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => toggleOption(id)}
                className={cn(
                  "flex w-full h-full justify-between items-center px-4 py-2 gap-2 text-sm hover:bg-secondary rounded-md",
                  selectedOptions.includes(id) ? "bg-secondary" : ""
                )}
              >
                {label}

                {selectedOptions.includes(id) && <Check className="w-4 h-4" />}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
});

ButtonWithOptions.displayName = "ButtonWithOptions";

export { Button, ButtonWithOptions, buttonVariants };
