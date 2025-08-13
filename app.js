const STORAGE_KEY = "fitness-tracker-data";

function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Workout logging
document.getElementById('start-workout').onclick = function() {
  let type = document.getElementById('workout-type').value;
  let duration = Number(document.getElementById('workout-duration').value) || 0;
  let today = new Date().toISOString().split('T')[0];
  let data = loadData();
  data.workouts = data.workouts || [];
  data.workouts.push({ date: today, type, duration });
  saveData(data);
  renderHistory();
  alert("Workout logged!");
};

// Stats logging
document.getElementById('save-stats').onclick = function() {
  let today = new Date().toISOString().split('T')[0];
  let data = loadData();
  data.stats = data.stats || {};
  data.stats[today] = {
    steps: Number(document.getElementById('steps').value) || 0,
    water: Number(document.getElementById('water').value) || 0,
    calories: Number(document.getElementById('calories').value) || 0,
    weight: Number(document.getElementById('weight').value) || 0
  };
  saveData(data);
  alert("Stats saved!");
};

// Schedule workouts
document.getElementById('schedule-workout').onclick = function() {
  let date = document.getElementById('schedule-date').value;
  let type = document.getElementById('schedule-type').value;
  let data = loadData();
  data.scheduled = data.scheduled || [];
  data.scheduled.push({ date, type });
  saveData(data);
  alert("Workout scheduled!");
};

// History rendering
function renderHistory() {
  let data = loadData();
  let workouts = data.workouts || [];
  let tbody = document.querySelector('#history-table tbody');
  tbody.innerHTML = '';
  workouts.forEach(w => {
    let row = `<tr><td>${w.date}</td><td>${w.type}</td><td>${w.duration}</td></tr>`;
    tbody.innerHTML += row;
  });

  let chartCtx = document.getElementById('history-chart').getContext('2d');
  if (window.historyChart) {
    window.historyChart.destroy();
  }
  window.historyChart = new Chart(chartCtx, {
    type: 'line',
    data: {
      labels: workouts.map(w => w.date),
      datasets: [{
        label: 'Duration (min)',
        data: workouts.map(w => w.duration),
        borderColor: '#43a047',
        backgroundColor: 'rgba(67,160,71,0.2)',
        fill: true
      }]
    }
  });
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

renderHistory();
