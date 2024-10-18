import Uploader from '@/components/ui/forms/uploader';
import { Controller } from 'react-hook-form';

interface FileInputProps {
  control: any;
  name: string;
  multiple?: boolean;
  type?: 'image' | 'file';
  error?: string;
  fileCategory?: FileCategory
}

export enum FileCategory {
  attachments = 'attachments',
  resumes = 'resumes',

}

const FileInput = ({ control, name, multiple, type, error,fileCategory }: FileInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { ref, ...rest } }) => (
        <>
          <Uploader {...rest} multiple={multiple} type={type} fileCategory={fileCategory} />
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </>
        
      )}
    />
  );
};

export default FileInput;
