# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Supabase.

## Features

- 🎨 Modern UI with dark/light theme support
- 📱 Fully responsive design
- 🔐 Secure authentication with Supabase
- 📝 Dynamic content management
- 🖼️ Image upload and management
- 🛠️ Admin dashboard for content management

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Authentication, Database, Storage)
- Framer Motion (Animations)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vrundpatel153/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
- Copy `.env.example` to `.env`
- Fill in your Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace the values with your actual Supabase project credentials.

## Project Structure

```
project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React context providers
│   ├── lib/          # Utility functions and configurations
│   └── App.tsx       # Main application component
├── public/           # Static assets
└── supabase/        # Supabase migrations and configurations
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Vrund Patel - [@Mytwitter](https://twitter.com/VrundPatel1535)

Project Link: [https://github.com/Vrundpatel153/portfolio](https://github.com/Vrundpatel153/portfolio) 
