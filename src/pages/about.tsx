import { useTranslation } from 'next-i18next';
import Seo from '@/components/seo/seo';
import { useSettings } from '@/framework/settings';
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import Image from 'next/image'; // If you're using next/image for image optimization
import PageBanner from '@/components/banners/page-banner';
export { getStaticProps } from '@/framework/general.ssr';

export const AboutCompanyPage = () => {
  const { t } = useTranslation('common');
  const { settings }: any = useSettings();

  return (
    <>
      <Seo title={t('about-company')} url={'about-company'} />
      <div className="w-full bg-gray-50">
        <PageBanner
            title={t('text-about-us')}
            breadcrumbTitle={t('text-home')}
        />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-800 mb-8">
                {t('our-story')}
              </h2>
              <p className="text-lg leading-7 text-gray-600 max-w-2xl mx-auto">
                All products are mined in the Far East, off the coast of Kamchatka and Sakhalin. These ecologically clean places are a traditional fishing hub of Russia.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  We offer only wild Far Eastern fish: kizhuch, snerk, smelt, pink salmon, and flounder.
                </p>
                <p>
                  There are also exotic delicacies: crab meat, sea urchin caviar, scallops, sea kale.
                </p>
                <p>
                  Large selection of snacks: dried squid, flounder, kizhucha straws, and squid.
                </p>
                <p>
                  We protect our reputation and monitor the quality of the product! Even the most sophisticated gourmet will not find any additional preservatives, dyes, and flavor enhancers in our products.
                </p>
                <p>
                  Visit our Red Caviar stores and choose the best Russian seafood delicacies!
                </p>
                <p>
                  <strong>Our stores</strong> are open daily from 09:00 to 22:00.
                </p>
              </div>
              <div>
                {/* Use next/image for optimized images */}
                <Image
                  src="https://storage.googleapis.com/borisik-products.appspot.com/attachments/1730235951723_about_shop.jpg" // Replace with your actual image path
                  alt=""
                  className="rounded-lg shadow-lg"
                  width={600}
                  height={400}
                  layout="responsive"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </section>

       
      </div>
    </>
  );
};

AboutCompanyPage.getLayout = getLayoutWithFooter;
export default AboutCompanyPage;
