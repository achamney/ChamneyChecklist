(async () => {
    const listContainer = await netService.getAllLists();
    listContainer.lists = listContainer.lists || [];
    function renderLists() {
        renderTemplate("listsTemplate", "lists", listContainer.lists);
        listContainer.lists.forEach((list) => {
            renderTemplate("tasksTemplate", `list${list.id}tasks`, list.items);
            list.items.forEach((task) => {
                renderTemplate("subTasksTemplate", `list${list.id}task${task.id}subtasks`, task.subTasks);
            });
        })
    }
    window.createNewList = () => {
        listContainer.lists.push({ items: [], title: "New List", id: Date.now() });
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }

    window.deleteList = (id) => {
        listContainer.lists = listContainer.lists.filter((list) => list.id !== id);
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.addTask = (id) => {
        const list = listContainer.lists.find((list) => list.id === id);
        list.items.push({ title: "", checked: false, id: Date.now(), listId: id, subTasks: [], subTaskLength: 0 });
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.deleteTask = (listId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        list.items = list.items.filter((item) => item.id !== id);
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.changeListTitle = (id, newValue) => {
        const list = listContainer.lists.find((list) => list.id === id);
        if (list.title === newValue) {
            return;
        }
        list.title = newValue;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.toggleListVisible = (id) => {
        const list = listContainer.lists.find((list) => list.id === id);
        list.toggled = list.toggled?.length > 0 ? "" : "listToggled";
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.changeTaskTitle = (listId, id, newValue) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === id);
        if (task.title === newValue) {
            return;
        }
        task.title = newValue;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.toggleTaskCompleted = (listId, id, newValue) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === id);
        task.checked = newValue ? "checked" : "";
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }

    window.moveTaskUp = (listId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === id);
        const taskIndex = list.items.indexOf(task);
        if (taskIndex === 0) {
            return;
        }
        const tempTask = list.items[taskIndex - 1];
        list.items[taskIndex - 1] = task;
        list.items[taskIndex] = tempTask;
        task.menuOpen = "";
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.moveTaskDown = (listId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === id);
        const taskIndex = list.items.indexOf(task);
        if (taskIndex === list.items.length - 1) {
            return;
        }
        const tempTask = list.items[taskIndex + 1];
        list.items[taskIndex + 1] = task;
        list.items[taskIndex] = tempTask;
        task.menuOpen = "";
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.addSubTask = (listId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === id);
        task.subTasks = task.subTasks || [];
        task.toggled = "";
        task.menuOpen = "";
        task.subTasks.push({ listId, taskId: id, id: Date.now(), title: "", checked: "" });
        task.subTaskLength = task.subTasks.length;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.toggleSubtasksVisible = (listId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === id);
        task.toggled = task.toggled?.length > 0 ? "" : "taskToggled";
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.openMenu = (listId, id, target) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === id);
        task.menuOpen = "menuOpen";
        task.menuLeft = target.getBoundingClientRect().left;
        task.menuTop = target.getBoundingClientRect().bottom;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.closeMenu = (listId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === id);
        task.menuOpen = "";
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.changeSubtaskTitle = (listId, taskId, id, newValue) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === taskId);
        const subTask = task.subTasks.find((item) => item.id === id);
        if (subTask.title === newValue) {
            return;
        }
        subTask.title = newValue;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.toggleSubtaskCompleted = (listId, taskId, id, newValue) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === taskId);
        const subTask = task.subTasks.find((item) => item.id === id);
        subTask.checked = newValue ? "checked" : "";
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.deleteSubtask = (listId, taskId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === taskId);
        task.subTasks = task.subTasks.filter((item) => item.id !== id);
        task.subTaskLength = task.subTasks.length;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.moveSubtaskUp = (listId, taskId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === taskId);
        const subTask = task.subTasks.find((item) => item.id === id);
        const subTaskIndex = task.subTasks.indexOf(subTask);
        if (subTaskIndex === 0) {
            return;
        }
        const tempTask = task.subTasks[subTaskIndex - 1];
        task.subTasks[subTaskIndex - 1] = subTask;
        task.subTasks[subTaskIndex] = tempTask;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.moveSubtaskDown = (listId, taskId, id) => {
        const list = listContainer.lists.find((list) => list.id === listId);
        const task = list.items.find((item) => item.id === taskId);
        const subTask = task.subTasks.find((item) => item.id === id);
        const subTaskIndex = task.subTasks.indexOf(subTask);
        if (subTaskIndex === task.subTasks.length - 1) {
            return;
        }
        const tempTask = task.subTasks[subTaskIndex + 1];
        task.subTasks[subTaskIndex + 1] = subTask;
        task.subTasks[subTaskIndex] = tempTask;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    renderLists();
})();
