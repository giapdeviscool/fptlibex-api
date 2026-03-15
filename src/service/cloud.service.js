import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import 'dotenv/config';

const s3 = new S3Client({
    region: "auto",
    endpoint: `https://76de7331774b4962b875617940fc6245.r2.cloudflarestorage.com/imagestorage`,
    credentials: {
        accessKeyId: process.env.R2_ACCESSKEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

export const uploadFile = async (fileBuffer, fileName) => {
    const command = new PutObjectCommand({
        Bucket: "imagestorage",
        Key: fileName,
        Body: fileBuffer,
        ContentType: "image/jpeg",
    });

    await s3.send(command);

    const url = `https://gphan.website/imagestorage/${fileName}`;
    return url;
};