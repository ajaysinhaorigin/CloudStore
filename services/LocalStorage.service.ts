const setAccessToken = (accessToken: string) => {
  localStorage.setItem("accessToken", accessToken);
};

const getAccessToken = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken !== null) {
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

const removeAccessToken = () => {
  try {
    localStorage.removeItem("accessToken");
  } catch (error) {}
};

const localStorageService = {
  setAccessToken,
  getAccessToken,
  removeAccessToken,
};

export { localStorageService };
