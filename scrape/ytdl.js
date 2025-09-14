const axios = require('axios')

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