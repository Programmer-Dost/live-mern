import { Client } from 'pg'
 // without prisma we would have done like this
const client = new Client({
connectionString: "postgresql://Abhijeet:mysecretpassword@localhost/postgres" // username:password@host/@database_name is format
})
async function createUsersTable() {
    await client.connect()
    const result = await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `)
    console.log(result)
}

// createUsersTable();


// -----------------------------Seperate------------------------------

// Async function to insert data into a table
async function insertData() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'Abhijeet',
    password: 'mysecretpassword',
  });

  try {
    await client.connect(); // Ensure client connection is established
    const insertQuery = "INSERT INTO users (username, email, password) VALUES ('username2', 'user3@example.com', 'user_password');";
    const res = await client.query(insertQuery);
    console.log('Insertion success:', res); // Output insertion result
  } catch (err) {
    console.error('Error during the insertion:', err);
  } finally {
    await client.end(); // Close the client connection
  }
}

// insertData();