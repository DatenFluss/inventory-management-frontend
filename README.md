# Enterprise Inventory Management System - Frontend

## Overview

A modern, React-based frontend application for managing enterprise inventory, employee resources, and organizational structure. This system provides role-based interfaces for employees, managers, administrators, and enterprise owners, offering tailored functionality for each user type.

## 🚀 Features

### Role-Based Dashboards

#### 🧑‍💼 Employee Dashboard
- Personal and enterprise information view
- Current inventory items in use
- Item request management
- Request status tracking

#### 👔 Manager Dashboard
- Team member management
- Pending requests approval/rejection
- Department inventory oversight
- Team performance metrics

#### 👑 Owner Dashboard
- Enterprise-wide statistics
- Department overview
- Complete employee listing
- Resource allocation insights

#### ⚙️ Admin Dashboard
- Employee management (CRUD operations)
- Role assignment
- Department configuration
- System access control

## 🛠 Technical Stack

- **React 18.x**
- **React Router 6** for routing
- **Axios** for API communication
- **Bootstrap 5** for styling
- **Context API** for state management
- **JWT** for authentication


## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/enterprise-inventory-frontend.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd enterprise-inventory-frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Create a `.env` file in the root directory**
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```

5. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

### 🔐 Authentication
The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in `localStorage` and automatically included in API requests through an Axios interceptor.

**Login Flow**
1. User submits credentials.
2. Backend validates and returns JWT.
3. Token stored in `localStorage`.
4. User redirected to role-specific dashboard.

### 🛣 Routing

**Public Routes**
- `/login` - Login page
- `/register` - Registration page

**Protected Routes**
- `/employee-dashboard` - Employee view
- `/manager-dashboard` - Manager view
- `/owner-dashboard` - Owner view
- `/admin-dashboard` - Admin panel
- `/unaffiliated-dashboard` - Unaffiliated user view

### 💼 State Management
The application uses React Context API for state management, particularly for:
- User authentication state
- Current user information
- Role-based permissions

### 🎨 Styling
- **Bootstrap 5** for responsive design
- **Custom CSS modules** for component-specific styling
- Responsive design for all screen sizes

### 🔄 API Integration
API calls are handled through a centralized `api.js` service using Axios:
- Interceptors for token management
- Error handling
- Response transformation

### 🛡 Security Features
- JWT-based authentication
- Role-based access control
- Protected routes
- XSS protection
- CSRF protection

### 🧪 Testing
Run tests with:
```bash
npm test
```

**Key test areas:**
- Component rendering
- Authentication flow
- Protected routes
- API integration

### 📱 Responsive Design
The application is fully responsive and tested on:
- Desktop browsers
- Tablets
- Mobile devices

### 🔧 Configuration
Environment variables can be configured in `.env`:
```env
REACT_APP_API_URL=backend_url
REACT_APP_VERSION=version_number
```

### 📚 Contributing
1. **Fork the repository**
2. **Create a feature branch**
3. **Commit changes**
4. **Push to the branch**
5. **Open a pull request**

### 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

### 🤝 Support
For support, email [support@enterprise-inventory.com](mailto:support@enterprise-inventory.com) or raise an issue in the repository.

### 🙋‍♂️ Authors
- **Vladyslav Shupliakov** - Initial work - [DatenFluss](https://github.com/DatenFluss)

### 🙌 Acknowledgments
- **React team** for the amazing framework
- **Bootstrap team** for the UI components
- All contributors who help improve the system
