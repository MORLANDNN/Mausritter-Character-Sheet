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
        condition: "Состояния",
        pips: "Зернышки"
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
            detail: "Восстанавливает d6 ОЗ при передышке",
            maxUses: 3,
            packSize: 1,
            pawsSize: 1,
            bodySize: 0
        },
        "torch": {
            id: "torch",
            name: "Факел",
            type: "item",
            detail: "Освещает путь (1 точка за смену)",
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
        "pickaxe": {
            id: "pickaxe",
            name: "Кирка",
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
        }
    }
};

