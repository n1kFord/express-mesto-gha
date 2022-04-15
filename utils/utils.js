function handleError(errorName, type) {
  if (type === 'forUsersRequests') {
    switch (errorName) {
      case 'ValidationError': return { message: 'Ошибка: Данные переданы неккоректно.', status: 400 };
      case 'CastError': return { message: 'Ошибка: Пользователь с указанным идентификатором не найден.', status: 404 };
      default: return { message: 'Ошибка: Что-то пошло не так.', status: 500 };
    }
  }
  if (type === 'forCardsRequests') {
    switch (errorName) {
      case 'ValidationError': return { message: 'Ошибка: Данные переданы неккоректно.', status: 400 };
      case 'CastError': return { message: 'Ошибка: Место с указанным идентификатором не найдено.', status: 404 };
      default: return { message: 'Ошибка: Что-то пошло не так.', status: 500 };
    }
  }
  return { message: 'Ошибка: проблема с сервером, попробуйте позже.', status: 500 };
}

module.exports = handleError;
