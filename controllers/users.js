const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ошибка: Пользователь с указанным идентификатором не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    next(new BadRequestError('Ошибка: неккоректный e-mail.'));
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => {
        res.send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        });
      })
      .catch(next);
  }
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    next(new BadRequestError('Ошибка: данные переданы неккоректно.'));
  } else {
    User.findByIdAndUpdate(req.user._id, { name: `${name}`, about: `${about}` }, { new: true, runValidators: true, upsert: false })
      .then((user) => res.send({ data: user }))
      .catch(next);
  }
};

module.exports.changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    next(new BadRequestError('Ошибка: данные переданы неккоректно.'));
  } else {
    User.findByIdAndUpdate(req.user._id, { avatar: `${avatar}` }, { new: true, runValidators: true, upsert: false })
      .then((user) => res.send({ data: user }))
      .catch(next);
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ошибка: Пользователь с указанным идентификатором не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    next(new BadRequestError('Ошибка: неккоректный e-mail.'));
  } else {
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-dev-secret', { expiresIn: '7d' });
        res.send({ token });
      })
      .catch(next);
  }
};
