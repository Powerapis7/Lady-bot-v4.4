
const noticias = (prefix, hora, data, pushname) => {
return `
╭───────────────╮
│NOTICIAS
╰───────────────╯
╭────────────────╮
│${prefix}g1
│${prefix}cnnbrasil
│${prefix}uol
│${prefix}exame
│${prefix}oglobo
│${prefix}metropoles
│${prefix}folha
│${prefix}jovempan
│${prefix}agazeta
│${prefix}terra
│${prefix}estadao
│${prefix}aominuto
│${prefix}vejaabril
│${prefix}poder360
│${prefix}fut
│${prefix}fisiculturista 
│${prefix}genoticias (assunto)
│${prefix}time (nome)
╰─────────────────
`
}
exports.noticias = noticias 
