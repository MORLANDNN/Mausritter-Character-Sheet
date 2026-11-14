// js/data.js — Эталонная база данных игры
const GameData = {
    // Лимиты (капы) ячеек по умолчанию
    caps: {
        paws: 2, // В лапах: макс 2
        body: 2, // Надетое: макс 2
        pack: 6  // В мешке: макс 6
    },
    // Категории для кнопки "+"
    categories: {
        weapon: "Оружие",
        armor: "Броня",
        item: "Предметы",
        spell: "Заклинания",
        condition: "Состояния"
    },
    // База предметов
    itemDatabase: {
        // --- ОРУЖИЕ ---
        "improvised": {
            id: "improvised",
            name: "Импровизированное",
            type: "weapon",
            detail: "d6",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
		"needle": {
            id: "needle",
            name: "Игла",
            type: "weapon",
            detail: "d6",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
		"dagger": {
            id: "dagger",
            name: "Кинжал",
            type: "weapon",
            detail: "d6",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "sword": {
            id: "sword",
            name: "Меч",
            type: "weapon",
            detail: "d6/d8",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0,
			versatile: {
				onePaw: {size: 1, detail: "d6"},
				twoPaws: {size:2, detail: "d8"}
			}
        },
		"pickaxe": {
            id: "pickaxe",
            name: "Кирка",
            type: "weapon",
            detail: "d6/d8",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0,
			versatile: {
				onePaw: {size: 1, detail: "d6"},
				twoPaws: {size:2, detail: "d8"}
			}
        },
		"axe": {
            id: "axe",
            name: "Топор",
            type: "weapon",
            detail: "d6/d8",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0,
			versatile: {
				onePaw: {size: 1, detail: "d6"},
				twoPaws: {size:2, detail: "d8"}
			}
        },
		"mace": {
            id: "mace",
            name: "Булава",
            type: "weapon",
            detail: "d6/d8",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0,
			versatile: {
				onePaw: {size: 1, detail: "d6"},
				twoPaws: {size:2, detail: "d8"}
			}
        },
		"warhammer_2": {
            id: "warhammer_2",
            name: "Молот",
            type: "weapon",
            detail: "d6/d8",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0,
			versatile: {
				onePaw: {size: 1, detail: "d6"},
				twoPaws: {size:2, detail: "d8"}
			}
        },
        "spear": {
            id: "spear",
            name: "Копье",
            type: "weapon",
            detail: "d10",
            maxUses: 3,
            packSize: 2,
            pawsSize: 2,
            bodySize: 0
        },
		"hookarm": {
            id: "hookarm",
            name: "Багор",
            type: "weapon",
            detail: "d10",
            maxUses: 3,
            packSize: 2,
            pawsSize: 2,
            bodySize: 0
        },
		"warhammer": {
            id: "warhammer",
            name: "Боевой молот",
            type: "weapon",
            detail: "d10",
            maxUses: 3,
            packSize: 2,
            pawsSize: 2,
            bodySize: 0
        },
		"sling": {
            id: "sling",
            name: "Праща",
            type: "weapon",
            detail: "d6",
            maxUses: 3,
            packSize: 2,
            pawsSize: 2,
            bodySize: 0
        },
        "bow": {
            id: "bow",
            name: "Лук",
            type: "weapon",
            detail: "d8",
            maxUses: 3,
            packSize: 2,
            pawsSize: 2,
            bodySize: 0
        },
        // --- БРОНЯ ---
        "light_armor": {
            id: "light_armor",
            name: "Легкая броня",
            type: "armor",
            detail: "1 ПБ",
            maxUses: 3,
            packSize: 2,
            pawsSize: 1,
            bodySize: 1
        },
        "heavy_armor": {
            id: "heavy_armor",
            name: "Тяжелая броня",
            type: "armor",
            detail: "1 ПБ",
            maxUses: 3,
            packSize: 2,
            pawsSize: 0,
            bodySize: 2
        },
        // --- ПРЕДМЕТЫ ---
        "rations": {
            id: "rations",
            name: "Паёк",
            type: "item",
            detail: "",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "torch": {
            id: "torch",
            name: "Факел",
            type: "item",
            detail: "",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
		"lantern": {
            id: "lantern",
            name: "Лампа",
            type: "item",
            detail: "",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "lamp_oil": {
            id: "lamp_oil",
            name: "Масло для лампы",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "electric_lantern": {
            id: "electric_lantern",
            name: "Электрический фонарь",
            type: "item",
            detail: "",
            maxUses: 6,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "flashlight_batteries": {
            id: "flashlight_batteries",
            name: "Батарейки",
            type: "item",
            detail: "Для электрического фонаря",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
		"waterskin": {
            id: "waterskin",
            name: "Бурдюк",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "bottle": {
            id: "bottle",
            name: "Бутылка",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "bucket": {
            id: "bucket",
            name: "Ведро",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "wooden_stakes": {
            id: "wooden_stakes",
            name: "Деревянные колья",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "wooden_pole": {
            id: "wooden_pole",
            name: "Деревянный шест, 6 дюймов",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "perfume": {
            id: "perfume",
            name: "Духи",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "grease": {
            id: "grease",
            name: "Жировая смазка",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "small_lock": {
            id: "small_lock",
            name: "Замок с ключом, небольшой",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "mirror": {
            id: "mirror",
            name: "Зеркало",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "chisel": {
            id: "chisel",
            name: "Зубило",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "glue": {
            id: "glue",
            name: "Клей",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "blank_book": {
            id: "blank_book",
            name: "Книга для записей",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "reading_book": {
            id: "reading_book",
            name: "Книга для чтения",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "cooking_pot": {
            id: "cooking_pot",
            name: "Котелок",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "bellows": {
            id: "bellows",
            name: "Кузнечные мехи",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "chalk": {
            id: "chalk",
            name: "Кусок мела",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
			bodySize: 0
        },
        "crowbar": {
            id: "crowbar",
            name: "Лом",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "shovel": {
            id: "shovel",
            name: "Лопата",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "hammer": {
            id: "hammer",
            name: "Молоток",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "musical_instrument": {
            id: "musical_instrument",
            name: "Музыкальный инструмент",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "shelter": {
            id: "shelter",
            name: "Навес",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "file": {
            id: "file",
            name: "Напильник",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "lockpicks": {
            id: "lockpicks",
            name: "Отмычки",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "hourglass": {
            id: "hourglass",
            name: "Песочные часы",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "horn": {
            id: "horn",
            name: "Рожок",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "drill": {
            id: "drill",
            name: "Сверло",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "whistle": {
            id: "whistle",
            name: "Свисток",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "net": {
            id: "net",
            name: "Сеть",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "bedroll": {
            id: "bedroll",
            name: "Спальный мешок",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "caltrops": {
            id: "caltrops",
            name: "Триволы*, мешок",
            type: "item",
            detail: "ловушка-заграждение из нескольких острых штырей, соединённых у основания и направленных  в разные стороны",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "loaded_dice": {
            id: "loaded_dice",
            name: "Шулерские игральные кости",
            type: "item",
            detail: "",
            maxUses: 0,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        // --- ЗАКЛИНАНИЯ ---
        "spell_fireball": {
            id: "spell_fireball",
            name: "Огненный шар",
            type: "spell",
            detail: "Стреляет огненным шаром на расстояние до 24 дюймов. Наносит [сум] + [мощь] урона всем существам в радиусе 6 дюймов",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_heal": {
            id: "spell_heal",
            name: "Исцеление",
            type: "spell",
            detail: "Лечит [сум] урона по силе и убирает карточку состояния «Ранен» с существа",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
		"spell_magic_missile": {
            id: "spell_magic_missile",
            name: "Магический снаряд",
            type: "spell",
            detail: "Наносит [сум] + [мощь] урона существу в пределах видимости",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_fear": {
            id: "spell_fear",
            name: "Страх",
            type: "spell",
            detail: "[мощь] существ получают состояние «Испуган»",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_darkness": {
            id: "spell_darkness",
            name: "Тьма",
            type: "spell",
            detail: "Создаёт сферу абсолютной тьмы диаметром [сум]х2 дюйма на [мощь] ходов",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_restore": {
            id: "spell_restore",
            name: "Восстановление",
            type: "spell",
            detail: "Убирает карточку состояния «Изнурён» или «Испуган» с [мощь]+1 существ",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_open_heart": {
            id: "spell_open_heart",
            name: "Открытое сердце",
            type: "spell",
            detail: "Делает намерения заклинателя понятными для [мощь] существ других видов на [мощь] ходов",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_ghost_beetle": {
            id: "spell_ghost_beetle",
            name: "Жук-призрак",
            type: "spell",
            detail: "Создаёт призрачного жука, который может нести 6 ячеек снаряжения на [мощь]х6 ходов",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_light": {
            id: "spell_light",
            name: "Свет",
            type: "spell",
            detail: "Заставляет [мощь] существ сделать спасбросок воли — в случае неудачи они окажутся ошеломлены. Либо создаёт свет с яркостью лампы на [сум] ходов",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_invisible_ring": {
            id: "spell_invisible_ring",
            name: "Невидимое кольцо",
            type: "spell",
            detail: "Создаёт силовое поле в форме кольца с радиусом [мощь]x6 дюймов. Оно невидимое и недвижимое. Длится [мощь] ходов",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_unlock": {
            id: "spell_unlock",
            name: "Взлом",
            type: "spell",
            detail: "Открывает дверь или ящик, как если бы мышь сделала успешный спасбросок силы со значением 10+[мощь]х4",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_grease": {
            id: "spell_grease",
            name: "Скольжение",
            type: "spell",
            detail: "Покрывает пространство [мощь]х6 дюймов скользкой горючей жидкостью. Существа в этой области должны сделать спасбросок ловкости, чтобы не упасть",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_growth": {
            id: "spell_growth",
            name: "Рост",
            type: "spell",
            detail: "Увеличивает существо в [мощь]+1 раз относительно его изначального размера на 1 ход",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_invisibility": {
            id: "spell_invisibility",
            name: "Невидимость",
            type: "spell",
            detail: "Делает существо невидимым на [мощь] ходов. Любое перемещение снижает длительность на 1 ход",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "spell_catnip": {
            id: "spell_catnip",
            name: "Кошачья мята",
            type: "spell",
            detail: "Превращает объект в приманку, перед которой не устоит ни одна кошка. Длится [мощь] ходов",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        // --- СОСТОЯНИЯ ---
        "cond_exhausted": {
            id: "cond_exhausted",
            name: "Изнурён",
            type: "condition",
            detail: "Снятие: длительный отдых",
            maxUses: 0,
            packSize: 1,
            pawsSize: 0,
            bodySize: 0
        },
        "cond_hungry": {
            id: "cond_hungry",
            name: "Голоден",
			type: "condition",
            detail: "Снятие: приём пищи",
            maxUses: 0,
            packSize: 1,
            pawsSize: 0,
            bodySize: 0
        },
        "cond_mad": {
            id: "cond_mad",
            name: "Опустошён",
            type: "condition",
            detail: "Помеха на спасброски ВОЛ. Снятие: полный отдых",
            maxUses: 0,
            packSize: 1,
            pawsSize: 0,
            bodySize: 0
        },
		"cond_frightened": {
            id: "cond_frightened",
            name: "Испуган",
            type: "condition",
            detail: "Спасбросок ВОЛ, при виде источника страха. Снятие: передышка",
            maxUses: 0,
            packSize: 1,
            pawsSize: 0,
            bodySize: 0
        },
        "cond_injured": {
            id: "cond_injured",
            name: "Травма",
            type: "condition",
            detail: "Помеха на СИЛ и ЛОВ. Снятие: полный отдых",
            maxUses: 0,
            packSize: 1,
            pawsSize: 0,
            bodySize: 0
        },
		// --- ДОПОЛНИТЕЛЬНЫЕ ПРЕДМЕТЫ ИЗ ТАБЛИЦЫ ПРОИСХОЖДЕНИЙ ---
        "milk_bottle": { 
		id: "milk_bottle", 
		name: "Бутылка молока", 
		type: "item", 
		detail: "",
		maxUses: 3, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "incense_stick": { 
		id: "incense_stick", 
		name: "Ароматическая палочка", 
		type: "item", 
		detail: "", 
		maxUses: 3, 
		packSize: 1,
		pawsSize: 1, 
		bodySize: 0 
		},
        "scissors": { 
		id: "scissors", 
		name: "Ножницы",
		type: "item",
		detail: "",
		maxUses: 3,
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "coffee_flask": { 
		id: "coffee_flask", 
		name: "Фляжка кофе", 
		type: "item", 
		detail: "", 
		maxUses: 3, 
		packSize: 1,
		pawsSize: 1,
		bodySize: 0 
		},
        "holy_symbol": {
		id: "holy_symbol", 
		name: "Святой символ", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1,
		bodySize: 0 
		},
        "ale_keg": { 
		id: "ale_keg", 
		name: "Бочонок эля", 
		type: "item", 
		detail: "", 
		maxUses: 3, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "wire": { 
		id: "wire", 
		name: "Проволока", 
		type: "item", 
		detail: "Катушка", 
		maxUses: 3, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "rope": { 
		id: "rope", 
		name: "Верёвка", 
		type: "item", 
		detail: "Моток", 
		maxUses: 3, 
		packSize: 1, 
		pawsSize: 1,
		bodySize: 0 
		},
        "bat_teeth_bag": { 
		id: "bat_teeth_bag", 
		name: "Мешок зубов летучих мышей", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "trash_hook": { 
		id: "trash_hook", 
		name: "Крюк для мусора", 
		type: "weapon", 
		detail: "d10", 
		maxUses: 3, 
		packSize: 1, 
		pawsSize: 2, 
		bodySize: 0 
		},
        "fishhook": { 
		id: "fishhook", 
		name: "Рыболовный крючок", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "thread": { 
		id: "thread", 
		name: "Нить", 
		type: "item", 
		detail: "Катушка", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "promissory_note": { 
		id: "promissory_note",
		name: "Вексель на 20 з. от благородного дома", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "soap": { 
		id: "soap", 
		name: "Мыло", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "goggles": { 
		id: "goggles", 
		name: "Защитные очки", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 0, 
		bodySize: 0 
		},
        "chain": { 
		id: "chain", 
		name: "Цепь", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "dried_mushrooms": { 
		id: "dried_mushrooms", 
		name: "Сушёные грибы", 
		type: "item", 
		detail: "Паёк", 
		maxUses: 3, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "spore_mask": { 
		id: "spore_mask", 
		name: "Маска от спор", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 0, 
		bodySize: 1 
		},
        "quill_ink": { 
		id: "quill_ink", 
		name: "Перо и чернила", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "compass": { 
		id: "compass", 
		name: "Компас", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "cheese": { 
		id: "cheese", 
		name: "Кусок сыра", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
		"dubious_map": { 
		id: "dubious_map", 
		name: "Недостоверная карта сокровищ", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "sealed_docs": { 
		id: "sealed_docs", 
		name: "Запечатанные документы", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "disguise_kit": { 
		id: "disguise_kit", 
		name: "Гримировальный набор", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "honey_pot": { 
		id: "honey_pot", 
		name: "Горшок с мёдом", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "mystery_book_scrap": { 
		id: "mystery_book_scrap", 
		name: "Обрывок таинственной книги", 
		type: "item", detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 1, 
		bodySize: 0 
		},
        "felt_hat": { 
		id: "felt_hat", 
		name: "Фетровая шляпа", 
		type: "item", 
		detail: "", 
		maxUses: 0, 
		packSize: 1, 
		pawsSize: 0, 
		bodySize: 1 
		}
    },
    // Таблицы для генератора персонажа
    generatorTables: {
        birthsigns: [
            "Звезда - храбрый/безрассудный",
            "Колесо - Трудолюбивый/приземлённый",
            "Жёлудь - Любознательный/упрямый",
            "Буря - Благородный/гневливый",
            "Луна - Мудрый/таинственный",
            "Мать - Заботливый/тревожный"
        ],
        coatColors: [
            "Шоколадный", "Чёрный", "Белый", "Коричневый", "Серый", "Голубой"
        ],
        coatPatterns: [
            "Однотонная шкурка", "Пегий", "Пятнистый", "Полосатый", "Мраморный", "В крапинку"
        ],
        features: [
            "Шрамы", "Упитанный", "Тощий", "Стройный", "Крошечный", "Крупный",
            "Боевой раскрас", "Иноземная одежда", "Изящная одежда", "Залатанная одежда", "Модная одежда", "Нестиранная одежда",
            "Нет уха", "Бугристая мордочка", "Красивая мордочка", "Круглая мордочка", "Изящная мордочка", "Длинная мордочка",
            "Ухоженный мех", "Свалявшиеся космы", "Крашенный мех", "Выбритый мех", "Кудрявый мех", "Шелковистый мех",
            "Чёрные как ночь глаза", "Повязка на глазу", "Кроваво-красные глаза", "Мудрые глаза", "Проницательные глаза", "Сияющие глаза",
            "Обрезанный хвост", "Хлыстообразный хвост", "Хвост с пушком", "Короткий хвост", "Цепкий хвост", "Хвост крючком"
        ],
        // Ключ: "ОЗ_Зёрнышки"
        backgrounds: {
            "1_1": { name: "Подопытный", itemA: { id: "spell_magic_missile", label: 'Заклинание "Магический снаряд"' }, itemB: { id: "heavy_armor", label: "Свинцовый фартук, 1 ПБ" } },
            "1_2": { name: "Повар", itemA: { id: "light_armor", label: "Щит и куртка" }, itemB: { id: "cooking_pot", label: "Котелок" } },
            "1_3": { name: "Житель клетки", itemA: { id: "spell_open_heart", label: 'Заклинание "Открытое сердце"' }, itemB: { id: "milk_bottle", label: "Бутылка молока" } },
            "1_4": { name: "Знахарь", itemA: { id: "spell_heal", label: 'Заклинание "Исцеление"' }, itemB: { id: "incense_stick", label: "Ароматическая палочка" } },
            "1_5": { name: "Кожевник", itemA: { id: "light_armor", label: "Щит и куртка (Лёгкая броня)" }, itemB: { id: "scissors", label: "Ножницы" } },
            "1_6": { name: "Уличный бандит", itemA: { id: "dagger", label: "Кинжал" }, itemB: { id: "coffee_flask", label: "Фляжка кофе" } },
            "2_1": { name: "Нищий священник", itemA: { id: "spell_restore", label: 'Заклинание "Восстановление"' }, itemB: { id: "holy_symbol", label: "Святой символ" } },
            "2_2": { name: "Пчелопас", itemA: { id: "hireling_bee", label: "Подёнщик: верная пчела" }, itemB: { id: "wooden_pole", label: "Шест, 6 дюймов" } },
            "2_3": { name: "Пивовар", itemA: { id: "hireling_torchbearer", label: "Подёнщик: пьяный факелоносец" }, itemB: { id: "ale_keg", label: "Бочонок эля" } },
            "2_4": { name: "Рыбак", itemA: { id: "net", label: "Сеть" }, itemB: { id: "needle", label: "Игла" } },
            "2_5": { name: "Кузнец", itemA: { id: "warhammer_2", label: "Молоток" }, itemB: { id: "file", label: "Напильник" } },
            "2_6": { name: "Проволочник", itemA: { id: "wire", label: "Проволока" }, itemB: { id: "electric_lantern", label: "Электрический фонарь" } },
            "3_1": { name: "Резчик по дереву", itemA: { id: "axe", label: "Топор" }, itemB: { id: "rope", label: "Верёвка" } },
            "3_2": { name: "Сектант", itemA: { id: "spell_darkness", label: 'Заклинание "Тьма"' }, itemB: { id: "bat_teeth_bag", label: "Мешок зубов летучих мышей" } },
            "3_3": { name: "Оловодобытчик", itemA: { id: "pickaxe", label: "Кирка" }, itemB: { id: "lantern", label: "Лампа" } },
            "3_4": { name: "Мусорщик", itemA: { id: "trash_hook", label: "Крюк для мусора" }, itemB: { id: "mirror", label: "Зеркало" } },
            "3_5": { name: "Стенолаз", itemA: { id: "fishhook", label: "Рыболовный крючок" }, itemB: { id: "thread", label: "Нить" } },
			"3_6": { name: "Торговец", itemA: { id: "hireling_packrat", label: "Подёнщик: вьючная крыса" }, itemB: { id: "promissory_note", label: "Вексель на 20 з. от благородного дома" } },
            "4_1": { name: "Матрос с плота", itemA: { id: "hammer", label: "Молоток" }, itemB: { id: "wooden_stakes", label: "Деревянные колья" } },
            "4_2": { name: "Погонщик червей", itemA: { id: "wooden_pole", label: "Шест, 6 дюймов" }, itemB: { id: "soap", label: "Мыло" } },
            "4_3": { name: "Воробьиный наездник", itemA: { id: "fishhook", label: "Рыболовный крючок" }, itemB: { id: "goggles", label: "Защитные очки" } },
            "4_4": { name: "Проводник по канализации", itemA: { id: "file", label: "Напильник" }, itemB: { id: "thread", label: "Нить" } },
            "4_5": { name: "Тюремный стражник", itemA: { id: "chain", label: "Цепь" }, itemB: { id: "spear", label: "Копьё" } },
            "4_6": { name: "Фермер-грибник", itemA: { id: "dried_mushrooms", label: "Сушёные грибы" }, itemB: { id: "spore_mask", label: "Маска от спор" } },
            "5_1": { name: "Строитель плотины", itemA: { id: "shovel", label: "Лопата" }, itemB: { id: "wooden_stakes", label: "Деревянные колья" } },
            "5_2": { name: "Картограф", itemA: { id: "quill_ink", label: "Перо и чернила" }, itemB: { id: "compass", label: "Компас" } },
            "5_3": { name: "Грабитель ловушек", itemA: { id: "cheese", label: "Кусок сыра" }, itemB: { id: "glue", label: "Клей" } },
            "5_4": { name: "Бродяга", itemA: { id: "shelter", label: "Навес (Палатка)" }, itemB: { id: "dubious_map", label: "Недостоверная карта сокровищ" } },
            "5_5": { name: "Фермер-зерновод", itemA: { id: "spear", label: "Копьё" }, itemB: { id: "whistle", label: "Свисток" } },
            "5_6": { name: "Гонец", itemA: { id: "bedroll", label: "Спальный мешок" }, itemB: { id: "sealed_docs", label: "Запечатанные документы" } },
            "6_1": { name: "Трубадур", itemA: { id: "musical_instrument", label: "Музыкальный инструмент" }, itemB: { id: "disguise_kit", label: "Гримировальный набор" } },
            "6_2": { name: "Азартный игрок", itemA: { id: "loaded_dice", label: "Шулерские игральные кости" }, itemB: { id: "mirror", label: "Зеркало" } },
            "6_3": { name: "Добытчик древесного сока", itemA: { id: "bucket", label: "Ведро" }, itemB: { id: "wooden_stakes", label: "Деревянные колья" } },
            "6_4": { name: "Пчеловод", itemA: { id: "honey_pot", label: "Горшок с мёдом" }, itemB: { id: "net", label: "Сеть" } },
            "6_5": { name: "Библиотекарь", itemA: { id: "mystery_book_scrap", label: "Обрывок таинственной книги" }, itemB: { id: "quill_ink", label: "Перо и чернила" } },
            "6_6": { name: "Обнищавший дворянин", itemA: { id: "felt_hat", label: "Фетровая шляпа" }, itemB: { id: "perfume", label: "Духи" } }
        }
    }


};

