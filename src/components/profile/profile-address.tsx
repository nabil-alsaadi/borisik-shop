import AddressCard from '@/components/address/address-card';
import { AddressHeader } from '@/components/address/address-header';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { AddressType } from '@/framework/utils/constants';
import { User } from '@/types';
import { useTranslation } from 'next-i18next';

interface AddressesProps {
  addresses: User['address'] | undefined;
  label: string;
  className?: string;
  userId: string;
}

export const ProfileAddressGrid: React.FC<AddressesProps> = ({
  addresses,
  label,
  className,
  userId,
}) => {
  const { openModal } = useModalAction();
  const { t } = useTranslation('common');

  //TODO: no address found
  function onAdd() {
    openModal('ADD_OR_UPDATE_ADDRESS', {
      customerId: userId,
      type: AddressType.Billing,
    });
  }
  function onEdit(address: any) {
    openModal('ADD_OR_UPDATE_ADDRESS', { customerId: userId, address });
  }
  function onDelete(address: any) {
    openModal('DELETE_ADDRESS', { customerId: userId, addressId: address?.id });
  }
  return (
    <div className={className}>
      <AddressHeader onAdd={onAdd} count={false} label={label} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {addresses?.map((address) => (
          <AddressCard
            checked={false}
            address={address}
            userId={userId}
            key={address.id}
            onDelete={() => onDelete(address)}
            onEdit={() => onEdit(address)}
          />
        ))}
        {!Boolean(addresses?.length) && (
          <span className="relative px-5 py-6 text-base text-left bg-gray-100 border rounded border-border-200">
            {t('text-no-address')}
          </span>
        )}
      </div>
    </div>
  );
};
export default ProfileAddressGrid;
