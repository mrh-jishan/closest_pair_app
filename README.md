# Closest Pair App

A web application built with Flask to find the closest pair of points in a 2D plane using efficient algorithms. This project demonstrates computational geometry concepts and provides a user-friendly interface for visualizing the closest pair problem.

## Features
- Upload or input a set of 2D points
- Visualize points and the closest pair
- Efficient O(n log n) algorithm implementation
- Interactive UI for adding/removing points

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mrh-jishan/closest_pair_app.git
   cd closest_pair_app
   ```
2. (Recommended) Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask development server:
   ```bash
   flask run
   ```

## Usage
- Open the app in your browser (usually at http://localhost:5000)
- Add points manually or upload a file
- The closest pair will be highlighted automatically

## Technologies Used
- Python
- Flask
- HTML/CSS/JavaScript

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
