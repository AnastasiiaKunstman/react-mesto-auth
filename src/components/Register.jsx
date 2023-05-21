import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister, loggedIn, isLoading }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //изменение инпутов
    function handleChangeEmail(evt) {
        setEmail(evt.target.value);
    };
    function handleChangePassword(evt) {
        setPassword(evt.target.value);
    };

    //отправка формы
    function handleSubmit(evt) {
        evt.preventDefault();
        onRegister(email, password);
    };

    return (
        !loggedIn && (
            <div className="auth">
                <form name="register" className="auth__form" onSubmit={handleSubmit}>
                    <h2 className="auth__title">Регистрация</h2>
                    <label>
                        <input
                            className="auth__input auth__input_type_email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleChangeEmail}
                            required
                        />
                        <span className="auth__input-error" />

                        <input
                            className="auth__input auth__input_type_password"
                            name="password"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            minLength="4"
                            maxLength="15"
                            onChange={handleChangePassword}
                            required
                        />
                        <span className="auth__input-error" />
                    </label>
                    <button type="submit" className="auth__button-submit" aria-label="Зарегистрироваться">
                        {!isLoading ? 'Зарегистрироваться' : 'Загрузка...'}
                    </button>
                </form>
                <div className="auth__signup">
                    <p className="auth__text">Уже зарегистрированы?</p>
                    <Link to="/sign-in" className="auth__button">
                        Войти
                    </Link>
                </div>
            </div>
        )
    );
};

export default Register;