// js/menu.js — Логика стартовой страницы
document.addEventListener("DOMContentLoaded", () => {
    renderCharList();
    // 1. Создание пустого листа
    document.getElementById('btn-new').addEventListener('click', () => {
        const newId = "char_" + Date.now();
        AppStorage.setActive(newId);
        window.location.href = "sheet.html"; // Переходим на лист
    });
    // 2. Открытие попапа генератора персонажа
    document.getElementById('btn-generate').addEventListener('click', () => {
        CharGenerator.open();
    });
    CharGenerator.init();
    // 3. ЭКСПОРТ (Сохранение базы в JSON)
    document.getElementById('btn-export').addEventListener('click', () => {
        const data = AppStorage.getAll();
        if (Object.keys(data).length === 0) {
            alert("У вас нет сохраненных персонажей для экспорта.");
            return;
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "mausritter_sheet.json";
        a.click();
        URL.revokeObjectURL(url);
    });
	// 4. ИМПОРТ (Загрузка базы из JSON)
    document.getElementById('file-import').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                localStorage.setItem(AppStorage.charsKey, JSON.stringify(data));
                renderCharList();
                alert("База персонажей успешно загружена!");
            } catch (err) {
                alert("Ошибка чтения файла. Убедитесь, что это корректный .json");
            } finally {
                e.target.value = '';
            }
        };
        reader.readAsText(file);
    });
});
// Отрисовка списка сохраненных мышей
function renderCharList() {
    const listEl = document.getElementById('char-list');
    listEl.innerHTML = '';
    const chars = AppStorage.getAll();
    const keys = Object.keys(chars);
    if (keys.length === 0) {
        listEl.innerHTML = '<p class="empty-list-msg">Пока нет сохраненных персонажей.</p>';
        return;
    }
    keys.forEach(id => {
        const char = chars[id];
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <div class="char-card-info" onclick="openChar('${id}')">
                <span class="char-card-name">${char.name || "Безымянная мышь"}</span>
                <span class="char-card-level">Уровень: ${char.level || 0}</span>
            </div>
            <button type="button" class="btn-action delete char-card-delete" onclick="deleteChar('${id}')">Удалить</button>
        `;
        listEl.appendChild(card);
    });
}
// Глобальные функции для кнопок в списке
window.openChar = function(id) {
    AppStorage.setActive(id);
    window.location.href = "sheet.html";
};
window.deleteChar = function(id) {
    if (confirm("Вы уверены, что хотите удалить этого персонажа безвозвратно?")) {
        AppStorage.delete(id);
        renderCharList();
    }
};

// --- ГЕНЕРАТОР ПЕРСОНАЖА ---
const CharGenerator = {
    state: null,
    // Бросок одного кубика d6 (1..6)
    rollD6() {
        return Math.floor(Math.random() * 6) + 1;
    },
    // Бросок 3d6 и сумма двух наибольших значений
    rollStat3d6() {
        const rolls = [this.rollD6(), this.rollD6(), this.rollD6()];
        const sorted = [...rolls].sort((a, b) => b - a);
        return {
            rolls: rolls,
            total: sorted[0] + sorted[1]
        };
    },
    // Случайный элемент массива
    pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
	// Соответствие ID предмета-подёнщика и описания внешности
    hirelingMap: {
        "hireling_bee": "Верная пчела",
        "hireling_packrat": "Вьючная крыса",
        "hireling_torchbearer": "Пьяный факелоносец"
    },

    // Бросок 2d6 для характеристик подёнщика
    roll2d6() {
        return this.rollD6() + this.rollD6();
    },

    // Создание объекта подёнщика по его типу
    createGeneratedHireling(itemId) {
        const appearanceText = this.hirelingMap[itemId];
        if (!appearanceText) return null;
        return {
            sourceItemId: itemId,
            appearance: appearanceText,
            birthSign: this.pickRandom(GameData.generatorTables.birthsigns),
            stats: {
                HP:  this.rollD6(),
                STR: this.roll2d6(),
                DEX: this.roll2d6(),
                WIL: this.roll2d6()
            }
        };
    },

    // Пересборка списка активных подёнщиков (основное происхождение + бонусное при статах <= 9)
    getActiveGeneratedHirelings() {
        if (!this.state) return [];
        const list = [];
        if (this.state.mainHireling) {
            list.push(this.state.mainHireling);
        }
        if (this.state.bonusHireling) {
            if (this.state.bonusMode === "both" ||
               (this.state.bonusMode === "one" && this.state.selectedBonusChoice === "A")) {
                list.push(this.state.bonusHireling);
            }
        }
        return list.slice(0, 2); // Максимум 2 подёнщика
    },
    init() {
        const overlay = document.getElementById('gen-modal-overlay');
        const btnClose = document.getElementById('btn-gen-close');
        const btnSave = document.getElementById('btn-gen-save');
        if (!overlay) return;
        // Закрытие по крестику и клику на фон
        btnClose.addEventListener('click', () => this.close());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });
        // Кнопки обмена характеристик
        document.querySelectorAll('.btn-swap').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleSwap(btn.dataset.swap);
            });
        });
        // Кнопка "Сохранить"
        btnSave.addEventListener('click', () => this.saveCharacter());
    },
    open() {
        this.generateNewMouse();
        this.render();
        document.getElementById('gen-modal-overlay').classList.remove('hidden');
        document.body.classList.add('modal-open');
    },
    close() {
        document.getElementById('gen-modal-overlay').classList.add('hidden');
        document.body.classList.remove('modal-open');
    },
    // Генерация всех параметров новой мыши
    generateNewMouse() {
        const tables = GameData.generatorTables;
        const baseStats = {
            STR: this.rollStat3d6(),
            DEX: this.rollStat3d6(),
            WIL: this.rollStat3d6()
        };
        const hp = this.rollD6();
        const pips = this.rollD6();
        const bgKey = `${hp}_${pips}`;
        const mainBg = tables.backgrounds[bgKey] || tables.backgrounds["1_1"];
        // Определяем максимальное значение характеристики
        const maxStat = Math.max(baseStats.STR.total, baseStats.DEX.total, baseStats.WIL.total);
        // Если макс. стат <= 9, выбираем случайную строку таблицы происхождений для бонусных предметов
        let bonusBg = null;
        let bonusMode = "none"; // 'none' | 'one' (<=9) | 'both' (<=7)
        if (maxStat <= 9) {
            const allBgKeys = Object.keys(tables.backgrounds);
            const randomKey = this.pickRandom(allBgKeys);
            bonusBg = tables.backgrounds[randomKey];
            bonusMode = maxStat <= 7 ? "both" : "one";
        }
        const birthSign = this.pickRandom(tables.birthsigns);
        const coatColor = this.pickRandom(tables.coatColors);
        const coatPattern = this.pickRandom(tables.coatPatterns);
        const feature = this.pickRandom(tables.features);
        // Список оружия из базы предметов
        const weapons = Object.values(GameData.itemDatabase).filter(i => i.type === "weapon");
        const defaultWeaponId = weapons.length > 0 ? weapons[0].id : "improvised";
        const mainHireling = this.createGeneratedHireling(mainBg.itemA.id);
        const bonusHireling = bonusBg ? this.createGeneratedHireling(bonusBg.itemA.id) : null;
        this.state = {
            name: "",
            baseStats: baseStats,
            currentStats: {
                STR: { ...baseStats.STR },
                DEX: { ...baseStats.DEX },
                WIL: { ...baseStats.WIL }
            },
            activeSwap: null,
            hp: hp,
            pips: pips,
            mainBg: mainBg,
            bonusBg: bonusBg,
            bonusMode: bonusMode,
            selectedBonusChoice: "A",
            mainHireling: mainHireling,
            bonusHireling: bonusHireling,
            birthSign: birthSign,
            appearance: `Цвет шкурки: ${coatColor}\nУзор шкурки: ${coatPattern}\nОсобенность: ${feature}`,
            selectedWeaponId: defaultWeaponId
        };
		const nameInput = document.getElementById('gen-name');
        if (nameInput) nameInput.value = "";
        const appInput = document.getElementById('gen-appearance');
        if (appInput) appInput.value = this.state.appearance;
    },
    // Переключение обмена двух характеристик
    toggleSwap(swapKey) {
        if (!this.state) return;
        // Сбрасываем к базовым броскам
        this.state.currentStats = {
            STR: { ...this.state.baseStats.STR },
            DEX: { ...this.state.baseStats.DEX },
            WIL: { ...this.state.baseStats.WIL }
        };
        // Если нажали на уже активную кнопку — отменяем обмен
        if (this.state.activeSwap === swapKey) {
            this.state.activeSwap = null;
        } else {
            this.state.activeSwap = swapKey;
            const [statA, statB] = swapKey.split('-');
            const temp = this.state.currentStats[statA];
            this.state.currentStats[statA] = this.state.currentStats[statB];
            this.state.currentStats[statB] = temp;
        }
        this.renderStats();
    },
    // Отрисовка всего окна генератора
    render() {
        if (!this.state) return;
        this.renderStats();
        // Блок 3: Защита, зёрнышки, происхождение, знак рождения
        document.getElementById('gen-hp-val').textContent = this.state.hp;
        document.getElementById('gen-pips-val').textContent = this.state.pips;
        document.getElementById('gen-bg-val').textContent = this.state.mainBg.name;
        document.getElementById('gen-sign-val').textContent = this.state.birthSign;
        // Блок 5: Снаряжение и оружие
        this.renderEquipment();
        this.renderWeapons();
		this.renderHirelingsBlock();
    },
    // Отрисовка характеристик и кнопок обмена
    renderStats() {
        const s = this.state.currentStats;
        document.getElementById('gen-str-rolls').textContent = s.STR.rolls.join(', ');
        document.getElementById('gen-str-val').textContent = s.STR.total;
        document.getElementById('gen-dex-rolls').textContent = s.DEX.rolls.join(', ');
        document.getElementById('gen-dex-val').textContent = s.DEX.total;
        document.getElementById('gen-wil-rolls').textContent = s.WIL.rolls.join(', ');
        document.getElementById('gen-wil-val').textContent = s.WIL.total;
        document.querySelectorAll('.btn-swap').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.swap === this.state.activeSwap);
        });
    },
    // Отрисовка списка стартового снаряжения и бонусного выбора (при статах <= 9 или <= 7)
    renderEquipment() {
        const listEl = document.getElementById('gen-equipment-list');
        listEl.innerHTML = '';
        const baseItems = [
            "Факелы (связка)",
            "Пайки",
            this.state.mainBg.itemA.label,
            this.state.mainBg.itemB.label
        ];
        // Если макс. характеристика <= 7, оба дополнительных предмета берутся сразу
        if (this.state.bonusMode === "both" && this.state.bonusBg) {
            baseItems.push(`${this.state.bonusBg.itemA.label} (бонус за макс. стат ≤ 7: ${this.state.bonusBg.name})`);
            baseItems.push(`${this.state.bonusBg.itemB.label} (бонус за макс. стат ≤ 7: ${this.state.bonusBg.name})`);
        }
        baseItems.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            listEl.appendChild(li);
        });
        // Блок выбора одного из двух предметов, если макс. характеристика 8 или 9
        const bonusBlock = document.getElementById('gen-bonus-block');
        const bonusTitle = document.getElementById('gen-bonus-title');
        const bonusOptions = document.getElementById('gen-bonus-options');
        bonusOptions.innerHTML = '';
        if (this.state.bonusMode === "one" && this.state.bonusBg) {
            bonusBlock.classList.remove('hidden');
            bonusTitle.textContent = `Макс. характеристика ≤ 9 — выберите 1 доп. предмет (${this.state.bonusBg.name}):`;
            const choices = [
			{ key: "A", item: this.state.bonusBg.itemA },
                { key: "B", item: this.state.bonusBg.itemB }
            ];
            choices.forEach(c => {
                const row = document.createElement('div');
                row.className = 'gen-selectable-row' + (this.state.selectedBonusChoice === c.key ? ' selected' : '');
                row.innerHTML = `<span>${c.item.label}</span>`;
                row.addEventListener('click', () => {
                    this.state.selectedBonusChoice = c.key;
                    this.renderEquipment();
					this.renderHirelingsBlock();
                });
                bonusOptions.appendChild(row);
            });
        } else {
            bonusBlock.classList.add('hidden');
        }
    },
    // Отрисовка списка оружия
    renderWeapons() {
        const container = document.getElementById('gen-weapons-list');
        container.innerHTML = '';
        const weapons = Object.values(GameData.itemDatabase).filter(i => i.type === "weapon");
        weapons.forEach(w => {
            const row = document.createElement('div');
            const isSelected = (this.state.selectedWeaponId === w.id);
            row.className = 'gen-selectable-row' + (isSelected ? ' selected' : '');
            row.innerHTML = `<span>${w.name}</span>
                <span>${w.detail} [${w.packSize} яч.]</span>`;
            row.addEventListener('click', () => {
                this.state.selectedWeaponId = w.id;
                this.renderWeapons();
            });
            container.appendChild(row);
        });
    },
    // Создание экземпляра предмета для инвентаря по его ID из GameData.itemDatabase
    createInventoryInstance(itemId, indexOffset = 0) {
        const template = GameData.itemDatabase[itemId];
        if (!template) return null;
        return {
            instanceId: "item_" + Date.now() + "_" + indexOffset + "_" + Math.floor(Math.random() * 1000),
            itemId: template.id,
            name: template.name,
            type: template.type,
            detail: template.detail,
            baseDetail: template.detail,
            maxUses: template.maxUses,
            usedCount: 0,
            packSize: template.packSize,
            pawsSize: template.pawsSize,
            bodySize: template.bodySize,
            location: "pack",
            versatile: template.versatile || null
        };
    },
    // Сохранение персонажа и переход на sheet.html
    saveCharacter() {
        if (!this.state) return;

        const newId = "char_" + Date.now();
        const nameVal = document.getElementById('gen-name').value.trim() || "Безымянная мышь";
        const appearanceVal = document.getElementById('gen-appearance').value;

        // Собираем ID всех стартовых предметов
        const itemIdsToAdd = [
            "torch",
            "rations",
            this.state.mainBg.itemA.id,
            this.state.mainBg.itemB.id
        ];

        if (this.state.bonusMode === "one" && this.state.bonusBg) {
            const chosen = this.state.selectedBonusChoice === "B"
                ? this.state.bonusBg.itemB.id
                : this.state.bonusBg.itemA.id;
            itemIdsToAdd.push(chosen);
        } else if (this.state.bonusMode === "both" && this.state.bonusBg) {
            itemIdsToAdd.push(this.state.bonusBg.itemA.id, this.state.bonusBg.itemB.id);
        }

        if (this.state.selectedWeaponId) {
            itemIdsToAdd.push(this.state.selectedWeaponId);
        }

        // Отфильтровываем ID подёнщиков из обычных предметов инвентаря
        const inventoryItems = [];
        itemIdsToAdd.forEach((id, idx) => {
            if (this.hirelingMap[id]) return; // Подёнщик пойдет в раздел hirelings
            const inst = this.createInventoryInstance(id, idx);
            if (inst) inventoryItems.push(inst);
        });

        // Формируем карточки сгенерированных подёнщиков для листа персонажа
        const activeHirelings = this.getActiveGeneratedHirelings();
        const hirelingsData = activeHirelings.map((h, idx) => ({
            id: "h_" + Date.now() + "_" + idx,
            name: h.appearance.split('\n')[0] || "Подёнщик",
            appearance: h.appearance,
            birthSign: h.birthSign,
            stats: {
                HP:  { max: h.stats.HP,  current: h.stats.HP },
                STR: { max: h.stats.STR, current: h.stats.STR },
                DEX: { max: h.stats.DEX, current: h.stats.DEX },
                WIL: { max: h.stats.WIL, current: h.stats.WIL }
            }
        }));

        const s = this.state.currentStats;
        const newCharData = {
            id: newId,
            name: nameVal,
            level: 1,
            xp: 0,
            pips: this.state.pips,
            stats: {
                STR: { max: s.STR.total, current: s.STR.total },
                DEX: { max: s.DEX.total, current: s.DEX.total },
                WIL: { max: s.WIL.total, current: s.WIL.total },
                HP:  { max: this.state.hp, current: this.state.hp }
            },
			background: this.state.mainBg.name,
            birthSign: this.state.birthSign,
            appearance: appearanceVal,
            grit: 0,
            ignoredConditions: [],
            bankItems: "",
            notes: "",
            customItems: [],
            items: inventoryItems,
            hirelings: hirelingsData
        };

        AppStorage.save(newId, newCharData);
        AppStorage.setActive(newId);
        window.location.href = "sheet.html";
    },
    // Отрисовка Блока 6 (Сгенерированный подёнщик)
    renderHirelingsBlock() {
        const block = document.getElementById('gen-hireling-block');
        const container = document.getElementById('gen-hirelings-container');
        if (!block || !container) return;

        const activeHirelings = this.getActiveGeneratedHirelings();
        container.innerHTML = '';

        if (activeHirelings.length === 0) {
            block.classList.add('hidden');
            return;
        }

        block.classList.remove('hidden');

        activeHirelings.forEach((h, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gen-hireling-item';
            wrapper.innerHTML = `
                <div class="gen-info-item">
                    <span class="gen-info-label">Знак рождения:</span>
                    <strong class="gen-info-value">${h.birthSign}</strong>
                </div>
                <label>Внешность:</label>
                <textarea rows="2" class="input-area gen-hireling-app" data-idx="${idx}">${h.appearance}</textarea>
            `;
            const textarea = wrapper.querySelector('.gen-hireling-app');
            textarea.addEventListener('input', (e) => {
                h.appearance = e.target.value;
            });
            container.appendChild(wrapper);
        });
    }
};



