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
        appearance: "",       // Внешность
        grit: 0,              // Выдержка
        ignoredConditions: [],// Игнорируемые состояния
        bankItems: "",        // Предметы в банке
        notes: "",            // Заметки
		customItems: [], // Созданные предметы
        items: [], // Массив инвентаря
		hirelings: [] // Массив подёнщиков
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
    // Загрузка сохраненных данных с защитой старых сохранений
    loadFromData(savedData) {
        if (savedData) {
            this.data = savedData;
            
            // Защита: если в старом сохранении нет нужных массивов — создаем их
            if (!Array.isArray(this.data.items)) this.data.items = [];
            if (!Array.isArray(this.data.customItems)) this.data.customItems = [];
            if (!Array.isArray(this.data.hirelings)) this.data.hirelings = [];
			if (typeof this.data.ignoredConditions === "string") {
                this.data.ignoredConditions = this.data.ignoredConditions ? [this.data.ignoredConditions] : [];
            } else if (!Array.isArray(this.data.ignoredConditions)) {
                this.data.ignoredConditions = [];
            }
            
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
	// Изменение конкретной строки в "Игнорируемых состояниях"
    setIgnoredCondition(index, value) {
        if (!Array.isArray(this.data.ignoredConditions)) {
            this.data.ignoredConditions = [];
        }
        this.data.ignoredConditions[index] = value;
        if (typeof AppStorage !== "undefined" && this.data.id) {
            AppStorage.save(this.data.id, this.data);
        }
    },
    // Изменение характеристик
    setStat(statKey, type, value) {
        const num = Math.max(0, parseInt(value, 10) || 0);
        if (this.data.stats[statKey] && (type === "max" || type === "current")) {
            this.data.stats[statKey][type] = num;
            this.notify();
        }
    },
	// Изменение полей подёнщика
    setHirelingField(hId, field, value, type = null, silent = false) {
        const h = this.data.hirelings.find(x => x.id === hId);
        if (!h) return;
        if (type) {
            if (h.stats[field]) h.stats[field][type] = Math.max(0, parseInt(value, 10) || 0);
        } else {
            h[field] = value;
        }
        if (silent) {
            if (typeof AppStorage !== "undefined" && this.data.id) {
                AppStorage.save(this.data.id, this.data);
            }
        } else {
            this.notify();
        }
    }
};
