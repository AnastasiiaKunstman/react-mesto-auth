import React, { useState } from 'react';

function Login({ onLogin, isLoading, loggedIn }) {
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
        onLogin(email, password);
    };

    return (
        !loggedIn && (
            <div className="auth">
                <form name="login" className="auth__form" noValidate onSubmit={handleSubmit} >
                    <h2 className="auth__title">Вход</h2>

                    <input
                        className="auth__input auth__input_type_email"
                        name="email"
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={handleChangeEmail}
                        required
                    />
                    <span className="auth__input-error" />

                    <input
                        className="auth__input auth__input_type_password"
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Пароль"
                        minLength="4"
                        maxLength="15"
                        onChange={handleChangePassword}
                        required
                    />
                    <span className="auth__input-error" />

                    <button className="auth__button-submit" type="submit" aria-label="Войти">
                        {!isLoading ? 'Войти' : 'Секундочку...'}
                    </button>

                </form>
            </div>
        )
    );
}

export default Login;