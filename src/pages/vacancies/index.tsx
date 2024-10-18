import { useTranslation } from 'next-i18next';
import Seo from '@/components/seo/seo';
import { useSettings } from '@/framework/settings';
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import Image from 'next/image'; // For optimized images in Next.js
import PageBanner from '@/components/banners/page-banner';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useVacancies } from '@/framework/vacancies';
import rangeMap from '@/lib/range-map';
import AuthorLoader from '@/components/ui/loaders/author-loader';
import Button from '@/components/ui/button';

export { getStaticProps } from '@/framework/general.ssr';

export const VacanciesPage = () => {
  const { t } = useTranslation('common');
//   const { settings }: any = useSettings();
  const { openModal } = useModalAction();
  // Dummy data for vacancies
  const { vacancies, isLoading, error } =
  useVacancies({
    limit :20,
  });
//   const vacancies = [
//     {
//       id: 1,
//       title: 'Seafood Sales Manager',
//       description:
//         'We are looking for an experienced sales manager to lead our seafood sales team. The role involves managing sales operations and driving revenue growth.',
//       requirements: [
//         '3+ years of sales experience in the seafood industry.',
//         'Excellent communication skills.',
//         'Ability to manage and mentor a team.',
//       ],
//       location: 'Moscow, Russia',
//     },
//     {
//       id: 2,
//       title: 'Quality Control Specialist',
//       description:
//         'Ensure our products meet the highest quality standards. The role involves checking the quality of seafood products before they are shipped.',
//       requirements: [
//         'Previous experience in quality control.',
//         'Attention to detail.',
//         'Ability to work in a fast-paced environment.',
//       ],
//       location: 'Vladivostok, Russia',
//     }
//   ];

  return (
    <>
      <Seo title={t('vacancies')} url={'vacancies'} />
      <div className="w-full bg-gray-50">
        <PageBanner
            title={t('text-vacancies')}
            breadcrumbTitle={t('text-home')}
        />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-800 mb-8">{t('text-open-positions')}</h2>
              <p className="text-lg leading-7 text-gray-600 max-w-2xl mx-auto">
                {t('text-apply-for-vacancies')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            {isLoading && !vacancies?.length
              ? rangeMap(20, (i) => (
                <AuthorLoader key={i} uniqueKey={`author-${i}`} />
              ))
              : vacancies?.map((vacancy) => (
                <div key={vacancy.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  {/* <Image
                    src={vacancy.image}
                    alt={vacancy.title}
                    className="w-full h-48 object-cover"
                    width={500}
                    height={300}
                    layout="responsive"
                  /> */}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{vacancy.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{vacancy.location}</p>
                    <p className="text-base text-gray-600 mb-4">{vacancy.description}</p>

                    <h4 className="font-semibold text-gray-700">{t('requirements')}:</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                      {vacancy.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>

                    <Button
                    onClick={() => openModal('VACANCY_MODAL',{vacancy})}
                    >
                      {t('apply-now')}
                    </Button>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

VacanciesPage.getLayout = getLayoutWithFooter;
export default VacanciesPage;
