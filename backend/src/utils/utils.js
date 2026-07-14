import { randomBytes, createHmac } from 'crypto';
import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

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

export const parseCookies = (req) => {
  const cookieHeader = req.headers.cookie || '';
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    })
  );
};