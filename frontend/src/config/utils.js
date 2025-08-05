// src/config/utils.js

/**
 * Checks if a given object is a valid object and has a non-empty '_id' property.
 * Useful for robustly checking if a user or message sender object is properly defined.
 * @param {Object} obj - The object to validate.
 * @returns {boolean} True if the object is valid and has an _id, false otherwise.
 */
export const isObjectAndHasId = (obj) => {
  return obj && typeof obj === 'object' && typeof obj._id === 'string' && obj._id.length > 0;
};