export const moneyToPaise = (amount: number): number => {
  return Math.round(amount * 100);
};

export const paiseToMoney = (paise: number): number => {
  return Number((paise / 100).toFixed(2));
};
