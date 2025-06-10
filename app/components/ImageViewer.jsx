import Image from "next/image";

// TODO improve the image viewer - make it properly styled to prevent hassle with sizing, and optimization
export function ImageViewer({
  src,
  alt,
  className,
  priority = false,
  onClick = () => {},
}) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt || "not found"}
        fill
        className={`object-cover cursor-pointer ${className}`}
        priority={priority}
        onClick={onClick}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
      />
    </div>
  );
}
