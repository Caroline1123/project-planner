import { getTasksFromStorage } from "./getTasks.js";

const getDelta = (task) => {
    let now = new Date();
    let deadline = new Date(task.deadline);
    // converts variables to milliseconds
    now = now.getTime();
    deadline = deadline.getTime();
    // calculate time delta 
    let delta = deadline-now;
    // converts delta to days
    return Math.ceil(delta / (1000 * 60* 60*24)); 
}

const displayTasks = () => {
    const tasks = getTasksFromStorage();
    const toDoTree = document.querySelector("#toDo");
    const doingTree = document.querySelector("#doing");
    const doneTree = document.querySelector("#done");
    const taskContainers =  document.querySelectorAll(".tasks-container");
    for (let taskContainer of taskContainers) {
        taskContainer.innerHTML = "";
    }
    // Get filter preferences from storage
    const filters = JSON.parse(localStorage.getItem('taskFilters'));
    const keyword = filters.keyword;
    const todoChecked = filters.todo;
    const doingChecked = filters.doing;
    const doneChecked = filters.done;
    const overdueChecked = filters.overdue;
    const endOfDayChecked = filters.endOfDay;
    const dueNextDaysChecked = filters.dueNextDays;
    
    // Sets display for sections depending on selected filter
    toDoTree.style.display = todoChecked ? "flex" : "none";
    doingTree.style.display = doingChecked ? "flex" : "none";
    doneTree.style.display = doneChecked ? "flex" : "none";

    for (let task of tasks) {
        let delta = getDelta(task);
        
        const shouldDisplay = (
            (keyword === '' || task.name.toLowerCase().includes(keyword) || task.description.includes(keyword)) 
            && 
            ((delta === 1 && endOfDayChecked) || (delta > 1 && dueNextDaysChecked) ||  (delta < 1 && overdueChecked))
        );
        if (shouldDisplay) {
            let taskCard = generateCard(task);
            taskCard.style.display = 'flex';
            if (task.status === "done") {
                const doneContainer = doneTree.querySelector(".tasks-container");
                doneContainer.appendChild(taskCard);
            }
            else if (task.status === "doing") {
                const doingContainer = doingTree.querySelector(".tasks-container");
                doingContainer.appendChild(taskCard);
            }
            else {
                const toDoContainer = toDoTree.querySelector(".tasks-container");
                toDoContainer.appendChild(taskCard);
            }
        }         
    }
}

const generateCard = (task) => {
    let delta = getDelta(task);
    const taskCard = document.createElement("div");
    taskCard.classList.add("task");
    taskCard.id = task.id;
    taskCard.setAttribute("draggable", true);
    taskCard.innerHTML = 
    `
    <div class="name_block"><h3>${task.name}</h3><span class="controls"><img title="Edit Task" class="edit_task" id="edit_${task.id}" src="assets/images/edit.svg"><img title="Delete Task" class="delete_task" id="delete_${task.id}" src="assets/images/delete.svg"</span>
    </div>
    <p class="task-description">${task.description}</p>
    `
    if (delta <= 1) {
        taskCard.innerHTML += 
        `<p class="task-deadline important"><img src="assets/images/clock.svg">${delta} j</p>`
    }
    else {
        taskCard.innerHTML +=
        `<p class="task-deadline"><img src="assets/images/clock.svg">${delta} j</p>`
    } 
    return taskCard;
}

export {displayTasks}