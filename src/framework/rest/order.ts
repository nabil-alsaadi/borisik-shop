import {
  CreateOrderInput,
  CreateOrderPaymentInput,
  CreateRefundInput,
  DownloadableFilePaginator,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  PaymentGateway,
  QueryOptions,
  RefundPolicyQueryOptions,
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { API_ENDPOINTS } from './client/api-endpoints';
import client from './client';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { isArray, isObject, isEmpty } from 'lodash';
import { applyOrderTranslations } from './utils/format-products-args';
import { useEffect, useState } from 'react';

import { collection, doc, limit, onSnapshot, orderBy, query, startAfter, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

// export function useOrders(options?: Partial<OrderQueryOptions>) {
//   const { locale } = useRouter();

//   const formattedOptions = {
//     ...options,
//     language: locale
//   };

//   const {
//     data,
//     isLoading,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//   } = useInfiniteQuery<OrderPaginator, Error>(
//     [API_ENDPOINTS.ORDERS, formattedOptions],
//     ({ queryKey, pageParam }) =>
//       client.orders.all(Object.assign({}, queryKey[1], pageParam)),
//     {
//       getNextPageParam: ({ current_page, last_page }) =>
//         last_page > current_page && { page: current_page + 1 },
//       refetchOnWindowFocus: false,
//     }
//   );

//   function handleLoadMore() {
//     fetchNextPage();
//   }
//   const orders = data?.pages?.flatMap((page) => page.data) ?? []
//   const orderTranlated = orders.map((order) => applyOrderTranslations(order,locale ?? 'en'))
//   console.log('orders',data)
//   return {
//     orders: orderTranlated,
//     paginatorInfo: Array.isArray(data?.pages)
//       ? mapPaginatorData(data?.pages[data.pages.length - 1])
//       : null,
//     isLoading,
//     error,
//     isFetching,
//     isLoadingMore: isFetchingNextPage,
//     loadMore: handleLoadMore,
//     hasMore: Boolean(hasNextPage),
//   };
// }

const PAGE_LIMIT = 15; // Set your pagination limit

export function useOrders() {
  const { locale } = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastDoc, setLastDoc] = useState<null | any>(null); // Keep track of the last document for pagination
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false); // General fetching state
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // Pagination loading state
  const [hasMore, setHasMore] = useState<boolean>(true); // Pagination state
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial query to fetch the first page of orders, ordered by 'created_at' descending (newest first)
    const orderCollection = collection(firestore, 'orders');
    const initialQuery = query(orderCollection, orderBy('created_at', 'desc'), limit(PAGE_LIMIT));

    setIsFetching(true);
    const unsubscribe = onSnapshot(
      initialQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const newOrders = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as Order[];
          setOrders(newOrders);
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]); // Set the last document for pagination
          setHasMore(snapshot.docs.length === PAGE_LIMIT); // Check if there are more documents to fetch
        } else {
          setOrders([]);
          setHasMore(false);
        }
        setIsLoading(false);
        setIsFetching(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
        setIsFetching(false);
      }
    );

    return () => unsubscribe();
  }, [locale]); // Re-run the listener when the locale changes

  // Function to load more orders (for pagination)
  const loadMoreOrders = () => {
    if (!lastDoc || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true); // Indicate pagination is happening

    const orderCollection = collection(firestore, 'orders');
    const nextQuery = query(
      orderCollection,
      orderBy('created_at', 'desc'),
      startAfter(lastDoc),
      limit(PAGE_LIMIT)
    );

    onSnapshot(
      nextQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const newOrders = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as Order[];
          setOrders((prevOrders) => [...prevOrders, ...newOrders]);
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]); // Set the last document for pagination
          setHasMore(snapshot.docs.length === PAGE_LIMIT); // Check if more documents are available
        } else {
          setHasMore(false);
        }
        setIsLoadingMore(false); // Done loading more orders
      },
      (err) => {
        setError(err);
        setIsLoadingMore(false); // Error handling
      }
    );
  };

  const orderTranslated = orders.map((order) =>
    applyOrderTranslations(order, locale ?? 'en')
  );

  return {
    orders: orderTranslated,
    isLoading,
    error,
    isFetching,
    isLoadingMore, // Now included in the returned values
    loadMore: loadMoreOrders,
    hasMore,
  };
}


// export function useOrder({ tracking_number }: { tracking_number: string }) {
//   const { locale } = useRouter();
//   const { data, isLoading, error, isFetching, refetch } = useQuery<
//     Order,
//     Error
//   >(
//     [API_ENDPOINTS.ORDERS, tracking_number, locale],
//     () => client.orders.get(tracking_number,{ language: locale }),
//     { refetchOnWindowFocus: false }
//   );

//   return {
//     order: data ? applyOrderTranslations(data,locale) : data,
//     isFetching,
//     isLoading,
//     refetch,
//     error,
//   };
// }

export function useOrder({ tracking_number }: { tracking_number: string }) {
  const { locale } = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tracking_number) return;

    // Define the query to find the document by the tracking_number field
    const ordersCollection = collection(firestore, 'orders');
    const orderQuery = query(ordersCollection, where('tracking_number', '==', tracking_number));

    // Listen for real-time updates using onSnapshot
    const unsubscribe = onSnapshot(
      orderQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          // Get the first matching document (assuming tracking_number is unique)
          const doc = snapshot.docs[0];
          const data = doc.data() as Order;
          setOrder({
            ...applyOrderTranslations(data, locale),
            id: doc.id, // Add the document id to the order data
          });
        } else {
          setOrder(null);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [tracking_number, locale]);

  return {
    order,
    isLoading,
    error,
  };
}


export function useRefunds(options: Pick<QueryOptions, 'limit'>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery(
    [API_ENDPOINTS.ORDERS_REFUNDS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.refunds(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    refunds: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}


export const useDownloadableProducts = (
  options: Pick<QueryOptions, 'limit'>
) => {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery<DownloadableFilePaginator, Error>(
    [API_ENDPOINTS.ORDERS_DOWNLOADS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.orders.downloadable(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
      refetchOnWindowFocus: false,
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    downloads: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    error,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
};

export function useCreateRefund() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { mutate: createRefundRequest, isLoading } = useMutation(
    client.orders.createRefund,
    {
      onSuccess: () => {
        toast.success(`${t('text-refund-request-submitted')}`);
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(`${t(data?.message)}`);
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
        closeModal();
      },
    }
  );

  function formatRefundInput(input: CreateRefundInput) {
    const formattedInputs = {
      ...input,
      // language: locale
    };
    createRefundRequest(formattedInputs);
  }

  return {
    createRefundRequest: formatRefundInput,
    isLoading,
  };
}

export function useCreateOrder() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();
  const { mutate: createOrder, isLoading } = useMutation(client.orders.create, {
    onSuccess: ({ tracking_number, payment_gateway, payment_intent }) => {
      console.log(
        tracking_number,
        payment_gateway,
        payment_intent,
        'create order'
      );

      if (tracking_number) {
        if (
          [
            PaymentGateway.COD,
            PaymentGateway.CASH,
            PaymentGateway.FULL_WALLET_PAYMENT,
          ].includes(payment_gateway as PaymentGateway)
        ) {
          return router.push(Routes.order(tracking_number));
        }

        if (payment_intent?.payment_intent_info?.is_redirect) {
          return router.push(
            payment_intent?.payment_intent_info?.redirect_url as string
          );
        } else {
          return router.push(`${Routes.order(tracking_number)}/payment`);
        }
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  function formatOrderInput(input: CreateOrderInput) {
    const formattedInputs = {
      ...input,
      language: locale,
      invoice_translated_text: {
        subtotal: t('order-sub-total'),
        discount: t('order-discount'),
        tax: t('order-tax'),
        delivery_fee: t('order-delivery-fee'),
        total: t('order-total'),
        products: t('text-products'),
        quantity: t('text-quantity'),
        invoice_no: t('text-invoice-no'),
        date: t('text-date'),
      },
    };
    createOrder(formattedInputs);
  }

  return {
    createOrder: formatOrderInput,
    isLoading,
    // isPaymentIntentLoading
  };
}

export function useGenerateDownloadableUrl() {
  const { mutate: getDownloadableUrl } = useMutation(
    client.orders.generateDownloadLink,
    {
      onSuccess: (data) => {
        function download(fileUrl: string, fileName: string) {
          var a = document.createElement('a');
          a.href = fileUrl;
          a.setAttribute('download', fileName);
          a.click();
        }

        download(data, 'record.name');
      },
    }
  );

  function generateDownloadableUrl(digital_file_id: string) {
    getDownloadableUrl({
      digital_file_id,
    });
  }

  return {
    generateDownloadableUrl,
  };
}

export function useVerifyOrder() {
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);

  return useMutation(client.orders.verify, {
    onSuccess: (data) => {
      //@ts-ignore
      if (data?.errors as string) {
        //@ts-ignore
        toast.error(data?.errors[0]?.message);
      } else if (data) {
        // FIXME
        //@ts-ignore
        setVerifiedResponse(data);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });
}

export function useOrderPayment() {
  const queryClient = useQueryClient();

  const { mutate: createOrderPayment, isLoading } = useMutation(
    client.orders.payment,
    {
      onSettled: (data) => {
        queryClient.refetchQueries(API_ENDPOINTS.ORDERS);
        queryClient.refetchQueries(API_ENDPOINTS.ORDERS_DOWNLOADS);
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};
        toast.error(data?.message);
      },
    }
  );

  function formatOrderInput(input: CreateOrderPaymentInput) {
    const formattedInputs = {
      ...input,
    };
    createOrderPayment(formattedInputs);
  }

  return {
    createOrderPayment: formatOrderInput,
    isLoading,
  };
}

export function useSavePaymentMethod() {
  const {
    mutate: savePaymentMethod,
    isLoading,
    error,
    data,
  } = useMutation(client.orders.savePaymentMethod);

  return {
    savePaymentMethod,
    data,
    isLoading,
    error,
  };
}

export function useGetPaymentIntentOriginal({
  tracking_number,
}: {
  tracking_number: string;
}) {
  const router = useRouter();
  const { openModal } = useModalAction();

  const { data, isLoading, error, refetch } = useQuery(
    [API_ENDPOINTS.PAYMENT_INTENT, { tracking_number }],
    () => client.orders.getPaymentIntent({ tracking_number }),
    // Make it dynamic for both gql and rest
    {
      enabled: false,
      onSuccess: (data) => {
        if (data?.payment_intent_info?.is_redirect) {
          return router.push(data?.payment_intent_info?.redirect_url as string);
        } else {
          openModal('PAYMENT_MODAL', {
            paymentGateway: data?.payment_gateway,
            paymentIntentInfo: data?.payment_intent_info,
            trackingNumber: data?.tracking_number,
          });
        }
      },
    }
  );

  return {
    data,
    getPaymentIntentQueryOriginal: refetch,
    isLoading,
    error,
  };
}

export function useGetPaymentIntent({
  tracking_number,
  payment_gateway,
  recall_gateway,
  form_change_gateway,
}: {
  tracking_number: string;
  payment_gateway: string;
  recall_gateway?: boolean;
  form_change_gateway?: boolean;
}) {
  const router = useRouter();
  const { openModal, closeModal } = useModalAction();

  const { data, isLoading, error, refetch, isFetching } = useQuery(
    [
      API_ENDPOINTS.PAYMENT_INTENT,
      { tracking_number, payment_gateway, recall_gateway },
    ],
    () =>
      client.orders.getPaymentIntent({
        tracking_number,
        payment_gateway,
        recall_gateway,
      }),
    // Make it dynamic for both gql and rest
    {
      enabled: false,
      onSuccess: (item) => {
        let data: any = '';
        if (isArray(item)) {
          data = { ...item };
          data = isEmpty(data) ? [] : data[0];
        } else if (isObject(item)) {
          data = item;
        }
        if (data?.payment_intent_info?.is_redirect) {
          return router.push(data?.payment_intent_info?.redirect_url as string);
        } else {
          if (recall_gateway) window.location.reload();
          openModal('PAYMENT_MODAL', {
            paymentGateway: data?.payment_gateway,
            paymentIntentInfo: data?.payment_intent_info,
            trackingNumber: data?.tracking_number,
          });
        }
      },
    }
  );

  return {
    data,
    getPaymentIntentQuery: refetch,
    isLoading,
    fetchAgain: isFetching,
    error,
  };
}
