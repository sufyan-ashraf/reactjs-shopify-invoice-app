const dev = process.env.NODE_ENV !== 'production';

const server = dev ? 'http://localhost:3000' : 'https://next-js-app-ten.vercel.app';
const password = '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';
const key = 'b9a5814dc31133c0c9214b7e4f1b0b77';
const shop = 'royalgalleriapk';

export {server, password, key, shop};