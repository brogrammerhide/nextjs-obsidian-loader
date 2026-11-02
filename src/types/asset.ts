export interface AssetRecord {
  storage: {
    provider: string;
    cloudName: string;
    assetFolder: string;
    publicId: string;
    secureUrl: string;
    format: string;
  };
  createdAt: string;
  file: {
    size: number;
    extension: string;
  };
  filename: string;
  status: "PUBLISHED";
  updatedAt: string;
}

export interface AssetsApiResponse {
  data: AssetRecord[];
  total: number;
}
