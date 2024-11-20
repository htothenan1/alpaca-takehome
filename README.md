# Alpaca Health Software Engineering Take-Home Project

### Project Description

Visit this link for details:
[https://harviio.notion.site/Alpaca-Health-Eng-Take-home-Project-1411bfc50b90803382d4cae01f9bcf18?pvs=4](https://www.notion.so/harviio/ABA-Session-Note-Generator-Take-Home-Project-1411bfc50b90803382d4cae01f9bcf18?pvs=4)

## Setup Instructions

### Backend Setup (Python 3.11+ required)

```bash
# Create and activate virtual environment
python -m venv alpaca_venv
source alpaca_venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
fastapi dev main.py
```

### Frontend Setup (Node.js 18+ required)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Default Project Structure

- `frontend/`: Next.js application
  - `src/components/`: Reusable React components
  - `src/app/`: Next.js app router pages
- `backend/`: FastAPI application
  - `app/main.py`: API endpoints

## Development

- Frontend runs on port 3000 with hot reload enabled
- Backend runs on port 8000 with auto-reload enabled
- API documentation available at http://localhost:8000/docs

## Submission

1. Create a private GitHub repository
2. Implement your solution
3. Document any assumptions or trade-offs
4. Include instructions for running your solution
5. Send us the repository link

## Time Expectation

- Expected time: 3-4 hours
- Please don't spend more than 6 hours

## Evaluation Criteria

Here's the refined criteria with more professionally-worded details:

| Category | Details | Weight |
|----------|---------|--------|
| Product Design & Scope Management | - Solution effectively addresses core requirements and business objectives<br>- Demonstrates strategic prioritization of features based on impact and constraints<br>- Clear rationale for scope decisions | 10% |
| Technical Architecture | - Architecture and technology choices align with project requirements<br>- Demonstrates understanding of trade-offs in technical decisions<br>- Selected tools support scalability and maintainability | 10% |
| Implementation Quality | - Clear and maintainable code architecture<br>- Effective component modularity and reusability<br>- Proper implementation of React patterns and best practices<br>- Efficient state management solutions<br>- Appropriate use of lifecycle methods and hooks<br>- Adherence to React ecosystem conventions | 40% |
| User Experience & Reliability | - Intuitive and responsive user interface<br>- Consistent error handling and edge case management<br>- Performance optimization<br>- Browser compatibility<br>- Accessibility considerations | 20% |
| Technical Documentation | - Comprehensive system architecture documentation<br>- Clear setup and deployment instructions<br>- Well-documented technical decisions and trade-offs<br>- API documentation where applicable | 10% |
| Quality Assurance | - Comprehensive test coverage<br>- Mix of unit, integration, and E2E tests where appropriate<br>- Test scenarios cover critical user flows<br>- Proper test organization and maintainability | 10% |
