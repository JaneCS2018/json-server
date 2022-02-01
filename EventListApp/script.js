const eventList = document.getElementById('table_eventlist')
let output=`
        <tr class="table__head">
        <th>Event name</th>
        <th>Start date</th>
        <th>End date</th>
        <th>Actions</th>
        </tr>
        `
const url = 'http://localhost:3000/events'
let eventLen;
const eventLenf = (events)=>{
    return events.length
}
const renderEvents = (events)=>{
    events.forEach(ele=> {
        let startdate = timeConverter(ele["startDate"])
        let enddate =timeConverter(ele["endDate"])
        output+=`
            <tr class="table__content"> 
                <td>
                    <input disabled value=${ele["eventName"]} />
                </td>
                <td>
                    <input disabled value=${startdate} />
                </td>
                <td>
                    <input disabled value=${enddate} />
                </td>
                <td>
                    <button class="edit_button" id="${ele.id}" >EDIT</button>
                    <button id="${ele.id}">DELETE</button>
                </td>
            </tr>
        `
    });

    output+=` 
        <tr> 
            <td>
                <input type="text" value="" id="eventName_${events.length}" />
            </td>
            <td>
                <input type="date" value="" id="startDate_${events.length}" />
            </td>
            <td>
                <input type="date" value="" id="endDate_${events.length}" />
            </td>
            <td>
                <button class="save" id='save_${events.length}' onclick='save(event)'}>SAVE</button>
                <button>CLOSE</button>
            </td>
        </tr>`
    
    eventList.innerHTML=output

}


const timeConverter = (timestamp)=>{
    const timestamp_int = parseInt(timestamp)
    const all_date = new Date(timestamp_int);
    const year = all_date.getFullYear()
    const month = (all_date.getMonth() + 1) < 10 ?  (all_date.getMonth() + 1).toString().padStart(2, '0'): (all_date.getMonth() + 1)
    const date = all_date.getDate() < 10 ? all_date.getDate().toString().padStart(2, '0'): all_date.getDate()
    return `${year}-${month}-${date}`
}




//Get - Read the posts
let res
fetch(url)
    .then(res=>res.json())
    .then(data=>{
        renderEvents(data) 
    })
   
//Insert New Post
//Timestamp convert

// function toTimestamp(year,month,day,hour,minute,second){
//     var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));
//     return datum.getTime()/1000;
//    }

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
 }

function save(event){
    
    const len = event.target.id.split('_')[1]
    const start_date = document.getElementById(`startDate_${len}`).value.split('-')
 
    const eve_name = document.getElementById(`eventName_${len}`).value
    const start_yy = parseInt(start_date[2])
    const start_mm= parseInt(start_date[0])<10 ? start_date[0].padStart(2, '0'): parseInt(start_date[0])
    const start_dd= parseInt(start_date[1])<10 ? start_date[1].padStart(2,'0'): parseInt(start_date[1])

    const end_date = document.getElementById(`endDate_${len}`).value.split('-')
    const end_yy = parseInt(end_date[2])
    const end_mm = parseInt(end_date[0])<10 ? end_date[0].padStart(2, '0'): parseInt(end_date[0])
    const end_dd = parseInt(end_date[1])<10 ? end_date[1].padStart(2,'0'): parseInt(end_date[1])

    // console.log(toTimestamp('02/13/2020 23:31:30'));
    const start_time=`${start_mm}/${start_dd}/${start_yy} 23:31:30`
    const end_time=`${end_mm}/${end_dd}/${end_yy} 23:31:30`

    const start_timestamp= toTimestamp(start_time)
    const end_timestamp = toTimestamp(end_time)


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
}