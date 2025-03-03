registerFieldColour()

const definitions = [
    {
        "type": "Populacao_Inicial",
        "tooltip": "Gera a população inicial de soluções aleatórias.",
        "message0": "População inicial com %1 indivíduos",
        "args0": [
            {
                "type": "field_number",
                "name": "QUAN",
                "value": 10,  // Adicionando valor inicial
                "min": 1,     // Valor mínimo
                "max": 100     // Valor máximo
            }
        ],
        "nextStatement": null,
        "colour": 315,
        "inputsInline": true
    },
    {
        "type": "Repetir_Ate",
        "tooltip": "Repetir até atingir a condição especificada.",
        "message0": "Repetir até %1",
        "args0": [
            {
                "type": "input_value",
                "name": "CONDICAO",
                "check": "Number"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
    },
    {
        "type": "Criterio_Parada",
        "tooltip": "Determina quando o algoritmo deve parar.",
        "message0": "a atingir a cor de critério de parada %1",
        "helpUrl": "",
        "args0": [
            {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#000099"
            }
        ],
        "output": null,
        "colour": 0,
        "inputsInline": true
    },
    {
        "type": "Geracao",
        "tooltip": "Repetir até atingir o número de gerações especificado.",
        "message0": "a %1 geração",
        "args0": [
            {
                "type": "field_number",
                "name": "CONDICAO",
                "check": "Number",
                "value": 10,  // Adicionando valor inicial
                "min": 5,     // Valor mínimo
                "max": 50     // Valor máximo
            }
        ],
        "output": null,
        "colour": 0
    },
    {
        "type": "Avaliacao_Aptidao",
        "tooltip": "Avalia a qualidade de cada indivíduo na população.",
        "message0": "Avaliar Aptidão",
        "nextStatement": null,
        "previousStatement": null,
        "colour": 120
    },
    {
        "type": "Selecao",
        "tooltip": "Seleciona os indivíduos para reprodução com base em sua aptidão.",
        "message0": "Selecionar Indivíduos por %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TIPO",
                "options": [
                    ["Roleta", "roleta"],
                    ["Torneio", "torneio"]
                ]
            }
        ],
        "nextStatement": null,
        "previousStatement": null,
        "colour": 45
    },
    {
        "type": "Cruzamento",
        "tooltip": "Combina dois indivíduos para criar um novo, visando melhorar as soluções.",
        "message0": "Realizar Cruzamento",
        "nextStatement": null,
        "previousStatement": null,
        "colour": 140
    },
    {
        "type": "Mutacao",
        "tooltip": "Aplica mudanças aleatórias nos cromossomos para aumentar a diversidade.",
        "message0": "Aplicar Mutação",
        "nextStatement": null,
        "previousStatement": "Substituicao",
        "colour": 20
    },
    {
        "type": "Substituicao",
        "tooltip": "Substitui a população antiga pela nova gerada, mantendo os melhores indivíduos.",
        "message0": "Substituir População",
        "previousStatement": null,
        "colour": 190
    }
];


// Definir os blocos no Blockly
Blockly.defineBlocksWithJsonArray(definitions);

// Funções
Blockly.JavaScript['Populacao_Inicial'] = function (block) {
    const valor = block.getFieldValue('QUAN');
    salvarNoLocalStorage('Populacao_Inicial', valor);
    return '';
};

Blockly.JavaScript['Repetir_Ate'] = function (block) {
    const condicaoBloco = block.getInputTargetBlock('CONDICAO');
    if (condicaoBloco) {
        salvarNoLocalStorage('Repetir_Ate', condicaoBloco["type"]);
        const valor = condicaoBloco['inputList'][0]['fieldRow'][1]['value_'];
        if (condicaoBloco["type"] == "Criterio_Parada") {

            salvarNoLocalStorage('Criterio_Parada', valor);
        }
        if (condicaoBloco["type"] == "Geracao") {
            salvarNoLocalStorage('Geracao', valor);
        }
    }
    return '';
};

Blockly.JavaScript['Criterio_Parada'] = function (block) {
    const valor = block.getFieldValue('COLOR');
    salvarNoLocalStorage('Criterio_Parada', valor);
    return '';
};
Blockly.JavaScript['Geracao'] = function (block) {
    const valor = block.getFieldValue('CONDICAO');
    salvarNoLocalStorage('Geracao', valor);
    return '';
};
Blockly.JavaScript['Avaliacao_Aptidao'] = function (block) {
    return '';
};
Blockly.JavaScript['Selecao'] = function (block) {
    const valor = block.getFieldValue('TIPO');
    salvarNoLocalStorage('Selecao', valor);
    return '';
};
Blockly.JavaScript['Cruzamento'] = function (block) {
    return '';
};
Blockly.JavaScript['Mutacao'] = function (block) {
    return '';
};
Blockly.JavaScript['Substituicao'] = function (block) {
    return '';
};
workspace = Blockly.inject('blocklyDiv', {
    toolbox: `
        <xml>
            <block type="Populacao_Inicial"><field name="QUAN">10</field></block>
            <block type="Repetir_Ate"></block>
            <block type="Criterio_Parada"></block>
            <block type="Geracao"></block>
            <block type="Avaliacao_Aptidao"></block>
            <block type="Selecao"></block>
            <block type="Cruzamento"></block>
            <block type="Mutacao"></block>
            <block type="Substituicao"></block>
        </xml>`
});


function verificarOrdem(workspace) {
    const ordemEsperada = [
        "Populacao_Inicial",
        "Repetir_Ate",
        "Avaliacao_Aptidao",
        "Selecao",
        "Cruzamento",
        "Mutacao",
        "Substituicao"
    ];

    let blocoAtual = workspace.getTopBlocks()[0]; // Pega o primeiro bloco superior
    let index = 0;
    let criterioPresente = false; // Verifica se Criterio_Parada ou Geracao está presente

    while (blocoAtual) {
        if (blocoAtual.type !== ordemEsperada[index]) {
            alert(`Erro: Esperado '${ordemEsperada[index]}', mas encontrado '${blocoAtual.type}'`);
            return false;
        }

        // Se o bloco atual for "Repetir_Ate", verificar se há um dos blocos obrigatórios conectados
        if (blocoAtual.type === "Repetir_Ate") {
            let inputBloco = blocoAtual.getInputTargetBlock("CONDICAO"); // Obtém o bloco conectado à entrada CONDICAO
            if (inputBloco && (inputBloco.type === "Criterio_Parada" || inputBloco.type === "Geracao")) {
                criterioPresente = true;
            }
        }

        blocoAtual = blocoAtual.getNextBlock(); // Pega o próximo bloco conectado
        index++;
    }

    if (index === 0) {
        alert("Erro: Nenhum bloco adicionado.");
        return false;
    }

    if (index < ordemEsperada.length) {
        alert("Erro: Nem todos os blocos foram adicionados.");
        return false;
    }

    if (!criterioPresente) {
        alert("Erro: O bloco 'Repetir Ate' precisa ter 'Cor de Parada' ou 'Geracao' conectado.");
        return false;
    }

    return true;
}


function generateCode() {
    Blockly.JavaScript.workspaceToCode(workspace);

}

workspace.addChangeListener(generateCode);
