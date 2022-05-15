const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((cardInfo) => {
      if (cardInfo === null) {
        throw new NotFoundError('Ошибка: Место с указанным идентификатором не найдено');
      } else if (cardInfo.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            res.send({ message: 'Место успешно удалено.' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Ошибка: вы не можете удалить чужое место.');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true, upsert: false },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Ошибка: Место с указанным идентификатором не найдено');
      } else {
        res.send({ message: 'Лайк успешно добавлен.', data: card });
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true, upsert: false },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Ошибка: Место с указанным идентификатором не найдено');
      } else {
        res.send({ message: 'Лайк успешно убран.', data: card });
      }
    })
    .catch(next);
};
