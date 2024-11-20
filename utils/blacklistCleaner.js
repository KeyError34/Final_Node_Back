import BlacklistedToken from '../models/BlacklistedToken.js';
import { Op } from 'sequelize';

const cleanBlacklist = async () => {
  try {
    const result = await BlacklistedToken.destroy({
      where: {
        expiresAt: { [Op.lt]: new Date() }, // Условие удаления
      },
    });
    console.log(`Blacklist cleaned. Removed ${result} expired tokens.`);
  } catch (error) {
    console.error('Error cleaning blacklist:', error.message);
  }
};

export default cleanBlacklist;