# 📚 Bookshelf API
A RESTful API for managing your digital bookshelf built with Node.js and Hapi framework.

## 🚀 Features

- Create, Read, Update, and Delete books
- Filter books by name, reading status, and completion status
- Input validation
- Error handling
- CORS enabled
- In-memory data storage

## 🛠️ Installation

### Clone this repository
```bash
git https://github.com/Fir3fliesss/be-dicoding.git
```
### Enter into folder
```bash
cd bookshelf-api
```
### Install dependencies:
```bash
npm install
```
### Start the server
```bash
npm run start
```

The server will run on [http://localhost:9000](localhost:9000)


## 🔧 Development
To run the server in development mode with auto-reload:
```bash
npm run dev
```

## 🧪 Testing
Run tests with:
```bash
npm test
```
## 📡 API Endpoints
### Books

| Method | Endpoint                | Description                 |
|--------|-------------------------|-----------------------------|
| GET    | `/books`                | Get all books               |
| GET    | `/books?name={name}`    | Search books by name        |
| GET    | `/books?reading={0/1}`  | Filter by reading status    |
| GET    | `/books?finished={0/1}` | Filter by completion status |
| GET    | `/books/{bookId}`       | Get book by ID              |
| POST   | `/books`                | Add new book                |
| PUT    | `/books/{bookId}`       | Update book                 |
| DELETE | `/books/{bookId}`       | Delete book                 |

### Request Body Format (POST/PUT)
```
{
    "name": "Book Name",
    "year": 2024,
    "author": "Author Name",
    "summary": "Book summary",
    "publisher": "Publisher Name",
    "pageCount": 100,
    "readPage": 0,
    "reading": false
}
```

## 📝 Response Format
### Success Response

```
{
    "status": "success",
    "data": {
        "books": [
            {
                "id": "book-123",
                "name": "Book Name",
                "publisher": "Publisher Name"
            }
        ]
    }
}
```
### Error Response
```
{
    "status": "fail",
    "message": "Error message"
}
```

## 🔒 Prerequisites
- Node.js (LTS Version)
- npm

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
