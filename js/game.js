// 初始游戏状态
const initialState = {
    scenes: {
        library: true,   // 场景是否解锁
        tavern: false,
        temple: false,
        exit: false
    },
    sceneCompleted: {
        library: false,  // 场景是否完成
        tavern: false,
        temple: false,
        exit: false
    },
    gold: 50,           // 金币数量
    helpers: 0,         // 打手数量
    hasClue: false,     // 是否找到线索
    hasTreasure: false, // 是否找到宝藏
    musicEnabled: true  // 音乐开关
};

// 加载游戏状态（从localStorage）
function loadGameState() {
    const saved = localStorage.getItem('treasureHuntState');
    return saved ? JSON.parse(saved) : { ...initialState };
}

// 保存游戏状态（到localStorage）
function saveGameState() {
    localStorage.setItem('treasureHuntState', JSON.stringify(gameState));
}

// 更新所有UI显示
function updateUI() {
    // 更新金币、打手、线索显示
    document.querySelectorAll('#gold').forEach(el => el.textContent = gameState.gold);
    document.querySelectorAll('#helpers').forEach(el => el.textContent = gameState.helpers);
    document.querySelectorAll('#clue').forEach(el => el.textContent = gameState.hasClue ? '已找到' : '未找到');
    
    // 更新场景状态（全景页专用）
    updateSceneStatus('library');
    updateSceneStatus('tavern');
    updateSceneStatus('temple');
    updateSceneStatus('exit');
}

// 更新单个场景的状态（锁定/解锁/完成）
function updateSceneStatus(scene) {
    const sceneEl = document.getElementById(scene);
    if (!sceneEl) return; // 非全景页不执行
    
    const statusEl = document.getElementById(`${scene}-status`);
    if (!statusEl) return;
    
    // 移除所有状态类
    sceneEl.classList.remove('locked', 'completed');
    
    // 设置状态
    if (!gameState.scenes[scene]) {
        sceneEl.classList.add('locked');
        statusEl.textContent = '未解锁';
    } else if (gameState.sceneCompleted[scene]) {
        sceneEl.classList.add('completed');
        statusEl.textContent = '已完成';
    } else {
        statusEl.textContent = '可探索';
    }
}

// 进入场景（检查解锁状态并跳转）
function enterScene(targetPage) {
    const sceneName = targetPage.split('.')[0]; // 提取场景名（如 library.html → library）
    if (!gameState.scenes[sceneName]) {
        alert('该场景未解锁，请先完成前面的冒险！');
        return;
    }
    saveGameState(); // 跳转前保存状态
    window.location.href = targetPage;
}

// 延迟工具函数（模拟耗时操作）
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 添加日志到场景日志容器
function addLog(message, type = 'info') {
    const logEl = document.getElementById('log');
    if (!logEl) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span style="opacity:0.7">${new Date().toLocaleTimeString()}</span> ${message}`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight; // 自动滚动到底部
}
