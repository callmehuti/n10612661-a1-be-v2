const {
  getAllService,
  getFileInfoService,
  updateFileService,
  uploadFileService,
} = require("../services/file");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

// [GET] /file/getAll
const getAllFile = async (req, res) => {
  try {
    const username = req.username;
    const files = await getAllService(username);
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// [GET] /file/generate?file=ANYTHING.MP4&qualities=720p,360p,480p
const generateFile = async (req, res) => {
  try {
    if (!req.query?.file || !req.query?.qualities)
      throw new Error("missing file name or qualities");
    const username = req.username;
    const { file, qualities } = req.query;
    const handledQualities = qualities.split(",");
    const fileName = file.split(".")[0];
    const fileDir = path.join(process.cwd(), "uploads", username, file);
    const outputDir = path.join("uploads", username, fileName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const fileExists = fs.existsSync(fileDir);
    if (!fileExists) throw new Error("file not exist");
    const qualitiesData = [
      {
        resolution: "426x240",
        bitrate: "250k",
        bitrateNumber: "250000",
        output: `${fileName}-240p.m3u8`,
        type: "240p",
      },
      {
        resolution: "640x360",
        bitrate: "800k",
        bitrateNumber: "800000",
        output: `${fileName}-360p.m3u8`,
        type: "360p",
      },
      {
        resolution: "854x480",
        bitrate: "1400k",
        bitrateNumber: "1400000",
        output: `${fileName}-480p.m3u8`,
        type: "480p",
      },
      {
        resolution: "1280x720",
        bitrate: "2600k",
        bitrateNumber: "2600000",
        output: `${fileName}-720p.m3u8`,
        type: "720p",
      },
      {
        resolution: "1920x1080",
        bitrate: "4500k",
        bitrateNumber: "4500000",
        output: `${fileName}-1080p.m3u8`,
        type: "1080p",
      },
      {
        resolution: "2560x1440",
        bitrate: "7000k",
        bitrateNumber: "7000000",
        output: `${fileName}-2k.m3u8`,
        type: "2k",
      },
      {
        resolution: "3849x2160",
        bitrate: "11000k",
        bitrateNumber: "11000000",
        output: `${fileName}-4k.m3u8`,
        type: "4k",
      },
    ];

    let countProcess = 0;

    for (const { resolution, bitrate, output, type } of qualitiesData) {
      if (!handledQualities.includes(type)) continue;

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(fileDir)
          .addOutputOption([
            `-vf scale=${resolution}`, // Video filter for scaling the video
            `-b:v ${bitrate}`, // Set the video bitrate
            "-c:v libx264", // Specify the video codec
            "-hls_time 10", // Set the duration of each .ts file generated to 10 seconds
            "-hls_playlist_type vod", // Set HLS playlist type to VOD (Video On Demand)
            `-hls_segment_filename ${path.join(
              outputDir,
              `${fileName}_${resolution}_%03d.ts`
            )}`, // Naming pattern for the segment files
          ])
          .output(path.join(outputDir, output))
          .on("end", () => {
            resolve("done");
            countProcess++;
          })
          .on("progress", (progress) => {
            // 0 * 33 + 33 = 33
            // 1 * 33 + 1 = 34
            // 2 * 33 + 1 = 67
            const percent =
              countProcess * (100 / handledQualities.length) +
              progress.percent.toFixed(2) / handledQualities.length;
              req.socket.emit("progress", { fileName: file, percent: Math.round(percent)});
            // You can log or handle progress here
          })
          .on("error", (err) => {
            console.log(err);
            reject(err);
          })
          .run();
      });

      let master = `
#EXTM3U`;
      for (const { resolution, type, bitrateNumber } of qualitiesData) {
        console.log(
          "resolution, type, bitrateNumber : ",
          resolution,
          type,
          bitrateNumber
        );

        if (!handledQualities.includes(type)) continue;
        master += `
#EXT-X-STREAM-INF:BANDWIDTH=${bitrateNumber},RESOLUTION=${resolution}
${fileName}-${type}.m3u8`;
      }
      const masterDir = path.join(outputDir, `${fileName}.m3u8`);
      fs.writeFileSync(masterDir, master);
    }
    const files = await updateFileService(username, file, handledQualities);
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// #EXT-X-STREAM-INF:BANDWIDTH=250000,RESOLUTION=426x240
// http://localhost:3300/user/handleDownload?fileName=something-240p

// [GET] /file/handleDownloadFile
const handleDownloadFile = async (req, res) => {
  try {
    const username = req.username;
    const key = req.query?.key;
    if (!key) throw new Error("Missing key");
    const fileName = key.split("-")[0];
    const mp4Dir = path.join(
      process.cwd(),
      "uploads",
      username,
      fileName,
      `${key}.mp4`
    );
    const m3u8Dir = path.join(
      process.cwd(),
      "uploads",
      username,
      fileName,
      `${key}.m3u8`
    );
    const fileExists = fs.existsSync(mp4Dir);
    if (fileExists) {
      return res.status(200).send({ result: "successful" });
    }
    if (!fs.existsSync(m3u8Dir)) throw new Error("m3u8 file is not exist");
    await new Promise((resolve, reject) => {
      ffmpeg(m3u8Dir)
        .videoCodec("copy")
        .audioCodec("copy")
        .output(path.join(mp4Dir))
        .on("end", () => {
          console.log("DONE HERE");
          resolve('done');
        })
        .on("error", (err) => {
          console.log(err);
          reject(err)
        })
        .run();

    });
    
    return res.status(200).send({ result: "successful" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

// [GET] /file/download?fileName=abc-240p.mp4
const downloadFile = async (req, res) => {
  try {
    const fileName = req.query?.fileName; 
    const quality = req.query?.quality;
    console.log("fileName: ", fileName);
    // filename-240p.mp4
    const username = req.username;
    if (!fileName || !quality) throw new Error("Missing fileName or quality");
    const pathDir = path.join(
      process.cwd(),
      "uploads",
      username,
      fileName,
      `${fileName}-${quality}.mp4`
    );
    const fileExists = fs.existsSync(pathDir);
    if (!fileExists) throw new Error("File not exist");
    const stat = fs.statSync(pathDir);
    const file = await getFileInfoService(username, `${fileName}.mp4`);
    console.log(file);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}-${quality}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");
    const stream = fs.createReadStream(pathDir);
    stream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

// [POST] /file/upload
const uploadFile = async (req, res) => {
  try {
    const { file } = req;
    const username = req.username;
    const files = await uploadFileService(
      username,
      file.filename,
      file.mimetype
    );
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  getAllFile,
  generateFile,
  uploadFile,
  downloadFile,
  handleDownloadFile,
};
