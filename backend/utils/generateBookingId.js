const PREFIX = "BMVKL";
const RANDOM_LENGTH = 15;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// "BMVKL" + 15 random uppercase alphanumeric characters = 20 characters total.
function generateBookingId() {
   let random = "";
   for (let i = 0; i < RANDOM_LENGTH; i++) {
      random += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
   }
   return PREFIX + random;
}

module.exports = generateBookingId;
