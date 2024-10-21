import { useState } from 'react';
import GoogleMap from './google-maps';
import Seo from '@/components/seo/seo';
import PageBanner from '@/components/banners/page-banner';
import { useTranslation } from 'react-i18next';
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import StoreInfo from './store-info';
import { useMapReviews } from '@/framework/map-reviews';
import { MapReview } from '@/types';

export default function MapWithReviews() {
    const locations = [
        { lat: 25.144009, lng: 55.2198175, name: 'Moscow Store', placeId: 'ChIJMWoQuStqXz4RojAV94tpCCE' },
        { lat: 25.0469018, lng: 55.2263796, name: 'Saint Petersburg Store', placeId: 'ChIJG44CKrJvXz4RnPHZTlJzIuY' },
    ];
    const [selectedLocation, setSelectedLocation] = useState(locations[0]);
    const { reviewData, isLoading } = useMapReviews({ placeId: selectedLocation.placeId });

    const { t } = useTranslation('common');
    const handleMarkerClick = async (location: any) => {
        setSelectedLocation(location);
    };
    const handleFeedbackClick = () => {
        window.open('https://maps.google.com', '_blank'); // Open Google Maps feedback
    };

    return (
        <>
            <Seo title="Reviews" url="reviews" />
            <div className="flex flex-col min-h-screen bg-light">
                <section className="mx-auto w-full max-w-1920 bg-light pb-8 lg:pb-10 xl:pb-14">
                    <PageBanner
                        title={t('text-reviews')}
                        breadcrumbTitle={t('text-home')}
                    />
                    <div className="mx-auto w-full px-4 py-8 lg:px-10 lg:py-10">
                        <div className="flex flex-col lg:flex-row lg:h-[80vh]">
                            {/* Map section */}
                            <div className="lg:w-2/3 w-full pr-0 lg:pr-4 mb-6 lg:mb-0">
                                <div className="relative w-full h-[40vh] lg:h-[80vh]">
                                    <GoogleMap locations={locations} onMarkerClick={handleMarkerClick} />
                                </div>
                            </div>

                            {/* Reviews side panel */}
                            <div className="lg:w-1/3 w-full p-4 bg-white rounded-lg flex flex-col lg:h-full">
                                {/* <h2 className="text-xl font-semibold mb-4">{selectedLocation?.name || 'Select a Location'}</h2> */}

                                {isLoading ? (
                                    <p>Loading reviews...</p>
                                ) : (

                                    <>
                                        <StoreInfo
                                            storeName={reviewData?.name}
                                            rating={reviewData?.rating}
                                            reviewsCount={reviewData?.user_ratings_total}
                                            ratingsCount={reviewData?.user_ratings_total}
                                            onFeedbackClick={handleFeedbackClick}
                                        />
                                        <div className='overscroll-x-none overflow-hidden relative flex-grow'>
                                            {reviewData && reviewData.reviews && reviewData.reviews.map((value: MapReview, index: number) => (
                                                <div key={index} className="mb-6 p-4 border-b last:border-b-0">
                                                    <p className="font-semibold text-gray-700">{value.author_name}</p>
                                                    <p className="text-sm text-gray-500">{new Date(value.time * 1000).toLocaleDateString()}</p>
                                                    <div className="flex items-center mb-2">
                                                        <span className="text-yellow-400">{'⭐'.repeat(value.rating)}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">
                                                        {value.text.length > 100 ? (
                                                            <>
                                                                {value.text.substring(0, 100)}...
                                                                <button
                                                                    className="text-blue-500 ml-1"
                                                                    onClick={() => window.open(`https://maps.google.com?q=place_id:${selectedLocation?.placeId}`, '_blank')}
                                                                >
                                                                    {t('text-read-more')}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            value.text
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-white"></div>
                                        </div>
                                        {reviewData && reviewData?.reviews?.length > 3 && (
                                            <div className="text-center mt-4">
                                                <button
                                                    className="text-blue-500"
                                                    onClick={() => window.open(`https://maps.google.com?q=place_id:${selectedLocation.placeId}`, '_blank')}
                                                >
                                                    {t('show-more-google-maps')}
                                                </button>
                                            </div>
                                        )}
                                    </>

                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

MapWithReviews.authenticationRequired = false;
MapWithReviews.getLayout = getLayoutWithFooter;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale!, ['common'])),
        },
    };
};