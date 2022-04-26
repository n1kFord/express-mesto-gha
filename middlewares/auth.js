const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ message: 'Ошибка: вы не авторизованы.' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Ошибка: токен уже устарел или является неккоректным.' });
  }

  req.user = payload;
  next();
};
