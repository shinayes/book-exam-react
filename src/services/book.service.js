import http from "../http-common";

class BookDataService {
  constructor() {
    this.serviceBaseURL = "/books";
  }

  mapLocation(location, path = []) {
    if (path.length == 0) {
      path.push(location.name)
    }

    if (location.parentLocation) {
      path.push(location.parentLocation.name);
      if (location.parentLocation.parentLocation) {
        this.mapLocation(location.parentLocation, path)
      }
    }
    return path; 
  }

  async getAll() {
    return http.get(this.serviceBaseURL);
  }

  get(id) {
    return http.get(`${this.serviceBaseURL}/${id}`);
  }

  create(data) {
    console.log(data);
    return http.post(this.serviceBaseURL, data);
  }

  update(id, data) {
    return http.put(`${this.serviceBaseURL}/${id}`, data);
  }

  delete(id) {
    return http.delete(`${this.serviceBaseURL}/${id}`);
  }
}

export default new BookDataService()