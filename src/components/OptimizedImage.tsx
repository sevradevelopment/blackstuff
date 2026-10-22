import Image, { type ImageProps } from "next/image";

type Props = ImageProps & {
  tone?: "sand" | "dark";
};

/** Consistent Next Image defaults — sharp on both phone and desktop */
export function OptimizedImage({
  alt,
  tone = "sand",
  className = "",
  priority,
  quality = 95,
  loading,
  ...props
}: Props) {
  return (
    <Image
      {...props}
      alt={alt}
      priority={priority}
      quality={quality}
      loading={priority ? undefined : loading ?? "lazy"}
      decoding="async"
      className={`${tone === "sand" ? "bg-sand/40" : "bg-charcoal"} ${className}`}
    />
  );
}
