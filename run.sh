#!/bin/bash

# Function to start the backend
start_backend() {
  echo "Starting backend server..."
  cd backend
  npm install
  npm start &
  cd ..
}

# Function to start the frontend
start_frontend() {
  echo "Starting frontend application..."
  cd frontend
  npm install
  npm start &
  cd ..
}

# Main script
echo "Setting up Credit Card Processing MVP..."

# Start backend
start_backend

# Wait a moment for backend to initialize
sleep 5

# Start frontend
start_frontend

echo "Open http://localhost:3000 in your browser to access the application."
echo "Press Ctrl+C to stop all processes."

# Wait for user to cancel
wait