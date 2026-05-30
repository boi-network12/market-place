import mongoose from 'mongoose';

const gracefulShutdown = async (signal: string) => {
    console.log(`⚠️ Received ${signal}. Closing MongoDB connection...`);

    try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error occurred while closing MongoDB connection:', error);
        process.exit(1);
    }
}

export const setupCleanupHandlers = () => {
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    process.on('uncaughtException', (err) => {
        console.error('💥 Uncaught Exception:', err);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
        console.error('💥 Unhandled Rejection:', reason);
        process.exit(1);
    });
}