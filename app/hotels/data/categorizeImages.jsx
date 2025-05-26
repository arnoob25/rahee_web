export function useGetCategorizedImages(images) {
  let coverImages = [];
  let featuredImages = [];
  let otherImages = [];

  images?.forEach((image) => {
    if (image.isCover) coverImages.push(image);
    else if (image.isFeatured) featuredImages.push(image);
    else otherImages.push(image);
  });

  return { coverImages, featuredImages, hotelImages: otherImages };
}
