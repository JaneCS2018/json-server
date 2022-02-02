const Appapi = (() => {
    const baseurl = "http://localhost:3000";
    const path = "events";

    const getList = () =>
        fetch([baseurl, path].join("/")).then((response) => response.json())

    //AddTodo
    const addList = (list) =>
        fetch([baseurl, path].join("/"), {
            method: "POST",
            body: JSON.stringify(list),
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
            },
        }).then((response) => response.json());


    const deleteList = (id) =>
        fetch([baseurl, path, id].join("/"), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }

        }).then((response) => response.json())


    return {
        getList,
        deleteList,
        addList,
    };
})();


const View = (() => {
    const domstr = {
        eventlist: "#table_eventlist",
        addbtn: ".add_new",
        deletebtn: ".delete_btn",
    };
    const render = (element, tmp) => {
        element.innerHTML = tmp;

    };


    const createTmp = (arr) => {
        let tmp = ``;
        arr.forEach((ele) => {

            //startDate          
            const time = parseInt(ele["startDate"])
            const all_date = new Date(time);
            const year = all_date.getFullYear()
            const month = (all_date.getMonth() + 1) <10 ? (all_date.getMonth() + 1).toString().padStart(2, '0'):(all_date.getMonth() + 1)
            const date = all_date.getDate() <10 ? all_date.getDate().toString().padStart(2, '0'):all_date.getDate()

            //endDate
            const timeEnd = parseInt(ele["endDate"])
            const all_date_end = new Date(timeEnd);
            const End_year = all_date_end.getFullYear()
            const End_month = (all_date_end.getMonth() + 1)<10 ? (all_date_end.getMonth() + 1).toString().padStart(2, '0') :(all_date_end.getMonth() + 1)
            const End_date = all_date_end.getDate() < 10 ? all_date_end.getDate().toString().padStart(2,'0'): all_date_end.getDate()

           
            tmp += `
            <tr class="table__content"> 
                <td>
                    <input disabled value=${ele["eventName"]} />
                </td>
                <td>
                    <input disabled value="${year}-${month}-${date}" />
                </td>
                <td>
                    <input disabled value="${End_year}-${End_month}-${End_date}" />
                </td>
                <td>
                    <button class="edit_button" id="${ele.id}" >EDIT</button>
                    <button id="${ele.id}">DELETE</button>
                </td>
            </tr>
            `
        });
        let len =arr.length
        tmp += ` 
        <tr> 
            <td>
                <input type="text" value="" />
            </td>
            <td>
                <input type="date" value="" />
            </td>
            <td>
                <input type="date" value="" />
            </td>
            <td>
                <button class="save_button" id=${len}>SAVE</button>
                <button id=${len}>CLOSE</button>
            </td>
        </tr>`

        return tmp;
    };

    const addTmp = (arr) => {
        let res = document.getElementById('table_eventlist').innerHTML
        let len = arr.length + 1
        const newRow = `   
                    <tr> 
                        <td>
                            <input type="text" value="" />
                        </td>
                        <td>
                            <input type="date" value="" />
                        </td>
                        <td>
                            <input type="date" value="" />
                        </td>
                        <td>
                            <button class="save_button" id=${len}>SAVE</button>
                            <button id=${len}>CLOSE</button>
                        </td>
                    </tr>`

        res += newRow
        return res
    }


    return {
        domstr,
        render,
        createTmp,
        addTmp
    };
})();



// ~~~~~~~~~~~~~~~model~~~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
    class List {
        constructor(eventName, startDate, endDate) {
            this.eventName = eventName;
            this.startDate = startDate;
            this.endDate = endDate;
        }
    }

    class State {
        #eventlist = [];

        get eventList() {
            return this.#eventlist;
        }

        set eventList(newdata) {
            this.#eventlist = newdata;

            // render the todolist
            const ele = document.querySelector(view.domstr.eventlist);
            const tmp = view.createTmp(this.#eventlist);
            view.render(ele, tmp);

        }
    }

    const getList = api.getList;
    const addList = api.addList;
    const deleteTodo = api.deleteList;

    return {
        List,
        State,
        addList,
        getList,
        deleteTodo,
    };
})(Appapi, View);

// ~~~~~~~~~~~~~~~controller~~~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
    const state = new model.State();

    //Add list
    const addList = () => {
        const addbutton = document.querySelector(view.domstr.addbtn)
        addbutton.addEventListener("click", () => {

            // const newTmp = view.addTmp(state.eventList)
            // view.render(table, newTmp);
            // state.eventList = newTmp
            input_value=true
            const newList = new model.List('', '', '');
            model.addList(newList).then((newItem) => {
                state.eventList = [ ...state.eventList, newItem];
            });
            console.log(input_value)

        })
    }

    const deleteList = () => {
        const ele = document.querySelector(view.domstr.eventlist);
        ele.addEventListener("click", (event) => {

            if (event.target.id !== '') {
                state.eventList = state.eventList.filter((item) => {
                    return +item.id !== +event.target.id;
                });
                console.log(event.target.id);
                model.deleteTodo(event.target.id);
            }
        });
    };

    const init = () => {
        model.getList().then((data) => {
            state.eventList = data;
        });
    };

    const bootstrap = () => {
        init();
        addList();
        deleteList();
    };

    return { bootstrap };
})(Model, View);

Controller.bootstrap();



