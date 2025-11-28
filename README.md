# Foiné - Pinterest Clone

A full-stack social media application for sharing and discovering images, built with Spring Boot and React.

## 🚀 Features

- **Image Upload & Storage**: Upload images to Cloudinary with automatic optimization
- **Persistent Data**: All posts saved to database, survive logout/browser refresh
- **User Authentication**: JWT-based authentication system
- **Global Feed**: Browse all public posts with pagination
- **User Profiles**: View posts by specific users
- **Search**: Find posts by title or description
- **Like & Save**: Interact with posts
- **Responsive Design**: Works on desktop and mobile
- **Production Ready**: Optimized for deployment

## 🛠 Tech Stack

### Backend
- **Spring Boot 3.5.7** - Java web framework
- **Spring Data JPA** - Database ORM
- **H2/MySQL** - Database (configurable)
- **Spring Security** - Authentication & authorization
- **Cloudinary** - Image storage & CDN
- **Maven** - Build tool

### Frontend
- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Framer Motion** - Animations

## 📋 Prerequisites

- **Java 17+** (JDK 17 or higher)
- **Node.js 16+** and npm
- **Maven 3.6+**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/adamxparx/foine.git
cd foine
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
Frontend will start on `http://localhost:4029`

### 4. Access the Application
- **Frontend**: http://localhost:4029
- **Backend API**: http://localhost:8080/api
- **H2 Console** (dev only): http://localhost:8080/h2-console

## 🔧 Configuration

### Environment Variables

Create `.env` file in the frontend directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### Database Configuration

**Development (H2 - default):**
```properties
# application.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
```

**Production (MySQL):**
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/foine
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=validate
```

### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Set environment variables:
```bash
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret
```

## 📡 API Endpoints

### Posts
- `GET /api/posts?page=0&size=12` - Get all posts (paginated)
- `GET /api/posts/{id}` - Get single post
- `POST /api/posts/upload` - Create new post (multipart/form-data)
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `GET /api/posts/user/{userId}` - Get user's posts
- `GET /api/posts/search?query=term` - Search posts
- `POST /api/posts/{id}/like` - Like/unlike post

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

## 🏗 Production Deployment

### Backend Deployment
```bash
# Build the application
mvn clean package -DskipTests

# Run with production profile
java -jar target/foine-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files (nginx/apache)
# Copy build/ contents to web server
```

### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM openjdk:17-jdk-slim
COPY target/foine-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 🧪 Testing

### Backend Tests
```bash
mvn test
```

### Frontend Tests
```bash
npm test
```

### Manual Testing Checklist
- ✅ Upload image → appears in feed
- ✅ Logout → login → images persist
- ✅ Different browser → same account sees images
- ✅ Search works
- ✅ Pagination loads more posts
- ✅ Like/unlike functionality
- ✅ Delete post removes from all views

## 📊 Database Schema

```sql
-- Image Posts Table
CREATE TABLE image_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    image_url VARCHAR(1000) NOT NULL,
    user_id BIGINT NOT NULL,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Users Table (if using custom auth)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention (JPA)
- XSS protection (React)
- CORS configuration
- File upload restrictions (10MB max)
- Authentication required for mutations

## 📈 Performance Optimizations

- Database indexing on frequently queried columns
- Pagination for large datasets
- Image lazy loading
- CDN for image delivery (Cloudinary)
- Connection pooling
- Gzip compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please open a GitHub issue or contact the maintainers.

---

**Happy coding! 🎨📸**