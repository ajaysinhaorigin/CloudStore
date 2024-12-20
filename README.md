# Cloud Storage Application  

A modern and secure cloud storage application, designed for seamless file management and collaboration. Built using **Next.js**, **ShadCN**, **Cloudinary**, **Mongoose**, and **Nodemailer**, this project incorporates both frontend and backend features to ensure a user-friendly experience and robust performance.  

## Features  

### Frontend Features:  
1. **User Authentication**:  
   - Sign-in and Sign-out functionality.  
   - OTP-based email verification for secure access.  

2. **File Management**:  
   - Upload, delete, and rename files.  
   - Share files with other users on the platform.  
   - Modern search functionality with **debouncing** and **result caching** for faster searches.  

3. **Storage Insights**:  
   - Every user is allowed up to **1GB of storage**.  
   - A dynamic dashboard with a **storage usage chart** to monitor usage in real-time.  

4. **UI/UX**:  
   - Intuitive and **responsive UI design** for a seamless experience on all devices.  

### Backend Highlights:  
- **Custom Backend Architecture**:  
  - Built with **Next.js API Routes** and **Mongoose** for scalable and flexible database management.  
  - Cloudinary integration for optimized and secure file storage.  
  - Nodemailer for robust email communication, including OTP verification.  
  - Efficient middleware setup for file size validation and user-specific storage limits.  

## Tech Stack  
- **Frontend**: Next.js, ShadCN (UI components library)  
- **Backend**: Next.js API Routes, Mongoose  
- **Database**: MongoDB  
- **File Storage**: Cloudinary  
- **Email Service**: Nodemailer  

## Installation  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/ajaysinhaorigin/cloudstore.git  
