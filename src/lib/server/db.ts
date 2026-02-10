import postgres, { type Sql } from 'postgres';
import { env } from '$env/dynamic/private';

let sqlClient: Sql | null = null;

export function isDatabaseConfigured(): boolean {
	return Boolean(env.DATABASE_URL);
}

export function getSql(): Sql {
	const databaseUrl = env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not configured');
	}

	if (!sqlClient) {
		sqlClient = postgres(databaseUrl, {
			max: 10,
			idle_timeout: 20,
			connect_timeout: 10,
			prepare: false
		});
	}

	return sqlClient;
}
