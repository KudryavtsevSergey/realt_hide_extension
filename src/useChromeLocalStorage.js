const useChromeLocalStorage = async (key, defaultValue) => {
  const storage = chrome.storage.local;

  const { [key]: value = defaultValue } = await storage.get(key);

  const set = async (value) => {
    await storage.set({ [key]: value });
  };

  const remove = async () => {
    await storage.remove(key);
  };

  return { value, set, remove };
};

export default useChromeLocalStorage;
