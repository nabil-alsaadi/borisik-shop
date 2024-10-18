export const getPreviewImage = (value: any) => {
  let images: any[] = [];
  if (value) {
    images = Array.isArray(value)
      ? value.map(({ thumbnail, name,type }) => ({ preview: thumbnail,name,type }))
      : [{ preview: value.thumbnail,value: value.name,type: value.type}];
  }
  return images;
};
