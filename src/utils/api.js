class Api {
    constructor(config) {
        this._baseUrl = config.baseUrl;
        this._headers = config.headers;
    };


    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
    };

    _request(url, options) {
        return fetch(url, options).then((res) => this._checkResponse(res));
    };


    //Информация о пользователе
    getUserInfo() {
        return this._request(`${this._baseUrl}/users/me`, {
            headers: this._headers
        })
    };

    //Картинки с сервера
    getInitialCards() {
        return this._request(`${this._baseUrl}/cards`, {
            headers: this._headers,
        })
    };


    //Редактирование информации о пользователе
    changeUserInfo(name, about) {
        return this._request(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: name,
                about: about,
            }),
        })
    };


    //Создать новую карточку
    addNewCard(data) {
        return this._request(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(data)
        })
    };

    //Изменение аватара
    changeAvatar(avatar) {
        return this._request(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: avatar
            }),
        })
    };

    //Удаление карточки
    deleteCard(cardId) {
        return this._request(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
        })
    };

    //Лайк
    changeLikeCardStatus(cardId, isLiked) {
        return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: isLiked ? 'PUT' : 'DELETE',
            headers: this._headers,
        })
    };
};


const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-62',
    headers: {
        authorization: '66f0fc0f-5294-4ede-9d73-f86f3fdca69e',
        'content-type': 'application/json'
    },
});

export default api;