exports.token = function token(req, res, next) {
    console.log('middleware');
    console.log('token' + token);
    const fetchOptions = {
      headers: {
        'Authorization': token,
        'Accept' : 'application/json'
      }
    };

    serviceIdentifier = 'Swarm'; // TODO!
    next();
};
