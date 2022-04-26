const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');

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
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Ошибка: данный ресурс на найден.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.code === 11000) {
    res.status(409).send({ message: 'Ошибка: пользователь с таким e-mail уже существует.' });
  } else if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'TypeError' || err.message === 'Validation failed') {
    res.status(400).send({ message: 'Ошибка: данные переданы неккоректно' });
  } else if (err.message === 'Ошибка: Неправильные почта или пароль.') {
    res.status(401).send({ message: err.message });
  } else {
    res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка: что-то пошло не так.' : message });
  }
});

app.use(errors());

app.listen(PORT);
