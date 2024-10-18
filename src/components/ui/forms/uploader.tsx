import { useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'next-i18next';
import { UploadIcon } from '@/components/icons/upload-icon';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useUploads } from '@/framework/settings';
import { FileCategory } from './file-input';

export default function Uploader({
  onChange,
  value,
  name,
  onBlur,
  multiple = false,
  type = 'image',
  fileCategory= FileCategory.attachments
}: any) {
  const { t } = useTranslation('common');
  const {
    mutate: upload,
    isLoading,
    files,
  } = useUploads({
    onChange,
    defaultFiles: value,
    fileCategory
  });
  const acceptedFormats = type === 'image' ? { 'image/*': ['.png', '.jpeg', '.jpg'] } : { 'application/pdf': ['.pdf'] };
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      upload(acceptedFiles);
    },
    [upload]
  );
  const { getRootProps, getInputProps } = useDropzone({
    //@ts-ignore
    accept: acceptedFormats,
    multiple,
    onDrop,
  });
  //FIXME: package update need to check
  // types: [
  //   {
  //     description: 'Images',
  //     accept: {
  //       'image/*': ['.png', '.gif', '.jpeg', '.jpg']
  //     }
  //   },
  // ],
  // excludeAcceptAllOption: true,
  // multiple: false


  // const thumbs = files.map((file: any, idx) => (
  //   <div
  //     className="relative inline-flex flex-col mt-2 overflow-hidden border rounded border-border-100 ltr:mr-2 rtl:ml-2"
  //     key={idx}
  //   >
  //     <div className="flex items-center justify-center w-16 h-16 min-w-0 overflow-hidden">
  //       {/* eslint-disable */}
  //       <img src={file.preview} alt={file?.name} />
  //     </div>
  //   </div>
  // ));

  const thumbs = files.map((file: any, idx) => {
    const isImage = file.type && file.type.startsWith('image/');
    const isPDF = file.type && file.type === 'application/pdf';
    console.log('files===========',files)
    return (
      <div
        className="relative inline-flex flex-col mt-2 overflow-hidden border rounded border-border-100 ltr:mr-2 rtl:ml-2"
        key={idx}
      >
        <div className="flex items-center justify-center w-16 h-16 min-w-0 overflow-hidden">
          {isImage ? (
            <img src={file.preview} alt={file?.name} />
          ) : isPDF ? (
            <embed
              src={file.preview}
              type="application/pdf"
              className="w-16 h-16"
              // alt="PDF Preview"
            />
          ) : (
            // For non-image and non-PDF files, show a file icon or a placeholder
            <div className="flex items-center justify-center w-16 h-16 text-gray-600">
              <svg
                className="w-10 h-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v16c0 1.1.9 2 2 2h12a2 2 0 002-2V8l-6-6H6a2 2 0 00-2 2z"
                />
              </svg>
              <span className="text-xs">{file.name}</span>
            </div>
          )}
        </div>
      </div>
    );
  });
  //FIXME: maybe no need to use this
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none',
        })}
      >
        <input
          {...getInputProps({
            name,
            onBlur,
          })}
        />
        <UploadIcon className="text-muted-light" />
        <p className="mt-4 text-sm text-center text-body">
          <span className="font-semibold text-accent">
            {t( type ==='image' ? 'text-upload-highlight' : 'text-upload-highlight-file')}
          </span>{' '}
          {t('text-upload-message')} <br />
          <span className="text-xs text-body">{t(type ==='image' ? 'text-img-format' : 'text-img-format-file')}</span>
        </p>
      </div>

      <aside className="flex flex-wrap mt-2">
        {!!thumbs.length && thumbs}
        {isLoading && (
          <div className="flex items-center h-16 mt-2 ltr:ml-2 rtl:mr-2">
            <Spinner
              text={t('text-loading')}
              simple={true}
              className="w-6 h-6"
            />
          </div>
        )}
      </aside>
    </section>
  );
}
