// @ts-check

/**
 * @type {HTMLDivElement | null}
 */
const display_nullable = document.querySelector("#display");

class Service {
    /**
     * @param {number} id 
     * @param {string} name 
     * @param {Array<number>} dependencies 
     */
    constructor(id, name, dependencies) {
        this.id = id;
        this.name = name;
        this.dependencies = dependencies;
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
        const element = document.querySelector(`[id='${this.id}']`);
        if (element) {
            const parent_element = element.parentElement;
            if (parent_element) {
                if (this.isHidden()) {
                    parent_element.className = "hidden";
                } else {
                    parent_element.className = "";
                }
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
     * @argument {Element} element
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
     * @param {Array<number>} dependencies 
     * @param {string} group
     */
    constructor(id, name, dependencies, group) {
        super(id, name, dependencies)
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
}

/**
 * @type {Array<Service>}
 */
const services = [
    new Service(0, "Wymiana opon", []),
    new Service(1, "Wymiana felg", []),
    new OneChoiseService(2, "Aluminiowe", [1], "felgi"),
    new OneChoiseService(3, "Stalowe", [1], "felgi"),
    new Service(4, "Rozmiar koła", [0, 1]),
    new Service(5, "Wymiana wycieraczek", []),
    new Service(6, "Ustawienie świateł", []),
    new Service(7, "Wymiana oleju", []),
    new Service(8, "Filtr oleju", [7]),
    new Service(9, "Filtr powetrza", [7]),
    new Service(10, "Mycie samochodu", []),
    new Service(11, "Woskowanie", [10]),
    new Service(12, "Wnętrze", [10]),
];

const groups = [
    ["Koła", [0, 1, 2, 3, 4]],
    ["Olej", [7, 8, 9]],
    ["Mycie samochodu", [10, 11, 12]],
    ["Dodatkowe usługi", [5, 6]],
];

if (display_nullable) {
    const display = /** @type {HTMLElement} */ (display_nullable);
    groups.forEach((group) => {
        const group_element = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.innerText = /** @type {string} */ (group[0]);

        group_element.append(legend);
        display.append(group_element);

        for (let i = 0; i < group[1].length; i++) {
            /**
             * @type {number}
             */
            const service_id = /** @type {number} */ (group[1][i]);
            /**
             * @type {Service}
             */
            const service = services[service_id];
            group_element.append(service.view());
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