import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'http://novaenergy.ai',
      lastModified: new Date(),
    },
  ];
}
