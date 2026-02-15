const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load R2 configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../.r2-config.json'), 'utf8'));

/**
 * Upload an MP3 file to Cloudflare R2
 * @param {string} filePath - Local path to the MP3 file
 * @param {string} fileName - Desired filename in R2 (e.g., "episode-001.mp3")
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
async function uploadToR2(filePath, fileName) {
    const s3Client = new S3Client({
        region: 'auto',
        endpoint: config.r2.endpoint,
        credentials: {
            accessKeyId: config.r2.accessKeyId,
            secretAccessKey: config.r2.secretAccessKey,
        },
    });

    try {
        const fileContent = fs.readFileSync(filePath);

        await s3Client.send(new PutObjectCommand({
            Bucket: config.r2.bucketName,
            Key: fileName,
            Body: fileContent,
            ContentType: 'audio/mpeg',
        }));

        const publicUrl = `${config.r2.publicUrl}/${fileName}`;
        console.log(`✅ Upload successful: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error('❌ Upload failed:', error);
        throw error;
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node upload-to-r2.js <file-path> <file-name>');
        console.log('Example: node upload-to-r2.js ./test.mp3 episode-001.mp3');
        process.exit(1);
    }

    const [filePath, fileName] = args;
    uploadToR2(filePath, fileName)
        .then(url => console.log(`Public URL: ${url}`))
        .catch(err => {
            console.error('Error:', err.message);
            process.exit(1);
        });
}

module.exports = { uploadToR2 };
