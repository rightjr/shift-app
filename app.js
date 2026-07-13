const days=["mon","tue","wed","thu","fri","sat","sun"];
const dayLabels=["月","火","水","木","金","土","日"];

function generateTimes(){

    const times=[];

    for(let h=6;h<=24;h++){

        times.push(`${String(h).padStart(2,"0")}:00`);
        times.push(`${String(h).padStart(2,"0")}:30`);

    }

    times.push("25:00");

    return times;

}

function createSelect(options,name){

    const select=document.createElement("select");

    select.name=name;

    options.forEach(v=>{

        const op=document.createElement("option");

        op.value=v;
        op.textContent=v;

        select.appendChild(op);

    });

    select.value="×";

    return select;

}

const container=document.getElementById("shiftContainer");

days.forEach((d,i)=>{

    const row=document.createElement("div");

    row.className="day-row";

    row.innerHTML=`
    <strong class="day-label">
        <span class="day-date" data-day="${i}"></span>
        (${dayLabels[i]})
    </strong>
    `;

    const start=createSelect(
        ["×","立ち上げ",...generateTimes()],
        `${d}_start`
    );

    const end=createSelect(
        ["×",...generateTimes(),"クローズ"],
        `${d}_end`
    );

    row.appendChild(start);
    row.appendChild(end);

    container.appendChild(row);

});

function generateWeekOptions(){

    const select=document.getElementById("weekSelect");

    const today=new Date();

    const monday=new Date(today);

    monday.setDate(today.getDate()-((today.getDay()+6)%7));

    for(let i=1;i<=4;i++){

        const d=new Date(monday);

        d.setDate(monday.getDate()+i*7);

        const value=d.toISOString().slice(0,10);

        const option=document.createElement("option");

        option.value=value;

        option.textContent=value;

        select.appendChild(option);

    }

    select.selectedIndex=1;

}

generateWeekOptions();

function updateDayDates(weekStart){

    const monday=new Date(weekStart);

    document.querySelectorAll(".day-date").forEach(el=>{

        const offset=Number(el.dataset.day);

        const d=new Date(monday);

        d.setDate(monday.getDate()+offset);

        el.textContent=`${d.getMonth()+1}/${d.getDate()}`;

    });

}

updateDayDates(document.getElementById("weekSelect").value);

document.getElementById("weekSelect").addEventListener("change",e=>{

    updateDayDates(e.target.value);

});

document.getElementById("createBtn").onclick=()=>{

    const employeeId=document.getElementById("employeeId").value.trim();
    const name=document.getElementById("userName").value.trim();
    const job=document.getElementById("jobType").value;
    const week=document.getElementById("weekSelect").value;

    if(employeeId===""){

        alert("従業員番号を入力してください");

        return;

    }

    if(name===""){

        alert("名前を入力してください");

        return;

    }

    if(job===""){

        alert("職種を選択してください");

        return;

    }

    let text="";

    text+="【シフト提出】\n\n";

    text+=`従業員番号：${employeeId}\n`;
    text+=`名前：${name}\n`;
    text+=`職種：${job}\n`;
    text+=`提出週：${week}\n\n`;

    document.querySelectorAll(".day-date").forEach((el,i)=>{

        const day=days[i];

        const start=document.querySelector(`[name=${day}_start]`).value;

        const end=document.querySelector(`[name=${day}_end]`).value;

        const date=el.textContent;

        if(start==="×"){

            text+=`${date}(${dayLabels[i]}) 休み\n`;

        }else{

            text+=`${date}(${dayLabels[i]}) ${start}〜${end}\n`;

        }

    });

    document.getElementById("result").value=text;

};

document.getElementById("copyBtn").onclick=async()=>{

    const text=document.getElementById("result").value;

    if(text===""){

        alert("先に文章を作成してください");

        return;

    }

    await navigator.clipboard.writeText(text);

    document.getElementById("msg").textContent="コピーしました！";

    setTimeout(()=>{
        document.getElementById("msg").textContent="";
    },2000);

};