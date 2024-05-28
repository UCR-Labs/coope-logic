const axios = require('axios');

/**
 * Obtiene el geocode a partir de una ubicación (latitud y longitud).
 * @param {string} location - La ubicación en formato 'latitud,longitud'.
 * @param {string} apiKey - La clave de la API de Google.
 * @returns {Promise<Object>} - Un objeto JSON con la dirección formateada.
 */
const geocode = async (location, apiKey) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=${apiKey}&language=es`;
  try {
    const result = await axios.get(url);
    if (result.data.results.length > 0) {
      return { address: result.data.results[0].formatted_address };
    } else {
      throw new Error('No address found');
    }
  } catch (error) {
    throw new Error('Server error');
  }
};

module.exports = { geocode };