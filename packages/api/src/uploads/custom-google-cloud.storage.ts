import {
  createReadStream,
  createWriteStream,
  ReadStream,
  unlinkSync,
} from 'fs';
import MulterGoogleCloudStorage from 'multer-google-storage';
import sharp from 'sharp';
import mime from 'mime-types';
import { Logger } from '@nestjs/common';

interface CallbackMessage {
  path: string;
  filename: string;
}

interface FileInfo {
  mimeType: string;
  fieldName: string;
  originalName: string;
}

class CustomGoogleCloudStorageEnv {
  public messageAcc: CallbackMessage;
  public originalFile = 'original';
  public thumbnailFile = 'thumbnail';
  public thumbnailType = 'image/jpeg';
  public thumbnailFileExt: string | false;
  public startOne: Date;
  public startTwo: Date;
  public endOne: Date;
  public endTwo: Date;

  constructor(
    public fileInfo: FileInfo,
    public originalFileExt: string | false,
    public multerCallback: any,
    public request: any,
  ) {
    const randomString = Array(16)
      .fill(null)
      .map(() => Math.round(Math.random() * 15).toString(16))
      .join('');
    this.originalFile += randomString;
    this.thumbnailFile += randomString;
  }

  public setMessage(message: CallbackMessage) {
    this.messageAcc = message;
  }

  public setThumbnailExt(thumbnailFileExt: string | false) {
    this.thumbnailFileExt = thumbnailFileExt;
  }

  public setStartOne() {
    this.startOne = new Date();
  }

  public setStartTwo() {
    this.startTwo = new Date();
  }

  public setEndOne() {
    this.endOne = new Date();
  }

  public setEndTwo() {
    this.endTwo = new Date();
  }
}

export class CustomGoogleCloudStorage {
  private logger = new Logger(CustomGoogleCloudStorage.name, true);
  private googleCloudStorage: MulterGoogleCloudStorage;

  constructor(opts: any) {
    this.googleCloudStorage = new MulterGoogleCloudStorage(opts);
  }

  private callback(env: CustomGoogleCloudStorageEnv) {
    return (err: any, message?: CallbackMessage) => {
      if (err) {
        env.multerCallback(err);
      } else if (message) {
        if (env.messageAcc) {
          unlinkSync(`${env.originalFile}.${env.originalFileExt}`);
          unlinkSync(`${env.thumbnailFile}.${env.thumbnailFileExt}`);
          env.setEndTwo();
          this.logger.log('------------------------------------------');
          this.logger.log(
            `Upload of original took: ${
              env.endOne.getTime() - env.startOne.getTime()
            }ms`,
          );
          this.logger.log(
            `Upload of thumbnail took: ${
              env.endTwo.getTime() - env.startTwo.getTime()
            }ms`,
          );
          this.logger.log('------------------------------------------');
          env.multerCallback(null, [env.messageAcc, message]);
        } else {
          env.setEndOne();
          env.setMessage(message);
          this.createThumbnail(env);
        }
      }
    };
  }

  private readFile(filename: string, cb: (img: ReadStream) => void) {
    const readStream = createReadStream(filename);
    readStream.on('open', () => cb(readStream));
  }

  private uploadImageToCloud(
    env: CustomGoogleCloudStorageEnv,
    mimeType?: string,
  ) {
    return (img: ReadStream) => {
      const data: Partial<Express.Multer.File> = {
        fieldname: env.fileInfo.fieldName,
        mimetype: mimeType || env.fileInfo.mimeType,
        originalname: env.fileInfo.originalName,
        stream: img,
      };

      this.googleCloudStorage._handleFile(
        env.request,
        data,
        this.callback(env),
      );
    };
  }

  private createThumbnail(env: CustomGoogleCloudStorageEnv) {
    const fileIn = `${env.originalFile}.${env.originalFileExt}`;
    env.setThumbnailExt(mime.extension(env.thumbnailType));
    const fileOut = `${env.thumbnailFile}.${env.thumbnailFileExt}`;
    const start = new Date();

    const resizeStream = sharp().resize(600, null).jpeg({ quality: 85 });
    const readStream = createReadStream(fileIn);
    const outputStream = createWriteStream(fileOut);

    readStream.on('open', () => {
      readStream.pipe(resizeStream).pipe(outputStream);
    });

    outputStream.on('finish', () => {
      const end = new Date();
      env.setStartTwo();
      this.logger.log(
        `Creating thumbnail took: ${end.getTime() - start.getTime()}ms`,
      );
      this.readFile(fileOut, this.uploadImageToCloud(env, env.thumbnailType));
    });
  }

  _handleFile(req: any, file: Express.Multer.File, cb: any) {
    const start = new Date();
    const fileInfo = {
      mimeType: file.mimetype,
      fieldName: file.fieldname,
      originalName: file.originalname,
    };

    const env = new CustomGoogleCloudStorageEnv(
      fileInfo,
      mime.extension(fileInfo.mimeType),
      cb,
      req,
    );
    const fileDest = `${env.originalFile}.${env.originalFileExt}`;

    const outputStream = createWriteStream(fileDest);
    file.stream.pipe(outputStream);

    outputStream.on('finish', () => {
      const end = new Date();
      this.logger.log(
        `Saving original took: ${end.getTime() - start.getTime()}ms`,
      );
      env.setStartOne();
      this.readFile(fileDest, this.uploadImageToCloud(env));
    });
  }

  _removeFile(req: any, file: any, cb: any) {
    if (file['0']) {
      this.googleCloudStorage._removeFile(req, file['0'], cb);
    }

    if (file['1']) {
      this.googleCloudStorage._removeFile(req, file['1'], cb);
    }
  }
}
