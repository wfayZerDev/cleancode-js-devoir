
import weapons from './weaponList.json';

export let weaponList: any[] = [];

export function init() {
    weaponList = weapons;


    let playerMaxHealth = 10;
    let playerCurrentHealth = 10;
    let enemyMaxHealth = 10;
    let enemyCurrentHealth = 10;
    let playerWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
    let enemyWeapon = null;
    let hasInit = true;
    let hasRound = true;
    let hasFought = false;
    let playerWon = false;
    let playerLost = false;
    let rerollCount: number = 0;
    const MAX_REROLLS: number = 2;

    weaponList = weapons;

    return {
        playerMaxHealth,
        playerCurrentHealth,
        enemyMaxHealth,
        enemyCurrentHealth,
        playerWeapon,
        enemyWeapon,
        hasInit,
        hasRound,
        hasFought,
        playerWon,
        playerLost,
        rerollCount,
        MAX_REROLLS
    }
}

export function newRound(hasInit: boolean) {
    if(hasInit) {
        weaponList = weapons;

        return {
            playerWeapon: weaponList[Math.floor(Math.random() * weaponList.length)],
            enemyWeapon: null,
            hasRound: true,
            hasFought: false
        }
    } else {
        throw new Error('Game not initialized');
    }
}


export function rerollWeapon(state: any) {
    if (state.rerollCount >= state.MAX_REROLLS) {
        throw new Error('Maximum number of rerolls reached');
    }

    state.playerWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
    state.rerollCount++;

    return state;
}

export function getRandomWeapon() {
    return weaponList[Math.floor(Math.random() * weaponList.length)];
}

export function fight(playerHealth: number, enemyHealth: number, playerWeapon: any, hasInit: boolean, hasRound: boolean, hasFought: boolean): Array<number|boolean> {
    validateGameState(hasInit, hasRound, hasFought);

    let playerDamages = calculateDamage(playerWeapon);
    let enemyWeapon = getRandomEnemyWeapon();
    let enemyDamages = calculateDamage(enemyWeapon);

    return calculateHealth(playerHealth, enemyHealth, playerDamages, enemyDamages, enemyWeapon);
}

function validateGameState(hasInit: boolean, hasRound: boolean, hasFought: boolean): void {
    if (!hasInit) {
        throw new Error('Game not initialized');
    }
    if (!hasRound) {
        throw new Error('Round not initialized');
    }
    if (hasFought) {
        throw new Error('Round already played');
    }
}

function calculateDamage(weapon: any): number {
    switch (weapon.name) {
        case 'hatchet':
        case 'knife':
        case 'spear':
            return 1;
        case 'sword':
        case 'halberd':
            return 5;
        case 'bow':
            return 1 * (Math.floor(Math.random() * 5));
        case 'crossbow':
            return 2 * (Math.floor(Math.random() * 5));
        case 'darts':
            return 1 * (Math.floor(Math.random() * 3));
        case 'dagger':
            return 3;
        default:
            throw new Error('Invalid weapon');
    }
}


function getRandomEnemyWeapon(): any {
    const weaponList = weapons;
    return weaponList[Math.floor(Math.random() * weaponList.length)];
}

function calculateHealth(playerHealth: number, enemyHealth: number, playerDamages: number, enemyDamages: number, enemyWeapon: any): Array<number|boolean> {
    if (playerDamages === enemyDamages) {
        return [playerHealth, enemyHealth];
    }

    if (playerDamages > enemyDamages) {
        enemyHealth -= playerDamages - enemyDamages;
    } else {
        playerHealth -= enemyDamages - playerDamages;
    }

    playerHealth = Math.max(playerHealth, 0);
    enemyHealth = Math.max(enemyHealth, 0);

    if (enemyHealth === 0) {
        return [playerHealth, enemyHealth, enemyWeapon, true, true, false];
    }

    if (playerHealth === 0) {
        return [playerHealth, enemyHealth, enemyWeapon, true, false, true];
    }

    return [playerHealth, enemyHealth, enemyWeapon, true, false, false];
}
