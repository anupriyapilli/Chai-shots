import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.join(__dirname), // point root to /frontend
  },
};

export default nextConfig;
