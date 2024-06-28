function doPost(e) {
    try {
      // Verifique se o corpo da requisição está presente
      if (!e.postData || !e.postData.contents) {
        throw new Error("No post data found");
      }
  
      // Parse the request body
      var data = JSON.parse(e.postData.contents);
  
      // Debug: log the data
      Logger.log(data);
  
      // Open the Google Sheet using its ID
      var sheet = SpreadsheetApp.openById('1AJY5rvXrY_wyUyz18mdHCqPXWwF8yagIYvY_ZcnvcdU').getActiveSheet();
  
      // Debug: log the sheet name to ensure it's opened correctly
      Logger.log(sheet.getName());
  
      // Add a new row with the data received from the POST request
      sheet.appendRow([data.data, data.usuario, data.placa, data.kminicial, data.kmfinal, data.litrosabastecidos]);
  
      // Return a success response
      return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
                           .setMimeType(ContentService.MimeType.JSON);
  
    } catch (error) {
      // Log the error for debugging
      Logger.log(error.toString());
      return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error.toString()}))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  }
  