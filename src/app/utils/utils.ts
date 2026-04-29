
const LOCAL_KEY = "userPreferences";

export const saveLayoutToLocalStorage = (pageName: string, model: any) => {
    const stored = localStorage.getItem(LOCAL_KEY);
    const allPrefs = stored ? JSON.parse(stored) : {};

    allPrefs[pageName] = model;

    localStorage.setItem(LOCAL_KEY, JSON.stringify(allPrefs));
};

export const loadLayoutFromLocalStorage = (pageName: string) => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (!stored) return null;

    const allPrefs = JSON.parse(stored);
    return allPrefs[pageName] || null;
};
