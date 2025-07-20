# Overview

ReConcrete is a sustainable e-commerce platform focused on promoting eco-friendly building practices through recycled concrete solutions. The application features a landing page with video upload capabilities, a product catalog showcasing three sustainable concrete offerings, and a secure checkout system with multiple payment options including Stripe integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The ReConcrete platform follows a modern full-stack architecture with a clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for cart management and React Query for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with a custom green eco-friendly color scheme
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **File Storage**: AWS S3 for video uploads and storage
- **Session Management**: Session-based cart storage using UUIDs

## Key Components

### Database Schema
The application uses a PostgreSQL database with the following core tables:
- **Users**: Basic user management with Stripe customer integration
- **Products**: Catalog of concrete products and services with pricing
- **Videos**: FAQ and educational content with S3 integration
- **Cart Items**: Session-based shopping cart functionality
- **Orders**: Order management with payment tracking
- **Order Items**: Individual items within orders

### Payment Processing
- **Primary Gateway**: Stripe for secure payment processing
- **Supported Methods**: Apple Pay, PayPal, Visa, Mastercard, and American Express
- **Features**: Client secret generation, payment confirmation, and order tracking

### Video Management
- **Upload System**: Multer middleware for handling video file uploads
- **Storage**: AWS S3 bucket integration for video storage and streaming
- **Supported Formats**: MP4, MOV, and AVI files up to 100MB
- **Metadata Tracking**: Duration, file size, and MIME type storage

### Product Catalog
The platform offers three main sustainable solutions:
1. Low-strength concrete integrated with recycled plastics
2. Plastic recycling services for local communities  
3. Enterprise recycling services for municipalities and waste management organizations

## Data Flow

### Cart Management
1. User sessions are tracked via UUID stored in localStorage
2. Cart items are associated with session IDs in the database
3. Real-time cart updates through React Query mutations
4. Cart state persists across browser sessions

### Payment Processing
1. Cart contents are validated on checkout initiation
2. Stripe payment intent is created with order details
3. Client-side payment confirmation using Stripe Elements
4. Order record creation upon successful payment
5. Cart clearing and confirmation display

### Video Upload Flow
1. Client-side file validation (type and size)
2. FormData upload to Express endpoint
3. AWS S3 upload with unique key generation
4. Database record creation with S3 URL
5. Query cache invalidation for immediate UI updates

## External Dependencies

### Payment Services
- **Stripe**: Primary payment processor with webhook support
- **PayPal SDK**: Secondary payment option integration

### Cloud Services
- **AWS S3**: Video file storage and content delivery
- **Neon Database**: Serverless PostgreSQL hosting

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Server-side bundling for production
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation via TSX
- Environment variable configuration for API keys and database URLs

### Production Build
- Frontend: Vite build outputting to `dist/public`
- Backend: ESBuild bundling server code to `dist/index.js`
- Static file serving through Express

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key
- `AWS_ACCESS_KEY_ID`: S3 access credentials
- `AWS_SECRET_ACCESS_KEY`: S3 secret key
- `AWS_REGION`: S3 bucket region
- `AWS_S3_BUCKET`: S3 bucket name

The architecture prioritizes type safety, developer experience, and scalability while maintaining a focus on environmental sustainability through its product offerings and user experience design.