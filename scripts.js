document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterSelect = document.getElementById('filter');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let isUpdating = false;
    let currentTaskId = null;

    taskForm.addEventListener('submit', handleSubmit);
    filterSelect.addEventListener('change', filterTasks);
    taskList.addEventListener('click', handleTaskAction);

    function handleSubmit(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const dueDate = document.getElementById('due-date').value;

        if (!title || !dueDate) {
            alert('Please fill out all fields.');
            return;
        }

        if (isUpdating) {
            updateTask(currentTaskId, title, dueDate);
        } else {
            addTask(title, dueDate);
        }

        taskForm.reset();
    }

    function addTask(title, dueDate) {
        const task = {
            id: Date.now(),
            title,
            dueDate,
        };

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
    }

    function filterTasks() {
        const filterValue = filterSelect.value;
        let filteredTasks = tasks;

        if (filterValue !== 'all') {
            const days = parseInt(filterValue, 10);
            const today = new Date();
            filteredTasks = tasks.filter(task => {
                const dueDate = new Date(task.dueDate);
                const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const normalizedDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

                const diffTime = normalizedToday - normalizedDueDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= days && diffDays >= 0;
            });
        }

        renderTasks(filteredTasks);
    }

    function handleTaskAction(event) {
        const taskId = event.target.closest('.task-card').dataset.id;
        if (event.target.id === 'delete') {
            deleteTask(taskId);
        } else if (event.target.id === 'update') {
            prepareUpdateTask(taskId);
        }
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== parseInt(taskId, 10));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
    }

    function prepareUpdateTask(taskId) {
        const task = tasks.find(task => task.id === parseInt(taskId, 10));
        document.getElementById('title').value = task.title;
        document.getElementById('due-date').value = task.dueDate;
        isUpdating = true;
        currentTaskId = taskId;
    }

    function updateTask(taskId, title, dueDate) {
        const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId, 10));
        tasks[taskIndex].title = title;
        tasks[taskIndex].dueDate = dueDate;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        isUpdating = false;
        currentTaskId = null;
        renderTasks(tasks);
    }

    function renderTasks(taskArray) {
        taskList.innerHTML = '';
        taskArray.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.dataset.id = task.id;

            taskCard.innerHTML = `
                <div>
                    <h4>${task.title}</h4>
                    <p>${task.dueDate}</p>
                </div>
                <div>
                    <button id="update">Update</button>
                    <button id="delete">Delete</button>
                </div>`;

            taskList.appendChild(taskCard);
        });
    }

    renderTasks(tasks);
});
