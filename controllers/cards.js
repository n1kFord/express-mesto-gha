const Card = require('../models/card');
const handleError = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка: Что-то пошло не так.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const answer = handleError(err.name, 'forCardsRequests');
      res.status(answer.status).send({ message: answer.message });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Ошибка: Место с указанным идентификатором не найдено' });
      } else {
        res.send({ message: 'Место успешно удалено.' });
      }
    })
    .catch((err) => {
      const answer = handleError(err.name, 'forCardsRequests');
      res.status(answer.status).send({ message: answer.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Ошибка: Место с указанным идентификатором не найдено' });
      } else {
        res.send({ message: 'Лайк успешно добавлен.' });
      }
    })
    .catch((err) => {
      const answer = handleError(err.name, 'forCardsRequests');
      res.status(answer.status).send({ message: answer.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Ошибка: Место с указанным идентификатором не найдено' });
      } else {
        res.send({ message: 'Лайк успешно убран.' });
      }
    })
    .catch((err) => {
      const answer = handleError(err.name, 'forCardsRequests');
      res.status(answer.status).send({ message: answer.message });
    });
};
