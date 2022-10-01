module.exports = {
	development: {
		username: 'root',
		password: '00Sakur@->--',
		database: 'korty',
		host: '127.0.0.1',
		dialect: 'mysql'
	},
	production: {
		username: process.env.DATABASE_username,
		password: process.env.DATABASE_password,
		database: process.env.DATABASE_database,
		host: process.env.DATABASE_host,
		dialect: 'mysql'
	}
};
