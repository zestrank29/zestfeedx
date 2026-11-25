"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

const CATEGORY_FALLBACKS: Record<string, string> = {
  health: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
  cricket: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  markets: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  tech: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  india: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1200&q=80",
  politics: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1200&q=80",
  world: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
  festivals: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
  ramayana: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
  entertainment: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
  explainers: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
};

const DEFAULT_NEWS_FALLBACK =
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  category?: string;
}

export default function SafeImage({
  src,
  alt,
  category,
  fallbackSrc,
  className = "",
  ...rest
}: SafeImageProps) {
  const chosenFallback =
    fallbackSrc ||
    (category && CATEGORY_FALLBACKS[category.toLowerCase()]) ||
    DEFAULT_NEWS_FALLBACK;

  const [currentSrc, setCurrentSrc] = useState(src || chosenFallback);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...rest}
      src={hasError ? chosenFallback : currentSrc}
      alt={alt || "ZestFeedX Editorial Photograph"}
      className={className}
      unoptimized
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(chosenFallback);
        }
      }}
    />
  );
}

