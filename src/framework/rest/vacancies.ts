import type {
    Author,
    AuthorPaginator,
    AuthorQueryOptions,
    PublicationPaginator,
    QueryOptions,
    Vacancy,
    VacancyPaginator,
  } from '@/types';
  import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
  import client from './client';
  import { API_ENDPOINTS } from './client/api-endpoints';
  import { mapPaginatorData } from '@/framework/utils/data-mappers';
  import { useRouter } from 'next/router';
import { applyPublicationTranslations, applyVacancyTranslations } from './utils/format-products-args';
import { toast } from 'react-toastify';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
  
export function useVacancies(options?: Partial<AuthorQueryOptions>) {
    const { locale, query } = useRouter();

    let formattedOptions = {
        ...options,
        language: locale,
    //   name: query?.text,
    };

    const {
        data,
        isLoading,
        error
    } = useQuery<Vacancy[], Error>(
        [API_ENDPOINTS.VACANCIES, formattedOptions],
        ({ queryKey, pageParam }) =>
        client.vacancies.all(Object.assign({}, queryKey[1], pageParam))
    );
    // console.log('data',data)
    // const res = data?.pages?.flatMap((page) => page.data) ?? []
    const res_translated = data ? data.flatMap( (item) => applyVacancyTranslations(item,locale)) : []
    return {
        vacancies: res_translated,
        isLoading,
        error
    };
}

export function useApplyVacancy() {
    const queryClient = useQueryClient();
    const { closeModal } = useModalAction();
    const { t } = useTranslation();
    const {
        mutate: applyVacancy,
        isLoading,
        error,
        data,
    } = useMutation(client.vacancies.apply,
        {
            // onSettled: (data) => {
            //     queryClient.refetchQueries(API_ENDPOINTS.VACANCIES);
            // },
            onError: (error) => {
                const {
                    response: { data },
                }: any = error ?? {};
                toast.error(data?.message);
            },
            onSuccess: () => {
                closeModal();
                toast.success(`${t('common:vacancy-successfully-applied')}`);
            }
        }
    );

    return {
        applyVacancy,
        data,
        isLoading,
        error,
    };
}

