// index.js

// Игровые данные
const gameState = {
    hero: {
        name: "Рыцарь",
        level: 1,
        hp: 100,
        maxHp: 100,
        mana: 50,
        maxMana: 50,
        atk: 15,
        def: 5,
        exp: 0,
        maxExp: 100,
        gold: 20,
        potions: 2
    },
    enemy: null,
    inBattle: false
};

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

// DOM элементы
const elements = {
    heroLevel: document.getElementById('hero-level'),
    hpBar: document.getElementById('hp-bar'),
    hpText: document.getElementById('hp-text'),
    manaBar: document.getElementById('mana-bar'),
    manaText: document.getElementById('mana-text'),
    expBar: document.getElementById('exp-bar'),
    expText: document.getElementById('exp-text'),
    heroAtk: document.getElementById('hero-atk'),
    heroDef: document.getElementById('hero-def'),
    heroGold: document.getElementById('hero-gold'),
    potionCount: document.getElementById('potion-count'),
    
    enemyCard: document.getElementById('enemy-card'),
    enemyName: document.getElementById('enemy-name'),
    enemyHpBar: document.getElementById('enemy-hp-bar'),
    enemyHpText: document.getElementById('enemy-hp-text'),
    enemyIcon: document.getElementById('enemy-icon'),

    btnAttack: document.getElementById('btn-attack'),
    btnSpell: document.getElementById('btn-spell'),
    btnHeal: document.getElementById('btn-heal'),
    btnExplore: document.getElementById('btn-explore'),

    navBattle: document.getElementById('nav-battle'),
    navShop: document.getElementById('nav-shop'),
    battleScreen: document.getElementById('battle-screen'),
    shopScreen: document.getElementById('shop-screen'),
    logContent: document.getElementById('log-content')
};

// Функция добавления записей в лог
function addLog(text, colorClass = '') {
    const p = document.createElement('p');
    p.className = `log-entry ${colorClass}`;
    p.textContent = text;
    elements.logContent.appendChild(p);
    elements.logContent.scrollTop = elements.logContent.scrollHeight;
}

// Обновление интерфейса
function updateUI() {
    const h = gameState.hero;
    
    elements.heroLevel.textContent = h.level;
    elements.hpBar.style.width = `${(h.hp / h.maxHp) * 100}%`;
    elements.hpText.textContent = `${h.hp} / ${h.maxHp}`;
    
    elements.manaBar.style.width = `${(h.mana / h.maxMana) * 100}%`;
    elements.manaText.textContent = `${h.mana} / ${h.maxMana}`;

    elements.expBar.style.width = `${(h.exp / h.maxExp) * 100}%`;
    elements.expText.textContent = `${h.exp} / ${h.maxExp}`;

    elements.heroAtk.textContent = h.atk;
    elements.heroDef.textContent = h.def;
    elements.heroGold.textContent = h.gold;
    elements.potionCount.textContent = h.potions;

    // Кнопки действия
    elements.btnAttack.disabled = !gameState.inBattle;
    elements.btnSpell.disabled = !gameState.inBattle || h.mana < 15;
    elements.btnHeal.disabled = h.potions <= 0 || h.hp >= h.maxHp;
    elements.btnExplore.disabled = gameState.inBattle;

    // Враг
    if (gameState.enemy) {
        const e = gameState.enemy;
        elements.enemyName.textContent = e.name;
        elements.enemyHpBar.style.width = `${Math.max(0, (e.hp / e.maxHp) * 100)}%`;
        elements.enemyHpText.textContent = `${Math.max(0, e.hp)} / ${e.maxHp}`;
        elements.enemyIcon.innerHTML = `<i class="fa-solid ${e.icon}"></i>`;
        elements.enemyCard.style.opacity = '1';
    } else {
        elements.enemyName.textContent = "Нет врага";
        elements.enemyHpBar.style.width = '0%';
        elements.enemyHpText.textContent = '0 / 0';
        elements.enemyIcon.innerHTML = `<i class="fa-solid fa-ghost"></i>`;
        elements.enemyCard.style.opacity = '0.5';
    }
}

// Поиск нового врага (фильтруем по силе в зависимости от уровня игрока, но иногда может выпасть сильный)
function explore() {
    if (gameState.inBattle) return;

    // Определяем максимальный доступный индекс врага по уровню игрока
    const maxAvailableIndex = Math.min(enemyTemplates.length - 1, Math.floor((gameState.hero.level - 1) / 1.5) + 2);
    const minAvailableIndex = Math.max(0, maxAvailableIndex - 4);
    
    const randomIndex = Math.floor(Math.random() * (maxAvailableIndex - minAvailableIndex + 1)) + minAvailableIndex;
    const template = enemyTemplates[randomIndex];
    
    // Масштабирование характеристик
    const scale = 1 + (gameState.hero.level - 1) * 0.15;
    gameState.enemy = {
        name: template.name,
        hp: Math.round(template.hp * scale),
        maxHp: Math.round(template.hp * scale),
        atk: Math.round(template.atk * scale),
        def: Math.round(template.def * scale),
        exp: Math.round(template.exp * scale),
        gold: Math.round(template.gold * scale),
        icon: template.icon,
        type: template.type
    };

    gameState.inBattle = true;
    addLog(`Вы наткнулись на: ${gameState.enemy.name}! (Урон: ${gameState.enemy.atk})`, 'yellow');
    updateUI();
}

// Ход врага
function enemyTurn() {
    if (!gameState.enemy || gameState.enemy.hp <= 0) return;

    // Шанс нанести критический удар у сильных врагов (демоны, драконы, боссы)
    let isCrit = Math.random() < 0.15 && (gameState.enemy.type === 'demon' || gameState.enemy.type === 'boss');
    let damageMultiplier = isCrit ? 1.5 : 1;
    
    const damage = Math.max(1, Math.round((gameState.enemy.atk * damageMultiplier) - gameState.hero.def));
    gameState.hero.hp = Math.max(0, gameState.hero.hp - damage);

    if (isCrit) {
        addLog(`⚡ Критический удар! ${gameState.enemy.name} наносит вам аж ${damage} урона!`, 'red');
    } else {
        addLog(`${gameState.enemy.name} атакует вас на ${damage} урона.`);
    }

    if (gameState.hero.hp <= 0) {
        addLog("Вы потерпели поражение! Половина золота утеряна.", 'red');
        gameState.hero.hp = gameState.hero.maxHp;
        gameState.hero.mana = gameState.hero.maxMana;
        gameState.hero.gold = Math.floor(gameState.hero.gold / 2);
        gameState.inBattle = false;
        gameState.enemy = null;
    }
    updateUI();
}

// Атака игрока
function attack() {
    if (!gameState.inBattle) return;

    const damage = Math.max(1, gameState.hero.atk - gameState.enemy.def);
    gameState.enemy.hp -= damage;
    addLog(`Вы нанесли ${damage} урона врагу ${gameState.enemy.name}.`);

    if (gameState.enemy.hp <= 0) {
        winBattle();
    } else {
        enemyTurn();
    }
    updateUI();
}

// Заклинание
function castSpell() {
    if (!gameState.inBattle || gameState.hero.mana < 15) return;

    gameState.hero.mana -= 15;
    const damage = gameState.hero.atk * 2; // Магия игнорирует броню
    gameState.enemy.hp -= damage;
    addLog(`Вы применили огненный шар и нанесли ${damage} магиеского урона!`, 'blue');

    if (gameState.enemy.hp <= 0) {
        winBattle();
    } else {
        enemyTurn();
    }
    updateUI();
}

// Лечение
function usePotion() {
    if (gameState.hero.potions <= 0 || gameState.hero.hp >= gameState.hero.maxHp) return;

    gameState.hero.potions--;
    const healAmount = 50;
    gameState.hero.hp = Math.min(gameState.hero.maxHp, gameState.hero.hp + healAmount);
    addLog(`Вы выпили зелье и восстановили ${healAmount} HP.`, 'green');

    if (gameState.inBattle) {
        enemyTurn();
    }
    updateUI();
}

// Победа в бою
function winBattle() {
    addLog(`Победа! Получено: ${gameState.enemy.gold} золота и ${gameState.enemy.exp} опыта.`, 'green');
    gameState.hero.gold += gameState.enemy.gold;
    addExp(gameState.enemy.exp);
    gameState.inBattle = false;
    gameState.enemy = null;
}

// Начисление опыта и прокачка
function addExp(amount) {
    const h = gameState.hero;
    h.exp += amount;

    while (h.exp >= h.maxExp) {
        h.exp -= h.maxExp;
        h.level++;
        h.maxExp = Math.round(h.maxExp * 1.5);
        h.maxHp += 25;
        h.hp = h.maxHp;
        h.maxMana += 15;
        h.mana = h.maxMana;
        h.atk += 4;
        h.def += 2;
        addLog(`🎉 Уровень повышен! Теперь вы ${h.level} уровня! Все характеристики выросли.`, 'yellow');
    }
}

// Покупка в магазине
function buyItem(item, price) {
    if (gameState.hero.gold < price) {
        addLog("Недостаточно золота!");
        return;
    }

    gameState.hero.gold -= price;
    if (item === 'potion') {
        gameState.hero.potions++;
        addLog("Вы купили Зелье Лечения.");
    } else if (item === 'sword') {
        gameState.hero.atk += 6;
        addLog("Вы купили Стальной Меч (+6 к Атаке).");
    } else if (item === 'armor') {
        gameState.hero.def += 4;
        addLog("Вы купили Кожаную Броню (+4 к Защите).");
    }
    updateUI();
}

// Слушатели событий
elements.btnAttack.addEventListener('click', attack);
elements.btnSpell.addEventListener('click', castSpell);
elements.btnHeal.addEventListener('click', usePotion);
elements.btnExplore.addEventListener('click', explore);

elements.navBattle.addEventListener('click', () => {
    elements.battleScreen.classList.add('active');
    elements.shopScreen.classList.remove('active');
    elements.navBattle.classList.add('active');
    elements.navShop.classList.remove('active');
});

elements.navShop.addEventListener('click', () => {
    elements.shopScreen.classList.add('active');
    elements.battleScreen.classList.remove('active');
    elements.navShop.classList.add('active');
    elements.navBattle.classList.remove('active');
});

document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const item = e.target.getAttribute('data-item');
        const price = parseInt(e.target.getAttribute('data-price'));
        buyItem(item, price);
    });
});

// Инициализация
updateUI();