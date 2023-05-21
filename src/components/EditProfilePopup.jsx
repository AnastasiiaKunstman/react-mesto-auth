import { useState, useEffect, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, onLoading }) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    //Подписка на контекст
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about)
    }, [currentUser, isOpen]);

    function handleChangeName(evt) {
        setName(evt.target.value)
    };

    function handleChangeDescription(evt) {
        setDescription(evt.target.value)
    };

    function handleSubmit(evt) {
        // Запрещаем браузеру переходить по адресу формы
        evt.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name,
            about: description,
        })
    };

    return (
        <PopupWithForm
            name="profile"
            title="Редактировать профиль"
            buttonText={onLoading ? `Сохранение...` : `Сохранить`}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                id="input-username"
                required=""
                type="text"
                minLength={2}
                maxLength={40}
                name="username"
                className="popup__input popup__input_field_name"
                placeholder="Имя"
                onChange={handleChangeName}
                value={name || ''}
            />
            <span id="input-username-error" className="popup__input-error" />
            <input
                id="input-job"
                required=""
                type="text"
                minLength={2}
                maxLength={200}
                name="job"
                className="popup__input popup__input_field_job"
                placeholder="О себе"
                onChange={handleChangeDescription}
                value={description || ''}
            />
            <span id="input-job-error" className="popup__input-error" />
        </PopupWithForm>
    )
};

export default EditProfilePopup;