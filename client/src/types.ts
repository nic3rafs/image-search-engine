interface ImagesResponse {
  images: WeaviateImage[];
  totalPages?: number;
}
interface ImageDataResponse{
  class: string;
  creationTimeUnix: number;
  id: string;
  lastUpdateTimeUnix: number;
  properties: {
    image: string;
    text: string;
  };
  vectorWeights: number[] | null;
}

interface WeaviateImage {
  image?: string;
  text: string;
  _additional: {
    id: string;
  };
}



export type { ImagesResponse, WeaviateImage };
