export const getInitials = (fullName = "") => {
    const words = fullName.trim().split(" ").filter(Boolean);

    if(words.length === 0) return "";

    if(words.length === 1){
        return words[0][0].toUpperCase();
    }

    return(
        words[0][0] + 
        words[words.length - 1][0]
    ).toUpperCase();
};