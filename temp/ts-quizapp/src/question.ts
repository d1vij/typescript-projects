const questionsDiv = document.getElementById("questions")! as HTMLDivElement;
const addQuestion = document.getElementById("add-question")! as HTMLButtonElement;
addQuestion.addEventListener('click',createQuestion);


interface IOption{
    id:number,
    text:string
}
interface IQuestion {
    id:number,
    title:string,
    options:IOption[]
    correct_id:number
}



function _getId(): number {
    return Math.floor(Math.random() * 10e9);
}


function createQuestion(): void{
    let questionId = _getId();

    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-div");
    questionDiv.setAttribute("data-question-id",questionId.toString());
    questionDiv.innerHTML = `
            <input type="text" data-id="${questionId}" class="question-title-input" value="" placeholder="Question Text" name="title">
            <span class="option-input-span">
            <input type="text" class="option-input" placeholder="Option text" data-id="${questionId}">
            <button class="add-option" data-id="${questionId}">Add option</button>
            </span>
            <ol class="options" data-id="${questionId}"></ol>
            <button data-id="${questionId}" class="question-save">Save Question</button>`

    questionsDiv.appendChild(questionDiv);
            
    const saveButton = questionDiv.querySelector(`button.question-save[data-id="${ questionId }"]`) as HTMLButtonElement;
    const optionInput = questionDiv.querySelector(`input.option-input[data-id="${questionId}"]`) as HTMLInputElement;
    const addOption = questionDiv.querySelector(`button.add-option[data-id="${questionId}"]`) as HTMLButtonElement;
    const optionsList = questionDiv.querySelector(`ol.options[data-id="${questionId}"]`) as HTMLOListElement;
    
    optionsList.addEventListener('click',_deleteOption);
    
    
    addOption.addEventListener('click', ()=>{
        let optiontext = optionInput.value;
        optionInput.value="";
        _addOption(optionsList,optiontext, questionId);
    });
    saveButton.addEventListener('click', (event)=>{
        _saveQuestion(event, questionId)
    })

}

function _addOption(optionsList: HTMLOListElement, optionText: string, questionId: number): void {
    const optionLIElement = document.createElement('li');
    const optionId = _getId();

    optionLIElement.classList.add('question-option');
    optionLIElement.setAttribute('data-question-id', optionId.toString());

    optionLIElement.innerHTML = `
        <button type="button" class="question-delete-button" data-id="${optionId}">delete</button>
        <span class="option-text">${optionText}</span>
        <input type="radio" name="correct-option-${questionId}" value="${optionId}" checked>
    `
    optionsList.appendChild(optionLIElement);
}

function _deleteOption(event:Event){
    const target = event.target as HTMLLIElement;
    if(target.classList.contains('question-delete-button')){
        const _id = target.getAttribute("data-id");
        document.querySelector(`li[data-question-id="${_id}"]`)?.remove();
    }
}
    



function _saveQuestion(event:Event, questionId:number) : void{
    let optionslistElement = document.querySelector(`ol.options[data-id="${questionId}"]`) as HTMLOListElement;
    let optionsLIArray = optionslistElement.querySelectorAll<HTMLLIElement>(`li`);
    let optionsObjArray: IOption[] = [];
    
    optionsLIArray.forEach(_li => {
        let option:IOption = {
            id: parseInt(_li.getAttribute("data-question-id")!),
            text : _li.querySelector<HTMLSpanElement>("span.option-text")!.textContent!
        }

        optionsObjArray.push(option);
    })
    console.log(optionsObjArray);
    let correctOptionId = parseInt(document.querySelector<HTMLInputElement>(`input[name="correct-option-${questionId}"]:checked`)!.value!);
    let questionTitle = document.querySelector<HTMLInputElement>(`input.question-title-input[data-id="${questionId}"]`)?.value!;
    let questionObj: IQuestion = {
        id : questionId,
        title:questionTitle,
        options: optionsObjArray,
        correct_id: correctOptionId
    }
    console.log(questionObj);
}

