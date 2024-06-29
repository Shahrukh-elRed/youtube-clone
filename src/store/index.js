import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getHomePageVideos } from "./reducers/getHomePageVideos";

const initialState = {
  videos: [],
  currentPlaying: null,
  searchTerm: "",
  searchResults: [],
  nextPageToken: null,
  recommendedVideos: [],
};

const YoutubeSlice = createSlice({
  name: "youtubeApp",
  initialState,
  reducers: {
    clearVideos: (state) => {
      state.videos = [];
      state.nextPageToken = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHomePageVideos.fulfilled, (state, action) => {
      state.videos = action.payload.parsedData;
      state.nextPageToken = action.payload.nextPageToken;
    });
  },
});

export const { clearVideos } = YoutubeSlice.actions;

export const store = configureStore({
  reducer: {
    youtubeApp: YoutubeSlice.reducer,
  },
});
