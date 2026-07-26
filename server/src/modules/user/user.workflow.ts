import * as repo from './user.repository';
import * as service from './user.service';
import { enqueueEmailTask } from '../../services/email.repository';
import { EmailIntent, EmailTaskStatus } from '../../constants/email.constants';

export async function resetUserPasswordWorkflow(userId: string): Promise<boolean> {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const { plain: newPassword, hashed: hashedPassword } =
    await service.generateRandomPasswordWithHash();

  await repo.updateUserPassword(userId, hashedPassword);

  await enqueueEmailTask(
    user.email,
    EmailIntent.ADMIN_PASSWORD_RESET,
    `Password Reset – ${user.username}`,
    EmailTaskStatus.PENDING,
    { newPassword, username: user.username }
  );

  return true;
}
