import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { YOUTUBE_API_URL } from "../../utils/constants";
import { parseRecommendedData } from "../../utils/parseRecommendedData";

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const getRecommendedVideos = createAsyncThunk(
  "yotubeApp/getRecommendedVideos",
  async (videoId, { getState }) => {
    const {
      youtubeApp: {
        currentPlaying: {
          channelInfo: { id: channelId },
        },
      },
    } = getState();

    const {
      data: { items },
    } = await axios.get(
      `${YOUTUBE_API_URL}/activities?key=${API_KEY}&channelId=${channelId}&part=snippet,contentDetails&maxResults=20&type=video&videoId=${videoId}`
    );

    const parsedData = await parseRecommendedData(items, videoId);

    return { parsedData };
  }
);
