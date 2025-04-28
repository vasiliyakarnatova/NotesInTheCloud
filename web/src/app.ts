interface Reminder {
    title: string;
    time: Date;
  }
  
  const reminders: Reminder[] = [];
  
  function createReminder(title: string, time: string): void {
    const reminder: Reminder = { title, time: new Date(time) };
    reminders.push(reminder);
  
    const delay = reminder.time.getTime() - Date.now();
  
    const notification = document.getElementById('notification') as HTMLDivElement;
    
    if (delay > 0) {
      setTimeout(() => {
        alert('Напомняне: ' + reminder.title);
      }, delay);
  
      notification.textContent = `Напомнянето "${reminder.title}" е създадено успешно!`;
      notification.style.color = "green";
    } else {
      notification.textContent = 'Времето на напомнянето вече е минало.';
      notification.style.color = "red";
    }
  }
  
  const form = document.getElementById('reminder-form') as HTMLFormElement;
  const titleInput = document.getElementById('title') as HTMLInputElement;
  const timeInput = document.getElementById('time') as HTMLInputElement;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    createReminder(titleInput.value, timeInput.value);
    form.reset();
  });
  