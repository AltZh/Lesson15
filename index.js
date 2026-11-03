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

// Список возможных врагов
const enemyTemplates = [
    { name: "Дикий Гоблин", hp: 40, maxHp: 40, atk: 8, def: 2, exp: 35, gold: 15, icon: "fa-ghost" },
    { name: "Лесной Волколак", hp: 60, maxHp: 60, atk: 12, def: 3, exp: 50, gold: 25, icon: "fa-dog" },
    { name: "Пещерный Огр", hp: 100, maxHp: 100, atk: 18, def: 6, exp: 90, gold: 50, icon: "fa-skull" }
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
function addLog(text) {
    const p = document.createElement('p');
    p.className = 'log-entry';
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

// Поиск нового врага
function explore() {
    if (gameState.inBattle) return;

    const randomIndex = Math.floor(Math.random() * enemyTemplates.length);
    const template = enemyTemplates[randomIndex];
    
    // Создаем копию врага с масштабированием под уровень игрока
    const scale = 1 + (gameState.hero.level - 1) * 0.2;
    gameState.enemy = {
        name: template.name,
        hp: Math.round(template.hp * scale),
        maxHp: Math.round(template.hp * scale),
        atk: Math.round(template.atk * scale),
        def: Math.round(template.def * scale),
        exp: Math.round(template.exp * scale),
        gold: Math.round(template.gold * scale),
        icon: template.icon
    };

    gameState.inBattle = true;
    addLog(`Вы наткнулись на: ${gameState.enemy.name}!`);
    updateUI();
}

// Ход врага
function enemyTurn() {
    if (!gameState.enemy || gameState.enemy.hp <= 0) return;

    const damage = Math.max(1, gameState.enemy.atk - gameState.hero.def);
    gameState.hero.hp = Math.max(0, gameState.hero.hp - damage);
    addLog(`${gameState.enemy.name} атакует вас на ${damage} урона!`);

    if (gameState.hero.hp <= 0) {
        addLog("Вы потерпели поражение! Золото и опыт потеряны.");
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
    addLog(`Вы применили огненный шар и нанесли ${damage} урона!`);

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
    addLog(`Вы выпили зелье и восстановили ${healAmount} HP.`);

    if (gameState.inBattle) {
        enemyTurn();
    }
    updateUI();
}

// Победа в бою
function winBattle() {
    addLog(`Победа! Получено: ${gameState.enemy.gold} золота и ${gameState.enemy.exp} опыта.`);
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
        h.maxHp += 20;
        h.hp = h.maxHp;
        h.maxMana += 10;
        h.mana = h.maxMana;
        h.atk += 3;
        h.def += 2;
        addLog(`Уровень повышен! Теперь вы ${h.level} уровня.`);
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
        gameState.hero.atk += 5;
        addLog("Вы купили Стальной Меч (+5 к Атаке).");
    } else if (item === 'armor') {
        gameState.hero.def += 3;
        addLog("Вы купили Кожаную Броню (+3 к Защите).");
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