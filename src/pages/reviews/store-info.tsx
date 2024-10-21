import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function StoreInfo({ storeName, rating, reviewsCount, ratingsCount, onFeedbackClick }: any) {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
      {/* Store Info Section */}
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
        <div>
          <h2 className="text-2xl font-bold">{storeName}</h2>
          <div className="flex items-center mt-2">
            <span className="text-4xl font-semibold">{rating}</span>
            <div className="flex items-center ml-2">
              <span className="text-yellow-400">{'⭐'.repeat(Math.floor(rating))}</span>
              <span className="ml-1 text-gray-500 text-sm">
                ({reviewsCount} {t('reviews')}, {ratingsCount} {t('ratings')})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
          {t('give-rating')}
        </button> */}
        <button
          onClick={onFeedbackClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t('provide-feedback')}
        </button>
      </div>
    </div>
  );
}
