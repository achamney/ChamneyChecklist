
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