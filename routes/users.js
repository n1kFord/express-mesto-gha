const router = require('express').Router();
const {
  celebrate, Joi,
} = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, changeUserInfo, changeUserAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:userId', auth, getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), auth, changeUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), auth, changeUserAvatar);

module.exports = router;
