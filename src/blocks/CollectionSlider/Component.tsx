"use client"

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/utilities/ui";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Collection configuration - moved outside component to prevent recreation
const collectionConfig = {
  posts: {
    apiPath: "/api/posts",
    titleField: "title",
    dateField: "publishedAt",
    imageField: "heroImage",
    slugField: "slug",
    contentField: "content",
  },
  categories: {
    apiPath: "/api/categories",
    titleField: "title",
    dateField: "createdAt",
    imageField: "image",
    slugField: "slug",
    contentField: "description",
  },
  media: {
    apiPath: "/api/media",
    titleField: "filename",
    dateField: "createdAt",
    imageField: "url",
    slugField: "id",
    contentField: "alt",
  },
  bookings: {
    apiPath: "/api/bookings",
    titleField: "title",
    dateField: "createdAt",
    imageField: "image",
    slugField: "id",
    contentField: "description",
  },
  photos: {
    apiPath: "/api/photos",
    titleField: "title",
    dateField: "lastSynced",
    imageField: "url",
    slugField: "externalId",
    contentField: "title",
  },
};

function truncateText(text: string, maxLength: number) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function extractTextFromRichText(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (content.root && content.root.children) {
    return extractTextFromLexicalNodes(content.root.children);
  }
  try {
    const contentStr = JSON.stringify(content);
    return contentStr.replace(/[{}"\[\],:]/g, " ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

function extractTextFromLexicalNodes(nodes: any[]): string {
  if (!Array.isArray(nodes)) return "";
  return nodes
    .map((node) => {
      if (node.type === "paragraph" || node.type === "heading") {
        if (node.children) {
          return extractTextFromLexicalNodes(node.children);
        }
      }
      if (node.type === "text" && node.text) {
        return node.text;
      }
      if (node.children) {
        return extractTextFromLexicalNodes(node.children);
      }
      return "";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

interface CollectionItem {
  id: string;
  [key: string]: any;
}

interface CollectionSliderBlockProps {
  title?: string;
  description?: string;
  collection: "posts" | "categories" | "media" | "bookings" | "photos";
  selectionMethod: "manual" | "latest" | "category" | "featured";
  items?: CollectionItem[];
  category?: {
    id: string;
    title: string;
    slug: string;
  };
  itemsLimit?: number;
  display?: {
    showImage?: boolean;
    showTitle?: boolean;
    showExcerpt?: boolean;
    showDate?: boolean;
    showCategory?: boolean;
    excerptLength?: number;
  };
  slider?: {
    autoplay?: boolean;
    delay?: number;
    loop?: boolean;
    nav?: boolean;
    pagination?: boolean;
    perView?: string;
    space?: number;
  };
  styling?: {
    cardStyle?: "modern" | "minimal" | "classic";
    theme?: "light" | "dark";
    showReadMore?: boolean;
  };
}

type Props = {
  className?: string;
} & CollectionSliderBlockProps;

export const CollectionSliderBlock: React.FC<Props> = ({
  className,
  title,
  description,
  collection,
  selectionMethod,
  items: manualItems,
  category,
  itemsLimit = 6,
  display = {},
  slider = {},
  styling = {},
}) => {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<any>(null);
  const sliderId = useRef(`collection-slider-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    let isCancelled = false;
    const config = collectionConfig[collection];
    const fetchItems = async () => {
      setLoading(true);
      try {
        let url = config.apiPath;
        const params = new URLSearchParams();
        switch (selectionMethod) {
          case "manual":
            if (manualItems && manualItems.length > 0) {
              setItems(manualItems);
              setLoading(false);
              return;
            }
            break;
          case "latest":
            params.append("sort", `-${config.dateField}`);
            params.append("limit", itemsLimit.toString());
            break;
          case "category":
            if (category?.id) {
              params.append("where[categories][in]", category.id);
              params.append("sort", `-${config.dateField}`);
              params.append("limit", itemsLimit.toString());
            }
            break;
          case "featured":
            params.append("sort", `-${config.dateField}`);
            params.append("limit", itemsLimit.toString());
            break;
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setItems(data.docs || []);
        }
      } catch (error) {
        console.error(`Error fetching ${collection}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
    return () => {
      isCancelled = true;
    };
  }, [collection, selectionMethod, manualItems, category, itemsLimit]);

  if (loading) {
    return (
      <div className={cn("mx-auto my-8 w-full", className)}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={cn("mx-auto my-8 w-full", className)}>
        <div className="text-center py-12">
          <p className="text-gray-600">No {collection} found.</p>
        </div>
      </div>
    );
  }

  const themeClasses: Record<string, string> = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-white",
  };

  const cardStyleClasses: Record<string, string> = {
    modern:
      "bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300",
    minimal:
      "bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors duration-300",
    classic:
      "bg-white rounded-lg border-2 border-gray-300 overflow-hidden hover:border-gray-400 transition-colors duration-300",
  };

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: slider?.space || 30,
    slidesPerView: parseInt(slider?.perView || "3"),
    loop: slider?.loop ?? true,
    autoplay: slider?.autoplay
      ? {
          delay: slider.delay || 5000,
          disableOnInteraction: false,
        }
      : false,
    navigation: slider?.nav ? {
      nextEl: `.${sliderId.current}-next`,
      prevEl: `.${sliderId.current}-prev`,
    } : false,
    pagination: slider?.pagination ? { 
      clickable: true,
      el: `.${sliderId.current}-pagination`,
    } : false,
    breakpoints: {
      640: {
        slidesPerView: Math.min(parseInt(slider?.perView || "3"), 2),
      },
      768: {
        slidesPerView: Math.min(parseInt(slider?.perView || "3"), 3),
      },
      1024: {
        slidesPerView: parseInt(slider?.perView || "3"),
      },
    },
  };

  return (
    <div
      className={cn(
        "mx-auto my-8 w-full",
        themeClasses[styling?.theme || "light"],
        className
      )}
    >
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}
      <div className="relative">
        <Swiper ref={swiperRef} {...swiperConfig} className="w-full">
          {items.map((item) => {
            const config = collectionConfig[collection];
            const title = item[config.titleField] || item.title || item.name || "Untitled";
            const date = item[config.dateField] || item.createdAt || item.updatedAt || item.lastSynced;
            const image = item[config.imageField] || item.heroImage || item.image || item.url || item.thumbnailUrl;
            const slug = item[config.slugField] || item.slug || item.id || item.externalId;
            const content = item[config.contentField] || item.content || item.description || item.excerpt || title;
            return (
              <SwiperSlide key={item.id}>
                <div
                  className={cn(
                    "h-full p-4",
                    cardStyleClasses[styling?.cardStyle || "modern"]
                  )}
                >
                  {/* Item Image */}
                  {display?.showImage !== false && image && (
                    <div className="relative h-48 mb-4 overflow-hidden">
                      <img
                        src={typeof image === "string" ? image : image.url}
                        alt={typeof image === "string" ? title : image.alt || title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  {/* Item Content */}
                  <div className="p-4">
                    {/* Category */}
                    {display?.showCategory !== false && item.categories && item.categories.length > 0 && (
                      <div className="mb-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {item.categories[0].title}
                        </span>
                      </div>
                    )}
                    {/* Title */}
                    {display?.showTitle !== false && (
                      <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors duration-300">
                        <a href={`/${collection}/${slug}`}>{title}</a>
                      </h3>
                    )}
                    {/* Date */}
                    {display?.showDate !== false && date && (
                      <p className="text-sm text-gray-500 mb-2">{formatDate(date)}</p>
                    )}
                    {/* Excerpt */}
                    {display?.showExcerpt !== false && content && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {truncateText(
                          extractTextFromRichText(content),
                          display.excerptLength || 150
                        )}
                      </p>
                    )}
                    {/* Read More Button */}
                    {styling?.showReadMore && (
                      <a
                        href={`/${collection}/${slug}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        Read More
                      </a>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* Custom Navigation Buttons */}
        {slider?.nav && (
          <>
            <button className={`${sliderId.current}-prev swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300 shadow-lg`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className={`${sliderId.current}-next swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300 shadow-lg`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        {/* Custom Pagination */}
        {slider?.pagination && (
          <div className={`${sliderId.current}-pagination swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20`} />
        )}
      </div>
    </div>
  );
}; 