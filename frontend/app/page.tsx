"use client";

import RestaurantSearch from "@/components/restaurant-search";
import RestaurantList from "@/components/restaurant-list";
import Hero from "@/components/hero";
import { useEffect, useState } from "react";
import { RestaurantSearchParams, RestaurantSummary } from "@/domain/domain";
import { useAppContext } from "@/providers/app-context-provider";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Home() {
  const { apiService } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [currentSearchParams, setCurrentSearchParams] =
    useState<RestaurantSearchParams>({});

  const searchRestaurants = async (
    params: RestaurantSearchParams,
    targetPage?: number,
  ) => {
    try {
      setLoading(true);
      setCurrentSearchParams(params);

      const paginatedParams = {
        ...params,
        page: targetPage || page,
        size: 8,
      };

      console.log(`Searching for Restaurants: ${JSON.stringify(params)}`);
      if (!apiService?.searchRestaurants) {
        throw "ApiService is not initialized!";
        return;
      }
      const restaurants = await apiService.searchRestaurants(paginatedParams);

      if (restaurants) {
        setTotalPages(restaurants.totalPages);
        setFirst(restaurants.first);
        setLast(restaurants.last);
        setRestaurants(restaurants.content);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await searchRestaurants(currentSearchParams, newPage);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (!totalPages) return [];

    const pageNumbers: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pageNumbers.push(1);

    if (page > 3) {
      pageNumbers.push("ellipsis");
    }

    // Calculate middle pages
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (page < totalPages - 2) {
      pageNumbers.push("ellipsis");
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  useEffect(() => {
    const doUseEffect = async () => {
      await searchRestaurants({});
    };

    if (!apiService) {
      return;
    }

    doUseEffect();
  }, [apiService]);

  return (
    <div>
      <Hero />
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <RestaurantSearch searchRestaurants={searchRestaurants} />
        <RestaurantList loading={loading} restaurants={restaurants} />
        {totalPages && totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                {!first && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                    />
                  </PaginationItem>
                )}

                {getPageNumbers().map((pageNum, index) => (
                  <PaginationItem key={`${pageNum}-${index}`}>
                    {pageNum === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={pageNum === page}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {!last && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}
