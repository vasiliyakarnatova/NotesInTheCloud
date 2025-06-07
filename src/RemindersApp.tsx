import React, { useEffect, useState } from 'react';
import './styles.css';

interface Reminder {
  text: string;
  time: string;
}

const RemindersApp: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [text, setText] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('reminders');
    if (saved) {
      const parsed = JSON.parse(saved) as Reminder[];
      setReminders(parsed);
      scheduleNotifications(parsed);
    }
  }, []);

  const handleAdd = () => {
    if (!text || !time) return;
    const newReminder: Reminder = { text, time };
    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem('reminders', JSON.stringify(updated));
    scheduleNotifications([newReminder]);
    setText('');
    setTime('');
  };

  const handleDelete = (index: number) => {
    const updated = reminders.filter((_, i) => i !== index);
    setReminders(updated);
    localStorage.setItem('reminders', JSON.stringify(updated));
  };

  const showNotification = (message: string) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(message);
        }
      });
    }
  };

  const scheduleNotifications = (remindersToSchedule: Reminder[]) => {
    const now = new Date();
    remindersToSchedule.forEach(reminder => {
      const reminderTime = new Date(reminder.time);
      const delay = reminderTime.getTime() - now.getTime();
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        setTimeout(() => showNotification("Напомняне: " + reminder.text), delay);
      }
    });
  };

  return (
    <div className="container">
      <h1>Създай напомняне</h1>

      <label htmlFor="reminderInput">Текст на напомняне:</label>
      <input
        type="text"
        id="reminderInput"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Напиши напомняне"
      />

      <label htmlFor="reminderTime">Дата и час:</label>
      <input
        type="datetime-local"
        id="reminderTime"
        value={time}
        onChange={e => setTime(e.target.value)}
      />

      <button onClick={handleAdd}>Добави</button>

      <h2>Списък с напомняния</h2>
      <ul className="reminder-list">
        {reminders.map((reminder, index) => (
          <li key={index} className="reminder-item">
            <span>{reminder.text} — {new Date(reminder.time).toLocaleString()}</span>
            <button onClick={() => handleDelete(index)} className="delete-btn">
              Изтрий
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemindersApp;
