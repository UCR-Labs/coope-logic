// Importar las dependencias necesarias
import * as functions from 'firebase-functions';

//Incluir todas las clases que desean exportar
export { SQLiteFunctions } from "./src/storage/SQLite";


/**
 * Función Echo que responde con el mismo mensaje recibido en la solicitud.
 * @param {Object} request - El objeto de solicitud HTTP.
 * @param {Object} response - El objeto de respuesta HTTP.
 */

export const echo = functions.https.onRequest((request, response) => {
    const message = request.body.message;
    response.send({ message });
  });