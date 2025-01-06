<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import BlueButton from "$lib/components/buttons/BlueButton.svelte";
  import { browser } from "$app/environment";
  import type { QuestionSetType } from "$lib/types/database/question_sets";
  import Heading2 from "$lib/components/headings/Heading2.svelte";
  import { qSetCreation } from "$lib/states/question_set_creation.svelte";
  import { goto } from "$app/navigation";

  let localStorageData: QuestionSetType; // localStorage data will always reflect what is in the DB

  if (browser) {
    const acquireData = localStorage.getItem("QSCP");

    if (acquireData != null) {
      localStorageData = JSON.parse(acquireData) as QuestionSetType;
    } else {
      console.log(
        "this case should never be hit, because /app/questions/create should pull new localStorage on refresh and change the page"
      );
    }
  }

  async function advanceProgress() {
    let questionSetCreationObject: (QuestionSetType & { id: string }) | null =
      null;
    if (browser) {
      // @ts-ignore
      // * JSON.parse(null) will return null which is exactly what I need, just can't find a way
      // * for TS to understand this.
      questionSetCreationObject = JSON.parse(localStorage.getItem("QSCP"));
    }
    if (questionSetCreationObject == null)
      return console.log("what the fuckk (submitSavedQuestionsToSet)");

    questionSetCreationObject.progress += 1;

    await fetch("/api/question_sets/advance_setup", {
      method: "POST",
      body: JSON.stringify({
        id: questionSetCreationObject.id,
        newProgress: questionSetCreationObject.progress,
      }),
    });

    localStorage.setItem("QSCP", JSON.stringify(questionSetCreationObject));
    qSetCreation.progress = questionSetCreationObject.progress;

    goto("/app/dashboard")
  }
</script>

<div class="flex flex-row justify-center items-center space-x-1">
  <p
    class="font-bold text-2xl text-white rounded-full border-[2px] border-white flex items-center justify-center p-5 w-14 h-14"
  >
    4
  </p>
  <Heading1 label="Final Step" />
</div>
<DefaultParagraph
  label="Look through the data you have inputed for this question set. After completing this step you will be able to use the question set to start a game."
/>

<Heading2 label="Questions - Three Answers"/>

<table class="w-full text-white text-center font-regular">
  <thead class="bg-gray-900 font-light text-md">
    <tr>
      <th class="py-2">
        Question
      </th>
      <th class="py-2"> Answer A </th>
      <th class="py-2"> Answer B </th>
      <th class="py-2"> Answer C </th>
      <th class="py-2"> Correct Answer </th>
    </tr>
  </thead>
  <tbody class="text-md">

    {#each localStorageData.questions_three as l, i}
      <tr class="bg-gray-800 border-b border-gray-700">
        <td class="py-2 px-2 break-all border-r border-gray-700">
          {l.label}
        </td>
        <td class="py-2 px-2 break-all border-r border-gray-700">{l.answerA}</td
        >
        <td class="py-2 px-2 break-all border-r border-gray-700">{l.answerB}</td
        >
        <td class="py-2 px-2 break-all border-r border-gray-700">{l.answerC}</td
        >
        <td class="py-2 px-2 break-all">{l.correctAnswer}</td>
      </tr>
    {/each}
  </tbody>
</table>

<Heading2 label="Questions - Open"/>
<table class="w-full text-white text-center font-regular table-fixed">
  <thead class="bg-gray-900 font-light text-md">
    <tr>
      <th class="py-2">
        Question 
      </th>
      <th class="py-2"> Answer</th>
    </tr>
  </thead>
  <tbody class="text-md">

    {#each localStorageData.questions_open as l, i}
      <tr class="bg-gray-800 border-b border-gray-700">
        <td class="py-2 px-2 break-all w-50% border-r border-gray-700">
          {l.label}
        </td>
        <td class="py-2 px-2 break-all w-50%">{l.answer}</td>
      </tr>
    {/each}
  </tbody>
</table>

<BlueButton textSize="md" label="Finalize Question Set Creation" clickAction={advanceProgress}></BlueButton>
