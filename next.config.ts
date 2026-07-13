const nextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    async headers() {
        return [
            {
                source: '/:path*.{png,jpg,jpeg,gif,svg,webp,avif,ico}',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
        ];
    },
};

export default nextConfig;
