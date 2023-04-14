import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class UploadService {
  generateUniqueFileName(originalFileName: string) {
    const arr = originalFileName.split('.');
    const extension = arr[arr.length - 1];
    return `${new Date().getTime()}.${extension}`;
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const bucket = getStorage().bucket();

      const fileName = this.generateUniqueFileName(file.originalname);

      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      });

      const url = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-09-2491',
      });

      return { url: url[0] };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error uploading file');
    }
  }
}
