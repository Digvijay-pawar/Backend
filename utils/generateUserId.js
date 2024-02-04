const generateUserId = () => {
    //I want to generate 7 digit unique number
    const min = 1000000;
    const max = 9999999;
    const userId = Math.floor(Math.random() * (max - min + 1)) + min;
    return userId;
}

export default generateUserId;