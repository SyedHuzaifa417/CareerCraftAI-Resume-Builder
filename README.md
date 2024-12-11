# CareerCraft AI

CareerCraft AI is a comprehensive career management platform designed to simplify the process of creating resumes, managing subscriptions, and leveraging AI-powered tools to enhance your professional profile. This project is powered by modern technologies to ensure a seamless and responsive user experience.

## Features

### Core Features
- **AI-Powered Assistance**:
  - Powered by Gemini AI to generate work experience and summaries with a single click.
- **Resume Management**:
  - Drag-and-drop functionality for organizing resumes (powered by `dnd-kit`).
  - Resume customization and export using `react-to-print`.
- **Subscription Plans**:
  - **Pro Monthly**: Access to AI tools and 3 resume creations.
  - **Pro Plus Monthly**: Unlimited resumes, AI tools, and customization options.
  - Subscriptions can be updated, canceled, and renewed through Stripe integration.
- **Authentication and Authorization**:
  - User authentication and authorization with `Clerk`.
- **Image Management**:
  - Cloudinary integration for secure image storage.

### Theming and Styling
- **Dark Mode and Light Mode**:
  - Theme toggling with `next-themes` (including system theme support).
- **Responsive Design**:
  - Built with `shadcn/ui` and `Tailwind CSS` for a modern and accessible user interface.

### Form Management and Validation
- **Forms**:
  - Efficient form handling using `react-hook-form`.
  - Schema validation with `zod`.

### State Management
- **State Handling**:
  - Managed application state with `zustand`.

### Type Safety
- **TypeScript**:
  - Ensures type safety throughout the application.

### Database and ORM
- **Database**:
  - Powered by Neon DB for fast and reliable database operations.
- **ORM**:
  - Prisma ORM for seamless database interaction.

## Tools and Technologies Used

### Frontend
- **Next.js 15**: For server-side rendering and dynamic routing.
- **TypeScript**: Provides type safety across the application.
- **Tailwind CSS**: For custom, responsive, and utility-first styling.
- **shadcn/ui**: Ensures a responsive and consistent design.

### Backend
- **Prisma ORM**: Simplifies database operations.
- **Neon DB**: A modern database solution.

### Authentication
- **Clerk**: Provides secure user authentication and authorization.

### AI and Resume Management
- **Gemini AI**: Powers AI tools for generating professional content.
- **react-to-print**: Enables users to print resumes effortlessly.
- **dnd-kit**: Facilitates drag-and-drop functionality for resume organization.

### Subscriptions and Payments
- **Stripe**: Handles secure subscription payments and management.

### Image Storage
- **Cloudinary**: Manages image uploads and storage securely.

### Additional Tools
- **zustand**: Lightweight state management library.
- **react-hook-form**: Simplifies form handling.
- **zod**: Validates form inputs.
- **next-themes**: Provides light, dark, and system themes.

## Installation and Setup

To run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/SyedHuzaifa417/CareerCraftAI-Resume-Builder.git
   ```

2. Navigate to the project directory:
   ```bash
   cd CareerCraftAI-Resume-Builder
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the required environment variables for:
   ```bash
   
    DATABASE_URL=******************
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=******************
    CLERK_SECRET_KEY=******************
    NEXT_PUBLIC_CLERK_SIGN_IN_URL='/sign-in'
    NEXT_PUBLIC_CLERK_SIGN_UP_URL='/sign-up'
    CLOUDINARY_CLOUD_NAME=******************
    CLOUDINARY_API_KEY=******************
    CLOUDINARY_API_SECRET=******************
    GEMINI_API_KEY=******************
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="******************"
    STRIPE_SECRET_KEY="******************"
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY="******************"
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY="******************"
    STRIPE_WEBHOOK_SECRET="******************"
    NEXT_PUBLIC_BASE_URL="http://localhost:3000"

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run start`: Runs the production build.
- `npx prisma studio`: Opens Prisma Studio for database management.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Special thanks to the developers of the tools and libraries used in this project.
