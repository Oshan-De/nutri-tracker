# Nutri Tracker

A multi-user calorie tracking application designed with cutting-edge technologies to deliver seamless user experience and innovative AI-powered dietary suggestions.

## Features

- **Multi-user authentication** with Clerk.
- **Dashboard** displaying an overview of user data and trends.
- **Meal log system** for adding, editing, and deleting meals.
- **AI integration** for personalized dietary suggestions.
- **Responsive UI/UX** with animations and modern design.

## Tech Stack

- **Framework:** Next.js (Latest v15), React (Latest v19)
- **Styling:** Tailwind CSS, ShadCN
- **State Management:** Zustand
- **Database:** Vercel Postgres (connected via Drizzle ORM)
- **Authentication:** Clerk
- **Animations:** Framer Motion
- **Type Checking:** TypeScript
- **Deployment:** Vercel Neon
- **AI Integration:** MistralAI

## Project Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 14.x)
- npm or yarn
- ngrok (for local Clerk webhooks)

### Clone the Repository

```bash
git clone https://github.com/Oshan-De/nutri-tracker.git
cd nutri-tracker
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Configure Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

POSTGRES_URL=your-vercel-postgres-url

MISTRAL_API_KEY=your-mistral-api-key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_SIGNING_SECRET=your-clerk-signing-secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
```

> **Note:** Replace placeholders with actual values. Refer to the [Clerk Documentation](https://clerk.dev/docs), [Vercel Postgres Setup Guide](https://vercel.com/docs/storage/vercel-postgres), and [MistralAI Documentation](https://mistralai.com/docs) for details.

### Start ngrok for Clerk Webhooks

Clerk requires a public URL for webhooks. Use ngrok to expose your local development server:

```bash
ngrok http 3000
```

Update your Clerk webhook settings with the ngrok URL. Refer to the [Clerk Webhook Setup Documentation](https://clerk.dev/docs) for guidance.

To temporarily stop Clerk webhooks, you can disable them in the Clerk dashboard.

### Run the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Access the application at `http://localhost:3000`.

## Deployment

This project is deployed using Vercel Neon:

- **Database:** Vercel Postgres
- **Frontend and Backend:** Deployed to Vercel

Follow the [Vercel Deployment Guide](https://vercel.com/docs) to deploy your own instance.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue in the [GitHub repository](https://github.com/Oshan-De/nutri-tracker/).

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

For any questions or support, please contact the project maintainers through the GitHub repository.
