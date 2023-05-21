import React from "react";

function ImagePopup({ card, onClose }) {

    //Закрытие по оверлею
    function handleClickClose(evt) {
        if (evt.target.classList.contains('popup_opened')) {
            onClose();
        }
    };

    return (
        <div className={`popup popup_image-open image-popup ${card ? "popup_opened" : ""}`} onClick={handleClickClose}>
            <div className="popup__container popup__container_image-popup ">
                <button type="button" className="popup__close" onClick={onClose} aria-label="Зыкрыть форму" />
                <img src={card ? card.link : ""} alt={card ? card.name : ""} className="popup__photo-image" />
                <h2 className="popup__title-image">{card ? card.name : ""}</h2>
            </div>
        </div>
    )
};

export default ImagePopup;