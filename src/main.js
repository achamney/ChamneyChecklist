window.$ = function (query) {
    const results = document.querySelectorAll(query);
    const fnList = {
        show: () => {
            results.forEach((result) => {
                result.style.display = "block";
            });
            return fnList;
        },
        hide: () => {
            results.forEach((result) => {
                result.style.display = "none";
            });
            return fnList;
        },
    }
    return fnList;
}
const queryProto = {
    ajax: ({ url, type, data, contentType, success }) => {
        return fetch(url, {
            method: type,
            body: data,
            mode: "cors", // <-- Change this
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        }).then(success);
    },
    get: (url) => {
        return fetch(url, {
            mode: "cors", // <-- Change this
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        }).then((resp) => resp.json());
    }
}
Object.setPrototypeOf($, queryProto);

(async () => {
    const listContainer = await netService.getAllLists();
    listContainer.lists = listContainer.lists || [];
    function renderLists() {
        renderTemplate("listsTemplate", "lists", listContainer.lists);
        listContainer.lists.forEach((list,i)=>{
            renderTemplate("tasksTemplate", `list${i}tasks`, listContainer.lists[i].items);
        })
    }
    renderLists();
    window.createNewList = () => {
        listContainer.lists.push({ items: [], title: "New List", id: listContainer.lists.length });
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }

    window.deleteList = (id) => {
        listContainer.lists = listContainer.lists.filter((list)=>list.id !== id); 
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.addTask = (id) => {
        const list = listContainer.lists.find((list)=>list.id === id); 
        list.items.push({title:"", checked:false, id: list.items.length, listId: id});
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.deleteTask = (listId, id) => {
        const list = listContainer.lists.find((list)=>list.id === listId); 
        list.items = list.items.filter((item)=>item.id !== id);
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
    window.changeTaskTitle = (listId, id, newValue) => {
        const list = listContainer.lists.find((list)=>list.id === listId); 
        const task = list.items.find((item)=>item.id === id);
        task.title = newValue;
        netService.setList(listContainer, "2e8e0898-12f8-11f0-b5ae-0afff235d613", () => renderLists());
    }
})();

function renderTemplate(templateId, domId, data) {
    const template = document.querySelector(`#${templateId}`);
    const parentNode = document.querySelector(`#${domId}`);
    parentNode.innerHTML = "";
    data.forEach((datum) => {
        const clonedDocumentFragment = template.content.cloneNode(true);

        // Looks like there is no better way to modify HTML of the whole
        // DocumentFragment, so we modify HTML of each child node:
        Array
            .from(clonedDocumentFragment.children)
            .forEach(childElement => renderInnerVariables(
                childElement,
                datum
            ));
        parentNode.appendChild(clonedDocumentFragment);
    });
    // And here example of the method replacing those values
    function renderInnerVariables(targetElement, variables = {}) {
        // Reminder: it can be really unsafe to put user data here
        targetElement.innerHTML = targetElement.innerHTML.replace(
            // Instead of looping through variables, we can use regexp
            // to get all the variables in content
            /{([\w_]+)}/g,
            (original, variableName) => {
                // Check if variables passed and target variable exists
                return variables && variables.hasOwnProperty(variableName)
                    // Pass the variable value
                    ? variables[variableName]
                    // Or pass the original string
                    : original;
            }
        );
    }
}