var reminders = [];
function createReminder(title, time) {
    var reminder = { title: title, time: new Date(time) };
    reminders.push(reminder);
    var delay = reminder.time.getTime() - Date.now();
    var notification = document.getElementById('notification');
    if (delay > 0) {
        setTimeout(function () {
            alert('Напомняне: ' + reminder.title);
        }, delay);
        notification.textContent = "\u041D\u0430\u043F\u043E\u043C\u043D\u044F\u043D\u0435\u0442\u043E \"".concat(reminder.title, "\" \u0435 \u0441\u044A\u0437\u0434\u0430\u0434\u0435\u043D\u043E \u0443\u0441\u043F\u0435\u0448\u043D\u043E!");
        notification.style.color = "green";
    }
    else {
        notification.textContent = 'Времето на напомнянето вече е минало.';
        notification.style.color = "red";
    }
}
var form = document.getElementById('reminder-form');
var titleInput = document.getElementById('title');
var timeInput = document.getElementById('time');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    createReminder(titleInput.value, timeInput.value);
    form.reset();
});
