import { storage, databases } from '../utils/appwrite';
import { ID, Query, Permission, Role } from 'node-appwrite';
import { InputFile } from '../utils/inputFile';

import crypto from 'crypto';
import sharp, { cache } from 'sharp';

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

      deserializedResults.push({ cache: true });

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
    : fluffleResults.results;

  if (!Array.isArray(fluffleResultsArray)) {
    throw new Error('Invalid Fluffle API response: results is not an array');
  }

  // Filter out unlikely matches and format results
  const platforms = fluffleResultsArray
    .filter((result: any) => result.match !== 'unlikely') // Exclude "unlikely" matches
    .map((result: any) => {
      const singlePatfoorm = {
        platform: result.platform,
        location: result.location,
        credits: result.credits || [], // Default to an empty array if credits are missing
      };

      return JSON.stringify(singlePatfoorm);
    });

  // Resize the image
  const resizedImage = await sharp(imageBuffer)
    .resize({ width: 256, height: 256, fit: 'inside' })
    .png()
    .toBuffer();

  // Simulate file upload to Appwrite storage (commented out in your example)
  const file = await storage.createFile(
    BUCKET_ID,
    ID.unique(),
    InputFile.fromBuffer(resizedImage, `${hash}.png`),
    [Permission.read(Role.any()), Permission.write(Role.users()), Permission.update(Role.users())]
  );

  // Create the final metadata object
  const metadata = {
    hash,
    fileId: file.$id, // Replace with `file.$id` when integrating Appwrite
    createdAt: new Date().toISOString(),
    nsfw: platforms.some((platform: any) => !platform.nsfw), // Determine NSFW status based on results
    users: ['6769e28b000c70486c50'], // Assign all results to the bot user for now
    platforms, // Serialize platforms array to JSON
  };

  // Simulate saving metadata to the Appwrite database (commented out in your example)
  await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), metadata);

  console.log('Formatted Metadata:', metadata);
  return metadata;
};
