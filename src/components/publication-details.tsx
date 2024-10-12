import React from "react";
import { useModalState } from "./ui/modal/modal.context";

interface PublicationDetailsProps {
  publication: {
    title: string;
    date: string;
    description: string;
    image: string;
  } | null;
}

const PublicationDetails: React.FC = () => {
  const {
    data: publication,
  } = useModalState();
  if (!publication) return null;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-light p-8 md:h-auto md:min-h-0 md:max-w-2xl md:p-16 lg:w-screen lg:max-w-[56.25rem]">
      <div className="mb-8">
        <img
          src={publication?.image?.original}
          alt={publication.title}
          className="w-full h-48 object-cover rounded-md"
        />
        <h2 className="text-xl font-semibold mt-4">{publication.title}</h2>
        <p className="text-sm text-body-dark my-2">
          {new Date(publication.date).toLocaleDateString()}
        </p>
        {publication.description ? (
            <p
            className="text-sm text-body react-editor-description"
            dangerouslySetInnerHTML={{
                __html: publication.description,
            }}
            />
        ) : (
            ''
        )}
      </div>
    </div>
  );
};

export default PublicationDetails;