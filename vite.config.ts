import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      {
        name: 'mock-api',
        configureServer(server) {
          import('body-parser').then(bodyParser => {
            server.middlewares.use(bodyParser.json());
            server.middlewares.use('/api/create-payment-intent', async (req, res, next) => {
              if (req.method === 'POST') {
                const data = (req as any).body;
                res.setHeader('Content-Type', 'application/json');
                const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
                  apiVersion: '2023-10-16' as any,
                });
                try {
                  const paymentIntent = await stripe.paymentIntents.create({
                    amount: data.amount,
                    currency: data.currency || 'usd',
                    automatic_payment_methods: { enabled: true },
                  });
                  res.end(JSON.stringify({ clientSecret: paymentIntent.client_secret }));
                } catch (e: any) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: { message: e.message } }));
                }
              } else {
                next();
              }
            });
          });
        }
      }
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
