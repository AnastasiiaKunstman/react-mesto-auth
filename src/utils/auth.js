class Auth {
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
        return fetch(url, options).then(this._checkResponse)
    };


    //регистрация
    register(email, password) {
        return this._request(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ email, password }),
        })
    };


    //вход
    login(email, password) {
        return this._request(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ email, password }),
        })
    };


    //проверка токена
    checkToken(token) {
        return this._request(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
    };
};

const auth = new Auth({
    baseUrl: "https://auth.nomoreparties.co",
    headers: {
        "Content-Type": "application/json",
    },
});

export default auth;