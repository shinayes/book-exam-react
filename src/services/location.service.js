import http from "../http-common";

class LocationDataService {
  constructor() {
    this.serviceBaseURL = "/locations";
  }

  mapLocation(location, path = []) {
    if (location.parentLocation) {
      path.push(location.parentLocation.name);
      if (location.parentLocation.parentLocation) {
        this.mapLocation(location.parentLocation, path)
      }
    }
    return path; 
  }

  getAll() {
    http.get(this.serviceBaseURL);


    return http.get(this.serviceBaseURL);
  }

  get(id) {
    return http.get(`${this.serviceBaseURL}/${id}`);
  }

  create(data) {
    return http.post(this.serviceBaseURL, data);
  }

  update(id, data) {
    return http.put(`${this.serviceBaseURL}/${id}`, data);
  }

  delete(id) {
    return http.delete(`${this.serviceBaseURL}/${id}`);
  }
}

export default new LocationDataService()