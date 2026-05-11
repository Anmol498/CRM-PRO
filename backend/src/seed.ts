import bcrypt from 'bcrypt';
import User from './models/User.model';
import { runScript } from './scripts/connectForScript';

runScript('seed-database', async () => {
    // Clear existing initial test data
    await User.deleteMany();

    // Admin Account Data
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = {
        name: 'System Admin',
        email: 'admin@travel.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
    };

    // Agent Account Data
    const agentPasswordHash = await bcrypt.hash('agent123', 10);
    const agentUser = {
        name: 'Demo Agent',
        email: 'agent@travel.com',
        passwordHash: agentPasswordHash,
        role: 'agent',
    };

    await User.insertMany([adminUser, agentUser]);

    console.log('Database successfully seeded with Demo Admin & Agent accounts!');
});




