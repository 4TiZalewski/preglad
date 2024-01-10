// @ts-check

/**
 * @type {HTMLDivElement | null}
 */
const display_nullable = document.querySelector("#display");

/**
 * @type {HTMLFormElement | null}
 */
const form_nullable = document.querySelector("#form");

/** 
 * @type {HTMLInputElement | null}
 */
const name_input_nullable = document.querySelector("#name");

/** 
 * @type {HTMLInputElement | null}
 */
const date_input_nullable = document.querySelector("#date");

class Service {
    /**
     * @param {number} id 
     * @param {string} name 
     * @param {Array<number>} dependencies 
     * @param {number} cost
     * @param {string} html_id
     */
    constructor(id, name, cost, dependencies, html_id) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.dependencies = dependencies;
        this.html_id = html_id;
    }

    /**
     * Returns the viewable HTML element to put into HTML
     * 
     * @returns {HTMLElement}
     */
    view() {
        const hidden = this.isHidden();

        /**
         * @type {HTMLLabelElement}
         */
        const label = document.createElement("label");
        label.htmlFor = this.id.toString();
        if (hidden) {
            label.className = "hidden";
        }

        /**
         * @type {HTMLInputElement}
         */
        const element = document.createElement("input");
        element.type = "checkbox";
        element.id = label.htmlFor;
        element.name = element.id;

        element.addEventListener("change", (event) => {
            event.preventDefault();

            update_dependencies(this);
        });

        const text = document.createTextNode(" " + this.name);

        label.append(element);
        label.append(text);

        return label;
    }

    update() {
        /**
         * @type {HTMLInputElement | null}
         */
        const element_nullable = document.querySelector(`[id='${this.id}']`);
        if (element_nullable) {
            const element = /** @type {HTMLInputElement} */ (element_nullable);
            /**
             * @type {HTMLElement | null}
             */
            const parent_element_nullable = element.parentElement;
            if (parent_element_nullable) {
                const parent_element = /** @type {HTMLElement} */ (parent_element_nullable);
                if (this.isHidden()) {
                    parent_element.className = "hidden";
                } else {
                    parent_element.className = "";
                }

                update_html(this);
            } else {
                console.error("Parent element of service does not exist!");
            }
        } else {
            console.error("Service does not exists!");
        }
    }

    /**
     * Returns whenether the service should be viewable or hidden
     * 
     * @returns {boolean}
     */
    isHidden() {
        let hidden = true;
        this.dependencies.forEach((service_id) => {
            const service = services[service_id];
            const element = document.querySelector(`[id='${service_id}']`);
            if (element) {
                if (hidden) {
                    hidden = !service.selected(element);
                }
            } else {
                console.error(`Service is dependent on service which does not exist (target_id='${service_id}', this.id='${this.id}')`);
            }
        });

        if (this.dependencies.length == 0) {
            hidden = false;
        }

        return hidden;
    }

    /**
     * Returns whenether the service is selected using HTML element which is a return value of view()
     * 
     * @param {Element} element
     * @returns {boolean}
     */
    selected(element) {
        return (/** @type {HTMLInputElement} */ (element)).checked;
    }
}

class OneChoiseService extends Service {
    /**
     * @param {number} id 
     * @param {string} name 
     * @param {number} cost
     * @param {Array<number>} dependencies 
     * @param {string} html_id
     * @param {string} group
     */
    constructor(id, name, cost, dependencies, html_id, group) {
        super(id, name, cost, dependencies, html_id);
        this.group = group;
    }

    /**
     * Returns the viewable HTML element to put into HTML
     * 
     * @returns {HTMLElement}
     */
    view() {
        const hidden = this.isHidden();

        /**
         * @type {HTMLLabelElement}
         */
        const label = document.createElement("label");
        label.htmlFor = this.id.toString();
        if (hidden) {
            label.className = "hidden";
        }

        /**
         * @type {HTMLInputElement}
         */
        const element = document.createElement("input");
        element.type = "radio";
        element.id = label.htmlFor;
        element.name = this.group;

        element.addEventListener("change", (event) => {
            event.preventDefault();

            update_dependencies(this);
        });

        const text = document.createTextNode(" " + this.name);

        label.append(element);
        label.append(text);

        return label;
    }

    update() {
        /**
         * @type {HTMLInputElement | null}
         */
        const element_nullable = document.querySelector(`[id='${this.id}']`);
        if (element_nullable) {
            const element = /** @type {HTMLInputElement} */ (element_nullable);
            /**
             * @type {HTMLElement | null}
             */
            const parent_element_nullable = element.parentElement;
            if (parent_element_nullable) {
                const parent_element = /** @type {HTMLElement} */ (parent_element_nullable);
                if (this.isHidden()) {
                    parent_element.className = "hidden";
                    element.checked = false;
                } else {
                    parent_element.className = "";
                }

                update_html(this);
            } else {
                console.error("Parent element of service does not exist!");
            }
        } else {
            console.error("Service does not exists!");
        }
    }
}

/**
 * @type {Array<Service>}
 */
const services = [
    new Service(0, "Wymiana opon", 100, [], "wheels"),
    new Service(1, "Wymiana felg", 0, [], "wheels"),
    new OneChoiseService(2, "Aluminiowe", 280, [1], "felgi", "felgi"),
    new OneChoiseService(3, "Stalowe", 200, [1], "felgi", "felgi"),
    new Service(4, "Wymiana wycieraczek", 80, [], "dodatkowe"),
    new Service(5, "Ustawienie świateł", 150, [], "dodatkowe"),
    new Service(6, "Wymiana oleju", 100, [], "olej"),
    new Service(7, "Filtr oleju", 50, [6], "olej"),
    new Service(8, "Filtr powetrza", 50, [6], "olej"),
    new Service(9, "Mycie samochodu", 15, [], "mycie"),
    new Service(10, "Woskowanie", 20, [9], "mycie"),
    new Service(11, "Wnętrze", 30, [9], "mycie"),
];

if (display_nullable && form_nullable && name_input_nullable && date_input_nullable) {
    const display = /** @type {HTMLDivElement} */ (display_nullable);
    const form = /** @type {HTMLFormElement} */ (form_nullable);
    const name_input = /** @type {HTMLInputElement} */ (name_input_nullable);
    const date_input = /** @type {HTMLInputElement} */ (date_input_nullable);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let wycena = 0;
        services.forEach((service) => {
            if (!service.isHidden()) {
                /** @type {HTMLElement | null} */
                const element_nullable = document.querySelector(`[id='${service.id}']`);
                if (element_nullable) {
                    const element = /** @type {HTMLElement} */ (element_nullable);
                    if (service.selected(element)) {
                        wycena += service.cost;
                    }
                }
            }
        });

        while (display.firstChild) {
            display.removeChild(display.firstChild);
        }

        if (name_input.value.trim().length > 2 && date_input.value != "") {
            const name_element = document.createElement("p");
            name_element.innerText = `Imię: ${name_input.value}`;

            const date_element = document.createElement("p");
            date_element.innerText = `Data wizyty: ${date_input.value}`;

            const cost_element = document.createElement("p");
            cost_element.innerText = `Wycena: ${wycena}zł`;

            display.append(name_element);
            display.append(date_element);
            display.append(cost_element);
        }
    });

    form.addEventListener('reset', (event) => {
        event.preventDefault();

        while (display.firstChild) {
            display.removeChild(display.firstChild);
        }

        const inputs = document.querySelectorAll("input");

        inputs.forEach((input) => {
            input.checked = false;
        });

        services.forEach((service) => {
            service.update();
        });
    });

    services.forEach((service) => {
        /**
         * @type {HTMLElement | null}
         */
        const parent_nullable = document.querySelector(`#${service.html_id}`);
        if (parent_nullable) {
            const parent = /** @type {HTMLElement} */ (parent_nullable);
            parent.append(service.view());
        } else {
            console.error(`Service is attached to HTML which does not exist!, (service_id: ${service.id}, html_id: ${service.html_id})`);
        }
    });

    /**
     * @type {Array<string>}
     */
    const checked_parents = [];
    services.forEach((service) => {
        if (!checked_parents.includes(service.html_id)) {
            /**
             * @type {HTMLElement | null}
             */
            const parent_nullable = document.querySelector(`#${service.html_id}`);
            if (parent_nullable) {
                const parent = /** @type {HTMLElement} */ (parent_nullable);
                let child_count = 0;
                parent.childNodes.forEach((child) => {
                    if (child.nodeName === "LABEL" && !service.isHidden()) {
                        child_count += 1;
                    }
                });

                if (child_count == 0 && !parent.classList.contains("hidden")) {
                    parent.classList.add("hidden");
                } else if (child_count != 0 && parent.classList.contains("hidden")) {
                    parent.classList.remove("hidden");
                }

                checked_parents.push(service.html_id);
            }
        }
    });
} else {
    console.warn("Missing required elements!");
}

/**
 * @param {Service} parent_service 
 */
function update_dependencies(parent_service) {
    services.forEach((service) => {
        if (service.dependencies.includes(parent_service.id)) {
            service.update();
        }
    });
}

/**
 * @param {Service} service 
 */
function update_html(service) {
    const parent_nullable = document.querySelector(`#${service.html_id}`);
    if (parent_nullable) {
        const parent = /** @type {HTMLElement} */ (parent_nullable);
        let child_count = 0;
        parent.childNodes.forEach((child) => {
            if (child.nodeName === "LABEL") {
                const input = /** @type {HTMLInputElement} */ (child.firstChild);
                const service = services[Number(input.id)];
                if (!service.isHidden()) {
                    child_count += 1;
                }
            }
        });

        if (child_count == 0 && !parent.classList.contains("hidden")) {
            parent.classList.add("hidden");
        } else if (child_count != 0 && parent.classList.contains("hidden")) {
            parent.classList.remove("hidden");
        }
    }
}