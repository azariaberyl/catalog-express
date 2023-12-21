### 1. User Registration

- **Endpoint:** `POST /users/register`
- **Request:**
  ```json
  {
    "email": "user@example.com",
    "username": "unique_username",
    "name": "Full Name",
    "password": "secure_password"
  }
  ```
- **Response (Success):**
  ```json
  {
    "data": {
      "name": "Full Name",
      "username": "unique_username",
      "email": "user@example.com"
    }
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Invalid email format"
  }
  ```

### 2. User Login

- **Endpoint:** `POST /users/login`
- **Request:**
  ```json
  {
    "email": "user@example.com",
    "password": "secure_password"
  }
  ```
- **Response (Success):**
  ```json
  {
    "token": "authentication_token"
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Invalid email or password"
  }
  ```

### 3. Get User

- **Endpoint:** `GET /users/current`
- **Headers:**
  - **Authorization:** Bearer authentication_token
- **Response (Success):**
  ```json
  {
    "data": {
      "name": "Full Name",
      "username": "username"
      "email": "user@example.com"
    }
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Unauthorized access"
  }
  ```

### 4. Update User

- **Endpoint:** `PATCH /users/current`
- **Headers:**
  - **Authorization:** Bearer authentication_token
- **Request:**
  ```json
  {
    "name": "New Full Name", // Optional
    "password": "new_secure_password" // Optional
  }
  ```
- **Response (Success):**
  ```json
  {
    "data": {
      "name": "New Full Name"
    }
  }
  ```
- **Response (Error):**
  ```json
  {
    "errors": "Unauthorized update"
  }
  ```

### 5. Logout User

- **Endpoint:** `DELETE /users/logout`
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
    "errors": "Unauthorized logout"
  }
  ```
