// js/ui.js — Связь данных с HTML-интерфейсом
	document.addEventListener("DOMContentLoaded", () => {
    CharacterState.subscribe(renderUI);
    const btnAddItem = document.getElementById('btn-add-item');
    if (btnAddItem) {
        btnAddItem.addEventListener('click', () => {
            UI_Modals.currentTarget = "pack";
            UI_Modals.openCatalog();
        });
    }
    // 1. ПРИВЯЗКА ПРОСТЫХ ТЕКСТОВЫХ И ЧИСЛОВЫХ ПОЛЕЙ
    const fieldMap = {
        'name': 'name',
        'background': 'background',
        'birthsign': 'birthSign',
        'appearance': 'appearance',
        'bank': 'bankItems',
        'notes': 'notes',
        'level': 'level',
        'xp': 'xp',
        'grit': 'grit'
    };
    Object.entries(fieldMap).forEach(([htmlKey, stateKey]) => {
        const input = document.getElementById(`char-${htmlKey}`);
        if (input) {
            input.addEventListener('input', (e) => {
                const val = input.type === 'number' ? (parseInt(e.target.value, 10) || 0) : e.target.value;
                CharacterState.setField(stateKey, val);
            });
        }
    });
    // 2. ПРИВЯЗКА ХАРАКТЕРИСТИК (СИЛ, ЛОВ, ВОЛ, ЗАЩ)
    const stats = ['str', 'dex', 'wil', 'hp'];
    stats.forEach(stat => {
        ['current', 'max'].forEach(type => {
            const input = document.getElementById(`${stat}-${type}`);
            if (input) {
                input.addEventListener('input', (e) => CharacterState.setStat(stat.toUpperCase(), type, e.target.value));
            }
        });
    });
    // 3. ЗЕРНЫШКИ (Пипсы)
    const pipsInput = document.getElementById('char-pips');
    if (pipsInput) {
        pipsInput.addEventListener('input', (e) => InventoryLogic.setPips(e.target.value));
    }
    // 4. РАСКРЫТИЕ ВЫПАДАЮЩИХ СПИСКОВ НА 5 СТРОК (только на ПК)
    document.querySelectorAll('.scrollable-native-select').forEach(selectEl => {
        selectEl.addEventListener('focus', function() {
            if (window.innerWidth > 768) {
                this.size = 5;
            }
        });
        selectEl.addEventListener('change', function() {
            this.size = 1;
            this.blur();
            this.dispatchEvent(new Event('input'));
        });
        selectEl.addEventListener('blur', function() {
            this.size = 1;
        });
    });
    // 4.1. МОБИЛЬНОЕ ПЕРЕКЛЮЧЕНИЕ КОЛОНОК (КНОПКИ + СВАЙП)
    initMobileColumns();
	// Кнопка menu
	const btnMenu = document.getElementById('btn-menu');
    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            window.location.href = "index.html";
        });
    }
	// МОБИЛЬНАЯ НАВИГАЦИЯ И СВАЙПЫ
	function initMobileColumns() {
        const appContainer = document.getElementById('app-container');
        if (!appContainer) return;
        const cols = ['left', 'right', 'hirelings'];
        let currentIndex = 0;

        function setMobileCol(index) {
            currentIndex = (index + cols.length) % cols.length;
            appContainer.classList.remove('mobile-show-left', 'mobile-show-right', 'mobile-show-hirelings');
            appContainer.classList.add(`mobile-show-${cols[currentIndex]}`);
        }

        setMobileCol(0); // По умолчанию "Основное"

        document.querySelectorAll('.btn-col-switch').forEach(btn => {
            btn.addEventListener('click', () => {
                const dir = btn.dataset.dir === 'prev' ? -1 : 1;
                setMobileCol(currentIndex + dir);
            });
        });

        let touchStartX = 0;
        let touchStartY = 0;
        let isSwipingFromInput = false;

        appContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            const tag = e.target.tagName.toLowerCase();
            isSwipingFromInput = (tag === 'input' || tag === 'textarea' || tag === 'select');
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        appContainer.addEventListener('touchend', (e) => {
            if (window.innerWidth > 768 || isSwipingFromInput) return;
            const overlay = document.getElementById('modal-overlay');
            if (overlay && !overlay.classList.contains('hidden')) return;
            if (e.changedTouches.length !== 1) return;

            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = e.changedTouches[0].clientY - touchStartY;

            if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
                if (deltaX < 0) {
                    // Свайп влево -> следующая колонка по кругу (Подёнщики -> Основное)
                    setMobileCol(currentIndex + 1);
                } else if (deltaX > 0) {
                    // Свайп вправо -> предыдущая колонка по кругу (Основное -> Подёнщики)
                    setMobileCol(currentIndex - 1);
                }
            }
        }, { passive: true });
    }


    // 5. ЗАГРУЗКА СОХРАНЕНИЯ ИЗ LOCALSTORAGE ПРИ СТАРТЕ
	// --- ЗАГРУЗКА ПЕРСОНАЖА ПО ID ИЛИ ВОЗВРАТ В МЕНЮ ---
    if (typeof AppStorage !== "undefined") {
        const activeId = AppStorage.getActive();
        if (!activeId) {
            window.location.href = "index.html"; // Если нет ID, выбрасываем в меню
            return;
        }
        const saved = AppStorage.load(activeId);
        if (saved) {
            CharacterState.loadFromData(saved);
            if (!Array.isArray(CharacterState.data.customItems)) CharacterState.data.customItems = [];
            if (!Array.isArray(CharacterState.data.items)) CharacterState.data.items = [];
            Object.entries(fieldMap).forEach(([htmlKey, stateKey]) => {
                const input = document.getElementById(`char-${htmlKey}`);
                if (input && CharacterState.data[stateKey] !== undefined) {
                    input.value = CharacterState.data[stateKey];
                }
            });
            stats.forEach(stat => {
                ['current', 'max'].forEach(type => {
                    const input = document.getElementById(`${stat}-${type}`);
                    const statObj = CharacterState.data.stats[stat.toUpperCase()];
                    if (input && statObj) {
                        input.value = statObj[type];
                    }
                });
            });
            if (pipsInput) {
                pipsInput.value = CharacterState.data.pips || 0;
            }
        } else {
            CharacterState.data.id = activeId; // Присваиваем ID пустой мыши
        }
    }
    // Первичная отрисовка интерфейса
    renderUI();
});
// ГЛАВНАЯ ФУНКЦИЯ ОТРИСОВКИ
function renderUI() {
    // 1. Обновление счетчиков в заголовках таблиц
    document.getElementById('paws-count').textContent = `${InventoryLogic.getUsedPaws()}/${GameData.caps.paws}`;
    document.getElementById('body-count').textContent = `${InventoryLogic.getUsedBody()}/${GameData.caps.body}`;
    document.getElementById('pack-count').textContent = `${InventoryLogic.getUsedPack()}/${GameData.caps.pack}`;
    // 2. Проверка и отображение перегруза
	const overload = InventoryLogic.getOverloadStatus();
    const overloadWarning = document.getElementById('overload-warning');
    if (overload.overloaded) {
        overloadWarning.textContent = overload.message;
        overloadWarning.classList.remove('hidden');
    } else {
        overloadWarning.classList.add('hidden');
    }
    // 3. Отрисовка таблиц инвентаря
    renderList('paws-list', InventoryLogic.getPawsRows());
    renderList('body-list', InventoryLogic.getBodyRows());
    renderList('pack-list', InventoryLogic.getPackRows());
    renderIgnoredConditions();
	renderHirelings();
}
// Функция сборки конкретного списка (В лапах, Надетое, В мешке)
function renderList(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        let usesHtml = '';
        if (item.maxUses > 0) {
            usesHtml = '<div class="uses-container">';
            for (let i = 0; i < item.maxUses; i++) {
                const filledClass = i < item.usedCount ? 'filled' : '';
                usesHtml += `<div class="use-circle ${filledClass}" data-instance="${item.instanceId}" data-index="${i}"></div>`;
            }
            usesHtml += '</div>';
        }
        itemEl.innerHTML = `<div class="item-header">
                <span class="item-name">${item.name}</span>
                ${usesHtml}
            </div>
            <div class="item-detail">${item.detail}</div>`;
        // Клик по кружочкам прочности
        const circles = itemEl.querySelectorAll('.use-circle');
        circles.forEach(circle => {
            circle.addEventListener('click', (e) => {
                e.stopPropagation();
                InventoryLogic.toggleUse(e.target.dataset.instance, parseInt(e.target.dataset.index, 10));
            });
        });
        // Клик по строке (только для реальных предметов, не для мешочков с зернышками)
        if (!item.isVirtualPips) {
            itemEl.addEventListener('click', () => {
                UI_Modals.openActions(item.instanceId);
            });
        }
        container.appendChild(itemEl);
    });
    if (items.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'empty-slot';
        container.appendChild(emptyEl);
    }
}
// --- ЛОГИКА МОДАЛЬНЫХ ОКОН (ПОПАПОВ) ---
	const UI_Modals = {
		currentTarget: "pack",
		overlay: () => document.getElementById('modal-overlay'),
		showOverlay() {
			this.overlay().classList.remove('hidden');
			document.body.classList.add('modal-open');
		},
		closeAll() {
			this.overlay().classList.add('hidden');
			document.body.classList.remove('modal-open');
			document.querySelectorAll('.modal-content').forEach(el => el.classList.add('hidden'));
		},

    // 1. КАТАЛОГ С РАСКРЫВАЮЩИМИСЯ КАТЕГОРИЯМИ
    openCatalog() {
        this.closeAll();
        const list = document.getElementById('catalog-list');
        list.innerHTML = '';
        const renderCategorySection = (title, itemsArray, isCustom = false) => {
            const catHeader = document.createElement('div');
            catHeader.className = 'catalog-category';
            catHeader.textContent = title;
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'catalog-category-items hidden';
            itemsArray.forEach(item => {
                itemsContainer.appendChild(this.createCatalogItemEl(item, isCustom));
            });
            catHeader.addEventListener('click', () => {
                const isHidden = itemsContainer.classList.toggle('hidden');
                catHeader.classList.toggle('open', !isHidden);
            });
            list.appendChild(catHeader);
            list.appendChild(itemsContainer);
        };
        for (const [catKey, catName] of Object.entries(GameData.categories)) {
            const itemsInCat = Object.values(GameData.itemDatabase).filter(i => i.type === catKey);
            if (itemsInCat.length === 0) continue;
            renderCategorySection(catName, itemsInCat, false);
        }
        if (CharacterState.data.customItems.length > 0) {
			renderCategorySection('Созданные вами', CharacterState.data.customItems, true);
        }
        this.showOverlay();
        document.getElementById('modal-catalog').classList.remove('hidden');
    },
    createCatalogItemEl(template, isCustom = false) {
        const div = document.createElement('div');
        div.className = 'catalog-item';
        div.innerHTML = `<span class="catalog-item-name">${template.name}</span> <span class="catalog-item-size">[${template.packSize} яч.]</span>`;
        div.onclick = () => {
            this.openLocationChoice(isCustom ? template : template.id);
        };
        return div;
    },
    // 2. СОЗДАНИЕ КАСТОМНОГО ПРЕДМЕТА
    openCreate() {
        this.closeAll();
        document.getElementById('custom-name').value = '';
        document.getElementById('custom-type').value = 'item';
        document.getElementById('custom-detail').value = '';
        document.getElementById('custom-uses').value = '0';
        document.getElementById('custom-slots').value = '1';
        document.getElementById('custom-weapon-block').classList.add('hidden');
        document.getElementById('custom-armor-block').classList.add('hidden');
        document.getElementById('custom-armor-size').value = 'light';
        document.getElementById('custom-slots-block').classList.remove('hidden');
        this.showOverlay();
        document.getElementById('modal-create').classList.remove('hidden');
    },
    saveCustomItem() {
        const name = document.getElementById('custom-name').value || "Неизвестный предмет";
        const type = document.getElementById('custom-type').value;
        const detail = document.getElementById('custom-detail').value;
        const uses = Math.min(6, Math.max(0, parseInt(document.getElementById('custom-uses').value, 10) || 0));
        let packSize = 1, pawsSize = 0, bodySize = 0;
        let versatile = null;
        if (type === 'weapon') {
            const wSize = document.getElementById('custom-weapon-size').value;
            if (wSize === 'light') {
                packSize = 1;
                pawsSize = 1;
            } else if (wSize === 'medium') {
                packSize = 1;
                pawsSize = 1;
                versatile = {
                    onePaw: { size: 1, detail: detail + " (В 1 лапе)" },
                    twoPaws: { size: 2, detail: detail + " (В 2 лапах)" }
                };
            } else if (wSize === 'heavy') {
                packSize = 2;
                pawsSize = 2;
            }
        } else if (type === 'armor') {
            const aSize = document.getElementById('custom-armor-size').value;
            packSize = 2;
            if (aSize === 'light') {
                pawsSize = 1;
                bodySize = 1;
            } else {
                pawsSize = 0;
                bodySize = 2;
            }
        } else {
            const slots = parseInt(document.getElementById('custom-slots').value, 10) || 1;
            packSize = slots;
            if (type !== 'condition') pawsSize = slots;
        }
        const template = {
            id: "custom_" + Date.now(),
            name,
            type,
            detail,
            maxUses: uses,
            packSize,
            pawsSize,
            bodySize,
            versatile
        };
        CharacterState.data.customItems.push(template);
        this.openLocationChoice(template);
    },
    // 3. ПОПАП ДЕЙСТВИЙ (Меню строки)
    openActions(instanceId) {
        const item = CharacterState.data.items.find(i => i.instanceId === instanceId);
        if (!item) return;
        this.closeAll();
        document.getElementById('action-item-name').textContent = item.name;
        const container = document.getElementById('action-buttons');
        container.innerHTML = '';
        // Блок использования (прочности)
        if (item.maxUses > 0) {
            const useBlock = document.createElement('div');
            useBlock.style.display = 'flex';
            useBlock.style.alignItems = 'center';
            useBlock.style.justifyContent = 'space-between';
            useBlock.style.marginBottom = '8px';
            useBlock.style.background = '#333';
            useBlock.style.borderRadius = '4px';
            useBlock.style.padding = '4px';
            const btnMinus = document.createElement('button');
            btnMinus.className = 'btn-action';
            btnMinus.style.width = '40px';
            btnMinus.style.marginBottom = '0';
            btnMinus.textContent = '-';
            btnMinus.onclick = () => {
                if (item.usedCount > 0) {
					InventoryLogic.toggleUse(instanceId, item.usedCount - 2);
                    textUses.textContent = `Использование (${item.usedCount}/${item.maxUses})`;
                }
            };
            const textUses = document.createElement('span');
            textUses.style.color = 'white';
            textUses.style.textTransform = 'uppercase';
            textUses.style.fontSize = '1.3rem';
            textUses.textContent = `Использование (${item.usedCount}/${item.maxUses})`;
            const btnPlus = document.createElement('button');
            btnPlus.className = 'btn-action';
            btnPlus.style.width = '40px';
            btnPlus.style.marginBottom = '0';
            btnPlus.textContent = '+';
            btnPlus.onclick = () => {
                if (item.usedCount < item.maxUses) {
                    InventoryLogic.toggleUse(instanceId, item.usedCount);
                    textUses.textContent = `Использование (${item.usedCount}/${item.maxUses})`;
                }
            };
            useBlock.appendChild(btnMinus);
            useBlock.appendChild(textUses);
            useBlock.appendChild(btnPlus);
            container.appendChild(useBlock);
        }
        const actions = InventoryLogic.getAvailableActions(instanceId);
        actions.forEach(action => {
            if (action.type === 'use') return;
            const btn = document.createElement('button');
            btn.className = `btn-action ${action.type === 'delete' ? 'delete' : ''}`;
            btn.textContent = action.label;
            btn.onclick = () => {
                const aType = action.type || '';
                if (aType === 'delete') {
                    InventoryLogic.removeItem(instanceId);
                    this.closeAll();
                } else if (aType === 'equip' || aType === 'equip_1' || aType === 'equip_2') {
                    const wasEquipped = item.location === "equipped";
                    const mode = aType === 'equip' ? null : aType;
                    const res = InventoryLogic.moveItem(instanceId, "equipped", mode);
                    if (!res.success) alert(res.error);
                    else if (wasEquipped) this.openActions(instanceId);
                    else this.closeAll();
                } else if (aType === 'pack') {
                    const res = InventoryLogic.moveItem(instanceId, "pack");
                    if (!res.success) alert(res.error);
                    else this.closeAll();
                } else if (aType === 'h_equip' || aType === 'h_equip_1' || aType === 'h_equip_2') {
                    const targetLoc = `hireling_${action.hId}_equipped`;
                    const wasEquipped = item.location === targetLoc;
                    const mode = aType === 'h_equip' ? null : aType.replace('h_', '');
                    const res = InventoryLogic.moveItem(instanceId, targetLoc, mode);
                    if (!res.success) alert(res.error);
                    else if (wasEquipped) this.openActions(instanceId);
                    else this.closeAll();
                } else if (aType === 'h_pack') {
                    const res = InventoryLogic.moveItem(instanceId, `hireling_${action.hId}_pack`);
                    if (!res.success) alert(res.error);
                    else this.closeAll();
                } else if (aType.startsWith('transfer_')) {
                    const targetLoc = aType.replace('transfer_', '');
                    const res = InventoryLogic.moveItem(instanceId, targetLoc);
                    if (!res.success) alert(res.error);
                    else this.closeAll();
                }
            };
            container.appendChild(btn);
        });
        this.showOverlay();
        document.getElementById('modal-actions').classList.remove('hidden');
    },
    // 4. ПОПАП ВЫБОРА МЕСТА
    openLocationChoice(itemIdOrObject) {
        const template = typeof itemIdOrObject === 'string'
            ? GameData.itemDatabase[itemIdOrObject]
            : itemIdOrObject;
        if (!template) return;

        const targetOwner = this.currentTarget || "main";
        const isHireling = targetOwner.startsWith("hireling_");
        const hId = isHireling ? targetOwner.replace("hireling_", "") : null;
        const packLoc = isHireling ? `hireling_${hId}_pack` : "pack";
        const equipLoc = isHireling ? `hireling_${hId}_equipped` : "equipped";

        if (template.type === 'condition') {
            InventoryLogic.addItem(itemIdOrObject, packLoc);
            this.closeAll();
            return;
        }

        this.closeAll();
        document.getElementById('location-item-name').textContent = template.name;
        const container = document.getElementById('location-buttons');
        container.innerHTML = '';

        const btnPack = document.createElement('button');
        btnPack.className = 'btn-action';
        btnPack.textContent = 'Положить в мешок';
        btnPack.onclick = () => {
            InventoryLogic.addItem(itemIdOrObject, packLoc);
            this.closeAll();
        };
        container.appendChild(btnPack);

        if (!isHireling && template.bodySize > 0) {
            const btnBody = document.createElement('button');
            btnBody.className = 'btn-action';
            btnBody.textContent = 'Надеть';
            btnBody.onclick = () => {
                const res = InventoryLogic.addItem(itemIdOrObject, equipLoc);
                if (!res.success) alert(res.error);
                else this.closeAll();
            };
            container.appendChild(btnBody);
        } else if (template.pawsSize > 0 || (isHireling && template.bodySize > 0)) {
            if (template.versatile) {
                const btn1 = document.createElement('button');
                btn1.className = 'btn-action';
                btn1.textContent = 'Взять в 1 лапу (d6)';
                btn1.onclick = () => {
                    const res = InventoryLogic.addItem(itemIdOrObject, equipLoc, "equip_1");
                    if (!res.success) alert(res.error);
                    else this.closeAll();
                };
                container.appendChild(btn1);

                const btn2 = document.createElement('button');
                btn2.className = 'btn-action';
                btn2.textContent = 'Взять в 2 лапы (d8)';
                btn2.onclick = () => {
                    const res = InventoryLogic.addItem(itemIdOrObject, equipLoc, "equip_2");
                    if (!res.success) alert(res.error);
                    else this.closeAll();
                };
                container.appendChild(btn2);
            } else {
                const btnEquip = document.createElement('button');
                btnEquip.className = 'btn-action';
                btnEquip.textContent = 'Взять в лапы';
                btnEquip.onclick = () => {
                    const res = InventoryLogic.addItem(itemIdOrObject, equipLoc);
                    if (!res.success) alert(res.error);
                    else this.closeAll();
                };
                container.appendChild(btnEquip);
            }
        }

        this.showOverlay();
        document.getElementById('modal-location').classList.remove('hidden');
    }
};
// Переключатель в окне "Создать свое" (Оружие / Броня <-> Количество ячеек)
const customTypeSelect = document.getElementById('custom-type');
if (customTypeSelect) {
    customTypeSelect.addEventListener('change', (e) => {
        const isWeapon = (e.target.value === 'weapon');
        const isArmor = (e.target.value === 'armor');
        document.getElementById('custom-weapon-block').classList.toggle('hidden', !isWeapon);
        document.getElementById('custom-armor-block').classList.toggle('hidden', !isArmor);
        document.getElementById('custom-slots-block').classList.toggle('hidden', isWeapon || isArmor);
    });
}
// Закрытие по клику на темный фон
const modalOverlay = document.getElementById('modal-overlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) UI_Modals.closeAll();
    });
}
	const btnAddHireling = document.getElementById('btn-add-hireling');
	if (btnAddHireling) {
		btnAddHireling.addEventListener('click', () => {
			const res = InventoryLogic.addHireling();
			if (!res.success) alert(res.error);
		});
	}
    // Сброс цели на основной инвентарь при клике на главный '+'
    const btnAddItem = document.getElementById('btn-add-item');
    if (btnAddItem) {
        btnAddItem.addEventListener('click', () => {
            UI_Modals.currentTarget = "pack"; 
            UI_Modals.openCatalog();
        });
    }

// --- ОТРИСОВКА ПОДЁНЩИКОВ ---
function renderHirelings() {
    const container = document.getElementById('hirelings-list');
    if (!container) return;
    container.innerHTML = '';

    if (!Array.isArray(CharacterState.data.hirelings)) {
        CharacterState.data.hirelings = [];
    }

    const countEl = document.getElementById('hirelings-count');
    if (countEl) {
        countEl.textContent = `${CharacterState.data.hirelings.length}/2`;
    }

    const birthsignsList = (GameData.generatorTables && GameData.generatorTables.birthsigns)
        ? GameData.generatorTables.birthsigns
        : [
            "Звезда - храбрый/безрассудный",
            "Колесо - Трудолюбивый/приземлённый",
            "Жёлудь - Любознательный/упрямый",
            "Буря - Благородный/гневливый",
            "Луна - Мудрый/таинственный",
            "Мать - Заботливый/тревожный"
        ];

    CharacterState.data.hirelings.forEach(h => {
        const card = document.createElement('div');
        card.className = 'hireling-card';

        const usedPaws = InventoryLogic.getHirelingUsedPaws(h.id);
        const usedPack = InventoryLogic.getHirelingUsedPack(h.id);
        card.innerHTML = `
            <div class="inventory-header">
                <input type="text" class="text-large hireling-name-input" value="${h.name || ''}" placeholder="Имя подёнщика" data-id="${h.id}">
                <div class="hireling-header-actions">
                    <button type="button" class="btn-add btn-roll-hireling" data-id="${h.id}" title="Сгенерировать характеристики (2d6) и знак рождения">🎲</button>
                    <button type="button" class="btn-add btn-remove-hireling" data-id="${h.id}" title="Удалить подёнщика">×</button>
                </div>
            </div>

            <!-- Характеристики точь-в-точь как у персонажа -->
            <div class="stats-grid">
                <div class="stat-box">
                    <label>ЗАЩ</label>
                    <div class="stat-inputs">
                        <input type="number" class="input-stat h-hp-cur" value="${h.stats.HP.current}" data-id="${h.id}"> /
                        <input type="number" class="input-stat h-hp-max" value="${h.stats.HP.max}" data-id="${h.id}">
                    </div>
                </div>
                <div class="stat-box">
                    <label>СИЛ</label>
                    <div class="stat-inputs">
                        <input type="number" class="input-stat h-str-cur" value="${h.stats.STR.current}" data-id="${h.id}"> /
                        <input type="number" class="input-stat h-str-max" value="${h.stats.STR.max}" data-id="${h.id}">
                    </div>
                </div>
                <div class="stat-box">
                    <label>ЛОВ</label>
                    <div class="stat-inputs">
                        <input type="number" class="input-stat h-dex-cur" value="${h.stats.DEX.current}" data-id="${h.id}"> /
                        <input type="number" class="input-stat h-dex-max" value="${h.stats.DEX.max}" data-id="${h.id}">
                    </div>
                </div>
                <div class="stat-box">
                    <label>ВОЛ</label>
                    <div class="stat-inputs">
                        <input type="number" class="input-stat h-wil-cur" value="${h.stats.WIL.current}" data-id="${h.id}"> /
                        <input type="number" class="input-stat h-wil-max" value="${h.stats.WIL.max}" data-id="${h.id}">
                    </div>
                </div>
            </div>

            <div class="details-group">
                <label>Знак рождения:</label>
                <div class="native-select-wrapper">
                    <select class="scrollable-native-select h-sign" data-id="${h.id}">
                        <option value="">— Выбрать —</option>
                        ${birthsignsList.map(sign => `<option value="${sign}" ${h.birthSign === sign ? 'selected' : ''}>${sign}</option>`).join('')}
                    </select>
                </div>
                <label>Внешность</label>
                <textarea rows="2" class="input-area h-app" data-id="${h.id}">${h.appearance || ''}</textarea>
            </div>

            <div class="inventory-section">
                <div class="inventory-header">
                    <h2>Снаряжение</h2>
                    <button type="button" class="btn-add btn-h-add" data-id="${h.id}">+</button>
                </div>
                <div class="inventory-category">
                    <div class="category-head">В лапах <span class="slot-count">${usedPaws}/2</span></div>
                    <div id="h-paws-${h.id}" class="inventory-list"></div>
                </div>
                <div class="inventory-category">
                    <div class="category-head">В мешке <span class="slot-count">${usedPack}/4</span></div>
                    <div id="h-pack-${h.id}" class="inventory-list"></div>
                </div>
            </div>
        `;

        container.appendChild(card);

        renderList(`h-paws-${h.id}`, InventoryLogic.getHirelingPawsRows(h.id));
        renderList(`h-pack-${h.id}`, InventoryLogic.getHirelingPackRows(h.id));
    });

    if (CharacterState.data.hirelings.length === 0) {
        container.innerHTML = '<div class="empty-slot" id="hirelings-empty-slot"></div>';
    }

    bindHirelingEvents();
}
function bindHirelingEvents() {
    // Генерация статов (2d6) и знака рождения
    document.querySelectorAll('.btn-roll-hireling').forEach(btn => {
        btn.onclick = (e) => {
            InventoryLogic.rollHirelingStats(e.currentTarget.dataset.id);
        };
    });

    // Удаление
   // Удаление
    document.querySelectorAll('.btn-remove-hireling').forEach(btn => {
        btn.onclick = (e) => {
            if (confirm("Уволить подёнщика? Его вещи перейдут в мешок персонажа.")) {
                InventoryLogic.removeHireling(e.currentTarget.dataset.id);
            }
        };
    });

    // Кнопка "+"
    document.querySelectorAll('.btn-h-add').forEach(btn => {
        btn.onclick = (e) => {
            UI_Modals.currentTarget = "hireling_" + e.currentTarget.dataset.id;
            UI_Modals.openCatalog();
        };
    });

    // Изменение текстовых полей и характеристик (silent = true, чтобы не терялся фокус после 1 символа)
    document.querySelectorAll('.hireling-name-input').forEach(inp => {
        inp.oninput = (e) => CharacterState.setHirelingField(e.target.dataset.id, 'name', e.target.value, null, true);
    });
    document.querySelectorAll('.h-sign').forEach(selectEl => {
        selectEl.addEventListener('focus', function() {
            if (window.innerWidth > 768) {
                this.size = 5;
            }
        });
        selectEl.addEventListener('change', function(e) {
            this.size = 1;
            this.blur();
            CharacterState.setHirelingField(e.target.dataset.id, 'birthSign', e.target.value, null, true);
        });
        selectEl.addEventListener('blur', function() {
            this.size = 1;
        });
    });

    const statMap = [
        { cls: 'h-hp-cur',  st: 'HP',  t: 'current' },
        { cls: 'h-hp-max',  st: 'HP',  t: 'max' },
        { cls: 'h-str-cur', st: 'STR', t: 'current' },
        { cls: 'h-str-max', st: 'STR', t: 'max' },
        { cls: 'h-dex-cur', st: 'DEX', t: 'current' },
        { cls: 'h-dex-max', st: 'DEX', t: 'max' },
        { cls: 'h-wil-cur', st: 'WIL', t: 'current' },
        { cls: 'h-wil-max', st: 'WIL', t: 'max' }
    ];
    statMap.forEach(m => {
        document.querySelectorAll(`.${m.cls}`).forEach(inp => {
            inp.oninput = (e) => CharacterState.setHirelingField(e.target.dataset.id, m.st, e.target.value, m.t, true);
        });
    });
} // <-- ЗАКРЫВАЮЩАЯ СКОБКА ДЛЯ bindHirelingEvents

// --- ОТРИСОВКА БЛОКА "ИГНОРИРУЕМЫЕ СОСТОЯНИЯ" ---
function renderIgnoredConditions() {
    const block = document.getElementById('ignored-cond-block');
    const list = document.getElementById('ignored-cond-list');
    if (!block || !list) return;

    const gritCount = Math.max(0, parseInt(CharacterState.data.grit, 10) || 0);

    // Если Выдержка = 0, скрываем весь блок
    if (gritCount === 0) {
        block.classList.add('hidden');
        list.innerHTML = '';
        return;
    }

    block.classList.remove('hidden');

    if (!Array.isArray(CharacterState.data.ignoredConditions)) {
        CharacterState.data.ignoredConditions = [];
    }

    // Обрезаем или дополняем массив под текущее значение Выдержки
    if (CharacterState.data.ignoredConditions.length > gritCount) {
        CharacterState.data.ignoredConditions.length = gritCount;
    }

    list.innerHTML = '';
    for (let i = 0; i < gritCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-line';
        input.placeholder = ``;
        input.value = CharacterState.data.ignoredConditions[i] || '';
        input.addEventListener('input', (e) => {
            CharacterState.setIgnoredCondition(i, e.target.value);
        });
        list.appendChild(input);
    }
}




