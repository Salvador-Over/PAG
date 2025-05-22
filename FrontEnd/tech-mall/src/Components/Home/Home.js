import React from 'react';
import Header from '../Header/Header';
import NavBanner from '../NavBanner/NavBanner';
import MostrarProd from '../MostrarProd/MostrarProd';
import Footer from '../Footer/Footer';
import './Home.css';

const Home = () => {
  const imagesUrl = [
    "https://elektragt.vtexassets.com/arquivos/ids/195697/1737-CONSOLA-PS5-BUNDL-DIGITAL-SLIM-182010--1-.jpg?v=638513277009500000",
    "https://media.wired.com/photos/5fa5dc3dba670daaf8e97a8d/master/pass/games_gear_series-x.jpg",
    "https://i.ebayimg.com/thumbs/images/g/rIIAAOSwXCVkEY8o/s-l1200.jpg",
  ];

  return (
    <div className="home-container">
      <Header />
      <NavBanner images={imagesUrl} />
      <MostrarProd />
      <Footer />
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  );
};

export default Home;