
# Hotel-booking-app

Set of APIs to reserve the presidential suite for Panoramic Hotel.

## System Requirements

**VScode:**  I’ve used the vscode for the whole development!

**Node JS:** I’ve used node js v18.9.0

**MongoDB:** I’ve used MongoDB v4.4.2

**Postman:** We’ll use this one to test all our API’s

## Packages used

**babel:**  For transpile the javascript into an older version

**cors:** For the CORS setting

**dotenv:** For reading the environment variables

**eslint:**  For enforcing a coding style

**express js:** The node framework

**husky:** For git pre-commit to hook for implementing eslint & prettier before committing

**joi:** Used to validate the user inputs

**mongoose:** MongoDB ORM for working with MongoDB

**morgan:** For showing API endpoint details

**nodemon:** For running the server, when we change a file

**prettier:** For formatting the code

## How to get started?

To install the packages and dependencies

```bash
  npm install
```
Create an .env file in the root directory. Check .env-example to get an idea of what I’ve inside the .env file.

```bash
  vim .env
```


To run the project on dev(local)

```bash
  npm run dev
```

To run the tests

```bash
  npm run test
```

For production build

```bash
  npm run build
  npm start
```


## Test Coverage

![App Screenshot](https://i.postimg.cc/N0dz04KW/test-coverage.png)


## API Reference

#### Create a reservation

```http
  POST /api/v1/reservation
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. |
| `first_name` | `string` | **Required**. |
| `last_name` | `string` | **Required**. |
| `no_of_guests` | `number` | **Required**. |
| `check_in` | `date` | **Required**. |
| `check_out` | `date` | **Required**. |

#### Retrieve a reservation

```http
  GET /api/v1/reservation/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Booking ID|

#### Cancel a reservation

```http
  DELETE /api/v1/reservation/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Booking ID|



## Postman Documentation

[Documentation](https://documenter.getpostman.com/view/5164966/Uz5AtKkk)

