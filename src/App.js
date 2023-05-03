import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import LocationsList from "./components/locations/locations-list.component";
import BooksList from "./components/books/books-list.component";
import { Header } from "./components/header";

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<LocationsList/>} />
            <Route path="/locations" element={<LocationsList/>} />
            <Route path="/books" element={<BooksList/>} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;