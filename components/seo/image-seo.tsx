import Image, { type ImageProps } from "next/image"

interface SeoImageProps extends Omit<ImageProps, "alt"> {
  alt: string
  title?: string
  caption?: string
  className?: string
  wrapperClassName?: string
}

export default function SeoImage({
  alt,
  title,
  caption,
  className = "",
  wrapperClassName = "",
  ...props
}: SeoImageProps) {
  return (
    <figure className={wrapperClassName}>
      <Image
        {...props}
        alt={alt}
        title={title || alt}
        className={`max-w-full ${className}`}
        loading={props.priority ? "eager" : "lazy"}
        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      />
      {caption && <figcaption className="mt-2 text-sm text-center text-gray-500 italic">{caption}</figcaption>}
    </figure>
  )
}
