const ytdl = require('youtubedl-core');
const yts = require('youtube-yts');
const readline = require('readline');
const ffmpeg = require('fluent-ffmpeg');
const NodeID3 = require('node-id3');
const fs = require('fs');
const { fetchBuffer } = require("./myfunc");
const ytM = require('node-youtube-music');
const { randomBytes } = require('crypto');
const ytIdRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;

class YT {
    constructor() { }

    static isYTUrl = (url) => {
        return ytIdRegex.test(url);
    }

    static getVideoID = (url) => {
        if (!this.isYTUrl(url)) throw new Error('is not YouTube URL');
        return ytIdRegex.exec(url)[1];
    }

    static WriteTags = async (filePath, Metadata) => {
        NodeID3.write(
            {
                title: Metadata.Title,
                artist: Metadata.Artist,
                originalArtist: Metadata.Artist,
                image: {
                    mime: 'jpeg',
                    type: {
                        id: 3,
                        name: 'front cover',
                    },
                    imageBuffer: (await fetchBuffer(Metadata.Image)).buffer,
                    description: `Cover of ${Metadata.Title}`,
                },
                album: Metadata.Album,
                year: Metadata.Year || ''
            },
            filePath
        );
    }

    static search = async (query, options = {}) => {
        const search = await yts.search({ query, hl: 'id', gl: 'ID', ...options });
        return search.videos;
    }

    static searchTrack = async (query) => {
    try {
        console.log('Searching for:', query); // Adicione este log
        let ytMusic = await ytM.searchMusics(query);
        console.log('ytMusic results:', ytMusic); // Adicione este log
        let result = [];
        for (let i = 0; i < ytMusic.length; i++) {
            result.push({
                isYtMusic: true,
                title: `${ytMusic[i].title} - ${ytMusic[i].artists.map(x => x.name).join(' ')}`,
                artist: ytMusic[i].artists.map(x => x.name).join(' '),
                id: ytMusic[i].youtubeId,
                url: 'https://youtu.be/' + ytMusic[i].youtubeId,
                album: ytMusic[i].album,
                duration: {
                    seconds: ytMusic[i].duration.totalSeconds,
                    label: ytMusic[i].duration.label
                },
                image: ytMusic[i].thumbnailUrl.replace('w120-h120', 'w600-h600')
            });
        }
        return result;
    } catch (error) {
        console.error('Failed to search track:', error); // Adicione este log
        throw error;
    }
}
    static downloadMusic = async (url) => {
    try {
        console.log('Downloading music from URL:', url); // Adicione este log
        const videoInfo = await ytdl.getInfo(url, { lang: 'id' });
        console.log('videoInfo:', videoInfo); // Adicione este log
        if (!videoInfo) {
            throw new Error('Failed to get video info');
        }

        let stream = ytdl(url, { filter: 'audioonly' });
        let songPath = `./XliconMedia/audio/${randomBytes(3).toString('hex')}.mp3`;
        stream.on('error', (err) => { throw err; });

        const file = await new Promise((resolve) => {
            ffmpeg(stream)
                .audioFrequency(44100)
                .audioChannels(2)
                .audioBitrate(128)
                .audioCodec('libmp3lame')
                .audioQuality(5)
                .toFormat('mp3')
                .save(songPath)
                .on('end', () => resolve(songPath));
        });
        await this.WriteTags(file, { Title: videoInfo.videoDetails.title, Artist: videoInfo.videoDetails.author.name, Image: videoInfo.videoDetails.thumbnails[0].url, Album: '', Year: videoInfo.videoDetails.publishDate ? videoInfo.videoDetails.publishDate.split('-')[0] : '' });
        return {
            meta: videoInfo.videoDetails,
            path: file,
            size: fs.statSync(songPath).size
        };
    } catch (error) {
        console.error('Failed to download music:', error); // Adicione este log
        throw error;
    }
}

    static mp3 = async (url, metadata = {}, autoWriteTags = false) => {
        try {
            if (!url) throw new Error('Video ID or YouTube Url is required');
            url = this.isYTUrl(url) ? 'https://www.youtube.com/watch?v=' + this.getVideoID(url) : url;
            const { videoDetails } = await ytdl.getInfo(url, { lang: 'id' });
            let stream = ytdl(url, { filter: 'audioonly' });
            let songPath = `./XliconMedia/audio/${randomBytes(3).toString('hex')}.mp3`;

            stream.on('error', (err) => { throw err; });

            const file = await new Promise((resolve, reject) => {
                ffmpeg(stream)
                    .audioFrequency(44100)
                    .audioChannels(2)
                    .audioBitrate(128)
                    .audioCodec('libmp3lame')
                    .audioQuality(5)
                    .toFormat('mp3')
                    .save(songPath)
                    .on('end', () => resolve(songPath))
                    .on('error', reject);
            });
            if (Object.keys(metadata).length !== 0) {
                await this.WriteTags(file, metadata);
            }
            if (autoWriteTags) {
                await this.WriteTags(file, { Title: videoDetails.title, Album: videoDetails.author.name, Year: videoDetails.publishDate ? videoDetails.publishDate.split('-')[0] : '', Image: videoDetails.thumbnails.slice(-1)[0].url });
            }
            return {
                meta: {
                    title: videoDetails.title,
                    channel: videoDetails.author.name,
                    seconds: videoDetails.lengthSeconds,
                    image: videoDetails.thumbnails.slice(-1)[0].url
                },
                path:file,
                size: fs.statSync(songPath).size
            };
        } catch (error) {
            throw new Error(`Failed to convert to mp3: ${error.message}`);
        }
    }
}

module.exports = YT;