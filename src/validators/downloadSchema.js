import { z } from 'zod';

export const downloadSchema = z.object({
  url: z
    .string({
      required_error: 'URL is required',
      invalid_type_error: 'URL must be a string'
    })
    .url('Invalid URL format')
    .refine(
      (url) => {
        const supportedDomains = [
          'tiktok.com',
          'vm.tiktok.com',
          'vt.tiktok.com',
          'instagram.com',
          'twitter.com',
          'x.com'
        ];
        return supportedDomains.some(domain => url.includes(domain));
      },
      {
        message: 'URL must be from TikTok, Instagram, or Twitter/X'
      }
    )
});
