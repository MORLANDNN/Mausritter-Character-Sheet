// js/storage.js — Логика работы с LocalStorage для множества персонажей
const AppStorage = {
    charsKey: "mausritter_characters", // Ключ для всех мышей
    activeKey: "mausritter_active_id", // Ключ для текущей открытой мыши
    // Получить всех персонажей
    getAll() {
        const dataStr = localStorage.getItem(this.charsKey);
        return dataStr ? JSON.parse(dataStr) : {};
    },
    // Сохранить конкретного персонажа
    save(charId, stateObj) {
        const chars = this.getAll();
        chars[charId] = stateObj;
        localStorage.setItem(this.charsKey, JSON.stringify(chars));
    },
    // Загрузить конкретного персонажа
    load(charId) {
        const chars = this.getAll();
        return chars[charId] || null;
    },
    // Удалить персонажа
    delete(charId) {
        const chars = this.getAll();
        delete chars[charId];
        localStorage.setItem(this.charsKey, JSON.stringify(chars));
    },
    // Запомнить, кого мы открываем
    setActive(charId) {
        localStorage.setItem(this.activeKey, charId);
    },
    // Узнать, кого мы открыли
    getActive() {
        return localStorage.getItem(this.activeKey);
    }
};
