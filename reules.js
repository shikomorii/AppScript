function processAndSumUp() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const processedSheetName = 'ProcessedData';
    let processedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(processedSheetName);

    // Criar a aba "ProcessedData" se não existir
    if (!processedSheet) {
        processedSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(processedSheetName);
    }

    const dataRange = sheet.getDataRange();
    const data = dataRange.getValues();

    let newData = [];
    let indexMap = {};

    // Verificar se a coluna "Soma F" já existe
    let header = data[0];
    let hasSumColumn = header.includes('Soma F');

    // Se a coluna "Soma F" já existe, não adicioná-la novamente
    if (!hasSumColumn) {
        header.push('Soma F');
    }

    newData.push(header);

    // Processando os dados
    for (let i = 1; i < data.length; i++) {
        let row = data[i];
        // Limpa e uniformiza as células B a E antes de criar a chave
        let processedCells = row.slice(1, 5).map(cell =>
            (cell === null || cell === '') ? '' : cell.toString().trim()
        );
        let key = processedCells.join('|');

        if (key.replace(/\|/g, '') !== '') { // Checa se a chave não é inteiramente vazia 
            let valueInF = parseFloat(row[5]) || 0; // Assegura que F é numérico

            if (key in indexMap) {
                // Soma o valor de F se a chave já existe
                let existingRow = newData[indexMap[key]];
                let existingSum = parseFloat(existingRow[7]) || 0; // Coluna G (índice 7)
                existingRow[7] = existingSum + valueInF;
            } else {
                // Nova entrada, guarda o índice onde a linha será colocada
                indexMap[key] = newData.length;
                // Insere a nova linha no array newData, copiando as células de A até E, mantém F e adiciona a soma inicial em G
                let newRow = [new Date(), ...processedCells, row[5], valueInF];
                newData.push(newRow);
            }
        }
    }

    // Adiciona os dados processados à aba "ProcessedData"
    let processedRange = processedSheet.getDataRange();
    let processedData = processedRange.getValues();
    let lastRow = processedData.length;

    // Escreve novos dados processados na aba "ProcessedData"
    processedSheet.getRange(lastRow + 1, 1, newData.length - 1, newData[0].length).setValues(newData.slice(1));

    // Ajustar a formatação da coluna A para data
    processedSheet.getRange(lastRow + 1, 1, newData.length - 1, 1).setNumberFormat("dd/MM/yyyy");

    // Limpa a planilha original para inserir novos dados para processamento
    sheet.clearContents();
    // Mantém o cabeçalho original
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
}
