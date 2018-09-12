exports.doesExist = function doesExist(variable, value) {
    try {
        variable = value;
    } catch (e) {
        logger.info('No ' + variable + ' skipping..');
    }
};


// This needs more thought to be implemented.
