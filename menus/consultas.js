
const consultas= (prefix, hora, data, pushname) => {
return `
╭───────────────╮
│     CONSULTAS
╰───────────────╯
╭────────────────╮
│${prefix}nome
│${prefix}nome2
│${prefix}telefone
│${prefix}gerarcpff
│${prefix}gerarpessoa
│${prefix}gerarsenha
│${prefix}cpf 
│${prefix}placa
│${prefix}ddd
│${prefix}ddd2
│${prefix}ip
│${prefix}cep
│${prefix}cep2
│${prefix}cnpj
│${prefix}operadora 
│${prefix}placa 
│${prefix}site
│${prefix}signo
│${prefix}filme
│${prefix}serie
│${prefix}bing
│${prefix}wikipedia 
│${prefix}google
│${prefix}moedas
│${prefix}tabeladobr
│${prefix}artilheirodobr
│${prefix}feriados
│${prefix}audiomeme
│${prefix}imdb
│${prefix}letra
│${prefix}correios
│${prefix}significado
│${prefix}deezer
│${prefix}happymod
│${prefix}aptoid
│${prefix}pesquisayt
│${prefix}amazon
│${prefix}mercadolivre
│${prefix}celular
│${prefix}playstore
│${prefix}nerding
│${prefix}nasa
│${prefix}dafont
╰─────────────────
`
}
exports.consultas = consultas