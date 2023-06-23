import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import MyTable from './Components/Table';
import rootReducer from './Redux/rootReducer';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
});

function App() {
  return (
    <Provider store={store}>
      <div>
        <Header />
        <MyTable />
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
