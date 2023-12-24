import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';

export const db = GUN();

export const user = db.user().recall({sessionStorage: true});

db.on('auth', async(event) => {
    const alias = await user.get('alias'); // username string
    username.set(alias);
});