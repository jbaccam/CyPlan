export function initializeCalendar(selectedSections) {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        events: generateEvents(selectedSections),
        firstDay: 1,
        hiddenDays: [0, 6],
        allDaySlot: false,
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
    });

    calendar.render();
    return calendar;
}

function generateEvents(sections) {
    const events = [];
    sections.forEach(section => {
        events.push({
            title: `${section.courseId} - Section ${section.sectionNumber}`,
            daysOfWeek: convertDaysToIndices(section.daysOfTheWeek),
            startTime: convertTimeFormat(section.timeStart),
            endTime: convertTimeFormat(section.timeEnd),
        });
    });
    return events;
}

function convertDaysToIndices(dayString) {
    const dayMapping = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5 };
    return Object.keys(dayMapping).filter(day => dayString.includes(day)).map(day => dayMapping[day]);
}

function convertTimeFormat(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12;
    if (modifier === 'AM' && hours === '12') hours = '00';
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}
