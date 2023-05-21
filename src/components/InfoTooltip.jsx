import React from 'react';
import successIcon from '../images/Union.svg';
import failIcon from '../images/fail-icon.svg';

function InfoTooltip({ isOpen, onClose, isSuccess }) {

    //Закрытие по оверлею
    function handleClickClose(evt) {
        if (evt.target.classList.contains('popup_opened')) {
            onClose();
        }
    };

    return (
        <div className={`popup tip-popup ${isOpen ? "popup_opened" : ""}`} onClick={handleClickClose}>
            <div className="popup__container">
                <button type="button" className="popup__close" onClick={onClose} aria-label="Зыкрыть форму" />
                <img className="popup__notification_image" src={`${isSuccess ? successIcon : failIcon}`} alt="" />
                <h2 className="popup__notification_title">{`${isSuccess ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}`}</h2>
            </div>
        </div>
    );
}

export default InfoTooltip;