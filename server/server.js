require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log('\nMONASTERY360 API');
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    }
};

startServer();