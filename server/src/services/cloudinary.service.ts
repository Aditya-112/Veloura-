import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadImage = async (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "veloura",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(
              new Error("Cloudinary did not return an upload result.")
            );
          }

          resolve(result);
        }
      )
      .end(file.buffer);
  });
};

export const deleteImage = async(
  publicId :string
): Promise<void> =>{
  await cloudinary.uploader.destroy(publicId);
};