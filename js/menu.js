// js/menu.js — Логика стартовой страницы
document.addEventListener("DOMContentLoaded", () => {
    renderCharList();
    // 1. Создание пустого листа
    document.getElementById('btn-new').addEventListener('click', () => {
        const newId = "char_" + Date.now();
        AppStorage.setActive(newId);
        window.location.href = "sheet.html"; // Переходим на лист
    });
    // 2. Генератор (Заглушка на будущее)
    document.getElementById('btn-generate').addEventListener('click', () => {
        alert("Генератор случайной мыши будет добавлен позже!");
    });
    // 3. ЭКСПОРТ (Сохранение базы в JSON)
    document.getElementById('btn-export').addEventListener('click', () => {
        const data = AppStorage.getAll();
        if (Object.keys(data).length === 0) {
            alert("У вас нет сохраненных персонажей для экспорта.");
            return;
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "mausritter_sheet.json";
        a.click();
        URL.revokeObjectURL(url);
    });
    // 4. ИМПОРТ (Загрузка базы из JSON)
    document.getElementById('file-import').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                localStorage.setItem(AppStorage.charsKey, JSON.stringify(data));
                renderCharList();
                alert("База персонажей успешно загружена!");
            } catch (err) {
                alert("Ошибка чтения файла. Убедитесь, что это корректный .json");
            }
        };
        reader.readAsText(file);
    });
});
// Отрисовка списка сохраненных мышей
function renderCharList() {
    const listEl = document.getElementById('char-list');
    listEl.innerHTML = '';
    const chars = AppStorage.getAll();
    const keys = Object.keys(chars);
    if (keys.length === 0) {
        listEl.innerHTML = '<p style="color: #666; font-style: italic;">Пока нет сохраненных персонажей.</p>';
        return;
    }
    keys.forEach(id => {
        const char = chars[id];
        const card = document.createElement('div');
        // Используем классы из components.css для красоты
        card.className = 'catalog-item'; 
        card.style.display = 'flex';
        card.style.justifyContent = 'space-between';
        card.style.alignItems = 'center';
        card.innerHTML = `<div style="cursor: pointer; flex-grow: 1; padding: 5px 0;" onclick="openChar('${id}')">
                <strong style="font-size: 1.2rem;">${char.name || "Безымянная мышь"}</strong>
                <span style="color: #666; margin-left: 10px; font-size: 0.9rem;">Уровень: ${char.level || 0}</span>
            </div>
            <button class="btn-action delete" style="width: auto; padding: 6px 12px; margin: 0; font-size: 0.9rem;" onclick="deleteChar('${id}')">Удалить</button>`;
        listEl.appendChild(card);
    });
}
// Глобальные функции для кнопок в списке
window.openChar = function(id) {
    AppStorage.setActive(id);
    window.location.href = "sheet.html";
};
window.deleteChar = function(id) {
    if (confirm("Вы уверены, что хотите удалить этого персонажа безвозвратно?")) {
        AppStorage.delete(id);
        renderCharList();
    }
};
