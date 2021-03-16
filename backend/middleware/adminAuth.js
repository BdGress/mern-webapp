const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,"secret");
    const id = decodedToken.id;
    const isAdmin = decodedToken.isAdmin;
    
      if(isAdmin){
      User.findById(id)
        .then(next())
        .catch(err => res.status(400).json('Invalid Id'));
      } else {
        throw 'Invalid Admin ID';
      }

  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};





      
    
 