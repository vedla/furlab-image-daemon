import axios from 'axios';
import FormData from 'form-data';

export const searchFluffle = async (imageBuffer: Buffer, includeNsfw: boolean) => {
  const formData = new FormData();
  formData.append('file', imageBuffer, { filename: 'image.png', contentType: 'image/png' });
  formData.append('includeNsfw', includeNsfw ? 'true' : 'false');

  formData.append('platforms[]', 'Fur Affinity');
  formData.append('platforms[]', 'Twitter');
  formData.append('platforms[]', 'e621');
  formData.append('platforms[]', 'Weasyl');
  formData.append('platforms[]', 'Furry Network');
  formData.append('platforms[]', 'DeviantArt');
  formData.append('platforms[]', 'Inkbunny');

  formData.append('limit', '8');

  const headers = {
    'User-Agent': process.env.FLUFFLE_USER_AGENT,
    ...formData.getHeaders(),
  };

  try {
    const response = await axios.post('https://api.fluffle.xyz/v1/search', formData, { headers });

    // Filter results to remove 'unlikely' matches
    const filteredResults = response.data.results.filter(
      (result: { match: string }) => result.match !== 'unlikely'
    );

    return { ...response.data, results: filteredResults }; // Return filtered results
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error calling Fluffle API:', error.message);
      console.error(error);
    } else {
      console.error('Error calling Fluffle API:', error);
    }
    throw error;
  }
};
