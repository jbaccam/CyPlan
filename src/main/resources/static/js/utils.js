// utils.js
export function convertDaysToIndices(dayString) {
    const dayMapping = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5 };
    return Object.keys(dayMapping).filter(day => dayString.includes(day)).map(day => dayMapping[day]);
}

export function convertTimeFormat(timeStr) {
    if (!timeStr || timeStr === 'N/A') return null;

    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
        hours = '00';
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

export function showFlashMessage(message, type = 'info') {
    const flashMessage = document.querySelector('.flash-message');
    if (!flashMessage) return;

    flashMessage.textContent = message;
    flashMessage.classList.add(`alert-${type}`);
    setTimeout(() => {
        flashMessage.textContent = '';
        flashMessage.classList.remove(`alert-${type}`);
    }, 5000);
}
