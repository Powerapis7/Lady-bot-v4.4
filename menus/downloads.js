
const downloads = (prefix, hora, data, pushname) => {
return `
╭───────────────╮
│     DOWNLOAD
╰───────────────╯
╭────────────────╮
│${prefix}tiktok [link]
│${prefix}tiktok_audio [link]
│${prefix}tiktok_video [link]
│${prefix}tiktokaudio [link]
│${prefix}tiktokvd (video)
│${prefix}tiktokad (audio)
│${prefix}clipe (video)
│${prefix}musica(audio)
│${prefix}playdoc (nome)
│${prefix}linkdoc (link)
│${prefix}play [nome/link]
│${prefix}playvideo [nome/link]
│${prefix}playdoc2 [nome/link]
│${prefix}playlink [link] (audio)
│${prefix}videolink [link] (video)
│${prefix}play_video [nome]
│${prefix}play_audio [nome]
│${prefix}ytmp3 [link] (audio)
│${prefix}ytbmp4 [link] (video)
│${prefix}ytbemp3 [link] (audio)
│${prefix}ytbemp4 [link](video)
│${prefix}play2  [link] (audio)
│${prefix}pla3 [link] (video)
│${prefix}play4 [link] (video)
│${prefix}play5 [link] (audio)
│${prefix}play6 [nome] (música)
│${prefix}play7 [nome] (video)
│${prefix}spotify [nome]
│${prefix}instagram [link da foto]
│${prefix}Instagram2 [link do video]
│${prefix}indtagramlink [link]
│${prefix}igaudio [link]
│${prefix}igimg [link]
│${prefix}ig [link da foto]
│${prefix}ig2 [link do video]
│${prefix}insta_audio [link]
│${prefix}story [link]
│${prefix}igstalk [nome]
│${prefix}pinterest   [nome]
│${prefix}pinterest 2 [nome]
│${prefix}pinterest 3 [nome]
│${prefix}pinterest 4 [nome]
│${prefix}pinterest 5 [nome do video]
│${prefix}pinterest_video [link]
│${prefix}pinterest_foto [link]
│${prefix}pinterestvideo [nome]
│${prefix}face_audio [link]
│${prefix}face_video [link]
│${prefix}twitter [link]
│${prefix}twitter_video [link]
│${prefix}twitter_audio [link]
│${prefix}threads [link]
│${prefix}kwai [link]
│${prefix}kwai_audio [link]
│${prefix}kwai_video [link]
│${prefix}xnxxdownload [link]
│${prefix}drive_video [link]
│${prefix}drive_audii [link]
╰─────────────────
`
}
exports.downloads = downloads 