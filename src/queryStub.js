window.$ = function (query) {
    const results = document.querySelectorAll(query);
    const fnList = {
        show: () => {
            results.forEach((result) => {
                result.style.opacity = "1";
            });
            return fnList;
        },
        hide: () => {
            results.forEach((result) => {
                //window.setTimeout(() => {
                result.style.opacity = "0";
                //}, 1000)
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
            mode: "cors",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        }).then(success);
    },
    get: (url) => {
        return fetch(url, {
            mode: "cors",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        }).then((resp) => resp.json());
    }
}
Object.setPrototypeOf($, queryProto);