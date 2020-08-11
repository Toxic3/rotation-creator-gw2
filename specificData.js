var dataImport = require("./dataImport.js");
var dataImportation = dataImport.dataImportation;
var sendReq = dataImport.sendReq;

function specificData(accessToken, charName) {
    var dataImported = dataImportation(accessToken, charName);
    console.log(dataImported);
}

function allChars(accessToken) {
    var charNames = JSON.parse(sendReq("characters?access_token=" + accessToken));
    for (var i = 0; i < charNames.length; i++) {
        specificData(accessToken, charNames[i]);
    }
}

allChars("2D1A46F9-05CD-9746-86E5-730ED5D3929BB9C60127-5ADF-477A-B284-3215C3B12C42");
//specificData("2D1A46F9-05CD-9746-86E5-730ED5D3929BB9C60127-5ADF-477A-B284-3215C3B12C42", "Alcoholic Toxic");