import cloudinary from 'cloudinary';

const uploadToCloudinary = async (fileBuffer) => {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, uploadResult) => {
            if (error) {
              return reject(error);
            }
            resolve(uploadResult);
          }
        ).end(fileBuffer); // Send file buffer to Cloudinary
      });
  
      return result; // Return the upload result (e.g., URL, public ID, etc.)
    } catch (error) {
      throw new Error(`Error uploading to Cloudinary: ${error.message}`);
    }
  };
  
  export { uploadToCloudinary };