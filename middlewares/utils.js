export const filterSensitiveData = (user) => {
    const { password, ...userWithoutPassword } = user._doc;
    return userWithoutPassword;
};