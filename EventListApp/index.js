const Appapi = (() => {
    const baseurl = "http://localhost:3000";
    const path = "events";

    const getTodos = () =>
        fetch([baseurl, path].join("/")).then((response) => response.json())

    //AddTodo
    const addTodo = (todo) =>
        fetch([baseurl, path].join("/"), {
            method: "POST",
            body: JSON.stringify(todo),
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
            },
        }).then((response) => response.json());


    const deleteTodo = (id) =>
        fetch([baseurl, path, id].join("/"), { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              } 
        
        }).then((response) => response.json())


    return {
        getTodos,
        deleteTodo,
        addTodo,
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
        let tmp = ` 
            <tr class="table__head">
                <th>Event name</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Actions</th>
            </tr>`;
        arr.forEach((ele) => {

            //startDate          
            const time = parseInt(ele["startDate"])
            const all_date = new Date(time);
            const year = all_date.getFullYear()
            const month = all_date.getMonth() + 1
            const date = all_date.getDate()

            //endDate
            const timeEnd = parseInt(ele["endDate"])
            const all_date_end = new Date(timeEnd);
            const End_year = all_date_end.getFullYear()
            const End_month = all_date_end.getMonth() + 1
            const End_date = all_date_end.getDate()

            
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
            `;

        });
       
            tmp+=`
               
            <tr> 
                <td>
                    <input value=''} />
                </td>
                <td>
                    <input value="" />
                </td>
                <td>
                    <input value="" />
                </td>
                <td>
                    <button>SAVE</button>
                    <button>CLOSE</button>
                </td>
            </tr>
            `;
       

        return tmp;
    };

    return {
        domstr,
        render,
        createTmp,
    };
})();



// ~~~~~~~~~~~~~~~model~~~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
    class Todo {
        constructor(eventName, startDate, endDate) {
            this.eventName = eventName;
            this.startDate = startDate;
            this.endDate = endDate;
        }
    }

    class State {
        #eventlist = [];

        get todolist() {
            return this.#eventlist;
        }

        set todolist(newdata) {
            this.#eventlist = newdata;

            // render the todolist
            const ele = document.querySelector(view.domstr.eventlist);
            const tmp = view.createTmp(this.#eventlist);
            view.render(ele, tmp);

        }
    }

    const getTodos = api.getTodos;
    const addTodo = api.addTodo;
    const deleteTodo = api.deleteTodo;

    return {
        Todo,
        State,
        addTodo,
        getTodos,
        deleteTodo,
    };
})(Appapi, View);

// ~~~~~~~~~~~~~~~controller~~~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
    const state = new model.State();

    //Add list
    const addList = () => {
        const addbutton = document.querySelector(view.domstr.addbtn)
        addbutton.addEventListener("click", (event) => {
            const todo = new model.Todo('', '', '');
            model.addTodo(todo).then((newtodo) => {
                state.todolist = [ ...state.todolist,newtodo];
            });
        })
    }

    const deleteList = () => {
        const ele = document.querySelector(view.domstr.eventlist);
        ele.addEventListener("click", (event) => {

            if (event.target.id !== '') {
                state.todolist = state.todolist.filter((todo) => {
                    return +todo.id !== +event.target.id;
                });
                console.log(event.target.id);
                model.deleteTodo(event.target.id);
            }
        });
    };

    const init = () => {
        model.getTodos().then((data) => {
            state.todolist = data;
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



