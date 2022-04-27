const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate, Joi, errors,
} = require('celebrate');

const NotFoundError = require('./errors/not-found-error');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string()
    // eslint-disable-next-line no-useless-escape
      .regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&amp;\/=]*)/)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ошибка: данный ресурс не найден.'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;
  if (err.code === 11000) {
    res.status(409).send({ message: 'Ошибка: пользователь с таким e-mail уже существует.' });
  } else if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'TypeError') {
    res.status(400).send({ message: 'Ошибка: данные переданы неккоректно' });
  } else if (err.message === 'Ошибка: Неправильные почта или пароль.') {
    res.status(401).send({ message: err.message });
  } else {
    res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка: что-то пошло не так.' : message });
  }
});

app.listen(PORT);
