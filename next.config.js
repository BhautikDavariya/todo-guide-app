/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
  // Add basePath
  basePath: '/todo-guide-app',
}

module.exports = nextConfig
