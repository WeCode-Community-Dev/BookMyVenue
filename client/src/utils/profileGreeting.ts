let played = false;

export const hasPlayedProfileGreeting = () => played;

export const markProfileGreetingPlayed = () => {
  played = true;
};

export const resetProfileGreeting = () => {
  played = false;
};
