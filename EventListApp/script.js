const eventList = document.getElementById('table_eventlist')
const addnew = document.querySelector('.add_new')
let output = ``
const url = 'http://localhost:3000/events'

const renderEvents = (events) => {
    events.forEach(ele => {
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
    });

    let len = events.length + 1
    output += ` 
        <tr id='Input_${len}''> 
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
                <input type="submit" class="save" id='save_${len}' onclick='save(event)'} value="SAVE">
                <input type="submit" id="close_${len}" value="CLOSE">
            </td>
        </tr>`

    eventList.innerHTML = output

}

//Add new row click
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
                <input type="submit" id='save_${len}' onclick='save(event)'} value="SAVE">
                <input type="submit" id="close_${len}" value="CLOSE">
            </td>
        </tr>`
    eventList.innerHTML = output
})



const timeConverter = (timestamp) => {
    const timestamp_int = parseInt(timestamp)
    const all_date = new Date(timestamp_int);
    const year = all_date.getFullYear()
    const month = (all_date.getMonth() + 1) < 10 ? (all_date.getMonth() + 1).toString().padStart(2, '0') : (all_date.getMonth() + 1)
    const date = all_date.getDate() < 10 ? all_date.getDate().toString().padStart(2, '0') : all_date.getDate()
    return `${year}-${month}-${date}`
}


function toTimestamp(strDate) {
    let date = strDate.split('-')
    let dd = date[2]
    let mm = date[1]
    let yy = date[0]
    let all = `${mm}-${dd}-${yy} 23:31:30`
    var datum = Date.parse(all);
    return datum.toString()
}


//Get - Read the posts
let res
fetch(url)
    .then(res => res.json())
    .then(data => {
        renderEvents(data)
    })

eventList.addEventListener('click', (e) => {
    let delButtonIsPressed = e.target.value === 'DELETE'
    let editButtonIsPressed = e.target.value === 'EDIT'
    let updateButtonIsPressed = e.target.value === "UPDATE"
    let closeButtonIsPressed = e.target.value === 'CLOSE'
    let id = e.target.parentElement.parentElement.id


    //Get EventName, StartDay, End
    const UpdateEventName = document.getElementById(`eventName_${id}`)
    const UpdateStartDay = document.getElementById(`startDate_${id}`)
    const UpdateEndDay = document.getElementById(`endDate_${id}`)


    //Delete - Remove the existing event
    //method: DELETE
    if (delButtonIsPressed) {
        fetch([url, id].join('/'), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
        console.log('delete')
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

        const start = toTimestamp(UpdateStartDay_v)
        const end = toTimestamp(UpdateEndDay_v)

        if (UpdateEventName_v !== '' &&
            UpdateStartDay_v !== '' &&
            UpdateEndDay_v !== '') {

            fetch([url, id].join("/"), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    eventName: UpdateEventName_v,
                    startDate: start,
                    endDate: end,
                }),
            })
                .then((response) => response.json())

        } else {
            alert("Some of your inputs may not be empty")
        }
    }

    //Close button
    if (closeButtonIsPressed) {
        const id = e.target.id.split('_')[1]
        const ele = document.getElementById(`Input_${id}`)
        ele.remove()
    }

})




function save(event) {
    const id = event.target.id.split('_')[1]
    const start_date = document.getElementById(`startDate_${id}`).value
    const end_date = document.getElementById(`endDate_${id}`).value

    const start_timestamp = toTimestamp(start_date)
    const end_timestamp = toTimestamp(end_date)

    const eve_name = document.getElementById(`eventName_${id}`).value

    //POST Event
    if (eve_name !== '' &&
        start_timestamp !== '' &&
        end_timestamp !== '') {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                eventName: eve_name,
                startDate: start_timestamp,
                endDate: end_timestamp,
            }),
        })
            .then((response) => response.json())
            .then(data => {
                const dataArr = []
                dataArr.push(data)
                renderEvents(dataArr)
            })
    } else {
        alert("Enter valid value")
    }
}