import { useState } from 'react';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useOrderPayment } from '@/framework/order';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { Image } from '@/components/ui/image';
import { Table } from '@/components/ui/table';
import { useIsRTL } from '@/lib/locals';
import amex from '@/assets/cards/amex.svg';
import diners from '@/assets/cards/diners.svg';
import discover from '@/assets/cards/discover.svg';
import jcb from '@/assets/cards/jcb.svg';
import mastercard from '@/assets/cards/mastercard.svg';
import unionpay from '@/assets/cards/unionpay.svg';
import visa from '@/assets/cards/visa.svg';
import CheckIconWithBg from '@/components/icons/check-icon-with-bg';
import Fallback from '@/assets/cards/fallback-image.png';
import { useTranslation } from 'next-i18next';

interface CardViewProps {
  view?: 'modal' | 'normal';
  payments: any;
}

let images = {
  amex,
  visa,
  diners,
  jcb,
  mastercard,
  unionpay,
  discover,
} as any;

const StripeSavedCardsList = ({
  view = 'normal',
  payments = [],
}: CardViewProps) => {
  const defaultCard = payments?.filter((payment: any) => payment?.default_card);
  const [selected, setSelected] = useState<any>(
    Object.assign({}, defaultCard.length ? defaultCard[0] : []),
  );
  const { t } = useTranslation('common');
  const stripe = useStripe();
  const elements = useElements();
  const { createOrderPayment } = useOrderPayment();
  const { data } = useModalState();
  const { paymentIntentInfo, trackingNumber } = data;
  const { closeModal } = useModalAction();
  const [loading, setLoading] = useState<any>(false);

  const onClickRow = (record: any) => {
    setSelected(record);
  };

  const continuePayment = async (method_key: string) => {
    if (!stripe || !elements) {
      return;
    }
    if (method_key) {
      setLoading(method_key);
      const confirmCardPayment = await stripe.confirmCardPayment(
        paymentIntentInfo?.client_secret!,
        {
          payment_method: method_key,
        },
      );

      // await createOrderPayment({
      //   tracking_number: trackingNumber as string,
      //   payment_gateway: 'stripe' as string,
      // });

      if (confirmCardPayment?.paymentIntent?.status === 'succeeded') {
        //@ts-ignore
        toast.success(t('payment-successful'));
        setLoading(false);
        closeModal();
      } else {
        toast.error(confirmCardPayment?.error?.message);
        setLoading(false);
        closeModal();
      }
    }
  };

  const { alignLeft, alignRight } = useIsRTL();
  const columns = [
    {
      title: '',
      dataIndex: '',
      width: 50,
      align: alignLeft,
      render: (record: any) => {
        return selected?.id === record?.id ? (
          <div className="w-10 text-accent">
            <CheckIconWithBg />
          </div>
        ) : (
          ''
        );
      },
    },
    {
      title: (
        <span className="text-sm text-[#686D73]">{t('text-company')}</span>
      ),
      dataIndex: 'network',
      key: 'network',
      width: 100,
      align: alignLeft,
      render: (network: string) => {
        return (
          <div className="w-10">
            {network ? (
              <Image
                src={images[network]}
                width={40}
                height={28}
                alt={t('text-company')}
              />
            ) : (
              <Image
                src={Fallback}
                width={40}
                height={28}
                alt={t('text-company')}
              />
            )}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-sm text-[#686D73]">{t('text-card-number')}</span>
      ),
      dataIndex: 'last4',
      key: 'last4',
      align: alignLeft,
      width: 150,
      render: (last4: number) => {
        return (
          <p className="text-base text-black truncate">{`**** **** **** ${last4}`}</p>
        );
      },
    },
    {
      title: (
        <span className="text-sm text-[#686D73]">
          {t('text-card-owner-name')}
        </span>
      ),
      dataIndex: 'owner_name',
      key: 'owner_name',
      align: alignLeft,
      width: 180,
      render: (owner_name: string) => {
        return <p className="text-base text-black truncate">{owner_name}</p>;
      },
    },
    {
      title: (
        <span className="text-sm text-[#686D73]">{t('text-card-expire')}</span>
      ),
      dataIndex: 'expires',
      key: 'expires',
      align: alignLeft,
      width: 130,
      render: (expires: string) => {
        return <p className="text-base text-black">{expires}</p>;
      },
    },
  ];
  return (
    <>
      <div className="block lg:hidden space-y-4">
        {payments.map((payment: any) => (
          <div
            key={payment.id}
            onClick={() => onClickRow(payment)}
            className={`w-full mx-2 md:mx-4 border rounded-lg p-4 shadow-md flex justify-between items-center ${selected?.id === payment.id ? 'bg-green-50' : 'bg-white'
              }`}
          >
            <div className="flex items-center">
              <Image
                src={images[payment.network] || Fallback}
                width={40}
                height={28}
                alt={t('text-company')}
                className="mr-3"
              />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {t('text-company')}: {payment.network || 'Unknown'}
                </div>
                <div className="text-sm text-gray-600">
                  {t('text-card-number')}: **** **** **** {payment.last4}
                </div>
                <div className="text-sm text-gray-600">
                  {t('text-card-owner-name')}: {payment.owner_name}
                </div>
                <div className="text-sm text-gray-600">
                  {t('text-card-expire')}: {payment.expires}
                </div>
              </div>
            </div>
            <div className={`w-10 text-accent transition-opacity ${selected?.id === payment.id ? 'opacity-100' : 'opacity-0'}`}>
              <CheckIconWithBg />
            </div>
          </div>
        ))}
      </div>



      {/* Desktop View - Table Layout */}
      <div className="hidden lg:block">
        <Table
          //@ts-ignore
          columns={columns}
          data={payments}
          className="w-full shadow-none card-view-table"
          scroll={{ x: 350, y: 500 }}
          rowClassName={(record, i) =>
            selected?.id === record?.id ? `row-highlight` : ''
          }
          emptyText={t('text-no-card-found')}
          onRow={(record) => ({
            onClick: onClickRow.bind(null, record),
          })}
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button
          loading={loading}
          disabled={!!loading}
          className="!h-9 px-4"
          onClick={() => continuePayment(selected?.method_key)}
        >
          {t('text-pay')}
        </Button>
      </div>
    </>
  );
};

export default StripeSavedCardsList;


