import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/forms/password-input';
import type { ChangePasswordUserInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import { useChangePassword } from '@/framework/user';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';
import Alert from '../ui/alert';

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('error-old-password-required'),
  newPassword: yup.string().required('error-new-password-required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'error-match-passwords')
    .required('error-confirm-password'),
});

export default function ChangePasswordForm() {
  const { t } = useTranslation('common');
  const {
    mutate: changePassword,
    isLoading: loading,
    formError,
    setFormError,
    success,
    setSuccess
  } = useChangePassword();
  const resetFormRef = useRef<() => void | undefined>();
  function onSubmit({ newPassword, oldPassword }: ChangePasswordUserInput) {
    console.log('onSubmit')
    changePassword({
      oldPassword,
      newPassword,
    });
  }
  // useEffect(() => {
  //   if (success) {
  //     setSuccess(false);
  //   }
  // },[success])
  useEffect(() => {
    if (success) {
      resetFormRef.current?.(); // Reset form fields
      setSuccess(false); // Reset the success flag
    }
  }, [success, setSuccess]);
  return (
    <>
    <Alert
        variant="error"
        message={formError && t(formError)}
        className="mb-6"
        closeable={true}
        onClose={() => setFormError(null)}
      />
    <Form<ChangePasswordUserInput & { passwordConfirmation: string }>
      onSubmit={onSubmit}
      validationSchema={changePasswordSchema}
      className="flex flex-col"
      serverError={formError}
    >
      {({ register, formState: { errors }, reset }) => {
        // useEffect(() => {
        //   if (success) {
        //     reset(); // Reset form fields
        //     setSuccess(false); // Reset the success flag
        //   }
        // }, [success, reset, setSuccess]);
        resetFormRef.current = reset;
        return (
        <>
          <PasswordInput
            label={t('text-old-password')}
            {...register('oldPassword')}
            error={t(errors.oldPassword?.message!)}
            className="mb-5"
            variant="outline"
          />
          <PasswordInput
            label={t('text-new-password')}
            {...register('newPassword')}
            error={t(errors.newPassword?.message!)}
            className="mb-5"
            variant="outline"
          />
          <PasswordInput
            label={t('text-confirm-password')}
            {...register('passwordConfirmation')}
            error={t(errors.passwordConfirmation?.message!)}
            className="mb-5"
            variant="outline"
          />
          <Button
            loading={loading}
            disabled={loading}
            className="ltr:ml-auto rtl:mr-auto"
          >
            {t('text-submit')}
          </Button>
        </>);
      }}
    </Form>
    </>
  );
}
