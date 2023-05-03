import React, { Component } from "react";
import LocationDataService from "../../services/location.service";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { FaFolder } from 'react-icons/fa'

export default class LocationsList extends Component {
  constructor(props) {
    super(props);

    this.retrieveLocations = this.retrieveLocations.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveLocation = this.setActiveLocation.bind(this);
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

    this.state = {
      locations: [],
      currentLocation: null,
      currentIndex: -1,
      currentParentLocation: null,
      show: false,
      locationDetails: {
        id: null,
        name: '',
        parentId: null
      },
      optionLocations: []
    };
  }

  componentDidMount() {
    this.retrieveLocations()
  }

  retrieveLocations() {
    LocationDataService.getAll()
      .then(response => {
        this.setState({
          locations: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  optionLocations() {
    let locations = this.state.locations ?? []
    if (locations.length > 0) {
      locations = locations.map((location, index) => {
        return {
          value: location.id,
          label: location.name
        }
      })
    }

    this.setState({
      optionLocations: locations
    });
  }

  refreshList() {
    this.retrieveLocations();
    this.setState({
      currentLocation: null,
      currentIndex: -1
    });
  }

  setActiveLocation(location, index) {
    this.setState({
      currentLocation: location,
      currentIndex: index
    });
  }

  handleClose() {
    this.setState({ show: false })
  }

  handleShow(updateData = null) {
    this.optionLocations()
    if (updateData) {
      this.setState({
        locationDetails: {
          id: updateData.id,
          name: updateData.name,
          parentId: updateData.parentLocation?.id
        },
        currentParentLocation: updateData.parentLocation
      });
    }
    this.setState({ show: true });
  }

  handleSubmit() {
    if (this.state.locationDetails.id) {
      LocationDataService.update(this.state.locationDetails.id, this.state.locationDetails)
        .then(response => {
          this.refreshList();
          this.setState({ show: false });
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      LocationDataService.create(this.state.locationDetails)
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
    LocationDataService.delete(this.state.locationDetails.id)
      .then(response => {
        this.refreshList();
        this.setState({ show: false });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { locations, optionLocations, currentLocation, currentIndex, currentParentLocation, show, locationDetails } = this.state;

    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-header position-relative">
            Location List
            <button className="btn btn-primary position-absolute end-2" onClick={this.handleShow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
              </svg>
            </button>
          </div>

          <div className="card-body row">
            {locations ?
              locations.map((location, index) => {
                let arrayPath = LocationDataService.mapLocation(location)
                return (
                  <div onClick={() => this.handleShow(location)} className="col-sm-3 col-md-2 col-lg-2 mb-2" data-marker-id="59c0c8e33b1527bfe2abaf92">
                    <div className="card h-100 border-0 shadow postion-relative">
                      <div className="card-body" >
                        <span className="items-center"><FaFolder /></span>
                        <h5 className="card-title" onClick={() => this.handleShow(location)}><a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">{location.name}</a></h5>

                        <div className="row" aria-label="Breadcrumb">
                          {arrayPath &&
                            arrayPath.reverse().map((path, index2) => {
                              if (index2 == 0) {
                                return (
                                  <div className="flex items-center hover-animate">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                    <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"> {path}</a>
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
                  </div>
                )
              }
              ) : (<div>
                <br />
                <p>Please add a new location...</p>
              </div>)
            }
          </div>

          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{locationDetails.id ? 'Update Location' : 'Create Location'}</Modal.Title>
              {locationDetails.id && (
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
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    defaultValue={locationDetails.name}
                    placeholder="Please enter location name..."
                    autoFocus
                    onChange={(e) => {
                      locationDetails.name = e.target.value
                      this.setState({ locationDetails: locationDetails })
                    }}
                  />
                </Form.Group>
                <Form.Label>Directory</Form.Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={{ label: currentParentLocation?.name, value: currentParentLocation?.id } || { label: "Please select location...", value: "" }}
                  isLoading={false}
                  isClearable={true}
                  isSearchable={true}
                  name="Location"
                  onChange={(e) => {
                    locationDetails.parentId = e?.value ?? null
                    this.setState({ locationDetails: locationDetails })
                  }}
                  placeholder="Please select location..."
                  options={optionLocations}
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