exports.doesExist = function doesExist(value) {
  try {
    JSON.parse(value);
  } catch (error) {
    return false;
  }
  return true;
};
