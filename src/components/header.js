
import React from "react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <nav className="navbar navbar-expand">
      <Link to={"/locations"} className="navbar-brand pl-4">
        Book Management
      </Link>
      <div className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to={"/locations"} className="nav-link">
            Locations
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/books"} className="nav-link">
            Books
          </Link>
        </li>
      </div>
      {/* <form className="d-flex pr-4" role="search">
      <input className="form-control me-2 " type="search" placeholder="Search" aria-label="Search"></input>
      <button className="btn btn-outline-success" type="submit">Search</button>
    </form> */}
    </nav>
  )
}