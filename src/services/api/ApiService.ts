import server from "@/plugins/axiosMiddleware";

export class ApiService {
  controller: string;
  constructor(controller: string) {
    this.controller = controller + "/";
  }
  protected getAll(method = "GetAll", headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      server
        .get(this.controller + `${method}`, {
          headers,
        })
        .then((response) => {
          if (response.status === 204) {
            // Not found
            resolve([]);
          } else {
            resolve(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  protected get(method: string, id = "", headers?: any): Promise<any> {
    if (id) {
      method += "/" + id;
    }
    return new Promise((resolve, reject) => {
      server
        .get(this.controller + method, {
          headers,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  protected post(data: any, method = "Create", headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      server
        .post(this.controller + `${method}`, data, {
          headers,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  protected download(data: any, method = "Download", headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      server
        .post(this.controller + `${method}`, data, {
          responseType: "blob",
          headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  protected upload(fileData: FormData, method = "Upload"): Promise<any> {
    return new Promise((resolve, reject) => {
      server
        .post(this.controller + `${method}`, fileData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  protected put(id: string, data: any, method = "Update", headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      server
        .put(this.controller + `${method}/${id}`, data, {
          headers,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  protected delete(id: string, method = "Delete", headers?: any): Promise<any> {
    if (id) {
      method += "/" + id;
    }
    return new Promise((resolve, reject) => {
      server
        .delete(this.controller + `${method}`, {
          headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
