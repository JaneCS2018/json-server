const eventList = document.getElementById('table_eventlist')
const addnew = document.querySelector('.add_new')
let output = ""
const url = 'http://localhost:3000/events'

let pagination = document.getElementById("pagination")
const prev = document.getElementById("PREV")
const next = document.getElementById("NEXT")
let pageNum = document.getElementById('pageNumber')

let currentPage = 0

//Show data
const renderEvents = (events) => {

    //Define totalPage number
    let totalPage = Math.ceil(events.length / 4)
    if (currentPage === 0) {
        events.slice(0, 4).forEach(ele => {
            let startdate = timeConverter(ele["startDate"])
            let enddate = timeConverter(ele["endDate"])
            output += `
                <tr class="table__content" id=${ele["id"]}> 
                    <td>
                        <input disabled value=${ele["eventName"]} id="eventName_${ele["id"]}" />
                    </td>
                    <td>
                        <input disabled value=${startdate} id="startDate_${ele["id"]}" />
                    </td>
                    <td>
                        <input disabled value=${enddate} id="endDate_${ele["id"]}" />
                    </td>
                    <td>
                        <input type="submit" class="edit_button" class="edit-event_${ele["id"]}" id="edit-event" value="EDIT">
                        <input type="submit" id="delete-event" value="DELETE">
                    </td>
                </tr>
            `
            eventList.innerHTML = output
        })
        pageNum.innerHTML = `1/${totalPage}`
    }

    pagination.addEventListener('click', (e) => {
        let nextButtonIsPressed = e.target.value === 'NEXT'
        let prevButtonIsPressed = e.target.value === 'PREV'
        let counter

        //NextButtonIsPressed
        if (nextButtonIsPressed) {
            output = ``
            currentPage += 4
            if (currentPage <= events.length) {
                events.slice(currentPage, currentPage + 4).forEach(ele => {
                    let startdate = timeConverter(ele["startDate"])
                    let enddate = timeConverter(ele["endDate"])
                    output += `
                    <tr class="table__content" id=${ele["id"]}> 
                        <td>
                            <input disabled value=${ele["eventName"]} id="eventName_${ele["id"]}" />
                        </td>
                        <td>
                            <input disabled value=${startdate} id="startDate_${ele["id"]}" />
                        </td>
                        <td>
                            <input disabled value=${enddate} id="endDate_${ele["id"]}" />
                        </td>
                        <td>
                            <input type="submit" class="edit_button" class="edit-event_${ele["id"]}" id="edit-event" value="EDIT">
                            <input type="submit" id="delete-event" value="DELETE">
                        </td>
                    </tr>
                `
                    eventList.innerHTML = output
                })


            }
        }

        //PrevButtonIsPressed
        if (prevButtonIsPressed) {
            output = ``
            currentPage -= 4
            if (currentPage >= 0) {
                events.slice(currentPage, currentPage + 4).forEach(ele => {
                    let startdate = timeConverter(ele["startDate"])
                    let enddate = timeConverter(ele["endDate"])
                    output += `
                 <tr class="table__content" id=${ele["id"]}> 
                     <td>
                         <input disabled value=${ele["eventName"]} id="eventName_${ele["id"]}" />
                     </td>
                     <td>
                         <input disabled value=${startdate} id="startDate_${ele["id"]}" />
                     </td>
                     <td>
                         <input disabled value=${enddate} id="endDate_${ele["id"]}" />
                     </td>
                     <td>
                         <input type="submit" class="edit_button" class="edit-event_${ele["id"]}" id="edit-event" value="EDIT">
                         <input type="submit" id="delete-event" value="DELETE">
                     </td>
                 </tr>
             `
                    eventList.innerHTML = output
                })

            }
        }
        
        //Define counter and totalPage
        counter = Math.floor((currentPage / 4) + 1)
        if (counter >= 1 && counter <= totalPage) {
            pageNum.innerHTML = `${counter}/${totalPage}`
        }
    })
}
//AddNewButton to add new input
addnew.addEventListener('click', (events) => {
    let len = events.length + 1
    output += ` 
        <tr id="Input_${len}"> 
            <td>
                <input type="text" value="" id="eventName_${len}" />
            </td>
            <td>
                <input type="date" value="" id="startDate_${len}" />
            </td>
            <td>
                <input type="date" value="" id="endDate_${len}" />
            </td>
            <td>
                <input type="submit" id="save_${len}"  value="SAVE">
                <input type="submit" id="close_${len}" value="CLOSE">
            </td>
        </tr>`
    eventList.innerHTML = output
})


//Timestamp to specific date
const timeConverter = (timestamp) => {
    const timestamp_int = parseInt(timestamp)
    const all_date = new Date(timestamp_int);
    const year = all_date.getFullYear()
    const month = (all_date.getMonth() + 1) < 10 ? (all_date.getMonth() + 1).toString().padStart(2, '0') : (all_date.getMonth() + 1)
    const date = all_date.getDate() < 10 ? all_date.getDate().toString().padStart(2, '0') : all_date.getDate()
    return `${year}-${month}-${date}`
}



//Specific date to timestamp convert
function toTimestamp(strDate) {
    let date = strDate.split('-')
    let dd = date[2]
    let mm = date[1]
    let yy = date[0]

    //Get current hours, minutes, seconds
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let all = `${mm}-${dd}-${yy} ${time}`
    var datum = Date.parse(all);
    return datum.toString()
}

//Define All Methods

//Get - Read the posts
const getList = (url) => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            renderEvents(data, currentPage)
        })

}

//Post
const createList = (url, eventName, startTimeStamp, endTimeStamp) => {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            eventName: eventName,
            startDate: startTimeStamp,
            endDate: endTimeStamp,
        }),
    })
        .then((response) => response.json())
        .then(data => {
            renderEvents(data)
        })
}


//Delete
const deleteList = (url, id) => {
    fetch([url, id].join('/'), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then((response) => response.json())
}


//Update
const updateList = (url, id, eventName, startTimeStamp, endTimeStamp) => {
    fetch([url, id].join("/"), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            eventName: eventName,
            startDate: startTimeStamp,
            endDate: endTimeStamp,
        }),
    })
        .then((response) => response.json())
}



//Call Get Event
getList(url)

//Define all eventList listener
eventList.addEventListener('click', (e) => {
    let id = e.target.parentElement.parentElement.id
    let delButtonIsPressed = e.target.value === 'DELETE'
    let editButtonIsPressed = e.target.value === 'EDIT'
    let updateButtonIsPressed = e.target.value === 'UPDATE'
    let saveButtonIsPressed = e.target.value === 'SAVE'
    let closeButtonIsPressed = e.target.value === 'CLOSE'


    //Get EventName, StartDate, EndDate
    const UpdateEventName = document.getElementById(`eventName_${id}`)
    const UpdateStartDay = document.getElementById(`startDate_${id}`)
    const UpdateEndDay = document.getElementById(`endDate_${id}`)

    //Post Event
    if (saveButtonIsPressed) {
        const save_id = e.target.id.split('_')[1]
        const start_date = document.getElementById(`startDate_${save_id}`).value
        const end_date = document.getElementById(`endDate_${save_id}`).value
        const eve_name = document.getElementById(`eventName_${save_id}`).value

        const start_timestamp = toTimestamp(start_date)
        const end_timestamp = toTimestamp(end_date)


        //POST Event
        if (eve_name !== '' &&
            start_timestamp !== '' &&
            end_timestamp !== '') {
            createList(url, eve_name, start_timestamp, end_timestamp)
        } else {
            alert("Please enter valid values to all fields")
        }

    }

    //Delete - Remove the existing event
    if (delButtonIsPressed) {
        deleteList(url, id)
    }

    //Update data
    if (editButtonIsPressed) {
        UpdateEventName.removeAttribute("disabled")
        UpdateStartDay.removeAttribute("disabled")
        UpdateStartDay.setAttribute("type", "Date")
        UpdateEndDay.removeAttribute("disabled")
        UpdateEndDay.setAttribute("type", "Date")
        e.target.value = "UPDATE"


    }
    if (updateButtonIsPressed) {
        const UpdateEventName_v = UpdateEventName.value
        const UpdateStartDay_v = UpdateStartDay.value
        const UpdateEndDay_v = UpdateEndDay.value

        const startDate = toTimestamp(UpdateStartDay_v)
        const endDate = toTimestamp(UpdateEndDay_v)

        if (UpdateEventName_v !== '' &&
            UpdateStartDay_v !== '' &&
            UpdateEndDay_v !== '') {

            updateList(url, id, UpdateEventName_v, startDate, endDate)

        } else {
            alert("Please fill out all the fields")
        }
    }

    //Close button
    if (closeButtonIsPressed) {
        const id = e.target.id.split('_')[1]
        const ele = document.getElementById(`Input_${id}`)
        ele.remove()
    }

})


