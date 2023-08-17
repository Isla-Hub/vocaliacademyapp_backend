export const filterSensitiveData = (user) => {
    const { password: _, ...userWithoutPassword } = user._doc;
    return userWithoutPassword;
};

export const applyFilterSensitiveData = (data) => {
    if (Array.isArray(data)) {
      return data.map(item => filterSensitiveData(item));
    } else {
      return filterSensitiveData(data);
    }
  };
  
