import dotenv from 'dotenv';
import IORedis from 'ioredis';

dotenv.config();

export function createBullMqOptions() {
	const redisConnectionUrl = process.env.REDIS_URL;
	if (!redisConnectionUrl) throw new Error('Redis connection URL not set');
	const redisClient = new IORedis(redisConnectionUrl);

	return {
		connection: redisClient.options,
	};
}
