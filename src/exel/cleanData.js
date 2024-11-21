const fs = require('fs');

// Leer el archivo JSON generado
const rawData = require('../exel/productos.json'); // Cambia a la ruta de tu archivo JSON

// Filtrar y transformar los datos
const cleanedData = rawData
  .filter((item) => item.__EMPTY && item.__EMPTY_3) // Filtra filas con datos útiles
  .map((item, index) => ({
    id: index + 1, // Genera un ID único
    classification: item.__EMPTY_1,
    code: item.__EMPTY_2,
    name: item.__EMPTY_3,
    unit: item.__EMPTY_4,
  }));

// Guardar los datos limpios como un nuevo archivo JSON
fs.writeFileSync('./productos_limpios.json', JSON.stringify(cleanedData, null, 2), 'utf-8');

console.log('Datos limpios guardados en productos_limpios.json');
