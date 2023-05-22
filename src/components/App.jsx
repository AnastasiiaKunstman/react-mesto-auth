import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import DelCardPopup from './DelCardPopup';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Register from './Register';

import { CurrentUserContext } from '../contexts/CurrentUserContext';

import api from '../utils/api';
import auth from '../utils/auth';


function App() {
  //попап редактирования профиля
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  //попап добавления новых карточек
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  //попап аватара
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  //попап увеличения карточки
  const [selectedCard, setSelectedCard] = useState(null);
  //попап удаления карточки
  const [deletedCard, deletePopup] = useState(null);
  const [isDelCardPopupOpen, setIsDelCardPopupOpen] = useState(false);
  //попап успешного/неуспешного входа
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // current user
  const [currentUser, setCurrentUser] = useState({});
  //карточки
  const [cards, setCards] = useState([]);
  //текст кнопки
  const [isLoading, setIsLoading] = useState(false);
  //статус входа
  const [loggedIn, setLoggedIn] = useState(false);
  //email
  const [email, setEmail] = useState('');

  const navigate = useNavigate();


  //Получаем информацию с сервера
  useEffect(() => {
    if (loggedIn) {
      //данные юзера и карточки с сервера
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, cards]) => {
          //данные профиля с сервера
          setCurrentUser(userInfo);
          //карточки с сервера
          setCards(cards);
        })
        .catch((err) => alert(err));
    }
  }, [loggedIn]);


  //обработчики событий
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);
  const handleDelCardClick = (card) => {
    setIsDelCardPopupOpen(true);
    deletePopup(card)
  };

  //закрытие всех попапов
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDelCardPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard(null)
  };

  //Редактировать информацию о пользователе
  function handleUpdateUser(userData) {
    setIsLoading(true);
    api.changeUserInfo(userData.name, userData.about)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  //Редактировать аватар
  function handleUpdateAvatar(userData) {
    setIsLoading(true);
    api.changeAvatar(userData.avatar)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  //Лайки
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(`Ошибка изменения статуса лайка: ${err}`))
  };

  //Удаление
  function handleCardDelete(card) {
    setIsLoading(true);
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards => cards.filter((c) => c._id !== card._id));
        closeAllPopups()
      })
      .catch(err => console.log(`Ошибка при удалении карточки: ${err}`))
      .finally(() => setIsLoading(false))
  };

  //Добаление новой карточки
  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api.addNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  //Регистрация пользователя
  function onRegister(email, password) {
    setIsLoading(true);
    auth.register(email, password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setEmail(email);
          navigate('/sign-in', { replace: true });
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
        setIsInfoTooltipPopupOpen(true);
      })
  };

  //Вход
  function onLogin(email, password) {
    setIsLoading(true);
    auth.login(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          setLoggedIn(true);
          setEmail(email);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        console.log(err);
      })
      .finally(() => setIsLoading(false))
  };

  //проверка токена и авторизация пользователя
  const tokenCheck = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.data.email);
            // авторизуем пользователя
            setLoggedIn(true);
            navigate('/', { replace: true });
          }
        })
        .catch(console.error);
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  // Выход
  const onSignOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/sign-in');
  };

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div>
          <Header email={email} onSignOut={onSignOut} />

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute path="/" loggedIn={loggedIn}>
                  <Main
                    element={Main}
                    loggedIn={loggedIn}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleDelCardClick}
                  />
                  <Footer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sign-in"
              element={
                <Login
                  loggedIn={loggedIn}
                  onLogin={onLogin}
                  tokenCheck={tokenCheck}
                  isLoading={isLoading}
                />
              }
            />

            <Route
              path="/sign-up"
              element={
                <Register
                  loggedIn={loggedIn}
                  onRegister={onRegister}
                  isLoading={isLoading}
                />
              }
            />

            <Route
              path="*"
              element={
                loggedIn ? <Navigate to="/" /> : <Navigate to="./sign-up" />
              }
            />
          </Routes>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            onLoading={isLoading}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            onLoading={isLoading}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
            onLoading={isLoading}
          />

          <DelCardPopup
            isOpen={isDelCardPopupOpen}
            onClose={closeAllPopups}
            card={deletedCard}
            onDelCard={handleCardDelete}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />

          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccess}
          />

        </div>

      </CurrentUserContext.Provider>
  );
};

export default App;