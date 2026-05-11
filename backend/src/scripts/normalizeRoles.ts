import { runScript } from './connectForScript';
import User from '../models/User.model';

runScript('normalize-roles', async () => {
    // Update all users where role is not lowercase
    const users = await User.find({ role: { $regex: /[A-Z]/ } });
    console.log(`Found ${users.length} users with mixed-case roles.`);

    for (const user of users) {
        const oldRole = user.role;
        user.role = oldRole.toLowerCase();
        await user.save();
        console.log(`Updated user ${user.email}: ${oldRole} -> ${user.role}`);
    }
});
