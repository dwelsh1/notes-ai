/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone for API routes support
  output: 'standalone',
  
  // External packages for server components
  serverExternalPackages: ['@mlc-ai/web-llm'],

  // Turbopack configuration (Next.js 16+)
  turbopack: {
    resolveAlias: {
      // Add any specific alias configurations if needed
    },
  },

  // Next.js image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables
  env: {
    // WebLLM configuration
    WEBLLM_MODEL: process.env.WEBLLM_MODEL || 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
  },
};

export default nextConfig;
