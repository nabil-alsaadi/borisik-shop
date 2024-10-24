import { useModalAction } from '@/components/ui/modal/modal.context';
import OtpForm from '@/components/otp/otp-form';
import { customerContactAtom } from '@/store/checkout';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useSettings } from '@/framework/settings';
import PhoneNumberForm from '@/components/otp/phone-number-form';
import { useUpdateUser, useUser } from '@/framework/user';

export default function AddOrUpdateContact() {
  const { t } = useTranslation('common');
  const { settings } = useSettings();
  const useOtp = settings?.useOtp;
  const { closeModal } = useModalAction();
  const { me } = useUser();
  const { mutate: updateProfile } = useUpdateUser();
  const [contactNumber, setContactNumber] = useAtom(customerContactAtom);

  function onSubmit({ phone_number }: { phone_number: string }) {
    if (!me?.profile?.contact){
      updateProfile({
        id: me?.id ?? '',
        profile: {
          contact: phone_number,
        },
      });
    }
    setContactNumber(phone_number);
    closeModal();
  }
  return (
    <div className="flex flex-col justify-center min-h-screen p-5 bg-light sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-5 text-sm font-semibold text-center text-heading sm:mb-6">
        {contactNumber ? t('text-update') : t('text-add-new')}{' '}
        {t('text-contact-number')}
      </h1>
      {useOtp ? (
        <OtpForm phoneNumber={contactNumber} onVerifySuccess={onSubmit} />
      ) : (
        <PhoneNumberForm onSubmit={onSubmit} phoneNumber={contactNumber} />
      )}
    </div>
  );
}
