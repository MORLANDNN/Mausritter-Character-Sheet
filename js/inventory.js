// js/inventory.js — Логика слотов, перегруза, зернышек и действий с предметами
const InventoryLogic = {
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
            template.id = "custom_" + Date.now(); 
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
        if (targetLocation === "equipped" && newItem.versatile && equipMode) {
            if (equipMode === "equip_1") {
                newItem.pawsSize = newItem.versatile.onePaw.size;
                newItem.detail = newItem.versatile.onePaw.detail;
				} else if (equipMode === "equip_2") {
                newItem.pawsSize = newItem.versatile.twoPaws.size;
                newItem.detail = newItem.versatile.twoPaws.detail;
            }
        }
        // Состояния всегда идут в мешок
        if (template.type === "condition") {
            newItem.location = "pack";
            CharacterState.data.items.push(newItem);
            CharacterState.notify();
            return { success: true, item: newItem };
        }
        // При экипировке проверяем, есть ли физически место в лапах/на теле
        if (targetLocation === "equipped") {
            if (!this.canEquip(newItem)) {
                return {
                    success: false,
                    error: "Недостаточно свободных ячеек (В лапах / Надетое) для этого предмета!"
                };
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
        // Выходим только если локация та же И не запрошена смена хвата
        if (item.location === newLocation && !equipMode) return { success: true };
        // Сохраняем исходные данные для возможного отката
        const originalSize = item.pawsSize;
        const originalDetail = item.detail;
        // Применяем модификаторы универсального оружия
        if (newLocation === "equipped" && item.versatile && equipMode) {
            if (equipMode === "equip_1") {
                item.pawsSize = item.versatile.onePaw.size;
                item.detail = item.versatile.onePaw.detail;
            } else if (equipMode === "equip_2") {
                item.pawsSize = item.versatile.twoPaws.size;
                item.detail = item.versatile.twoPaws.detail;
            }
        } else if (newLocation === "pack" && item.versatile) {
            // При возврате в мешок сбрасываем на базовые значения
            const template = GameData.itemDatabase[item.itemId];
            item.pawsSize = template ? template.pawsSize : 1;
            item.detail = template ? template.detail : (item.baseDetail || item.detail);
        }
        // Проверяем физическое место при экипировке (исключая старый размер этого же предмета)
        if (newLocation === "equipped") {
            if (!this.canEquip(item, item.instanceId)) {
                // Места нет - откатываем изменения габаритов
                item.pawsSize = originalSize;
                item.detail = originalDetail;
                return { success: false, error: "Недостаточно места в лапах или на теле!" };
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
        // Старую кнопку use оставляем для совместимости, но UI.js ее отфильтрует
        if (item.maxUses > 0 && item.usedCount < item.maxUses) {
            actions.push({ type: "use", label: "Отметить использование" });
        }
        if (item.type !== "condition") {
            if (item.location === "pack") {
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
            } else if (item.location === "equipped") {
                // Если оружие УЖЕ в лапах, и оно универсальное — добавляем кнопки для смены хвата
                if (item.versatile) {
                    if (item.pawsSize === 1) {
                        actions.push({ type: "equip_2", label: "Взять в 2 лапы" });
                    } else if (item.pawsSize === 2) {
                        actions.push({ type: "equip_1", label: "Взять в 1 лапу" });
                    }
                }
                actions.push({ type: "pack", label: "Переместить в мешок" });
            }
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
                name: `Мешочки с зернышками (${pipsSlots * 100} шт.)`,
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


