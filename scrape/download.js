const axios = require('axios')

const RAPID_KEY = "1dda0d29d3mshc5f2aacec619c44p16f219jsn99a62a516f98"; // ganti dengan key kamu

async function fetchMedia(url) {
  if (!url || !url.includes("https://")) throw new Error("Url is required");

  const { data } = await axios.post(
    "https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink",
    { url },
    {
      headers: {
        "accept-encoding": "gzip",
        "cache-control": "no-cache",
        "content-type": "application/json; charset=utf-8",
        referer: "https://auto-download-all-in-one.p.rapidapi.com/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
        "x-rapidapi-host": "auto-download-all-in-one.p.rapidapi.com",
        "x-rapidapi-key": RAPID_KEY,
      },
    }
  );

  if (data.error) {
    throw new Error("Download failed");
  }

  return data;
}

async function ytmp3(url) {
  try {
    const data = await fetchMedia(url);

    const audio = data.medias.find(
      (m) => m.type === "audio" || m.extension === "mp3"
    );

    if (!audio) {
      return { status: false, msg: "No MP3 format found" };
    }

    return {
      status: true,
      source: "youtube",
      id: data.id,
      title: data.title,
      author: data.author,
      thumbnail: data.thumbnail,
      duration: data.duration,
      mp3: {
        url: audio.url,
        quality: audio.quality || "audio",
        extension: audio.extension,
      },
    };
  } catch (error) {
    return { status: false, msg: error.message };
  }
}

async function ytmp4(url) {
  try {
    const data = await fetchMedia(url);

    const video = data.medias.find(
      (m) => m.type === "video" || m.extension === "mp4"
    );

    if (!video) {
      return { status: false, msg: "No MP4 format found" };
    }

    return {
      status: true,
      source: "youtube",
      id: data.id,
      title: data.title,
      author: data.author,
      thumbnail: data.thumbnail,
      duration: data.duration,
      mp4: {
        url: video.url,
        quality: video.quality || "video",
        extension: video.extension,
      },
    };
  } catch (error) {
    return { status: false, msg: error.message };
  }
}

module.exports = {
  ytmp4,
  ytmp3
}