const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'nnna0yke',
  api_key: '282193853912469',
  api_secret: '-rBi-ml_rl2PPG8OY3wORY9GM1A'
});

const designImagesPath = path.join(__dirname, '../client/public/images/designs');

const uploadImages = async () => {
  try {
    const files = fs.readdirSync(designImagesPath);
    console.log(`Found ${files.length} images to upload...\n`);

    const uploadedUrls = {};

    for (const file of files) {
      const filePath = path.join(designImagesPath, file);
      const fileName = path.parse(file).name;

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'divine-home/designs',
          public_id: fileName,
          resource_type: 'auto'
        });

        uploadedUrls[file] = result.secure_url;
        console.log(`✓ Uploaded: ${file}`);
        console.log(`  URL: ${result.secure_url}\n`);
      } catch (err) {
        console.error(`✗ Error uploading ${file}:`, err.message);
      }
    }

    console.log('\n========== CLOUDINARY URLS ==========');
    console.log(JSON.stringify(uploadedUrls, null, 2));
    console.log('=====================================\n');
    console.log('Upload complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

uploadImages();
