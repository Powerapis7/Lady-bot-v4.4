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

class YouTube {
    constructor() { }

    static isYouTubeURL = (url) => {
        return ytIdRegex.test(url);
    }

    static getVideoID = (url) => {
        if (!this.isYouTubeURL(url)) throw new Error('is not YouTube URL');
        return ytIdRegex.exec(url)[1];
    }

    static writeTags = async (filePath, Metadata) => {
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
        let ytMusic = await ytM.searchMusics(query);
        console.log('ytMusic:', ytMusic); // Adicionando log para verificar o resultado da pesquisa
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
        console.log('result:', result); // Adicionando log para verificar o resultado final
        return result;
    } catch (error) {
        throw error;
    }
}

static downloadMusic = async (query) => {
    try {
        const getTrack = Array.isArray(query) ? query : await this.searchTrack(query);
        console.log('getTrack:', getTrack); // Adicionando log para verificar o resultado da busca de músicas
        if (!getTrack || getTrack.length === 0) {
            throw new Error('No search results found');
        }
        const search = getTrack[0];
        console.log('search:', search); // Adicionando log para verificar o resultado da pesquisa
        if (!search || !search.id) {
            throw new Error('Invalid search result');
        }
        const videoInfo = await ytdl.getInfo('https://www.youtube.com/watch?v=' + search.id, { lang: 'id' });
        console.log('videoInfo:', videoInfo); // Adicionando log para verificar o resultado da obtenção de informações do vídeo
        if (!videoInfo) {
            throw new Error('Failed to get video info');
        }

        let stream = ytdl('https://www.youtube.com/watch?v=' + search.id, { filter: 'audioonly' });
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
        await this.writeTags(file, { Title: search.title, Artist: search.artist, Image: search.image, Album: search.album, Year: videoInfo.videoDetails.publishDate ? videoInfo.videoDetails.publishDate.split('-')[0] : '' });
        return {
            meta: search,
            path: file,
            size: fs.statSync(songPath).size
        };
    } catch (error) {
        throw error;
    }
}
    static mp4 = async (query, quality = 134) => {
        try {
            if (!query) throw new Error('Video ID or YouTube Url is required');
            const videoId = this.isYouTubeURL(query) ? this.getVideoID(query) : query;
            const videoInfo = await ytdl.getInfo('https://www.youtube.com/watch?v=' + videoId, { lang: 'id' });
            const format = ytdl.chooseFormat(videoInfo.formats, { format: 'mp4', quality: quality.toString(), filter: 'videoandaudio' });
            return {
                title: videoInfo.videoDetails.title,
                thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
                date: videoInfo.videoDetails.publishDate,
                duration: videoInfo.videoDetails.lengthSeconds,
                channel: videoInfo.videoDetails.ownerChannelName,
                quality: format.qualityLabel,
                contentLength: format.contentLength,
                description: videoInfo.videoDetails.description,
                videoUrl: format.url
            };
        } catch (error) {
            throw error;
        }
    }

    static mp3 = async (url, metadata = {}, autoWriteTags = false) => {
        try {
            if (!url) throw new Error('Video ID or YouTube Url is required');
            url = this.isYouTubeURL(url) ? 'https://www.youtube.com/watch?v=' + this.getVideoID(url) : url;
            const { videoDetails } = await ytdl.getInfo(url, { lang: 'id' });
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
                    .on('end', () => {
                        resolve(songPath);
                    });
            });
            if (Object.keys(metadata).length !== 0) {
                await this.writeTags(file, metadata);
            }
            if (autoWriteTags) {
                await this.writeTags(file, { Title: videoDetails.title, Album: videoDetails.author.name, Year: videoDetails.publishDate ? videoDetails.publishDate.split('-')[0] : '', Image: videoDetails.thumbnails.slice(-1)[0].url });
            }
            return {
                meta: {
                    title: videoDetails.title,
                    channel: videoDetails.author.name,
                    seconds: videoDetails.lengthSeconds,
                    image: videoDetails.thumbnails.slice(-1)[0].url
                },
                path: file,
                size: fs.statSync(songPath).size
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = YouTube;