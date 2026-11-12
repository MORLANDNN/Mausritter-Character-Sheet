// js/state.js — Управление состоянием конкретного персонажа
const CharacterState = {
    data: {
		id: "",
        name: "",
        level: 0,
        xp: 0,
        pips: 0,
        stats: {
            STR: { max: 0, current: 0 },
            DEX: { max: 0, current: 0 },
            WIL: { max: 0, current: 0 },
            HP:  { max: 0, current: 0 } 
        },
        // НОВЫЕ ТЕКСТОВЫЕ ПОЛЯ
        background: "",       // Происхождение
        birthSign: "",        // Знак рождения
        coat: "",             // Окрас
        appearance: "",       // Внешность
        grit: 0,              // Выдержка
        ignoredConditions: "",// Игнорируемые состояния
        bankItems: "",        // Предметы в банке
        notes: "",            // Заметки
		customItems: [], // Созданные предметы
        items: [] // Массив инвентаря
    },
    listeners: [],
    // Подписка интерфейса и хранилища на изменения
    subscribe(callback) {
        this.listeners.push(callback);
    },
    // Оповещение всех систем об изменениях
    notify() {
        if (typeof AppStorage !== "undefined" && this.data.id) {
            AppStorage.save(this.data.id, this.data);
        }
        this.listeners.forEach(callback => callback(this.data));
    },
    // Загрузка сохраненных данных
    loadFromData(savedData) {
        if (savedData) {
            this.data = savedData;
            this.notify();
        }
    },
    // Изменение текстовых полей
    setField(field, value) {
        if (field in this.data) {
            this.data[field] = value;
            this.notify();
        }
    },
    // Изменение характеристик
    setStat(statKey, type, value) {
        const num = Math.max(0, parseInt(value, 10) || 0);
        if (this.data.stats[statKey] && (type === "max" || type === "current")) {
            this.data.stats[statKey][type] = num;
            this.notify();
        }
    }
};
