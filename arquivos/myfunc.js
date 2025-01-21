const axios = require('axios'); // Importa a biblioteca axios para fazer requisições HTTP

// Função para formatar o tempo em dias, horas, minutos e segundos
exports.runtime = function(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " DIA, " : " DIAS, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " HORA, " : " HORAS, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " MINUTO, " : " MINUTOS, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " SEGUNDO" : " SEGUNDOS") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
};

exports.getBuffer = async (url, opcoes = {}) => {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'user-agent': 'Mozilla/5.0',
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...opcoes,
            responseType: 'arraybuffer'
        });
        return Buffer.from(response.data);
    } catch (error) {
        console.log(`Erro identificado: ${error}`);
        throw error;  // Lança o erro para ser tratado onde a função é chamada
    }
};