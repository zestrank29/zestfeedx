"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

const DEFAULT_NEWS_FALLBACK =
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_NEWS_FALLBACK,
  className = "",
  ...rest
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...rest}
      src={hasError ? fallbackSrc : currentSrc}
      alt={alt || "ZestFeedX Editorial Photograph"}
      className={className}
      unoptimized
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

