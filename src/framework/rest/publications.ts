import type {
    Author,
    AuthorPaginator,
    AuthorQueryOptions,
    PublicationPaginator,
    QueryOptions,
  } from '@/types';
  import { useInfiniteQuery, useQuery } from 'react-query';
  import client from './client';
  import { API_ENDPOINTS } from './client/api-endpoints';
  import { mapPaginatorData } from '@/framework/utils/data-mappers';
  import { useRouter } from 'next/router';
import { applyPublicationTranslations } from './utils/format-products-args';
  
  export function usePublications(options?: Partial<AuthorQueryOptions>) {
    const { locale, query } = useRouter();
  
    let formattedOptions = {
      ...options,
      language: locale,
    //   name: query?.text,
    };
  
    const {
      data,
      isLoading,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
    } = useInfiniteQuery<PublicationPaginator, Error>(
      [API_ENDPOINTS.PUBLICATIONS, formattedOptions],
      ({ queryKey, pageParam }) =>
        client.publications.all(Object.assign({}, queryKey[1], pageParam)),
      {
        getNextPageParam: ({ current_page, last_page }) =>
          last_page > current_page && { page: current_page + 1 },
      },
    );
  
    function handleLoadMore() {
      fetchNextPage();
    }
    const res = data?.pages?.flatMap((page) => page.data) ?? []
    const res_translated = res.flatMap( (item) => applyPublicationTranslations(item,locale))
    return {
      publications: res_translated,
      paginatorInfo: Array.isArray(data?.pages)
        ? mapPaginatorData(data?.pages[data.pages.length - 1])
        : null,
      isLoading,
      error,
      isFetching,
      isLoadingMore: isFetchingNextPage,
      loadMore: handleLoadMore,
      hasMore: Boolean(hasNextPage),
    };
  }
  