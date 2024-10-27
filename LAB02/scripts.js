class Todo {
    constructor() {
        this.tasks = [];
        this.isEditing = false;
        this.initialize();
    }

    initialize() {
        this.render();
        this.addEventListeners();
        this.loadTasksFromLocalStorage();
    }

    addTask(task, date) {
        if (!this.isEditing && this.validateTask(task, date)) {
            this.tasks.push({ task, date });
            this.saveAndRender();
        } else {
            alert("Tekst musi być dłuższy niż 3 i krótszy niż 255 znaków, a data musi być ustawiona w przyszłości");
        }
    }

    editTask(index) {
        if (this.isEditing) return;

        this.isEditing = true;

        const taskElement = document.getElementById(`task-${index}`);
        const task = this.tasks[index];

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.value = task.task;
        taskInput.className = "edit-input";
        taskInput.classList.add("text_input_style")

        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = task.date;
        dateInput.className = "edit-input";
        dateInput.classList.add("text_input_style")

        const saveButton = this.createButton("Zapisz", () => {
            this.saveEditedTask(index, taskInput.value.trim(), dateInput.value.trim());
        });
        saveButton.classList.add("button_style")

        const cancelButton = this.createButton("Anuluj", () => {
            this.cancelEdit(index);
        });
        cancelButton.classList.add("button_style")

        taskElement.innerHTML = '';
        taskElement.appendChild(taskInput);
        taskElement.appendChild(dateInput);
        taskElement.appendChild(saveButton);
        taskElement.appendChild(cancelButton);
    }

    saveEditedTask(index, editedTask, editedDate) {
        if (this.validateTask(editedTask, editedDate)) {
            this.tasks[index].task = editedTask;
            this.tasks[index].date = editedDate;
            this.saveAndRender();
        } else {
            alert("Tekst musi być dłuższy niż 3 i krótszy niż 255 znaków, a data musi być ustawiona w przyszłości");
        }
        this.isEditing = false;
    }

    cancelEdit(index) {
        this.isEditing = false;
        this.render();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveAndRender();
    }

    validateTask(task, date) {
        const isValidText = task.length >= 3 && task.length <= 255;
        const isFutureDate = date === "" || new Date(date) >= new Date();
        return isValidText && isFutureDate;
    }

    saveAndRender() {
        this.saveTasksToLocalStorage();
        this.render();
    }

    render() {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = '';

        this.tasks.forEach((task, index) => {
            taskList.appendChild(this.createTaskElement(task, index));
        });
    }

    createTaskElement({ task, date }, index) {
        const li = document.createElement("li");
        li.id = `task-${index}`;
        li.innerHTML = `
            <span class="task-text tab">${task}</span>
            <span class="tab">${date}</span>
            <button class="button_style" onclick="todo.deleteTask(${index})">Usuń</button>
        `;

        const taskTextElement = li.querySelector(".task-text");
        taskTextElement.addEventListener("hover",taskTextElement.classList.add("text_hover"))
        taskTextElement.addEventListener("click", () => this.editTask(index));

        return li;
    }

    addEventListeners() {
        document.getElementById("addTaskButton").addEventListener("click", () => {
            const taskInput = document.getElementById("newTask").value.trim();
            const dateInput = document.getElementById("dueDate").value.trim();
            this.addTask(taskInput, dateInput);
            this.clearInputs();
        });

        document.getElementById("search").addEventListener("input", this.filterTasks.bind(this));
    }

    clearInputs() {
        document.getElementById("newTask").value = "";
        document.getElementById("dueDate").value = "";
    }

    saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    loadTasksFromLocalStorage() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        this.render();
    }

    filterTasks() {
        const filter = document.getElementById("search").value.toLowerCase();
        this.tasks.forEach((task, index) => this.updateTaskVisibility(task, index, filter));
    }

    updateTaskVisibility(task, index, filter) {
        const li = document.getElementById(`task-${index}`);
        const taskSpan = li.querySelector("span");

        if (task.task.toLowerCase().includes(filter) || task.date.toLowerCase().includes(filter)) {
            taskSpan.innerHTML = this.highlightFilterMatch(task.task, filter);
            li.style.display = "";
        } else {
            taskSpan.innerHTML = task.task;
            li.style.display = "none";
        }
    }

    highlightFilterMatch(taskText, filter) {
        if (!filter) return taskText;
        const regex = new RegExp(`(${filter})`, 'ig');
        return taskText.replace(regex, match => `<span class="highlight">${match}</span>`);
    }

    createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClick);
        return button;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.todo = new Todo();
});
