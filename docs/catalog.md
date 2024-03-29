### 1. Create Catalog

- **Endpoint:** `POST /catalog/create`
- **Headers:**
  - **Authorization:** Bearer authentication_token
- **Request:** multipart/form-data
  ```json
  {
    "title": "New Catalog",
    "desc": "This is a new catalog",
    "items": [
      {
        "id": "123456",
        "title": "New Catalog",
        "desc": "This is a new catalog",
        "imagePath": "images/PATH"
      }
    ]
  }
  ```
  - File: Image
- **Response (Success):**
  ```json
  {
    "data": {
      "id": "Catalog id",
      "title": "New Catalog",
      "descn": "This is a new catalog"
    }
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Invalid format"
  }
  ```

### 2. Update Catalog

- **Endpoint:** `PUT /catalog/update/:id`
- **Headers:**
  - **Authorization:** Bearer authentication_token
- **Request:** multipart/form-data
  ```json
  {
    "title": "New Catalog",
    "desc": "This is a new catalog"
  }
  ```
  - File: Image
- **Response (Success):**
  ```json
  {
    "data": {
      "id": "id",
      "title": "New Catalog",
      "desc": "This is a new catalog",
      "image": "image path"
    }
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Invalid format"
  }
  ```

### 3. Get Catalog

- **Endpoint:** `GET /catalog/:username/:id`
- **Response (Success):**
  ```json
  {
    "data": {
      "id": "Catalog id",
      "title": "New Catalog",
      "description": "This is a new catalog",
      "image": "image path"
    }
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Catalog not found"
  }
  ```

### 4. Get All Catalog

- **Endpoint:** `GET /cactalog/:username`
- **Response (Success):**
  ```json
  {
    "data": [
      {
        "id": "Catalog id",
        "title": "New Catalog",
        "description": "This is a new catalog",
        "image": "image path"
      }
    ]
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Username not found"
  }
  ```

### 5. Delete Catalog

- **Endpoint:** `DELETE /catalog/delete/:id`
- **Headers:**
  - **Authorization:** Bearer authentication_token
- **Response (Success):**
  ```json
  {
    "data": "OK"
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Unauthorized deletion"
  }
  ```
