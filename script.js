  // ---- COUNTDOWN TO 10PM & PROGRESS BAR ----
  function updateCountdown() {
      const now = new Date();
      const targetTime = new Date(now);
      // Set target time to 10PM UTC+3:30 (6:30 PM UTC)
      targetTime.setUTCHours(18, 30, 0, 0);
      if (now > targetTime) targetTime.setDate(targetTime.getDate() + 1);
      const timeDifference = targetTime - now;

      if (timeDifference <= 0) {
          document.getElementById("countdown").innerText = "It's 10 PM (UTC +3:30)!";
          document.title = "It's 10 PM!";
          document.getElementById('countdown-bar').style.width = "0%";
      } else {
          const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));
          const minutesLeft = Math.floor((timeDifference / (1000 * 60)) % 60);
          const secondsLeft = Math.floor((timeDifference / 1000) % 60);
          const countdownText = `${hoursLeft} hours, ${minutesLeft} minutes, and ${secondsLeft} seconds left until 10 PM (UTC +3:30).`;
          document.getElementById("countdown").innerText = countdownText;
          document.title = `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s until 10 PM`;

          // Progress bar calculation (from last 10PM to next 10PM)
          const prevTarget = new Date(targetTime);
          prevTarget.setDate(targetTime.getDate() - 1);
          const totalSeconds = (targetTime - prevTarget) / 1000; // Always 24h = 86400s
          const secondsPassed = (now - prevTarget) / 1000;
          const percentComplete = Math.max(0, Math.min(100, (secondsPassed / totalSeconds) * 100));
          document.getElementById('countdown-bar').style.width = percentComplete + "%";
  
      }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();








  // ---- DAILY QUOTE FROM API ----
  async function getBookQuote() {
    try {
        const response = await fetch('https://favqs.com/api/qotd');
        const data = await response.json();
        document.getElementById('book-quote').innerHTML =
            `"${data.content}"<br><b>${data.author}${data.source ? ' – ' + data.source : ''}</b>`;
    } catch (e) {
        document.getElementById('book-quote').innerText = "Couldn't fetch quote right now.";
    }
}
// Show a quote on page load
window.addEventListener('DOMContentLoaded', getBookQuote);


  // ---- TO-DO LIST PERSISTENCE ----
  function saveTasks() {
      const tasks = [];
      document.querySelectorAll('#task-list li').forEach(li => {
          const taskText = li.querySelector('span:nth-child(1)').innerText;
          const taskTime = li.querySelector('span:nth-child(2)').innerText;
          tasks.push({ taskText, taskTime });
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const taskList = document.getElementById("task-list");
      taskList.innerHTML = '';
      tasks.forEach(({ taskText, taskTime }) => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${taskText}</span> - <span>${taskTime}</span>
                          <button onclick="deleteTask(this)" class="delete-btn">Delete</button>`;
          taskList.appendChild(li);
      });
  }
  window.addEventListener("DOMContentLoaded", loadTasks);

  function addTask() {
      const taskInput = document.getElementById("task");
      const taskText = taskInput.value.trim();
      const taskStartTime = document.getElementById("task-start-time").value;
      const taskEndTime = document.getElementById("task-end-time").value;

      if (taskText !== "" && taskStartTime !== "" && taskEndTime !== "") {
          const taskList = document.getElementById("task-list");
          const li = document.createElement("li");
          li.innerHTML = `<span>${taskText}</span> - <span>${taskStartTime} to ${taskEndTime}</span>
                          <button onclick="deleteTask(this)" class="delete-btn">Delete</button>`;
          taskList.appendChild(li);

          taskInput.value = "";
          document.getElementById("task-start-time").value = "";
          document.getElementById("task-end-time").value = "";

          saveTasks();
      }
  }

  document.getElementById("task").addEventListener('keydown', function(e){
      if(e.key === "Enter") addTask();
  });

  function deleteTask(button) {
      const taskList = document.getElementById("task-list");
      const listItem = button.parentNode;
      taskList.removeChild(listItem);
      saveTasks();
  }

  function deleteAll() {
      const taskList = document.getElementById("task-list");
      while (taskList.firstChild) {
          taskList.removeChild(taskList.firstChild);
      }
      saveTasks();
  }

  // ---- EXPORT TASKS TO CSV ----
  function exportTasks() {
      const tasks = [];
      document.querySelectorAll('#task-list li').forEach(li => {
          const taskText = li.querySelector('span:nth-child(1)').innerText;
          const taskTime = li.querySelector('span:nth-child(2)').innerText;
          tasks.push([taskText, taskTime]);
      });
      let csvContent = "data:text/csv;charset=utf-8,Task,Time\n" + tasks.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "tasks.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
