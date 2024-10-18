// import { useRouter } from 'next/router';
// import Logo from '@/components/ui/logo';
// import Input from '@/components/ui/forms/input';
// import Button from '@/components/ui/button';
// import { useTranslation } from 'next-i18next';
// import { useModalAction, useModalState } from '@/components/ui/modal/modal.context';
// import { Form } from '@/components/ui/forms/form';
// import type { VacancyInput } from '@/types';
// import * as yup from 'yup';
// // import { useApply } from '@/framework/vacancies';
// import FileInput, { FileCategory } from '@/components/ui/forms/file-input'; // Assuming you have a FileInput component
// import { useRegister } from '@/framework/user';
// import TextArea from '../ui/forms/text-area';
// import { useApplyVacancy } from '@/framework/vacancies';

// // Validation schema for the apply form
// const applyFormSchema = yup.object().shape({
//   name: yup.string().required('error-name-required'),
//   email: yup.string().email('error-email-format').required('error-email-required'),
//   phone: yup.string().required('error-phone-required').matches(/^9715[0-9]{8}$/, 'error-invalid-phone-number'),
//   resume: yup.array()
//     .of(
//       yup.object().shape({
//         id: yup.string().required(),  // Assuming the file has an 'id' or some identifier
//         original: yup.string().required(),  // Assuming the file has a URL or filename
//       })
//     )
//     .min(1, 'error-resume-required'),
//   coverLetter: yup.string().optional(),
// });

// function ApplyForm() {
//   const { t } = useTranslation('common');
//   const { applyVacancy, isLoading } = useApplyVacancy();

//   const {
//     data: { vacancy },
//   } = useModalState();
//   console.log('vacancy============',vacancy)
//   function onSubmit({ name, email, phone, resume, coverLetter }: VacancyInput) {
//     const firstResume = Array.isArray(resume) ? resume[0] : resume;
//     if (!firstResume) {
//         console.error('No resume uploaded');
//         return;
//     }
    
//     applyVacancy({
//       name,
//       email,
//       phone,
//       resume: firstResume,
//       coverLetter,
//       vacancy
//     });
//   }

//   return (
//     <>
//       <Form<VacancyInput>
//         onSubmit={onSubmit}
//         validationSchema={applyFormSchema}
//         // serverError={formError}
//       >
//         {({ register,control, formState: { errors }, setValue }) => (
//           <>
//             <Input
//               label={t('text-name')}
//               {...register('name')}
//               variant="outline"
//               className="mb-5"
//               error={t(errors.name?.message!)}
//             />
//             <Input
//               label={t('text-email')}
//               {...register('email')}
//               type="email"
//               variant="outline"
//               className="mb-5"
//               error={t(errors.email?.message!)}
//             />
//             <Input
//               label={t('text-phone')}
//               {...register('phone')}
//               type="tel"
//               variant="outline"
//               className="mb-5"
//               error={t(errors.phone?.message!)}
//               placeholder='971*********'
//             />
//              <div className="mb-8">
//                 <FileInput control={control} name="resume" type='file'  error={t(errors.resume?.message!)} fileCategory={FileCategory.resumes} />
//              </div>
            
//             {/* <FileInput
//               label={t('text-resume')}
//               setValue={setValue}
//               name="resume"
//               accept=".pdf,.doc,.docx"
//               className="mb-5"
//               error={t(errors.resume?.message!)}
//             /> */}
//             <TextArea
//               label={t('text-cover-letter')}
//               {...register('coverLetter')}
//               variant="outline"
//               className="mb-5"
//               error={t(errors.coverLetter?.message!)}
//               placeholder={t('text-optional')}
//             />
//             <div className="mt-8">
//               <Button
//                 className="h-12 w-full"
//                 loading={isLoading}
//                 disabled={isLoading}
//               >
//                 {t('text-apply')}
//               </Button>
//             </div>
//           </>
//         )}
//       </Form>
//     </>
//   );
// }

// export default function ApplyView() {
//   const { t } = useTranslation('common');
//   const router = useRouter();
//   const { closeModal } = useModalAction();
//   function handleNavigate(path: string) {
//     router.push(`/${path}`);
//     closeModal();
//   }

//   return (
//     <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
//       <div className="flex justify-center">
//         <Logo />
//       </div>
//       <p className="mt-4 mb-7 px-2 text-center text-sm leading-relaxed text-body sm:mt-5 sm:mb-10 sm:px-0 md:text-base">
//         {t('apply-helper-text')}
//       </p>
//       <ApplyForm />
//     </div>
//   );
// }

import { useRouter } from 'next/router';
import Logo from '@/components/ui/logo';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import { useModalAction, useModalState } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import type { VacancyInput } from '@/types';
import * as yup from 'yup';
import FileInput, { FileCategory } from '@/components/ui/forms/file-input';
import TextArea from '../ui/forms/text-area';
import { useApplyVacancy } from '@/framework/vacancies';
import SelectInput from '../ui/forms/select-input';

// Extend your validation schema to include new fields
const applyFormSchema = yup.object().shape({
  name: yup.string().required('error-name-required'),
  email: yup.string().email('error-email-format').required('error-email-required'),
  phone: yup.string().required('error-phone-required').matches(/^9715[0-9]{8}$/, 'error-invalid-phone-number'),
  resume: yup.array().min(1, 'error-resume-required'),
  coverLetter: yup.string().optional(),
  maritalStatus: yup.object().required('error-marital-status-required'),
  education: yup.object().required('error-education-required'),
  citizenship: yup.string().required('error-citizenship-required'),
  employmentRecordBook: yup.object().required('error-employment-record-book-required'),
  medicalBook: yup.object().required('error-medical-book-required'),
  smoking: yup.object().required('error-smoking-required'),
  alcoholConsumption: yup.object().required('error-alcohol-consumption-required'),
  emergencyPhone: yup.string().required('error-emergency-phone-required'),
});

function ApplyForm() {
  const { t } = useTranslation('common');
  const { applyVacancy, isLoading } = useApplyVacancy();
  const { data: { vacancy } } = useModalState();

  function onSubmit({
    name,
    email,
    phone,
    resume,
    coverLetter,
    maritalStatus,
    education,
    citizenship,
    employmentRecordBook,
    medicalBook,
    smoking,
    alcoholConsumption,
    emergencyPhone,
  }: VacancyInput) {
    applyVacancy({
      name,
      email,
      phone,
      resume,
      coverLetter,
      maritalStatus: maritalStatus?.value,
      education: education?.value,
      citizenship,
      employmentRecordBook: employmentRecordBook?.value,
      medicalBook: medicalBook?.value,
      smoking: smoking?.value,
      alcoholConsumption: alcoholConsumption?.value,
      emergencyPhone,
      vacancy
    });
  }

  return (
    <>
      <Form<VacancyInput>
        onSubmit={onSubmit}
        validationSchema={applyFormSchema}
      >
        {({ register, control, formState: { errors } }) => (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Input
                label={t('text-name')}
                {...register('name')}
                variant="outline"
                error={t(errors.name?.message!)}
                required={true}
              />
              <Input
                label={t('text-email')}
                {...register('email')}
                type="email"
                variant="outline"
                error={t(errors.email?.message!)}
                required={true}
              />
              <Input
                label={t('text-phone')}
                {...register('phone')}
                type="tel"
                variant="outline"
                error={t(errors.phone?.message!)}
                placeholder="971*********"
                required={true}
              />
              <Input
                label={t('text-emergency-phone')}
                {...register('emergencyPhone')}
                variant="outline"
                error={t(errors.emergencyPhone?.message!)}
                required={true}
              />
              <SelectInput
                name="maritalStatus"
                control={control}
                label={t('text-marital-status')}
                options={[
                  { value: 'single', label: t('text-single') },
                  { value: 'married', label: t('text-married') },
                  { value: 'divorced', label: t('text-divorced') },
                ]}
                error={t(errors.maritalStatus?.message!)}
                required={true}
              />
              <SelectInput
                name="education"
                control={control}
                label={t('text-education')}
                options={[
                  { value: 'high_school', label: t('text-high-school') },
                  { value: 'bachelors', label: t('text-bachelors') },
                  { value: 'masters', label: t('text-masters') },
                  { value: 'phd', label: t('text-phd') },
                ]}
                error={t(errors.education?.message!)}
                required={true}
              />
              <Input
                label={t('text-citizenship')}
                {...register('citizenship')}
                variant="outline"
                error={t(errors.citizenship?.message!)}
                required={true}
              />
              <SelectInput
                name="employmentRecordBook"
                control={control}
                label={t('text-employment-record-book')}
                options={[
                  { value: 'yes', label: t('text-yes') },
                  { value: 'no', label: t('text-no') },
                ]}
                error={t(errors.employmentRecordBook?.message!)}
                required={true}
              />
              <SelectInput
                name="medicalBook"
                control={control}
                label={t('text-medical-book')}
                options={[
                  { value: 'yes', label: t('text-yes') },
                  { value: 'no', label: t('text-no') },
                ]}
                error={t(errors.medicalBook?.message!)}
                required={true}
              />
              <SelectInput
                name="smoking"
                control={control}
                label={t('text-smoking')}
                options={[
                  { value: 'yes', label: t('text-yes') },
                  { value: 'no', label: t('text-no') },
                ]}
                error={t(errors.smoking?.message!)}
                required={true}
              />
              <SelectInput
                name="alcoholConsumption"
                control={control}
                label={t('text-alcohol-consumption')}
                options={[
                  { value: 'yes', label: t('text-yes') },
                  { value: 'no', label: t('text-no') },
                  { value: 'sometimes', label: t('text-sometimes') },
                ]}
                error={t(errors.alcoholConsumption?.message!)}
                required={true}
              />
            </div>

            <div className="mt-5 mb-5">
              <FileInput
                control={control}
                name="resume"
                type="file"
                error={t(errors.resume?.message!)}
                fileCategory={FileCategory.resumes}
              />
            </div>
            <TextArea
              label={t('text-cover-letter')}
              {...register('coverLetter')}
              variant="outline"
              className="mb-5"
              error={t(errors.coverLetter?.message!)}
              placeholder={t('text-optional')}
            />

            <div className="mt-8">
              <Button
                className="h-12 w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {t('text-apply')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </>
  );
}

export default function ApplyView() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { closeModal } = useModalAction();
  function handleNavigate(path: string) {
    router.push(`/${path}`);
    closeModal();
  }

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[800px] xl:max-w-[1000px] md:rounded-xl ">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="mt-4 mb-7 px-2 text-center text-sm leading-relaxed text-body sm:mt-5 sm:mb-10 sm:px-0 md:text-base">
        {t('apply-helper-text')}
      </p>
      <ApplyForm />
    </div>
  );
}
