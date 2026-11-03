// Расширенный список врагов с разными типами и иконками FontAwesome
const enemyTemplates = [
    { name: "Пещерная Крыса", hp: 25, maxHp: 25, atk: 6, def: 1, exp: 20, gold: 8, icon: "fa-rat", type: "beast" },
    { name: "Дикий Гоблин", hp: 40, maxHp: 40, atk: 9, def: 2, exp: 35, gold: 15, icon: "fa-ghost", type: "humanoid" },
    { name: "Лесной Волколак", hp: 60, maxHp: 60, atk: 13, def: 3, exp: 55, gold: 25, icon: "fa-dog", type: "beast" },
    { name: "Скелет-Воин", hp: 70, maxHp: 70, atk: 15, def: 5, exp: 70, gold: 35, icon: "fa-skull-crossbones", type: "undead" },
    { name: "Разбойник", hp: 85, maxHp: 85, atk: 18, def: 4, exp: 90, gold: 60, icon: "fa-user-ninja", type: "humanoid" },
    { name: "Пещерный Огр", hp: 120, maxHp: 120, atk: 22, def: 6, exp: 130, gold: 80, icon: "fa-skull", type: "monster" },
    { name: "Болотная Ведьма", hp: 90, maxHp: 90, atk: 25, def: 3, exp: 140, gold: 95, icon: "fa-hat-wizard", type: "magic" },
    { name: "Бронированный Тролль", hp: 160, maxHp: 160, atk: 28, def: 10, exp: 200, gold: 140, icon: "fa-mountain", type: "monster" },
    { name: "Злобный Демон", hp: 220, maxHp: 220, atk: 35, def: 12, exp: 300, gold: 220, icon: "fa-fire", type: "demon" },
    { name: "Древний Дракон", hp: 350, maxHp: 350, atk: 48, def: 18, exp: 500, gold: 400, icon: "fa-dragon", type: "boss" }
];