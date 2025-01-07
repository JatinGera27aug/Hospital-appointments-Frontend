# Hospital Appointment System (Frontend)

This repository contains the frontend code for a **Hospital Appointment System**, designed to streamline interactions between patients, doctors, and administrators. The project offers role-based dashboards and functionality tailored to each user type.

## Features

- **Role-Based Dashboards**:  
  - Patients can view and manage appointments.  
  - Doctors can track patient records and appointments.  
  - Admins can manage doctor registrations and oversee operations.  

- **Authentication**:  
  - Users can register and log in with role-based redirection.  
  - Token-based authentication ensures secure access.  

- **Dynamic Routing**:  
  - Pages are dynamically rendered based on user roles (`/patient/dashboard`, `/doctor/dashboard`, `/admin/dashboard`).  

- **Responsive Design**:  
  Built with a modern UI to ensure accessibility across devices.

## Built With

- **React**: For building the user interface.  
- **React Router**: For navigation and routing.  
- **Zod + React Hook Form**: For form validation and management.  
- **Sonner**: For notifications and toast messages.  
- **Bolt UI Kit**: Basic layout and components (configured and improved further).  

## Deployment

The frontend is deployed on **Netlify** and accessible at: medcare-appointment.netlify.app



### Routing Note  
Ensure proper server configuration to handle routes like `/patient/dashboard`, `/doctor/dashboard`, etc., for direct access. In Netlify, you can add a `_redirects` file or configure fallback routing.

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/healthcare-management-frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd healthcare-management-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Roadmap for Future Improvements

- **Integration with Backend**: Adding real-time appointment management and data updates.  
- **Enhanced Role Management**: Restrict page access based on authentication status.  
- **UI Improvements**: Refine the user interface for better usability and aesthetics.  

---

### **Acknowledgment**  
The basic layout of this project was initially implemented using **Bolt UI Kit**. Further configurations, integrations, and improvements have been made to enhance functionality and user experience.

**Note**: This repository is for the **frontend part** only. Backend functionality, APIs, and server configurations are managed separately at [BACKEND](https://github.com/JatinGera27aug/Hospital-appointments)
