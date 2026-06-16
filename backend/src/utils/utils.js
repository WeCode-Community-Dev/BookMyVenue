import { randomBytes, createHmac } from 'crypto';

export const hashPassword = async (password, UserSalt) => {
  const salt = UserSalt || randomBytes(256).toString('hex');
  const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
  return { password: hashedPassword, salt };
};

export function classifyDay(dateString) {
    const day = new Date(dateString).getDay()
    // getDay() returns 0=Sunday, 1=Monday ... 6=Saturday
    if (day === 0 || day === 6) return 'weekend'
    return 'weekday'
}

export function findMatchingRow(pricing,dateType){
  return pricing.find((e)=> e.dayType === dateType);

}