const STORAGE_KEY = "fitness-tracker-data";

function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let currentExercises = [];

// Show Exercise Form
document.getElementById('add-exercise').onclick = () => {
  document.getElementById('exercise-form').style.display = "block";
};

// Save Exercise to Current Workout
document.getElementById('save-exercise').onclick = (e) => {
  e.preventDefault();
  let ex = {
    name: document.getElementById('exercise-name').value,
    sets: Number(document.getElementById('exercise-sets').value) || 0,
    reps: Number(document.getElementById('exercise-reps').value) || 0,
    weight: Number(document.getElementById('exercise-weight').value) || 0
  };
  currentExercises.push(ex);
  renderExercisesList();
  // Reset form
  document.getElementById('exercise-name').value = '';
  document.getElementById('exercise-sets').value = '';
  document.getElementById('exercise-reps').value = '';
  document.getElementById('exercise-weight').value = '';
  document.getElementById('exercise-form').style.display = "none";
};

// Render Current Exercises
function renderExercisesList() {
  let listDiv = document.getElementById('exercise-list');
  listDiv.innerHTML = currentExercises.map(ex =>
    `<div>${ex.name} - ${ex.sets} sets x ${ex.reps} reps @ ${ex.weight}kg</div>`
  ).join('');
}

// Log Workout
document.getElementById('start-workout').onclick = () => {
  let type = document.getElementById('workout-type').value;
  let duration = Number(document.getElementById('workout-duration').value) || 0;
  let today = new Date().toISOString().split('T')[0];
  let data = loadData();
  data.workouts = data.workouts || [];
  data.workouts.push({
    date: today, type, duration,
    exercises: currentExercises
  });
  saveData(data);
  renderHistory();
  currentExercises = [];
  renderExercisesList();
  alert("Workout logged!");
};

// Save Stats
document.getElementById('save-stats').onclick = () => {
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

// Schedule
document.getElementById('schedule-workout').onclick = () => {
  let date = document.getElementById('schedule-date').value;
  let type = document.getElementById('schedule-type').value;
  let data = loadData();
  data.scheduled = data.scheduled || [];
  data.scheduled.push({ date, type });
  saveData(data);
  alert("Workout scheduled!");
};

// Render History
function renderHistory() {
  let data = loadData();
  let workouts = data.workouts || [];
  let container = document.getElementById('history-container');
  container.innerHTML = '';
  
  workouts.forEach(w => {
    let exDetails = w.exercises && w.exercises.length
      ? `<ul>${w.exercises.map(ex => `<li>${ex.name} - ${ex.sets}x${ex.reps} @ ${ex.weight}kg</li>`).join('')}</ul>`
      : '<em>No exercises recorded</em>';
    container.innerHTML += `
      <div class="border rounded p-2 mb-2">
        <strong>${w.date}</strong> - ${w.type} (${w.duration} min)
        ${exDetails}
      </div>
    `;
  });

  let chartCtx = document.getElementById('history-chart').getContext('2d');
  if (window.historyChart) window.historyChart.destroy();
  window.historyChart = new Chart(chartCtx, {
    type: 'line',
    data: {
      labels: workouts.map(w => w.date),
      datasets: [{
        label: 'Duration (min)',
        data: workouts.map(w => w.duration),
        borderColor: '#43a047',
        backgroundColor: 'rgba(67, 160, 71, 0.2)',
        fill: true
      }]
    }
  });
}

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

renderHistory();
