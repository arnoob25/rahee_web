import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function PriceString({
  size = "large",
  price,
  unit = "night",
  label = "",
}) {
  const textStyle = cn(
    size === "large"
      ? "text-3xl font-bold"
      : size === "medium"
      ? "text-xl font-bold"
      : size === "small"
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
