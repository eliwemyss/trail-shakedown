# Trail Shakedown

A web application for planning and calculating backpacking gear weight and costs.

## Features

- **Manual Entry**: Add gear items one by one with name, brand, category, weight (oz), and price
- **Lighterpack Import**: Import your entire gear list from a Lighterpack URL
- View your complete gear list in a table
- Calculate total pack weight (in ounces and pounds)
- Calculate total gear cost
- Submit shakedowns to save gear lists

## Tech Stack

- **Frontend**: React 19, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the server directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd client
   npm start
   ```

3. Open http://localhost:3000 in your browser

## API Endpoints

### POST /api/shakedown
Create a new shakedown with a gear list.

**Request Body:**
```json
{
  "gearList": [
    {
      "name": "Tent",
      "brand": "MSR",
      "category": "Shelter",
      "weight_oz": 48,
      "price": 399.99
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "summary": {
      "totalItems": 1,
      "totalWeightOz": 48,
      "totalWeightLbs": "3.00",
      "totalPrice": "399.99"
    }
  }
}
```

### POST /api/lighterpack/import
Import gear list from a Lighterpack URL.

**Request Body:**
```json
{
  "url": "https://lighterpack.com/r/xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "gearList": [...],
    "itemCount": 25
  }
}
```

**Note:** Lighterpack stores weights in grams, which are automatically converted to ounces. The import will attempt to extract item names, categories, weights, and prices from the Lighterpack page.

## License

MIT
