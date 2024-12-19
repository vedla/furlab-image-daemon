'use server';

import { storage, databases } from '../utils/appwriteClient';
import { ID, Query, Permission, Role } from 'node-appwrite';
import { InputFile } from '../utils/inputFile';

import crypto from 'crypto';
import sharp from 'sharp';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || '';
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || '';

export const hashImage = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

export const getCachedResult = async (imageBuffer: Buffer) => {
  const hash = hashImage(imageBuffer);

  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('hash', hash),
    ]);

    if (result.total > 0) {
      const document = result.documents[0];

      // Deserialize fluffleResults back into an array of objects
      const deserializedResults = document.fluffleResults.map((entry: string) => {
        const [platform, url, score] = entry.split(',');
        return {
          platform: platform.split(':')[1],
          url: url.split(':')[1],
          score: parseFloat(score.split(':')[1]),
        };
      });

      return {
        ...document,
        fluffleResults: deserializedResults,
      };
    }

    return null;
  } catch (error) {
    if (error instanceof Error && (error as any).response) {
      console.error('Error querying cache:', error);
    }
    console.error('Error querying cache:', (error as Error).message);
    throw error;
  }
};

export const cacheResult = async (imageBuffer: Buffer, fluffleResults: any) => {
  const hash = hashImage(imageBuffer);

  // Ensure `fluffleResults` is an array
  const fluffleResultsArray = Array.isArray(fluffleResults)
    ? fluffleResults
    : fluffleResults.results; // Adjust `results` to match the Fluffle API response

  if (!Array.isArray(fluffleResultsArray)) {
    throw new Error('Invalid Fluffle API response: results is not an array');
  }

  // Serialize fluffleResults for storage
  const serializedResults = fluffleResultsArray.map((result: any) => {
    return `platform:${result.platform},url:${result.location},score:${result.score}`;
  });

  // Resize the image
  const resizedImage = await sharp(imageBuffer)
    .resize({ width: 256, height: 256, fit: 'inside' })
    .png()
    .toBuffer();

  // Upload the image to Appwrite storage
  const file = await storage.createFile(
    BUCKET_ID,
    ID.unique(),
    InputFile.fromBuffer(resizedImage, 'image.png'),
    [Permission.read(Role.any()), Permission.write(Role.users()), Permission.update(Role.users())]
  );

  // Save metadata to the Appwrite database
  const metadata = {
    hash,
    fluffleResults: serializedResults, // Store as an array of strings
    fileId: file.$id,
    createdAt: new Date().toISOString(),
  };

  await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), metadata);

  return metadata;
};
