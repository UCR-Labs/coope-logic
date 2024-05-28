class Echo {
    /**
     * Crea una instancia de Echo.
     */
    constructor() {}
  
    /**
     * Maneja las solicitudes HTTP entrantes y devuelve el mensaje recibido.
     * Si no se proporciona un mensaje en el cuerpo de la solicitud, devuelve un error 400.
     * Si ocurre un error durante el procesamiento de la solicitud, devuelve un error 500.
     * @param {Object} request - El objeto de solicitud HTTP.
     * @param {Object} response - El objeto de respuesta HTTP.
     */
    async handleRequest(request, response) {
      try {
        const message = request.body.message;
  
        if (!message) {
          response.status(400).send({ error: 'Se requiere un mensaje.' });
          return;
        }
  
        response.send({ message });
      } catch (error) {
        console.error('Error interno del servidor:', error);
        response.status(500).send({ error: 'Error interno del servidor.' });
      }
    }
  }
  
  module.exports = Echo;