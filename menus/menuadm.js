exports.menuadm = (comando, prefix, hora, data, pushname, totalcmd) => {
return `
╭───────────────╮
│ADM
╰───────────────╯
╭────────────────╮
│${prefix}mute [@]
│${prefix}desmute [@]
│${prefix}promover [@]
│${prefix}rebaixar [@]
│${prefix}ban [@]
│${prefix}marcar
│${prefix}cita [txt]
│${prefix}status
│${prefix}apagar
│${prefix}grupo [f/a]
│${prefix}sorteio
│${prefix}antifake [1/0]
│${prefix}autoreact [1/0]
│${prefix}anticatalg [1/0]
│${prefix}antiaudio [1/0]
│${prefix}antiimg [1/0]
│${prefix}antidoc [1/0]
│${prefix}antinotas [1/0]
│${prefix}antilink [1/0]
│${prefix}antilinkgp [1/0]
│${prefix}antivideo [1/0]
│${prefix}antisticker [1/0]
│${prefix}ct1 [1/0]
│${prefix}grupoinfo
│${prefix}rankinativo
│${prefix}anotacao
│${prefix}anotar
│${prefix}resetarlink
│${prefix}limpar
│${prefix}check [@]
│${prefix}atividades
│${prefix}regraspp
│${prefix}add [numero]
│${prefix}marcarwa [Wa.Me Todos]
│${prefix}sair [Tira o bot do GP]
│${prefix}listafake
│${prefix}listabr
│${prefix}banfake
│${prefix}banbrs
│${prefix}saibot [tirar bot do grupo]
╰─────────────────
`
 }