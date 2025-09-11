// dateUtils.js

export const saveLayoutToLocalStorage = (key: string, model: any) => {
    localStorage.setItem(key, JSON.stringify(model));
};

export const loadLayoutFromLocalStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};