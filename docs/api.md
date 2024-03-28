### Public Endpoints

1. **Register User**

   - **Endpoint:** `POST /users/register`
   - **Request Body:**
     ```json
     {
       "username": "string", // Unique username for the user
       "email": "string", // Email address of the user
       "password": "string", // Password for the user
       "name": "string" // (Optional) Name of the user
     }
     ```
   - **Response:**
     - `200 OK`: User registration successful.
     - `400 Bad Request`: If username or email already exists, or if the request is invalid.

2. **Login User**

   - **Endpoint:** `POST /users/login`
   - **Request Body:**
     ```json
     {
       "email": "string", // Email address of the user
       "password": "string" // Password for the user
     }
     ```
   - **Response:**
     - `200 OK`: Successful login. Returns user's JWT token.
     - `400 Bad Request`: If email or password is incorrect.

3. **Get Catalog by Username**

   - **Endpoint:** `GET /catalog/:username`
   - **Response:**
     - `200 OK`: Returns catalogs associated with the specified username.
     - `404 Not Found`: If username not found.

4. **Search Catalogs**
   - **Endpoint:** `GET /catalog/search`
   - **Query Parameters:**
     - `q`: Search query
   - **Response:**
     - `200 OK`: Returns catalogs matching the search query.

### Private Endpoints (Require Authentication)

1. **Get Current User**

   - **Endpoint:** `GET /users/current`
   - **Authorization Header:** `Bearer <token>`
   - **Response:**
     - `200 OK`: Returns details of the currently authenticated user.
     - `404 Not Found`: If user not found.

2. **Update Current User**

   - **Endpoint:** `PATCH /users/current`
   - **Authorization Header:** `Bearer <token>`
   - **Request Body:**
     ```json
     {
       "name": "string", // Updated name of the user (Optional)
       "password": "string" // Updated password of the user (Optional)
     }
     ```
   - **Response:**
     - `200 OK`: User information updated successfully.
     - `404 Not Found`: If user not found.

3. **Logout Current User**

   - **Endpoint:** `DELETE /users/current`
   - **Authorization Header:** `Bearer <token>`
   - **Response:**
     - `200 OK`: User logged out successfully.
     - `404 Not Found`: If user not found.

4. **Get Custom Codes**

   - **Endpoint:** `GET /catalog/customCode`
   - **Authorization Header:** `Bearer <token>`
   - **Response:**
     - `200 OK`: Returns custom codes associated with the authenticated user.
     - `404 Not Found`: If user not found.

5. **Create Catalog**

- **Endpoint:** `POST /catalog/create`
- **Authorization Header:** `Bearer <token>`
- **Request Body (Example):**
  ```multipart/form-data
  {
    "title": "Example Catalog",
    "desc": "This is an example catalog description.",
    "images": [
      (image file 1),
      (image file 2),
      ...
    ]
  }
  ```
- **Response:**
  - `200 OK`: Catalog created successfully.
  - `400 Bad Request`: If request is invalid.

6. **Create Catalog**

- **Endpoint:** `PUT /catalog/update/:id`
- **Authorization Header:** `Bearer <token>`
- **Request Body (Example):**
  ```multipart/form-data
  {
    "title": "Updated Catalog Title",
    "desc": "This is the updated description for the catalog.",
    "images": [
      (updated image file 1),
      (updated image file 2),
      ...
    ]
  }
  ```
- **Response:**
  - `200 OK`: Catalog updated successfully.
  - `404 Not Found`: If catalog not found.

In both examples, the request body is encoded as `multipart/form-data`, allowing the inclusion of both textual data (e.g., title, description) and binary data (e.g., images). The `images` field represents an array of image files to be uploaded for the catalog. The server-side code is responsible for handling the uploaded files and processing the catalog creation or update accordingly.

These examples illustrate how clients can structure their requests to create or update catalogs with associated images. Let me know if you need further clarification or assistance!

7. **Delete Catalog**
   - **Endpoint:** `DELETE /catalog/delete/:id`
   - **Authorization Header:** `Bearer <token>`
   - **Response:**
     - `200 OK`: Catalog deleted successfully.
     - `404 Not Found`: If catalog not found.

This documentation provides a detailed overview of the request body structure for each endpoint based on the code implementation.
