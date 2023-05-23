import { v2 } from 'cloudinary';
import { CLOUDINARY } from '@v1/cloudinary/cloundinary.constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'Your cloud name',
      api_key: 'Your api key',
      api_secret: 'Your api secret',
    });
  },
};
