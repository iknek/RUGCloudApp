// Class which is responsible for deciding button behaviour and sending command to API.
// TODO: Change to instead send request to worker, which directs it to API (?).

class Controller {
    getItems() {
        return fetch("/items")
            .then((res) => res.json())
            .then((data) => data);
    }

    otherAction() {
        console.log("Other action performed!");
        // TODO: other actions
    }
}

export default Controller;
