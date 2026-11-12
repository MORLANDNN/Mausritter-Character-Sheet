// js/ui.js — Связь данных с HTML-интерфейсом
document.addEventListener("DOMContentLoaded", () => {
    CharacterState.subscribe(renderUI);
    const btnAddItem = document.getElementById('btn-add-item');
    if (btnAddItem) {
        btnAddItem.addEventListener('click', () => UI_Modals.openCatalog());
    }
    // 1. ПРИВЯЗКА ПРОСТЫХ ТЕКСТОВЫХ И ЧИСЛОВЫХ ПОЛЕЙ
    const fieldMap = {
        'name': 'name',
        'background': 'background',
        'birthsign': 'birthSign',
        'coat': 'coat',
        'appearance': 'appearance',
        'ignored-cond': 'ignoredConditions',
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
    let currentCol = 'left'; // 'left' (Основное) или 'right' (Снаряжение)
    function setMobileCol(col) {
        currentCol = col;
        appContainer.classList.remove('mobile-show-left', 'mobile-show-right');
        appContainer.classList.add(col === 'left' ? 'mobile-show-left' : 'mobile-show-right');
    }
    function toggleMobileCol() {
        setMobileCol(currentCol === 'left' ? 'right' : 'left');
    }
    // По умолчанию открыта левая колонка (Основное)
    setMobileCol('left');
    // Кнопки "<" и ">"
    document.querySelectorAll('.btn-col-switch').forEach(btn => {
        btn.addEventListener('click', () => {
            toggleMobileCol();
        });
    });
    // Обработка свайпов
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwipingFromInput = false;
    appContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        const tag = e.target.tagName.toLowerCase();
        // Не перехватываем свайп, если пользователь выделяет текст или крутит поле ввода
        isSwipingFromInput = (tag === 'input' || tag === 'textarea' || tag === 'select');
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    appContainer.addEventListener('touchend', (e) => {
        if (window.innerWidth > 768 || isSwipingFromInput) return;
        // Если открыт попап — свайп колонок не срабатывает
        const overlay = document.getElementById('modal-overlay');
        if (overlay && !overlay.classList.contains('hidden')) return;
        if (e.changedTouches.length !== 1) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        // Свайп засчитывается, если смещение по горизонтали > 55px и явно превышает вертикальный скролл
        if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (deltaX < 0 && currentCol === 'left') {
                // Свайп влево -> переход к "Снаряжению"
                setMobileCol('right');
            } else if (deltaX > 0 && currentCol === 'right') {
                // Свайп вправо -> возврат к "Основному"
                setMobileCol('left');
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
        document.getElementById('custom-slots-block').classList.remove('hidden');
        this.showOverlay();
        document.getElementById('modal-create').classList.remove('hidden');
    },
    saveCustomItem() {
        const name = document.getElementById('custom-name').value || "Неизвестный предмет";
        const type = document.getElementById('custom-type').value;
        const detail = document.getElementById('custom-detail').value;
        const uses = parseInt(document.getElementById('custom-uses').value, 10) || 0;
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
        } else {
            const slots = parseInt(document.getElementById('custom-slots').value, 10) || 1;
            packSize = slots;
            if (type === 'armor') bodySize = slots;
            else if (type !== 'condition') pawsSize = slots;
        }
        const template = { name, type, detail, maxUses: uses, packSize, pawsSize, bodySize, versatile };
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
                if (action.type === 'delete') {
                    InventoryLogic.removeItem(instanceId);
                    this.closeAll();
                } else if (action.type === 'equip' || action.type === 'equip_1' || action.type === 'equip_2') {
                    const wasEquipped = item.location === "equipped";
                    const mode = action.type === 'equip' ? null : action.type;
                    const res = InventoryLogic.moveItem(instanceId, "equipped", mode);
                    if (!res.success) {
                        alert(res.error);
                    } else if (wasEquipped) {
                        // Если меняли хват уже экипированного оружия — обновляем кнопку в окне
                        this.openActions(instanceId);
                    } else {
                        this.closeAll();
                    }
                } else if (action.type === 'pack') {
                    const res = InventoryLogic.moveItem(instanceId, "pack");
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
        if (template.type === 'condition') {
            InventoryLogic.addItem(itemIdOrObject, "pack");
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
            InventoryLogic.addItem(itemIdOrObject, "pack");
            this.closeAll();
        };
        container.appendChild(btnPack);
        if (template.bodySize > 0) {
            const btnBody = document.createElement('button');
            btnBody.className = 'btn-action';
            btnBody.textContent = 'Надеть';
            btnBody.onclick = () => {
				const res = InventoryLogic.addItem(itemIdOrObject, "equipped");
                if (!res.success) alert(res.error);
                else this.closeAll();
            };
            container.appendChild(btnBody);
        } else if (template.pawsSize > 0) {
            if (template.versatile) {
                const btn1 = document.createElement('button');
                btn1.className = 'btn-action';
                btn1.textContent = 'Взять в 1 лапу (d6)';
                btn1.onclick = () => {
                    const res = InventoryLogic.addItem(itemIdOrObject, "equipped", "equip_1");
                    if (!res.success) alert(res.error);
                    else this.closeAll();
                };
                container.appendChild(btn1);
                const btn2 = document.createElement('button');
                btn2.className = 'btn-action';
                btn2.textContent = 'Взять в 2 лапы (d8)';
                btn2.onclick = () => {
                    const res = InventoryLogic.addItem(itemIdOrObject, "equipped", "equip_2");
                    if (!res.success) alert(res.error);
                    else this.closeAll();
                };
                container.appendChild(btn2);
            } else {
                const btnEquip = document.createElement('button');
                btnEquip.className = 'btn-action';
                btnEquip.textContent = 'Взять в лапы';
                btnEquip.onclick = () => {
                    const res = InventoryLogic.addItem(itemIdOrObject, "equipped");
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
// Переключатель в окне "Создать свое" (Оружие <-> Количество ячеек)
const customTypeSelect = document.getElementById('custom-type');
if (customTypeSelect) {
    customTypeSelect.addEventListener('change', (e) => {
        const isWeapon = (e.target.value === 'weapon');
        document.getElementById('custom-weapon-block').classList.toggle('hidden', !isWeapon);
        document.getElementById('custom-slots-block').classList.toggle('hidden', isWeapon);
    });
}
// Закрытие по клику на темный фон
const modalOverlay = document.getElementById('modal-overlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) UI_Modals.closeAll();
    });
}




