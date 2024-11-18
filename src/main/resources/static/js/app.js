import { showFlashMessage } from './utils.js';

const { createApp } = Vue;

createApp({
    data() {
        return {
            departments: departments,
            courses: initialData.map(course => ({
                ...course,
                showSections: false,
            })),
            selectedSections: selectedSections,
            currentScheduleIndex: currentScheduleIndex,
            scheduleCount: scheduleCount,
            calendar: null,
            newCourse: {
                department: '',
                courseId: '',
            },
            flashMessage: {
                message: '',
                type: 'info',
            },
            formSubmitted: false,
        };
    },
    methods: {
        newCourse: {
            department: '', // The selected department (e.g., "COMS")
            courseId: '',   // The course ID (e.g., "228")
            courseName: '', // Optional: Human-readable course name
            description: '', // Optional: A brief course description
        },
        courses: initialData.map(course => ({
            courseId: course.courseId,         // Unique course ID (e.g., "COMS 228")
            courseName: course.courseName,     // Name of the course (e.g., "Data Structures")
            description: course.description,   // Optional: A brief course description
            sections: course.sections.map(section => ({
                sectionNumber: section.sectionNumber, // Section ID (e.g., "001")
                instructor: section.instructor,       // Instructor name
                daysOfTheWeek: section.daysOfTheWeek, // Days the section meets (e.g., "MWF")
                timeStart: section.timeStart,         // Start time (e.g., "10:00 AM")
                timeEnd: section.timeEnd,             // End time (e.g., "11:00 AM")
                openSeats: section.openSeats          // Available seats
            }))
        })),


        addCourse: function () {
            this.formSubmitted = true;

            // Validate form fields
            if (!this.newCourse.department || !this.newCourse.courseId) {
                if (!this.newCourse.department) {
                    showFlashMessage('Please select a department', 'danger');
                }
                if (!this.newCourse.courseId) {
                    showFlashMessage('Please enter a course ID', 'danger');
                }
                return;
            }

            // Create form data for submission
            const formData = new FormData();
            formData.append('department', this.newCourse.department);
            formData.append('courseId', this.newCourse.courseId);

            // Debugging log
            console.log('Submitting course:', this.newCourse);

            // Send request to backend
            fetch('/addCourse', {
                method: 'POST',
                body: formData,
            })
                .then(async (response) => {
                    if (response.ok) {
                        showFlashMessage('Course added successfully!', 'success');
                        // Reset form fields
                        this.newCourse.department = '';
                        this.newCourse.courseId = '';
                    } else {
                        const errorMessage = await response.text();
                        console.error('Server error:', errorMessage);
                        showFlashMessage(errorMessage || 'Failed to add course', 'danger');
                    }
                })
                .catch((error) => {
                    console.error('Error adding course:', error);
                    showFlashMessage('An error occurred while adding the course.', 'danger');
                });
        },
        removeCourse(course) {
            const { department, courseId } = course;

            // Send request to backend to remove course
            fetch(`/removeCourse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ department, courseId }),
            })
                .then((response) => {
                    if (response.ok) {
                        // Remove course from local state
                        this.courses = this.courses.filter((c) => c.courseId !== courseId);
                        this.selectedSections = this.selectedSections.filter(
                            (section) => section.courseId !== courseId
                        );
                        // Reset schedule-related data
                        this.scheduleCount = 0;
                        this.currentScheduleIndex = 0;

                        showFlashMessage(`Course ${courseId} removed successfully`, 'success');
                    } else {
                        response.text().then((errorMessage) => {
                            console.error('Failed to remove course:', errorMessage);
                            showFlashMessage(errorMessage || 'Failed to remove course', 'danger');
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error removing course:', error);
                    showFlashMessage('An error occurred while removing the course.', 'danger');
                });
        },
    },
}).mount('#app');
