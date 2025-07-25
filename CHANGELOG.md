# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Admin dashboard page with product management capabilities (/admin route)
- AdminProductTable component for managing ReConcrete products
- Admin navigation sidebar with ReConcrete branding
- Admin stats cards showing total products, orders, revenue, and low stock items
- Product creation, editing, and deletion functionality in admin panel
- About Us page with comprehensive company mission, process, products, and value proposition
- Contact page with phone number, email, QQ, WeChat, and TikTok account information
- "Contact Our Experts" button in products page that navigates to contact page
- Navigation links for About Us, Products, and Contact in the main navigation bar
- Mobile navigation menu with hamburger button for better mobile experience
- Enhanced navigation visibility with improved styling and active states
- About page route (/about) added to App router

### Changed
- Removed "Our Mission" and "Products" sections from footer navigation on landing page
- Updated footer navigation to be cleaner with fewer links
- Improved navigation component with better mobile responsiveness and visual indicators

### Removed
- PayPal payment option from checkout page, now only supports Stripe payments
- Various footer navigation links that were redundant

- Initial ReConcrete e-commerce platform implementation
- Landing page with hero section and video upload functionality
- Product listing page with three sustainable concrete solutions
- Secure checkout process with Stripe integration
- Video upload and storage capabilities with AWS S3
- Shopping cart system with React state management
- PostgreSQL database for product and order management
- Responsive design with eco-friendly green color scheme
- Support for Apple Pay, PayPal, and Visa payment methods
- Order confirmation system with thank you messaging
- Dedicated thank you page with order details and referral messaging

### Changed
- Added TikTok link alongside YouTube on both thank you page and landing page (hero section and footer)
- Removed Contact link from footer navigation
- Added prominent About Us, Products, and Contact navigation buttons to homepage hero section
- Updated navigation bar to include About Us, Products, and Contact links

### Added
- Admin dashboard with comprehensive product and order management
- AdminProductTable component for creating, editing, and deleting products
- Admin statistics display showing total products, orders, and revenue
- Order status management functionality for admins
- Admin API routes for product CRUD operations and order management

### Fixed
- 

### Removed
-