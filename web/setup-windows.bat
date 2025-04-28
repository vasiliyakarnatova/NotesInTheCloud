@echo off
echo === НАСТРОЙКА НА ПРОЕКТА ЗА VS CODE ===
echo.

echo 1. Изпълняване на скрипта prepare-for-vs-code.js...
node prepare-for-vs-code.js
echo.

echo 2. Преименуване на генерираните файлове...
move vite.config.new.ts vite.config.ts
move package.json.new package.json
move client\index.html.new client\index.html
copy .env.template .env
echo.

echo 3. Инсталиране на зависимостите...
npm install
echo.

echo === НАСТРОЙКАТА Е ЗАВЪРШЕНА УСПЕШНО! ===
echo.
echo Сега можете да стартирате приложението с:
echo start-windows.bat
echo.
pause