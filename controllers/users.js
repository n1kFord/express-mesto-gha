const User = require('../models/user');
const handleError = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка: Что-то пошло не так.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Ошибка: Пользователь с указанным идентификатором не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      const answer = handleError(err.name, 'forUsersRequests');
      res.status(answer.status).send({ message: answer.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const answer = handleError(err.name, 'forUsersRequests');
      res.status(answer.status).send({ message: answer.message });
    });
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  if (name === undefined || about === undefined) {
    res.status(400).send({ message: 'Ошибка: Данные переданы неккоректно.' });
  } else {
    User.findByIdAndUpdate(req.user._id, { name: `${name}`, about: `${about}` }, { new: true, runValidators: true, upsert: false })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        const answer = handleError(err.name, 'forUsersRequests');
        res.status(answer.status).send({ message: answer.message });
      });
  }
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (avatar === undefined) {
    res.status(400).send({ message: 'Ошибка: Данные переданы неккоректно.' });
  } else {
    User.findByIdAndUpdate(req.user._id, { avatar: `${avatar}` }, { new: true, runValidators: true, upsert: false })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        const answer = handleError(err.name, 'forUsersRequests');
        res.status(answer.status).send({ message: answer.message });
      });
  }
};
