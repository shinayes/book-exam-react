import React, { Component } from "react";
import BookDataService from "../../services/book.service";
import LocationDataService from "../../services/location.service";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';

export default class BooksList extends Component {
  constructor(props) {
    super(props);

    this.retrieveBooks = this.retrieveBooks.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveBook = this.setActiveBook.bind(this);
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

    this.state = {
      books: [],
      locations: [],
      currentBook: null,
      currentIndex: -1,
      show: false,
      bookDetails: {
        id: null,
        title: '',
        author: '',
        locationId: null
      }
    };
  }

  componentDidMount() {
    this.retrieveBooks();
    this.retrieveLocations();
  }

  retrieveBooks() {
    BookDataService.getAll()
      .then(response => {
        this.setState({
          books: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveLocations() {
    LocationDataService.getAll()
      .then(response => {
        let locations = response.data ?? []
        if (locations.length > 0) {
          locations = locations.map((location, index) => {
            return {
              value: location.id,
              label: location.name
            }
          })
        }

        this.setState({
          locations: locations
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveBooks();
    this.setState({
      currentBook: null,
      currentIndex: -1
    });
  }

  setActiveBook(book, index) {
    this.setState({
      currentBook: book,
      currentIndex: index
    });
  }

  handleClose() {
    this.setState({ show: false })
  }

  handleShow(updateData = null) {
    if (updateData) {
      this.setState({
        bookDetails: {
          id: updateData.id,
          title: updateData.title,
          author: updateData.author,
          locationId: updateData.location?.id
        }
      });
    }
    console.log(this.state.bookDetails);
    console.log(this.state.show);
    this.setState({ show: true });
  }

  handleSubmit() {
    if (this.state.bookDetails.id) {
      BookDataService.update(this.state.bookDetails.id, this.state.bookDetails)
        .then(response => {
          this.refreshList();
          this.setState({ show: false });
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      BookDataService.create(this.state.bookDetails)
        .then(response => {
          this.refreshList();
          this.setState({ show: false });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  handleDelete() {
    BookDataService.delete(this.state.bookDetails.id)
      .then(response => {
        this.refreshList();
        this.setState({ show: false });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { books, locations, currentBook, currentIndex, show, bookDetails } = this.state;

    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-header position-relative">
            Book List
            <button className="btn btn-primary position-absolute end-2" onClick={this.handleShow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
              </svg>
            </button>
          </div>

          <div className="card-body row">
            {books ?
              books.map((book, index) => {
                let arrayPath = BookDataService.mapLocation(book.location)
                return (<div className="col-sm-4 col-md-3 col-lg-3 mb-5" data-marker-id="59c0c8e33b1527bfe2abaf92">
                  <div className="card h-100 border-0 shadow postion-relative">
                    <img onClick={() => this.handleShow(book)} src="https://picsum.photos/200" className="card-img-top overflow-hidden dark-overlay bg-cover h-30 hover-animate" alt="..."></img>
                    <div className="card-body items-center">
                      <h5 className="card-title" onClick={() => this.handleShow(book)}><a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">{book.title}</a></h5>
                      <p className="text-sm text-muted mb-3"> Cupidatat excepteur non dolore laborum et quis nostrud veniam dolore deserunt. Pariatur dolore ut in elit id nulla. Irur...</p>
                      <p className="text-sm text-muted text-uppercase mb-1">By <a href="#" className="text-dark">{book.author}</a></p>

                      <div className="row" aria-label="Breadcrumb">
                        {arrayPath &&
                          arrayPath.reverse().map((path, index2) => {
                            if (index2 == 0) {
                              return (
                                <div className="flex items-center hover-animate">
                                  <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white pl-2"> {path}</a>
                                </div>
                              );
                            } else if (index2 == arrayPath.length - 1) {
                              return (
                                <div className="flex items-center hover-animate">
                                  <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ">{path}</span>
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex items-center hover-animate">
                                  <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                  <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">{path}</a>
                                </div>
                              );
                            }
                          }
                          )}
                      </div>

                    </div>
                  </div>
                </div>)
              }
              ) : (<div>
                <br />
                <p>Please add a new book...</p>
              </div>)
            }
          </div>

          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{bookDetails.id ? 'Update Book' : 'Create Book'}</Modal.Title>
              {bookDetails.id && (
                <button className="btn btn-secondary position-absolute end-2" onClick={this.handleDelete}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                  </svg>
                </button>
              )}

            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    defaultValue={bookDetails.title}
                    placeholder="Please enter book title..."
                    autoFocus
                    onChange={(e) => {
                      bookDetails.title = e.target.value
                      this.setState({ bookDetails: bookDetails })
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    defaultValue={bookDetails.author}
                    placeholder="Please enter book author..."
                    autoFocus
                    onChange={(e) => {
                      bookDetails.author = e.target.value
                      this.setState({ bookDetails: bookDetails })
                    }}
                  />
                </Form.Group>
                <Form.Label>Directory</Form.Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={{ label: bookDetails.title, value: bookDetails.id } || { label: "Please select location...", value: "" }}
                  isLoading={false}
                  isClearable={true}
                  isSearchable={true}
                  name="Location"
                  onChange={(e) => {
                    bookDetails.locationId = e?.value ?? null
                    this.setState({ bookDetails: bookDetails })
                  }}
                  placeholder="Please select location..."
                  options={locations}
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={this.handleClose}>Close</button>
              <button className="btn btn-primary" onClick={this.handleSubmit}>Save</button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
} 