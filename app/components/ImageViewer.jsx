import Image from "next/image";

export function ImageViewer({
  src,
  alt,
  className,
  priority = false,
  onClick = () => {},
}) {
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt || "not found"}
      fill
      className={`object-cover cursor-pointer ${className}`}
      priority={priority}
      onClick={onClick}
    />
  );
}
