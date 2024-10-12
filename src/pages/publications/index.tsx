import PageBanner from "@/components/banners/page-banner";
import { getLayoutWithFooter } from "@/components/layouts/layout-with-footer";
import Seo from "@/components/seo/seo";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from 'next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { usePublications } from "@/framework/publications";
import { PUBLICATION_PER_PAGE } from "@/framework/client/variables";
import Button from "@/components/ui/button";
import rangeMap from "@/lib/range-map";
import AuthorLoader from "@/components/ui/loaders/author-loader";

// Dummy data for publications


export default function PublicationsPage() {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  const { publications, loadMore, isLoadingMore, isLoading, hasMore, error } =
    usePublications({
      limit :PUBLICATION_PER_PAGE,
    });
  return (
    <>
      <Seo title="Publications" url="publications" />
      <div className="flex flex-col min-h-screen bg-light">
        {/* Main content */}
        <section className="mx-auto w-full max-w-1920 bg-light pb-8 lg:pb-10 xl:pb-14">
          <PageBanner
            title={t('text-publications')}
            breadcrumbTitle={t('text-home')}
          />
          <div className="mx-auto w-full max-w-screen-lg px-4 py-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading && !publications.length
              ? rangeMap(PUBLICATION_PER_PAGE, (i) => (
                <AuthorLoader key={i} uniqueKey={`author-${i}`} />
              ))
              : publications.map((publication) => (
                <div key={publication.id} 
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                  onClick={() => openModal('PUPLICATION_MODAL',publication)}
                >
                  <img
                    src={publication?.image?.original}
                    alt={publication.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-heading mb-2">
                      {publication.title}
                    </h2>
                    <p className="text-sm text-body-dark mb-3">
                      {new Date(publication.created_at).toLocaleDateString()}
                    </p>
                    {/* <p className="text-body text-sm">
                      {publication.description}
                    </p> */}
                    {publication.description ? (
                      <p
                        className="text-sm text-body react-editor-description line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: publication.description,
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="mt-12 flex items-center justify-center lg:mt-16">
                <Button onClick={loadMore} size="big" loading={isLoadingMore}>
                  {t('text-explore-more')}
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

PublicationsPage.authenticationRequired = false;
PublicationsPage.getLayout = getLayoutWithFooter;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  };
};

const publications = [
  {
    id: 1,
    title: "The Art of Preparing Fresh Seafood",
    date: "2024-09-15T00:00:00Z",
    description: `
      <p>A comprehensive guide to preparing fresh seafood at home. Learn the secrets of choosing the freshest ingredients and the techniques to bring out the best flavors.</p>
      <h3>How to Choose Fresh Seafood</h3>
      <p>Always look for bright eyes, firm flesh, and a clean ocean scent. Check out our guide for more tips.</p>
      <img src="https://borisik.ru/upload/iblock/642/6423514ec0fb25a96be4880f11bcc73d.jpg" alt="Seafood selection" class="mt-4" />
      <p>Watch the video below to learn more:</p>
      <video controls class="w-full mt-4">
        <source src="https://www.example.com/videos/seafood-guide.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    `,
    image: "https://borisik.ru/upload/iblock/642/6423514ec0fb25a96be4880f11bcc73d.jpg",
  },
  {
    id: 2,
    title: "Next Level Seafood Recipes for Home Cooks",
    date: "2024-08-25T00:00:00Z",
    description: `
      <p>Take your home-cooked seafood dishes to the next level with these professional recipes. Impress your family and friends with your culinary skills.</p>
      <h3>Seafood Paella</h3>
      <p>This classic Spanish dish is packed with shrimp, mussels, and clams. A must-try for seafood lovers.</p>
      <img src="https://borisik.ru/upload/iblock/348/348e2e6d20276836f04c2c8db4183a9a.jpg" alt="Seafood Paella" class="mt-4" />
      <h3>Grilled Salmon with Lemon Butter</h3>
      <p>Simple yet elegant, this grilled salmon is topped with a zesty lemon butter sauce. Perfect for any occasion.</p>
      <video controls class="w-full mt-4">
        <source src="https://www.example.com/videos/salmon-recipe.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    `,
    image: "https://borisik.ru/upload/iblock/348/348e2e6d20276836f04c2c8db4183a9a.jpg",
  },
  {
    id: 3,
    title: "Sustainable Seafood: A Guide to Eco-Friendly Choices",
    date: "2024-08-25T00:00:00Z",
    description: `
      <p>Learn how to make environmentally conscious seafood choices. We cover sustainable fishing practices and the best types of seafood to support healthy oceans.</p>
      <h3>What is Sustainable Seafood?</h3>
      <p>Sustainable seafood is sourced in ways that protect the environment and ensure that fish populations remain healthy.</p>
      <img src="https://borisik.ru/upload/iblock/ac5/ac5de7e6fe8e8fd507d36a58b3476f04.jpg" alt="Sustainable Fishing" class="mt-4" />
      <p>Check out this video to learn more about sustainability in seafood:</p>
      <video controls class="w-full mt-4">
        <source src="https://www.example.com/videos/sustainable-seafood.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    `,
    image: "https://borisik.ru/upload/iblock/ac5/ac5de7e6fe8e8fd507d36a58b3476f04.jpg",
  },
];
