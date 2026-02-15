import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function uploadVideoToCloudflare(filePath: string) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        console.error('❌ Error: CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN not set in .env.local');
        process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Error: File not found at ${filePath}`);
        process.exit(1);
    }

    console.log(`🚀 Video Upload: Preparing to upload: ${filePath}`);

    try {
        // Direct Stream Upload Endpoint
        const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`;

        const fileBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const fileBlob = new Blob([fileBuffer], { type: 'video/mp4' });

        const formData = new FormData();
        formData.append('file', fileBlob, fileName);

        console.log('📤 Uploading video content to Cloudflare Stream...');

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
            },
            body: formData
        });

        const result = await res.json();

        if (!result.success) {
            throw new Error(`Video Upload failed: ${JSON.stringify(result.errors)}`);
        }

        const videoId = result.result.uid;
        const previewUrl = result.result.preview;
        const thumbnail = result.result.thumbnail;

        console.log('\n✅ Video Upload Successful!');
        console.log(`🎥 Video ID: ${videoId}`);
        console.log(`🔗 Preview: ${previewUrl}`);

        // Save the ID to a file so we can easily copy it
        fs.writeFileSync('upload_video_result.txt', videoId);

        return videoId;

    } catch (error: any) {
        console.error('❌ Video Upload failed:', error.message);
        process.exit(1);
    }
}

// CLI Entry point
const targetFile = process.argv[2];
if (!targetFile) {
    console.log('Usage: npx tsx scripts/upload-video-to-cloudflare.ts <path-to-video>');
    process.exit(0);
}

uploadVideoToCloudflare(targetFile);
