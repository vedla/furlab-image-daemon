import { Client, Databases, Storage, ImageGravity, ImageFormat } from 'node-appwrite';

import chalk from 'chalk';

import 'dotenv/config';

const client = new Client();

const appwriteConfig = {
  endpoint: process.env.APPWRITE_ENDPOINT,
  projectId: process.env.APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: process.env.APPWRITE_DATABASE_ID,
  userCollectionId: process.env.APPWRITE_COLLECTION_ID,
  bucketId: process.env.APPWRITE_BUCKET_ID,
};

export const createAppwriteClient = () => {
  if (
    !appwriteConfig.endpoint ||
    !appwriteConfig.projectId ||
    !appwriteConfig.apiKey ||
    !appwriteConfig.databaseId ||
    !appwriteConfig.userCollectionId ||
    !appwriteConfig.bucketId
  ) {
    console.error(chalk.bgRed('E001__Missing Appwrite configuration(s) variable(s)'));
    throw new Error('Missing Appwrite configuration');
  }

  client
    .setEndpoint(appwriteConfig.endpoint as string)
    .setProject(appwriteConfig.projectId as string)
    .setKey(appwriteConfig.apiKey as string);

  return client;
};

export const databases = new Databases(createAppwriteClient());
export const storage = new Storage(createAppwriteClient());

export const getImagePreview = async (fileId: string) => {
  // const preview = await storage.getFilePreview(
  //   appwriteConfig.bucketId as string,
  //   fileId,
  //   200,
  //   200,
  //   ImageGravity.Center
  // );

  const preview = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${fileId}/preview`;

  console.warn('getImagePreview', preview);

  return preview;
};
