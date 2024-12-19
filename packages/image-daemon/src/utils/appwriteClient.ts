import {
  Client,
  Databases,
  Storage,
  ID,
  Query,
  Permission,
  Role,
} from 'node-appwrite';

import chalk from 'chalk';

import 'dotenv/config';

const client = new Client();


export const createAppwriteClient = () => {

  const appwriteConfig = {
    endpoint: process.env.APPWRITE_ENDPOINT,
    projectId: process.env.APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DATABASE_ID,
    userCollectionId: process.env.APPWRITE_COLLECTION_ID,
    bucketId: process.env.APPWRITE_BUCKET_ID,
  };

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
