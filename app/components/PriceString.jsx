import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function PriceString({
  size = "lg",
  price,
  unit = "night",
  label = "",
}) {
  const textStyle = cn(
    size === "lg"
      ? "text-5xl font-bold"
      : size === "md"
      ? "text-4xl font-bold"
      : size === "sm"
      ? "text-base"
      : ""
  );

  if (price === null || price === undefined) return <>Price unavailable</>;

  return (
    <>
      {label.trim().length > 0 ? (
        <Label htmlFor="price" className="text-xs text-muted-foreground">
          {label}
        </Label>
      ) : null}
      <span id="price" className={`flex items-baseline text- ${textStyle}`}>
        {`৳${price.toLocaleString()}`}
        <span className="text-sm text-muted-foreground">{`‎ /${unit}`}</span>
      </span>
    </>
  );
}
