exports.doesExist = function doesExist(variable, value) {
    try {
        variable = value;
    } catch (e) {
        logger.info('No ' + variable + ' skipping..');
    }
};
