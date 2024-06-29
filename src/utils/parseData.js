import axios from "axios";
import {
  convertRawViewstoString,
  parseVideoDuration,
  timeSince,
} from "./index";
import { YOUTUBE_API_URL } from "./constants";

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const parseData = async (items) => {
  try {
    const videoIds = [];
    const channelIds = [];
    items.forEach((item) => {
      channelIds.push(item.snippet.channelId);
      videoIds.push(item.id.videoId);
    });

    const {
      data: { items: channelsData },
    } = await axios.get(
      `${YOUTUBE_API_URL}/channels?part=snippet,contentDetails&id=${channelIds.join(
        ","
      )}&key=${API_KEY}`
    );

    const parsedChannelsData = [];
    channelsData.forEach((channel) =>
      parsedChannelsData.push({
        id: channel.id,
        image: channel.snippet.thumbnails.default.url,
      })
    );

    const {
      data: { items: videosData },
    } = await axios.get(
      `${YOUTUBE_API_URL}/videos?part=contentDetails,statistics&id=${videoIds.join(
        ","
      )}&key=${API_KEY}`
    );

    const parsedData = [];
    items.forEach((item, index) => {
      const { image: channelImage } =
        parsedChannelsData.find((data) => data.id === item.snippet.channelId) ||
        {};

      if (channelImage) {
        parsedData.push({
          videoId: item.id.videoId,
          videoTitle: item.snippet.title,
          videoDescription: item.snippet.description,
          videoThumbnail: item.snippet.thumbnails.medium.url,
          videoLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          videoDuration: parseVideoDuration(
            videosData[index].contentDetails.duration
          ),
          videoViews: convertRawViewstoString(
            videosData[index].statistics.viewCount
          ),
          videoAge: timeSince(new Date(item.snippet.publishedAt)),
          channelInfo: {
            id: item.snippet.channelId,
            image: channelImage,
            name: item.snippet.channelTitle,
          },
        });
      }
    });

    return parsedData;
  } catch (err) {
    console.log(err);
    return [];
  }
};

//////////////////////////////////////////////////////////

// export const parseData = async (items) => {
//   try {
//     const videoIds = items.map((item) => item.id.videoId);
//     const channelIds = items.map((item) => item.snippet.channelId);

//     // Fetch channels data
//     const {
//       data: { items: channelsData },
//     } = await axios.get(
//       `${YOUTUBE_API_URL}/channels?part=snippet,contentDetails&id=${channelIds.join(
//         ","
//       )}&key=${API_KEY}`
//     );

//     // Prepare parsedChannelsData
//     const parsedChannelsData = channelsData.map((channel) => ({
//       id: channel.id,
//       image: channel.snippet.thumbnails.default.url,
//     }));

//     // Fetch videos data
//     const {
//       data: { items: videosData },
//     } = await axios.get(
//       `${YOUTUBE_API_URL}/videos?part=contentDetails,statistics&id=${videoIds.join(
//         ","
//       )}&key=${API_KEY}`
//     );

//     // Prepare parsedData asynchronously
//     const parsedDataPromises = items.map(async (item, index) => {
//       const channelImage = parsedChannelsData.find(
//         (data) => data.id === item.snippet.channelId
//       )?.image;

//       if (channelImage && videosData[index]) {
//         const videoData = videosData[index];
//         return {
//           videoId: item.id.videoId,
//           videoTitle: item.snippet.title,
//           videoDescription: item.snippet.description,
//           videoThumbnail: item.snippet.thumbnails.medium.url,
//           videoLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
//           videoDuration: parseVideoDuration(videoData.contentDetails.duration),
//           videoViews: convertRawViewstoString(videoData.statistics.viewCount),
//           videoAge: timeSince(new Date(item.snippet.publishedAt)),
//           channelInfo: {
//             id: item.snippet.channelId,
//             image: channelImage,
//             name: item.snippet.channelTitle,
//           },
//         };
//       }
//       return null;
//     });

//     // Wait for all promises to resolve and filter out null values
//     const parsedData = (await Promise.all(parsedDataPromises)).filter(Boolean);

//     return parsedData;
//   } catch (err) {
//     console.error("Error in parseData:", err);
//     return []; // Return empty array on error
//   }
// };
