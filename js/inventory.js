// js/inventory.js — Логика слотов, перегруза, зернышек и действий с предметами
const InventoryLogic = {
	// Случайная генерация характеристик (2d6) и знака рождения подёнщика
    rollHirelingStats(hId) {
        const h = (CharacterState.data.hirelings || []).find(x => x.id === hId);
        if (!h) return;

        const d6 = () => Math.floor(Math.random() * 6) + 1;
        const roll2d6 = () => d6() + d6();

        const hp = d6(); // Если для ЗАЩ тоже нужно 2d6, замените d6() на roll2d6()
        const str = roll2d6();
        const dex = roll2d6();
        const wil = roll2d6();

        h.stats = {
            HP:  { max: hp,  current: hp },
            STR: { max: str, current: str },
            DEX: { max: dex, current: dex },
            WIL: { max: wil, current: wil }
        };

        const signs = (GameData.generatorTables && GameData.generatorTables.birthsigns)
            ? GameData.generatorTables.birthsigns
            : [
                "Звезда - храбрый/безрассудный",
                "Колесо - Трудолюбивый/приземлённый",
                "Жёлудь - Любознательный/упрямый",
                "Буря - Благородный/гневливый",
                "Луна - Мудрый/таинственный",
                "Мать - Заботливый/тревожный"
            ];
        h.birthSign = signs[Math.floor(Math.random() * signs.length)];

        CharacterState.notify();
    },
	/// --- ПОДЁНЩИКИ ---
    addHireling() {
        if (!Array.isArray(CharacterState.data.hirelings)) CharacterState.data.hirelings = [];
        if (CharacterState.data.hirelings.length >= 2) {
            return { success: false, error: "Максимум 2 подёнщика." };
        }
        CharacterState.data.hirelings.push({
            id: "h_" + Date.now(),
            name: "",
            appearance: "",
            birthSign: "",
            stats: {
                HP:  { max: 0, current: 0 },
                STR: { max: 0, current: 0 },
                DEX: { max: 0, current: 0 },
                WIL: { max: 0, current: 0 }
            }
        });
        CharacterState.notify();
        return { success: true };
    },
    removeHireling(hId) {
        const prefix = `hireling_${hId}`;
        CharacterState.data.items.forEach(i => {
            if (i.location && i.location.startsWith(prefix)) {
                i.location = "pack";
                if (i.versatile) {
                    const tpl = GameData.itemDatabase[i.itemId];
                    i.pawsSize = tpl ? tpl.pawsSize : 1;
                    i.detail = tpl ? tpl.detail : (i.baseDetail || i.detail);
                }
            }
        });
        CharacterState.data.hirelings = CharacterState.data.hirelings.filter(h => h.id !== hId);
        CharacterState.notify();
    },
    // Занято в лапах у подёнщика (макс 2)
    getHirelingUsedPaws(hId, ignoreInstanceId = null) {
        const loc = `hireling_${hId}_equipped`;
        return CharacterState.data.items
            .filter(i => i.location === loc && i.instanceId !== ignoreInstanceId)
            .reduce((sum, i) => sum + (i.pawsSize || i.bodySize || 1), 0);
    },
    // Занято в мешке у подёнщика (макс 4)
    getHirelingUsedPack(hId) {
        const loc = `hireling_${hId}_pack`;
        const legacyLoc = `hireling_${hId}`;
        return CharacterState.data.items
            .filter(i => i.location === loc || i.location === legacyLoc)
            .reduce((sum, i) => sum + i.packSize, 0);
    },
    canEquipHireling(hId, itemTemplate, ignoreInstanceId = null) {
        if (itemTemplate.type === "condition") return false;
        const needed = itemTemplate.pawsSize || itemTemplate.bodySize || 1;
        return (this.getHirelingUsedPaws(hId, ignoreInstanceId) + needed) <= 2;
    },
	getHirelingPackRows(hId) {
        const loc = `hireling_${hId}_pack`;
        const legacyLoc = `hireling_${hId}`;
        return CharacterState.data.items.filter(i => i.location === loc || i.location === legacyLoc);
    },
    // 1. ПОДСЧЕТ ЗАНЯТЫХ ЯЧЕЕК
    // Сколько слотов занимают зернышки (каждая полная сотня = 1 слот в мешке)
    getPipsSlots(pipsCount = CharacterState.data.pips) {
        return Math.floor(Math.max(0, pipsCount) / 250);
    },
    // Занято в лапах
    getUsedPaws() {
        return CharacterState.data.items
            .filter(item => item.location === "equipped")
            .reduce((sum, item) => sum + item.pawsSize, 0);
    },
    // Занято на теле (Надетое)
    getUsedBody() {
        return CharacterState.data.items
            .filter(item => item.location === "equipped")
            .reduce((sum, item) => sum + item.bodySize, 0);
    },
    // Занято в мешке (предметы в мешке + полные сотни зернышек)
    getUsedPack(customPips = CharacterState.data.pips) {
        const itemsSlots = CharacterState.data.items
            .filter(item => item.location === "pack")
            .reduce((sum, item) => sum + item.packSize, 0);
        return itemsSlots + this.getPipsSlots(customPips);
    },
    // Статус перегруза (Возвращает нужный текст, если превышен кап инвентаря)
    getOverloadStatus() {
        const used = this.getUsedPack();
        const isOverloaded = used > GameData.caps.pack;
        return {
            overloaded: isOverloaded,
            message: isOverloaded 
                ? "Перегруз: теперь мышь не может бегать и проходит с помехой все спасброски" 
                : ""
        };
    },
    // 2. ПРОВЕРКИ ВМЕСТИМОСТИ ЭКИПИРОВКИ (В мешок можно класть сколько угодно)
    // Поместится ли предмет при экипировке (в лапы и/или на тело)
    canEquip(itemTemplate, ignoreInstanceId = null) {
        // Состояния нельзя взять в лапы или надеть
        if (itemTemplate.type === "condition") return false;
        if (itemTemplate.pawsSize === 0 && itemTemplate.bodySize === 0) return false;
        const usedPaws = CharacterState.data.items
            .filter(item => item.location === "equipped" && item.instanceId !== ignoreInstanceId)
            .reduce((sum, item) => sum + item.pawsSize, 0);
        const usedBody = CharacterState.data.items
            .filter(item => item.location === "equipped" && item.instanceId !== ignoreInstanceId)
            .reduce((sum, item) => sum + item.bodySize, 0);
        const enoughPaws = (usedPaws + itemTemplate.pawsSize) <= GameData.caps.paws;
        const enoughBody = (usedBody + itemTemplate.bodySize) <= GameData.caps.body;
        return enoughPaws && enoughBody;
    },
    // 3. УПРАВЛЕНИЕ ЗЕРНЫШКАМИ (ПИПСАМИ)
    // Больше не блокируем ввод, даже если это вызовет перегруз
    setPips(newAmount) {
        const cleanAmount = Math.max(0, parseInt(newAmount, 10) || 0);
        CharacterState.data.pips = cleanAmount;
        CharacterState.notify();
        return { success: true };
    },
    // 4. ДОБАВЛЕНИЕ ПРЕДМЕТОВ И СОСТОЯНИЙ
    // targetLocation: 'equipped' или 'pack'
    // itemIdOrObject может быть строкой (id базы) ИЛИ объектом (кастомный предмет)
    addItem(itemIdOrObject, targetLocation = "pack", equipMode = null) {
        let template;
        if (typeof itemIdOrObject === "string") {
            // Берем из базы
            template = GameData.itemDatabase[itemIdOrObject];
            if (!template) return { success: false, error: "Предмет не найден в базе." };
        } else {
            // Это кастомный предмет, созданный игроком
            template = itemIdOrObject;
            if (!template.id) {
                template.id = "custom_" + Date.now();
            }
        }
        const newItem = {
            instanceId: "item_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
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
            location: targetLocation,
            versatile: template.versatile // Пробрасываем свойство универсальности, если есть
        };
        // Если предмет добавляют сразу в лапы и это универсальное оружие
        const isEquipping = targetLocation === "equipped" || targetLocation.endsWith("_equipped");
        if (isEquipping && newItem.versatile && equipMode) {
            if (equipMode === "equip_1") {
                newItem.pawsSize = newItem.versatile.onePaw.size;
                newItem.detail = newItem.versatile.onePaw.detail;
            } else if (equipMode === "equip_2") {
                newItem.pawsSize = newItem.versatile.twoPaws.size;
                newItem.detail = newItem.versatile.twoPaws.detail;
            }
        }
        // Состояния всегда идут в мешок (персонажа или подёнщика)
        if (template.type === "condition") {
            if (targetLocation.startsWith("hireling_")) {
                const hId = targetLocation.replace("hireling_", "").replace(/_(pack|equipped)$/, "");
                newItem.location = `hireling_${hId}_pack`;
            } else {
                newItem.location = "pack";
            }
            CharacterState.data.items.push(newItem);
            CharacterState.notify();
            return { success: true, item: newItem };
        }
        // Проверка места в лапах/на теле персонажа
        if (targetLocation === "equipped") {
            if (!this.canEquip(newItem)) {
                return { success: false, error: "Недостаточно свободных ячеек (В лапах / Надетое)!" };
            }
        } else if (targetLocation.endsWith("_equipped")) {
            // Проверка места в лапах подёнщика (макс 2)
            const hId = targetLocation.replace("hireling_", "").replace("_equipped", "");
            if (!this.canEquipHireling(hId, newItem)) {
                return { success: false, error: "У подёнщика недостаточно свободных ячеек «В лапах» (макс 2)!" };
            }
        }
        // В мешок предмет попадает в любом случае, просто может вызвать перегруз
        CharacterState.data.items.push(newItem);
        CharacterState.notify();
        return { success: true, item: newItem };
    },
    // 5. ДЕЙСТВИЯ В ПОПАПЕ СТРОКИ (Использование, Перемещение, Удаление)
    toggleUse(instanceId, circleIndex) {
        const item = CharacterState.data.items.find(i => i.instanceId === instanceId);
        if (!item || item.maxUses === 0) return;
        // Если кликнули по уже закрашенному последнему кружочку — снимаем отметку
        if (item.usedCount === circleIndex + 1) {
            item.usedCount = circleIndex;
        } else {
            item.usedCount = circleIndex + 1;
        }
        CharacterState.notify();
    },
    // Перемещение между Мешком и Экипировкой с учетом хвата (equipMode)
    moveItem(instanceId, newLocation, equipMode = null) {
        const item = CharacterState.data.items.find(i => i.instanceId === instanceId);
        if (!item || item.type === "condition") return { success: false, error: "Состояние нельзя переместить." };
        if (item.location === newLocation && !equipMode) return { success: true };

        const originalSize = item.pawsSize;
        const originalDetail = item.detail;
        const isEquipping = newLocation === "equipped" || newLocation.endsWith("_equipped");
        const isPacking = newLocation === "pack" || newLocation.endsWith("_pack");

        if (isEquipping && item.versatile && equipMode) {
            if (equipMode === "equip_1") {
                item.pawsSize = item.versatile.onePaw.size;
                item.detail = item.versatile.onePaw.detail;
            } else if (equipMode === "equip_2") {
                item.pawsSize = item.versatile.twoPaws.size;
                item.detail = item.versatile.twoPaws.detail;
            }
        } else if (isPacking && item.versatile) {
            const template = GameData.itemDatabase[item.itemId];
            item.pawsSize = template ? template.pawsSize : 1;
            item.detail = template ? template.detail : (item.baseDetail || item.detail);
        }

        if (newLocation === "equipped") {
            if (!this.canEquip(item, item.instanceId)) {
                item.pawsSize = originalSize;
                item.detail = originalDetail;
                return { success: false, error: "Недостаточно места в лапах или на теле!" };
            }
        } else if (newLocation.endsWith("_equipped")) {
            const hId = newLocation.replace("hireling_", "").replace("_equipped", "");
            if (!this.canEquipHireling(hId, item, item.instanceId)) {
                item.pawsSize = originalSize;
                item.detail = originalDetail;
                return { success: false, error: "У подёнщика недостаточно места «В лапах» (макс 2)!" };
            }
        }

        item.location = newLocation;
        CharacterState.notify();
        return { success: true };
    },

    // Удаление предмета
    removeItem(instanceId) {
        CharacterState.data.items = CharacterState.data.items.filter(i => i.instanceId !== instanceId);
        CharacterState.notify();
    },
    // Получение доступных кнопок для попапа
    getAvailableActions(instanceId) {
        const item = CharacterState.data.items.find(i => i.instanceId === instanceId);
        if (!item) return [];
        const actions = [];
        const loc = item.location || "pack";

        if (loc === "pack" || loc === "equipped") {
            // Предмет у персонажа
            if (item.type !== "condition") {
                if (loc === "pack") {
                    if (item.bodySize > 0) {
                        actions.push({ type: "equip", label: "Надеть" });
                    } else if (item.pawsSize > 0) {
                        if (item.versatile) {
                            actions.push({ type: "equip_1", label: "Взять в 1 лапу" });
                            actions.push({ type: "equip_2", label: "Взять в 2 лапы" });
                        } else {
                            actions.push({ type: "equip", label: "Взять в лапы" });
                        }
                    }
                } else if (loc === "equipped") {
                    if (item.versatile) {
                        if (item.pawsSize === 1) actions.push({ type: "equip_2", label: "Взять в 2 лапы" });
                        else if (item.pawsSize === 2) actions.push({ type: "equip_1", label: "Взять в 1 лапу" });
                    }
                    actions.push({ type: "pack", label: "Переместить в мешок" });
                }
            }
            // Кнопки передачи подёнщикам (всегда в мешок подёнщика)
            (CharacterState.data.hirelings || []).forEach(h => {
                actions.push({
                    type: `transfer_hireling_${h.id}_pack`,
                    label: `Передать: ${h.name || "Подёнщик"}`
                });
            });
        } else if (loc.startsWith("hireling_")) {
            // Предмет у подёнщика
            const hId = loc.replace("hireling_", "").replace(/_(pack|equipped)$/, "");
            const inHirelingEquipped = loc.endsWith("_equipped");

            if (item.type !== "condition") {
                if (!inHirelingEquipped) {
                    if (item.versatile) {
                        actions.push({ type: "h_equip_1", hId, label: "Взять в 1 лапу" });
                        actions.push({ type: "h_equip_2", hId, label: "Взять в 2 лапы" });
                    } else {
                        actions.push({ type: "h_equip", hId, label: "Взять в лапы" });
                    }
                } else {
                    if (item.versatile) {
                        if (item.pawsSize === 1) actions.push({ type: "h_equip_2", hId, label: "Взять в 2 лапы" });
                        else if (item.pawsSize === 2) actions.push({ type: "h_equip_1", hId, label: "Взять в 1 лапу" });
                    }
                    actions.push({ type: "h_pack", hId, label: "Убрать в мешок" });
                }
            }

            // Передача персонажу и другому подёнщику (всегда в мешок)
            actions.push({ type: "transfer_pack", label: "Передать персонажу (в мешок)" });
            (CharacterState.data.hirelings || []).forEach(h => {
                if (h.id !== hId) {
                    actions.push({
                        type: `transfer_hireling_${h.id}_pack`,
                        label: `Передать: ${h.name || "Подёнщик"}`
                    });
                }
            });
        }

        actions.push({ type: "delete", label: "Удалить" });
        return actions;
    },

    // 6. ПОЛУЧЕНИЕ СТРОК ДЛЯ ОТРИСОВКИ ТАБЛИЦ
    getPawsRows() {
        return CharacterState.data.items.filter(i => i.location === "equipped" && i.pawsSize > 0);
    },
    getBodyRows() {
        return CharacterState.data.items.filter(i => i.location === "equipped" && i.bodySize > 0);
    },
    getPackRows() {
        const rows = [...CharacterState.data.items.filter(i => i.location === "pack")];
        const pipsSlots = this.getPipsSlots();
        if (pipsSlots > 0) {
            rows.push({
                instanceId: "virtual_pips",
                name: `Мешочки с зернышками (${pipsSlots * 250} шт.)`,
                type: "pips",
                detail: `Занимают ячеек в мешке: ${pipsSlots}`,
                maxUses: 0,
                usedCount: 0,
                packSize: pipsSlots,
                isVirtualPips: true
            });
        }
        return rows;
    }
};


