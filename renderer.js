const { ipcRenderer } = require('electron');

document.getElementById('changeTimeBtn').addEventListener('click', () => {
  const dateTimeInput = document.getElementById('dateTime').value;

  if (!dateTimeInput) {
    document.getElementById('status').innerText = 'Please select a valid date and time.';
    return;
  }

  // Format the date to "YYYY-MM-DD HH:MM:SS"
  const dateTime = new Date(dateTimeInput).toISOString().replace('T', ' ').split('.')[0];

  ipcRenderer.send('change-time', dateTime);
});

ipcRenderer.on('time-change-status', (event, status) => {
  if (status.success) {
    document.getElementById('status').innerText = `System time changed successfully: ${status.output}`;
  } else {
    document.getElementById('status').innerText = `Error changing system time: ${status.error}`;
  }
});
