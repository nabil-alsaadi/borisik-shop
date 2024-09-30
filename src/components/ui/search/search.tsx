import SearchBox from '@/components/ui/search/search-box';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSearch } from './search.context';
import { useEffect } from 'react';
interface Props {
  label: string;
  className?: string;
  inputClassName?: string;
  variant?: 'minimal' | 'normal' | 'with-shadow' | 'flat';
  [key: string]: unknown;
}

const Search: React.FC<Props> = ({
  label,
  variant,
  className,
  inputClassName,
  ...props
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { searchTerm, updateSearchTerm } = useSearch();

   // Clear search when category changes
   useEffect(() => {
    const handleRouteChange = (url: string) => {
      const currentCategory = router.query.category;
      const newCategory = new URL(url, window.location.origin).searchParams.get('category');

      if (newCategory) {
        clearSearch(); // Clear search when the category changes
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  
  const handleOnChange = (e: any) => {
    const { value } = e.target;
    updateSearchTerm(value);
  };

  // const onSearch = (e: any) => {
  //   e.preventDefault();
  //   if (!searchTerm) return;
  //   const { pathname, query } = router;
  //   router.push(
  //     {
  //       pathname,
  //       query: { ...query, text: searchTerm },
  //     },
  //     undefined,
  //     {
  //       scroll: false,
  //     }
  //   );
  // };
  const onSearch = (e: any) => {
    e.preventDefault();
    if (!searchTerm) return;

    const { pathname, query } = router;

    // Remove the category from the query when performing a search
    const { category, ...restQuery } = query;

    // Update the URL to include the search term and remove the category
    router.push(
      {
        pathname,
        query: { ...restQuery, text: searchTerm },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  function clearSearch() {
    updateSearchTerm('');
    const { pathname, query } = router;
    const { text, ...rest } = query;
    if (text) {
      router.push(
        {
          pathname,
          query: { ...rest },
        },
        undefined,
        {
          scroll: false,
        }
      );
    }
  }

  return (
    <SearchBox
      label={label}
      onSubmit={onSearch}
      onClearSearch={clearSearch}
      onChange={handleOnChange}
      value={searchTerm}
      name="search"
      placeholder={t('common:text-search-placeholder')}
      variant={variant}
      className={className}
      inputClassName={inputClassName}
      {...props}
    />
  );
};

export default Search;
