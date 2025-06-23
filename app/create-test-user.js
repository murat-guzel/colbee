const { connectDB } = require('./lib/database');
const User = require('./models/User');

async function createTestUser() {
    try {
        const { db } = await connectDB();
        
        // Check if test user already exists
        const existingUser = await db.collection('users').findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('Test user already exists:', existingUser._id.toString());
            return existingUser._id.toString();
        }

        // Create new test user
        const hashedPassword = await User.hashPassword('password123');
        const newUser = new User({
            email: 'test@example.com',
            userName: 'testuser',
            password: hashedPassword,
            firstName: 'Test',
            lastName: 'User',
            dialCode: '+1',
            phoneNumber: '1234567890',
            country: 'US',
            address: '123 Test St',
            postcode: '12345',
            city: 'Test City'
        });

        const result = await db.collection('users').insertOne(newUser.toMongoDoc());
        console.log('Test user created with ID:', result.insertedId.toString());
        return result.insertedId.toString();
    } catch (error) {
        console.error('Error creating test user:', error);
        throw error;
    }
}

// Run the function
createTestUser()
    .then(userId => {
        console.log('Test user ID:', userId);
        process.exit(0);
    })
    .catch(error => {
        console.error('Failed to create test user:', error);
        process.exit(1);
    }); 