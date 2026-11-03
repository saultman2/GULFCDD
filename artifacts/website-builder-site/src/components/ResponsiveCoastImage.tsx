import type { ImgHTMLAttributes } from "react";

const widths = [640, 960, 1280, 1920];
export function ResponsiveCoastImage({ src, width = 1920, height = 1080, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const stem = src?.includes("ocean-springs-harbor") ? "ocean-springs-harbor" :
    src?.includes("biloxi-coast") ? "biloxi-coast" : null;
  if (!stem) return <img src={src} width={width} height={height} {...props} />;
  const set = (format: string) => widths.map((width) => `/images/${stem}-v1-${width}.${format} ${width}w`).join(", ");
  return <picture className="contents">
    <source type="image/avif" srcSet={set("avif")} sizes="100vw" />
    <source type="image/webp" srcSet={set("webp")} sizes="100vw" />
    <img {...props} src={`/images/${stem}-v1-960.webp`} srcSet={set("webp")} sizes="100vw"
      width={stem === "biloxi-coast" ? 640 : 900} height={stem === "biloxi-coast" ? 475 : 506} />
  </picture>;
}
