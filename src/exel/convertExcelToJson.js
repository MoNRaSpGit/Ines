const xlsx = require('xlsx');
const fs = require('fs');

// Leer el archivo Excel
const workbook = xlsx.readFile('direcion del archivo');
const sheetName = workbook.SheetNames[0]; // Nombre de la primera hoja
const sheet = workbook.Sheets[sheetName];

// Convertir la hoja a JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Guardar los datos como archivo JSON
fs.writeFileSync('./productos.json', JSON.stringify(jsonData, null, 2), 'utf-8');

console.log('Archivo convertido y guardado como productos.json');
