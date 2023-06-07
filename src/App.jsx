import { useEffect } from 'react';
import './App.scss';
import { fetchDataFromApi } from './util/api';
import { useDispatch, useSelector } from "react-redux";
import { getApiConfiguration, getGenres } from './store/homeSlice';

import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Detail from "./pages/detail/Detail";
import Explore from "./pages/explore/Explore";
import SearchResult from "./pages/searchResult/SearchResult";
import PageNotFound from "./pages/404/PageNotFound";
import Header from "./component/header/Header";
import Footer from "./component/footer/Footer";
import { all } from 'axios';


function App() {
  const dispatch = useDispatch();
  //const { url } = useSelector((state) => state.home);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi('/configuration').then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original"
      }
      dispatch(getApiConfiguration(url));
    })
  }

  const genresCall = async () => {
    let promises = [];
    let endpoints = ['tv', 'movie'];
    let allGenres = {};
    endpoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    })

    const data = await Promise.all(promises);

    data.map(({ genres }) => {
      return genres.map((item) => {
        return allGenres[item.id] = item
      });
    });
    dispatch(getGenres(allGenres));

  }


  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Detail />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>

  )
}

export default App
